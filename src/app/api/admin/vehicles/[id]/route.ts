//src/app/api/admin/vehicles/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import {
  ApiResponseBackend,
  ApprovalStatus,
  VehicleDataFrontend,
} from "@/types/types";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/authOptions";
// import { sendVehicleRejectionEmail } from "@/lib/mailer";
import {
  sendVehicleApprovalEmail,
  sendVehicleRejectionEmailGmail,
} from "@/lib/mailer";

const createErrorResponse = (
  error: string,
  validationErrors?: Record<string, string[]>
): ApiResponseBackend<null> => ({
  success: false,
  error,
  ...(validationErrors && { validationErrors }),
});

const createSuccessResponse = <T>(
  data: T,
  message?: string
): ApiResponseBackend<T> => ({
  success: true,
  data,
  message,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    console.log("GET /api/admin/vehicles/[id] - Iniciando...");

    // Resolver params de forma asíncrona
    const resolvedParams = await params;

    // Verificar sesión y autorización
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), {
        status: 403,
      });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), {
        status: 403,
      });
    }

    // Validar que el ID sea válido
    if (!ObjectId.isValid(resolvedParams.id)) {
      return NextResponse.json(createErrorResponse("ID de vehículo inválido"), {
        status: 400,
      });
    }

    let client;
    try {
      client = await clientPromise;
    } catch (dbError) {
      console.error("Error de conexión a MongoDB:", dbError);
      return NextResponse.json(
        createErrorResponse("Error de conexión a la base de datos"),
        { status: 500 }
      );
    }

    try {
      const db = client.db("vehicle_store");

      const vehicle = await db
        .collection("vehicles")
        .findOne({ _id: new ObjectId(resolvedParams.id) });

      if (!vehicle) {
        return NextResponse.json(
          createErrorResponse("Vehículo no encontrado"),
          { status: 404 }
        );
      }

      // Convertir fechas a strings para el frontend
      const formattedVehicle = {
        ...vehicle,
        _id: vehicle._id.toString(),
        postedDate: vehicle.postedDate?.toISOString(),
        createdAt: vehicle.createdAt?.toISOString(),
        updatedAt: vehicle.updatedAt?.toISOString(),
      };

      return NextResponse.json(
        createSuccessResponse(
          formattedVehicle,
          "Vehículo obtenido exitosamente"
        ),
        { status: 200 }
      );
    } catch (serviceError) {
      console.error("Error al obtener vehículo:", serviceError);
      return NextResponse.json(
        createErrorResponse("Error al procesar la solicitud"),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error general en GET /api/admin/vehicles/[id]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    console.log("PATCH /api/admin/vehicles/[id] - Iniciando...");

    // Resolver params de forma asíncrona
    const resolvedParams = await params;

    // Verificar sesión y autorización
    const session = await getServerSession(authOptions);
    console.log("Sesión en API:", session);

    if (!session || !session.user) {
      console.log("Acceso denegado - No hay sesión");
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), {
        status: 403,
      });
    }

    if (session.user.role !== "admin") {
      console.log(
        "Acceso denegado - No es administrador, rol:",
        session.user.role
      );
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), {
        status: 403,
      });
    }

    // Obtener datos del cuerpo de la petición
    const body = await request.json();
    const { status, rejectionReason } = body;

    // Validar que el status sea válido
    if (!Object.values(ApprovalStatus).includes(status)) {
      return NextResponse.json(createErrorResponse("Estado inválido"), {
        status: 400,
      });
    }

    // Validar que el ID sea válido
    if (!ObjectId.isValid(resolvedParams.id)) {
      return NextResponse.json(createErrorResponse("ID de vehículo inválido"), {
        status: 400,
      });
    }

    let client;
    try {
      client = await clientPromise;
      console.log("Conexión a MongoDB exitosa");
    } catch (dbError) {
      console.error("Error de conexión a MongoDB:", dbError);
      return NextResponse.json(
        createErrorResponse("Error de conexión a la base de datos"),
        { status: 500 }
      );
    }

    try {
      const db = client.db("vehicle_store");
      console.log("Actualizando estado del vehículo...");

      const updateData: {
        status: ApprovalStatus;
        updatedAt: Date;
        rejectionReason?: string;
      } = {
        status: status,
        updatedAt: new Date(),
      };

      const unsetData: { rejectionReason?: "" } = {};

      if (status === ApprovalStatus.REJECTED && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      } else {
        unsetData.rejectionReason = "";
      }

      const updateOperation: {
        $set: Partial<typeof updateData>;
        $unset?: Partial<typeof unsetData>;
      } = {
        $set: updateData,
      };

      if (Object.keys(unsetData).length > 0) {
        updateOperation.$unset = unsetData;
      }

      const result = await db
        .collection("vehicles")
        .findOneAndUpdate(
          { _id: new ObjectId(resolvedParams.id) },
          updateOperation,
          { returnDocument: "after" }
        );

      if (!result) {
        return NextResponse.json(
          createErrorResponse("Vehículo no encontrado"),
          { status: 404 }
        );
      }

      const updatedVehicle = {
        ...result,
        _id: result._id.toString(),
      } as VehicleDataFrontend;

      if (status === ApprovalStatus.REJECTED && rejectionReason) {
        console.log("Enviando email de rechazo...");
        await sendVehicleRejectionEmailGmail(updatedVehicle, rejectionReason);
      } else if (status === ApprovalStatus.APPROVED) {
        console.log("Enviando email de aprobación...");
        await sendVehicleApprovalEmail(updatedVehicle);
      }

      console.log("Estado del vehículo actualizado exitosamente");

      return NextResponse.json(
        createSuccessResponse(
          updatedVehicle,
          "Estado del vehículo actualizado exitosamente"
        ),
        { status: 200 }
      );
    } catch (serviceError) {
      console.error("Error al actualizar vehículo:", serviceError);
      return NextResponse.json(
        createErrorResponse("Error al procesar la actualización"),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error general en PATCH /api/admin/vehicles/[id]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    console.log("DELETE /api/admin/vehicles/[id] - Iniciando...");

    // Resolver params de forma asíncrona
    const resolvedParams = await params;

    // Verificar sesión y autorización
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), {
        status: 403,
      });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), {
        status: 403,
      });
    }

    // Validar que el ID sea válido
    if (!ObjectId.isValid(resolvedParams.id)) {
      return NextResponse.json(createErrorResponse("ID de vehículo inválido"), {
        status: 400,
      });
    }

    let client;
    try {
      client = await clientPromise;
    } catch (dbError) {
      console.error("Error de conexión a MongoDB:", dbError);
      return NextResponse.json(
        createErrorResponse("Error de conexión a la base de datos"),
        { status: 500 }
      );
    }

    try {
      const db = client.db("vehicle_store");

      // Primero verificar que el vehículo existe
      const vehicle = await db
        .collection("vehicles")
        .findOne({ _id: new ObjectId(resolvedParams.id) });

      if (!vehicle) {
        return NextResponse.json(
          createErrorResponse("Vehículo no encontrado"),
          { status: 404 }
        );
      }

      // Eliminar el vehículo
      const result = await db
        .collection("vehicles")
        .deleteOne({ _id: new ObjectId(resolvedParams.id) });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          createErrorResponse("Error al eliminar el vehículo"),
          { status: 500 }
        );
      }

      console.log("Vehículo eliminado exitosamente");

      return NextResponse.json(
        createSuccessResponse(
          { id: resolvedParams.id },
          "Vehículo eliminado exitosamente"
        ),
        { status: 200 }
      );
    } catch (serviceError) {
      console.error("Error al eliminar vehículo:", serviceError);
      return NextResponse.json(
        createErrorResponse("Error al procesar la eliminación"),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error general en DELETE /api/admin/vehicles/[id]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}