import { NextRequest, NextResponse } from "next/server";
import { VehicleService } from "@/lib/vehicleService"; // Importas la clase

export async function GET(request: NextRequest) {
  // No más `connectToDB()` aquí
  const vehicleService = await VehicleService.getInstance(); // Obtienes la instancia conectada

  const { searchParams } = new URL(request.url);
  const vehicleIds = searchParams.getAll("vehicles");

  if (!vehicleIds || vehicleIds.length === 0) {
    return NextResponse.json(
      { success: false, message: "No vehicle IDs provided" },
      { status: 400 }
    );
  }

  try {
    const vehiclePromises = vehicleIds.map(async (id) => {
      // Usas la instancia del servicio
      const response = await vehicleService.getVehicleById(id);
      if (response.success) {
        return response.data;
      }
      return null;
    });

    const results = await Promise.all(vehiclePromises);
    const vehicles = results.filter((v) => v !== null);

    return NextResponse.json({ success: true, data: vehicles });
  } catch (error) {
    console.error("Error fetching vehicles in batch:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}