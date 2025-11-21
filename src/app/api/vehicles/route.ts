// src/app/api/vehicles/route.ts - ALEATORIO SIMPLE
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ApprovalStatus } from '@/types/types';
import { WithId, Document } from 'mongodb';

export const dynamic = "force-dynamic";

const convertMongoDocumentToVehicle = (doc: WithId<Document>) => {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    _id: _id.toString(),
    postedDate: doc.postedDate?.toISOString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
};

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('vehicle_store');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const random = searchParams.get('random') === 'true'; // ← NUEVO parámetro

    let vehicles: WithId<Document>[];

    if (random) {
      // 🎲 ALEATORIO: Usa $sample de MongoDB
      vehicles = await db
        .collection('vehicles')
        .aggregate<WithId<Document>>([
          {
            $match: {
              $or: [
                { status: ApprovalStatus.APPROVED },
                { status: { $exists: false } },
              ]
            }
          },
          { $sample: { size: limit } } // ← Selección aleatoria
        ])
        .toArray();
    } else {
      // 📅 NORMAL: Por fecha
      const sort = searchParams.get('sort') || 'createdAt';
      const order = searchParams.get('order') === 'asc' ? 1 : -1;
      
      vehicles = await db
        .collection('vehicles')
        .find({
          $or: [
            { status: ApprovalStatus.APPROVED },
            { status: { $exists: false } },
          ]
        })
        .sort({ [sort]: order })
        .limit(limit)
        .toArray();
    }

    console.log(`✅ Vehículos encontrados: ${vehicles.length}${random ? ' (aleatorios)' : ''}`);

    const formattedVehicles = vehicles.map(convertMongoDocumentToVehicle);

    return NextResponse.json({
      success: true,
      vehicles: formattedVehicles,
      total: vehicles.length,
      isRandom: random,
    });
  } catch (error) {
    console.error('❌ Error fetching vehicles:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}