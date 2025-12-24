// src/app/api/analytics/reels/interaction/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { vehicleId, interactionType, timestamp } = data;

    if (!vehicleId || !interactionType) {
      return NextResponse.json(
        { success: false, error: 'vehicleId and interactionType are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('vehicle_store');

    // Store interaction data
    await db.collection('reel_interactions').insertOne({
      vehicleId,
      interactionType,
      timestamp: new Date(timestamp),
      createdAt: new Date(),
    });

    // Update vehicle interaction counts
    const updateField: any = {};
    switch (interactionType) {
      case 'favorite':
        updateField['analytics.reelFavorites'] = 1;
        break;
      case 'share':
        updateField['analytics.reelShares'] = 1;
        break;
      case 'view_details':
        updateField['analytics.reelClickThrough'] = 1;
        break;
    }

    if (Object.keys(updateField).length > 0) {
      await db.collection('vehicles').updateOne(
        { _id: vehicleId },
        { $inc: updateField }
      );
    }

    console.log(`✅ Interaction recorded: ${interactionType} for vehicle ${vehicleId}`);

    return NextResponse.json({
      success: true,
      message: 'Interaction recorded successfully',
    });
  } catch (error) {
    console.error('❌ Error recording interaction:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to record interaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}