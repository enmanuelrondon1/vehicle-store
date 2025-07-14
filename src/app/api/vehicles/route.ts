//src/app/api/vehicles/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ApiResponseBackend, ApprovalStatus, VehicleDataBackend } from "@/types/types";
import { WithId, Document } from "mongodb";

const createErrorResponse = (
  error: string,
  validationErrors?: Record<string, string[]>
): ApiResponseBackend => ({
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

// Función helper para convertir MongoDB document a VehicleDataBackend
const convertMongoDocumentToVehicleData = (doc: WithId<Document>): VehicleDataBackend => {
  const { _id, ...rest } = doc;
  return {
    _id: _id.toString(),
    ...rest,
    // Asegurar que las fechas sean objetos Date
    postedDate: rest.postedDate instanceof Date ? rest.postedDate : new Date(rest.postedDate),
    createdAt: rest.createdAt instanceof Date ? rest.createdAt : new Date(rest.createdAt),
    updatedAt: rest.updatedAt instanceof Date ? rest.updatedAt : new Date(rest.updatedAt),
  } as VehicleDataBackend;
};

export async function GET(): Promise<NextResponse> {
  try {
    console.log("GET /api/vehicles - Iniciando...");

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
      console.log("Obteniendo lista de vehículos aprobados...");

      const vehicles = await db
        .collection("vehicles")
        .find({ status: ApprovalStatus.APPROVED })
        .toArray();

      const { convertToFrontend } = await import("@/types/types");
      
      // Convertir los documentos de MongoDB a VehicleDataBackend
      const backendVehicles = vehicles.map(convertMongoDocumentToVehicleData);
      
      // Luego convertir a formato frontend
      const formattedVehicles = backendVehicles.map((vehicle) =>
        convertToFrontend(vehicle)
      );

      console.log("Vehículos obtenidos:", formattedVehicles.length);

      return NextResponse.json(
        createSuccessResponse(formattedVehicles, "Lista de vehículos aprobados obtenida"),
        { status: 200 }
      );
    } catch (serviceError) {
      console.error("Error al obtener vehículos:", serviceError);
      return NextResponse.json(
        createErrorResponse("Error al procesar la lista de vehículos"),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error general en GET /api/vehicles:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}