//src/app/api/admin/vehicles/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import {
  ApiResponseBackend,
  ApprovalStatus,
  VehicleDataFrontend,
  VehicleHistoryEntry,
  Vehicle,
} from "@/types/types";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/authOptions";
import {
  sendVehicleApprovalEmail,
  sendVehicleRejectionEmailGmail,
} from "@/lib/mailer";
// ✅ FIX: importar revalidatePath para invalidar caché ISR al aprobar/rechazar
import { revalidatePath } from "next/cache";

interface Comment {
  _id: ObjectId;
  userId: ObjectId;
  username: string;
  text: string;
  createdAt: Date;
  type: "rejection";
}

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
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    console.log("GET /api/admin/vehicles/[id] - Iniciando...");

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

    if (!ObjectId.isValid(params.id)) {
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
        .findOne({ _id: new ObjectId(params.id) });

      if (!vehicle) {
        return NextResponse.json(
          createErrorResponse("Vehículo no encontrado"),
          { status: 404 }
        );
      }

      const formattedVehicle = {
        ...vehicle,
        _id: vehicle._id.toString(),
        postedDate: vehicle.postedDate instanceof Date ? vehicle.postedDate.toISOString() : vehicle.postedDate,
        createdAt: vehicle.createdAt instanceof Date ? vehicle.createdAt.toISOString() : vehicle.createdAt,
        updatedAt: vehicle.updatedAt instanceof Date ? vehicle.updatedAt.toISOString() : vehicle.updatedAt,
      };

      return NextResponse.json(
        createSuccessResponse(formattedVehicle, "Vehículo obtenido exitosamente"),
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
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    console.log("PATCH /api/admin/vehicles/[id] - Iniciando...");

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), { status: 403 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), { status: 403 });
    }

    const body = await request.json();
    const { status, rejectionReason } = body;

    if (!Object.values(ApprovalStatus).includes(status)) {
      return NextResponse.json(createErrorResponse("Estado inválido"), { status: 400 });
    }

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(createErrorResponse("ID de vehículo inválido"), { status: 400 });
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

      const updateData: {
        status: ApprovalStatus;
        updatedAt: Date;
        rejectionReason?: string;
      } = {
        status: status,
        updatedAt: new Date(),
      };

      const unsetData: { rejectionReason?: "" } = {};
      const pushData: {
        comments?: Comment;
        history?: VehicleHistoryEntry;
      } = {};

      if (status === ApprovalStatus.REJECTED && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
        const rejectionComment: Comment = {
          _id: new ObjectId(),
          userId: new ObjectId(session.user.id),
          username: session.user.name || "Admin",
          text: `Motivo del rechazo: ${rejectionReason}`,
          createdAt: new Date(),
          type: "rejection",
        };
        pushData.comments = rejectionComment;
      } else {
        unsetData.rejectionReason = "";
      }

      const historyEntry: VehicleHistoryEntry = {
        id: new ObjectId().toString(),
        action: `Estado cambiado a ${status}`,
        details:
          status === ApprovalStatus.REJECTED
            ? `Rechazado con motivo: ${rejectionReason}`
            : `El vehículo ha sido ${status.toLowerCase()}.`,
        author: session.user.name || "Admin",
        timestamp: new Date().toISOString(),
      };
      pushData.history = historyEntry;

      const updateOperation: {
        $set: Partial<typeof updateData>;
        $unset?: Partial<typeof unsetData>;
        $push?: Partial<typeof pushData>;
      } = { $set: updateData };

      if (Object.keys(unsetData).length > 0) updateOperation.$unset = unsetData;
      if (Object.keys(pushData).length > 0) updateOperation.$push = pushData;

      const result = await db
        .collection<{ comments?: Comment[] }>("vehicles")
        .findOneAndUpdate(
          { _id: new ObjectId(params.id) },
          updateOperation,
          { returnDocument: "after" }
        );

      if (!result) {
        return NextResponse.json(createErrorResponse("Vehículo no encontrado"), { status: 404 });
      }

      const updatedVehicle = {
        ...result,
        _id: result._id.toString(),
      } as VehicleDataFrontend;

      // ✅ FIX: Invalidar caché ISR al aprobar o rechazar un vehículo
      // Sin esto, la lista pública no se actualiza hasta que el ISR expire (60s)
      revalidatePath("/vehicleList");
      revalidatePath("/");
      revalidatePath(`/vehicles/${params.id}`);
      console.log("✅ Caché ISR invalidado para /vehicleList, / y /vehicles/" + params.id);

      if (status === ApprovalStatus.REJECTED && rejectionReason) {
        console.log("Enviando email de rechazo...");
        await sendVehicleRejectionEmailGmail(updatedVehicle, rejectionReason);
      } else if (status === ApprovalStatus.APPROVED) {
        console.log("Enviando email de aprobación...");
        await sendVehicleApprovalEmail(updatedVehicle);
      }

      console.log("Estado del vehículo actualizado exitosamente");

      return NextResponse.json(
        createSuccessResponse(updatedVehicle, "Estado del vehículo actualizado exitosamente"),
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
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    console.log("🚀 PUT /api/admin/vehicles/[id] - Iniciando...");

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), { status: 403 });
    }

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(createErrorResponse("ID de vehículo inválido"), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehicleId = new ObjectId(params.id);

    const vehicleToUpdate = await db.collection("vehicles").findOne({ _id: vehicleId });
    if (!vehicleToUpdate) {
      return NextResponse.json(createErrorResponse("Vehículo no encontrado"), { status: 404 });
    }

    const body: any = await request.json();

    const {
      _id, createdAt, updatedAt, postedDate,
      comments, history, status, rejectionReason,
      userId, userEmail,
      ...updateData
    } = body;

    if (updateData.year !== undefined)     updateData.year     = Number(updateData.year);
    if (updateData.price !== undefined)    updateData.price    = Number(updateData.price);
    if (updateData.mileage !== undefined)  updateData.mileage  = Number(updateData.mileage);
    if (updateData.doors !== undefined)    updateData.doors    = Number(updateData.doors);
    if (updateData.seats !== undefined)    updateData.seats    = Number(updateData.seats);

    if (updateData.images && !Array.isArray(updateData.images)) {
      updateData.images = [];
    }

    const result = await db.collection("vehicles").updateOne(
      { _id: vehicleId },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(createErrorResponse("Vehículo no encontrado"), { status: 404 });
    }

    // ✅ FIX: Invalidar caché ISR al editar un vehículo desde el admin
    revalidatePath("/vehicleList");
    revalidatePath("/");
    revalidatePath(`/vehicles/${params.id}`);

    const updatedVehicle = await db.collection("vehicles").findOne({ _id: vehicleId });
    if (!updatedVehicle) {
      return NextResponse.json(
        createErrorResponse("Vehículo no encontrado después de la actualización"),
        { status: 404 }
      );
    }

    const formattedVehicle = {
      ...updatedVehicle,
      _id: updatedVehicle._id.toString(),
      postedDate: updatedVehicle.postedDate instanceof Date ? updatedVehicle.postedDate.toISOString() : updatedVehicle.postedDate,
      createdAt:  updatedVehicle.createdAt  instanceof Date ? updatedVehicle.createdAt.toISOString()  : updatedVehicle.createdAt,
      updatedAt:  updatedVehicle.updatedAt  instanceof Date ? updatedVehicle.updatedAt.toISOString()  : updatedVehicle.updatedAt,
    };

    return NextResponse.json(
      createSuccessResponse(formattedVehicle, "Vehículo actualizado exitosamente"),
      { status: 200 }
    );
  } catch (error) {
    console.error("💥 ERROR CRÍTICO en PUT /api/admin/vehicles/[id]:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), { status: 403 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), { status: 403 });
    }

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(createErrorResponse("ID de vehículo inválido"), { status: 400 });
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

    const db = client.db("vehicle_store");
    const vehicleObjectId = new ObjectId(params.id);

    const vehicle = await db.collection("vehicles").findOne({ _id: vehicleObjectId });
    if (!vehicle) {
      return NextResponse.json(createErrorResponse("Vehículo no encontrado"), { status: 404 });
    }

    const ratingsDeleted  = await db.collection("ratings").deleteMany({ vehicleId: vehicleObjectId });
    const favoritesDeleted = await db.collection("favorites").deleteMany({ vehicleId: vehicleObjectId });
    const vehicleResult   = await db.collection("vehicles").deleteOne({ _id: vehicleObjectId });

    if (vehicleResult.deletedCount === 0) {
      return NextResponse.json(createErrorResponse("Error al eliminar el vehículo"), { status: 500 });
    }

    // ✅ FIX: Invalidar caché ISR al eliminar un vehículo
    revalidatePath("/vehicleList");
    revalidatePath("/");

    return NextResponse.json(
      createSuccessResponse(
        {
          id: params.id,
          deletedRatings: ratingsDeleted.deletedCount,
          deletedFavorites: favoritesDeleted.deletedCount,
        },
        "Vehículo y datos relacionados eliminados exitosamente"
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error general en DELETE /api/admin/vehicles/[id]:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}