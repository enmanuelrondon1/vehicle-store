// src/app/api/admin/vehicles/[id]/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ApiResponseBackend, Vehicle } from "@/types/types";
import { Filter } from "mongodb";

// Helper para respuestas de error
const createErrorResponse = (
  error: string,
  status: number
): NextResponse => {
  return NextResponse.json({ success: false, error } as ApiResponseBackend<null>, {
    status,
  });
};

// Helper para respuestas exitosas
const createSuccessResponse = <T>(
  data: T,
  message: string,
  status: number
): NextResponse => {
  return NextResponse.json(
    { success: true, data, message } as ApiResponseBackend<T>,
    { status }
  );
};

// Endpoint para AÑADIR nuevas imágenes a un vehículo
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return createErrorResponse("Acceso no autorizado", 403);
  }

  const { id } = params;
  if (!ObjectId.isValid(id)) {
    return createErrorResponse("ID de vehículo inválido", 400);
  }

  const { imageUrls } = await req.json();

  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    return createErrorResponse("Se requieren URLs de imágenes", 400);
  }

  try {
    const client = await clientPromise;
    const db = client.db("vehicle_store");

    const filter: Filter<Vehicle> = { _id: new ObjectId(id) as any };

    const result = await db
      .collection<Vehicle>("vehicles")
      .updateOne(filter, { $push: { images: { $each: imageUrls } } });

    if (result.modifiedCount === 0) {
      return createErrorResponse("Vehículo no encontrado o sin cambios", 404);
    }

    return createSuccessResponse(
      { imageUrls },
      "Imágenes añadidas correctamente",
      200
    );
  } catch (error) {
    console.error("Error al añadir imágenes al vehículo:", error);
    return createErrorResponse("Error interno del servidor", 500);
  }
}

// Endpoint para ELIMINAR una imagen de un vehículo
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return createErrorResponse("Acceso no autorizado", 403);
  }

  const { id } = params;
  if (!ObjectId.isValid(id)) {
    return createErrorResponse("ID de vehículo inválido", 400);
  }

  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return createErrorResponse("Se requiere la URL de la imagen", 400);
  }

  try {
    // NOTA: La lógica para eliminar de Cloudinary se ha movido a un servicio
    // o se asume que se maneja en otro lugar para simplificar este endpoint.
    // Aquí solo nos enfocamos en la base de datos.

    const client = await clientPromise;
    const db = client.db("vehicle_store");

    const filter: Filter<Vehicle> = { _id: new ObjectId(id) as any };

    const result = await db
      .collection<Vehicle>("vehicles")
      .updateOne(filter, { $pull: { images: imageUrl } });

    if (result.modifiedCount === 0) {
      return createErrorResponse(
        "Vehículo no encontrado o la imagen no existe en el vehículo",
        404
      );
    }

    return createSuccessResponse(
      { imageUrl },
      "Imagen eliminada correctamente",
      200
    );
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    return createErrorResponse("Error interno del servidor", 500);
  }
}