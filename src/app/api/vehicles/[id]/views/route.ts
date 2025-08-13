// src/app/api/vehicles/[id]/views/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { VehicleService } from "@/services/vehicleService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string | undefined;
  
  try {
    const resolvedParams = await params;
    id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID de vehículo requerido" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehicleService = new VehicleService(db);
    
    const response = await vehicleService.incrementVehicleViews(id);

    return NextResponse.json(response, { status: response.success ? 200 : 404 });
  } catch (error) {
    console.error(`Error en POST /api/vehicles/${id || 'unknown'}/views:`, error);
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}