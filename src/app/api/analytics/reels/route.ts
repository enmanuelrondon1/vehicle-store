// src/app/api/analytics/reels/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { vehicleId, viewDuration, isCompleteView, timestamp } = data;

    if (!vehicleId) {
      return NextResponse.json(
        { success: false, error: 'vehicleId is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('vehicle_store');

    // Store analytics data
    await db.collection('reel_analytics').insertOne({
      vehicleId,
      viewDuration,
      isCompleteView,
      timestamp: new Date(timestamp),
      createdAt: new Date(),
    });

    // Update vehicle view count if complete view
    if (isCompleteView) {
      await db.collection('vehicles').updateOne(
        { _id: vehicleId },
        { 
          $inc: { 
            views: 1,
            reelViews: 1 
          } 
        }
      );
    }

    console.log(`✅ Analytics recorded for vehicle ${vehicleId}: ${viewDuration}ms`);

    return NextResponse.json({
      success: true,
      message: 'Analytics recorded successfully',
    });
  } catch (error) {
    console.error('❌ Error recording analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to record analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get analytics summary
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');
    const days = parseInt(searchParams.get('days') || '7');

    const client = await clientPromise;
    const db = client.db('vehicle_store');

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    let query: any = {
      createdAt: { $gte: dateThreshold }
    };

    if (vehicleId) {
      query.vehicleId = vehicleId;
    }

    const analytics = await db
      .collection('reel_analytics')
      .find(query)
      .toArray();

    // Calculate summary stats
    const totalViews = analytics.length;
    const completeViews = analytics.filter(a => a.isCompleteView).length;
    const avgDuration = analytics.length > 0
      ? analytics.reduce((sum, a) => sum + a.viewDuration, 0) / analytics.length
      : 0;
    const completionRate = totalViews > 0
      ? (completeViews / totalViews) * 100
      : 0;

    // Group by vehicle
    const byVehicle = analytics.reduce((acc: any, item: any) => {
      if (!acc[item.vehicleId]) {
        acc[item.vehicleId] = {
          vehicleId: item.vehicleId,
          views: 0,
          completeViews: 0,
          totalDuration: 0,
        };
      }
      acc[item.vehicleId].views++;
      if (item.isCompleteView) acc[item.vehicleId].completeViews++;
      acc[item.vehicleId].totalDuration += item.viewDuration;
      return acc;
    }, {});

    const topVehicles = Object.values(byVehicle)
      .sort((a: any, b: any) => b.completeViews - a.completeViews)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalViews,
          completeViews,
          avgDuration: Math.round(avgDuration),
          completionRate: Math.round(completionRate * 10) / 10,
        },
        topVehicles,
        period: `${days} days`,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}