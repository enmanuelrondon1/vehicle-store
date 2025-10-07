// src/app/api/user/vehicles/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { VehicleService } from '@/services/vehicleService';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ message: 'No autorizado. Debes iniciar sesión para ver tus anuncios.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const client = await connectToDatabase;
    const db = client.db("vehicle_store");
    const vehicleService = new VehicleService(db);

    const response = await vehicleService.getVehiclesBySellerId(session.user.id);

    if (!response.success) {
      return new NextResponse(
        JSON.stringify({ message: response.error }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return NextResponse.json(response.data);

  } catch (error) {
    console.error('Error al obtener los vehículos del usuario:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error interno del servidor al procesar la solicitud.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}