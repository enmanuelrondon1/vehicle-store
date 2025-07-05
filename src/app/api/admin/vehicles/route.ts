// src/app/api/admin/vehicles/route.ts
import {  NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ApiResponseBackend } from "@/types/types";

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

export async function GET(): Promise<NextResponse> {
  try {
    console.log("GET /api/admin/vehicles - Iniciando...");

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
      console.log("Obteniendo lista de vehículos...");

      const vehicles = await db
        .collection("vehicles")
        .find({})
        .toArray();

      const { convertToFrontend } = await import("@/types/types");
      const formattedVehicles = vehicles.map((vehicle) =>
        convertToFrontend(vehicle as import("@/types/types").VehicleDataBackend)
      );

      console.log("Vehículos obtenidos:", formattedVehicles.length);

      return NextResponse.json(
        createSuccessResponse(formattedVehicles, "Lista de vehículos obtenida"),
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
    console.error("Error general en GET /api/admin/vehicles:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}