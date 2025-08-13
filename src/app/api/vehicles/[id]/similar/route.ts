// src/app/api/vehicles/[id]/similar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { VehicleService } from '@/services/vehicleService';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'ID de vehículo es requerido' },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db('vehicle_store');
    const vehicleService = new VehicleService(db);

    const response = await vehicleService.findSimilarVehicles(id);

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error en GET /api/vehicles/${id}/similar:`, error);
    return NextResponse.json(
      { success: false, error: 'Error Interno del Servidor' }, 
      { status: 500 }
    );
  }
}