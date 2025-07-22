// src/app/api/vehicles/[id]/views/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { VehicleService } from '@/services/vehicleService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params since they're now a Promise in Next.js 15
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ success: false, error: 'Vehicle ID is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('vehicle_store');
    const vehicleService = new VehicleService(db);

    const response = await vehicleService.incrementVehicleViews(id);

    return NextResponse.json(response, { status: response.success ? 200 : 404 });

  } catch (error) {
    console.error(`Error incrementing views for vehicle ${id}:`, error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}