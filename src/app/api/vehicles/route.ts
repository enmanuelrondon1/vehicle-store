// src/app/api/vehicles/route.ts
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
    const random = searchParams.get('random') === 'true';
    
    // 🎯 FILTROS
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const featured = searchParams.get('featured') === 'true';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');

    // Construir query de MongoDB
    const query: any = {
      $or: [
        { status: ApprovalStatus.APPROVED },
        { status: { $exists: false } },
      ]
    };

    // Aplicar filtros
    if (category && category !== 'all') {
      query.category = category;
    }

    if (condition && condition !== 'all') {
      query.condition = condition;
    }

    if (featured) {
      query.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = parseInt(minYear);
      if (maxYear) query.year.$lte = parseInt(maxYear);
    }

    console.log('🔍 Query filters:', query);

    let vehicles: WithId<Document>[];

    if (random) {
      // 🎲 ALEATORIO: Usa $sample de MongoDB
      vehicles = await db
        .collection('vehicles')
        .aggregate<WithId<Document>>([
          { $match: query },
          { $sample: { size: limit } }
        ])
        .toArray();
    } else {
      // 📅 NORMAL: Por fecha
      const sort = searchParams.get('sort') || 'createdAt';
      const order = searchParams.get('order') === 'asc' ? 1 : -1;
      
      vehicles = await db
        .collection('vehicles')
        .find(query)
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
      appliedFilters: {
        category,
        condition,
        featured,
        priceRange: minPrice || maxPrice ? [minPrice, maxPrice] : null,
        yearRange: minYear || maxYear ? [minYear, maxYear] : null,
      }
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