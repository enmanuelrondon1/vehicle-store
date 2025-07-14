// src/app/api/vehicles/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { VehicleService } from "@/services/vehicleService";
import { ApprovalStatus } from "@/types/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("GET /api/vehicles/[id] - Iniciando... ID:", id);

    let client;
    try {
      client = await clientPromise;
      console.log("Conexión a MongoDB exitosa");
    } catch (dbError) {
      console.error("Error de conexión a MongoDB:", dbError);
      return NextResponse.json(
        { success: false, error: "Error de conexión a la base de datos" },
        { status: 500 }
      );
    }

    try {
      const db = client.db("vehicle_store");
      const vehicleService = new VehicleService(db);
      console.log("Obteniendo vehículo con ID:", id);

      const result = await vehicleService.getVehicleById(id, ApprovalStatus.APPROVED);

      if (!result.success) {
        console.log("Vehículo no encontrado o error:", result.error);
        return NextResponse.json(
          { success: false, error: result.error },
          { status: result.error === "Vehículo no encontrado" ? 404 : 400 }
        );
      }

      console.log("Vehículo obtenido:", result.data);

      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "Vehículo obtenido exitosamente",
        },
        { status: 200 }
      );
    } catch (serviceError) {
      console.error("Error al obtener vehículo:", serviceError);
      return NextResponse.json(
        { success: false, error: "Error al procesar el vehículo" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error general en GET /api/vehicles/[id]:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { success: false, error: `Error interno del servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}