// src/app/api/vehicles/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ApprovalStatus } from '@/types/types';
import { WithId, Document } from 'mongodb';

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

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('vehicle_store');

    const vehicles = await db
      .collection('vehicles')
      .find({ status: ApprovalStatus.APPROVED }) // <-- El filtro clave
      .sort({ postedDate: -1 })
      .toArray();

    const formattedVehicles = vehicles.map(convertMongoDocumentToVehicle);

    return NextResponse.json({
      success: true,
      data: formattedVehicles,
    });

  } catch (error) {
    console.error('Error fetching approved vehicles:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}