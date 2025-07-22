// src/app/api/vehicles/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { VehicleService } from "@/services/vehicleService";
import { ApprovalStatus } from "@/types/types";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params since they're now a Promise in Next.js 15
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Vehicle ID is required' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'admin';

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehicleService = new VehicleService(db);

    // Un admin puede ver cualquier vehículo, un usuario normal solo los aprobados.
    const statusFilter = isAdmin ? undefined : ApprovalStatus.APPROVED;
    const response = await vehicleService.getVehicleById(id, statusFilter);

    return NextResponse.json(response, { status: response.success ? 200 : 404 });
  } catch (error) {
    console.error("Error general en GET /api/vehicles/[id]:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { success: false, error: `Error interno del servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}