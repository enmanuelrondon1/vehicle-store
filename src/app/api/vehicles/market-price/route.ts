// src/app/api/vehicles/market-price/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ApprovalStatus } from "@/types/types";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  noStore();
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");
    const model = searchParams.get("model");
    const year  = parseInt(searchParams.get("year") || "0");

    if (!brand || !model) {
      return NextResponse.json(
        { success: false, error: "brand y model son requeridos" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("vehicle_store");

    // Construir query: misma marca/modelo, año ±2, solo aprobados
    const query: Record<string, unknown> = {
      status: ApprovalStatus.APPROVED,
      brand: { $regex: new RegExp(`^${brand}$`, "i") },
      model: { $regex: new RegExp(`^${model}$`, "i") },
    };

    if (year > 0) {
      query.year = { $gte: year - 2, $lte: year + 2 };
    }

    const vehicles = await db
      .collection("vehicles")
      .find(query, { projection: { price: 1, year: 1, mileage: 1, condition: 1 } })
      .limit(50)
      .toArray();

    if (vehicles.length === 0) {
      // Sin resultados exactos — intentar solo por marca
      const byBrandOnly = await db
        .collection("vehicles")
        .find(
          {
            status: ApprovalStatus.APPROVED,
            brand: { $regex: new RegExp(`^${brand}$`, "i") },
            ...(year > 0 ? { year: { $gte: year - 3, $lte: year + 3 } } : {}),
          },
          { projection: { price: 1, year: 1 } }
        )
        .limit(30)
        .toArray();

      if (byBrandOnly.length === 0) {
        return NextResponse.json({
          success: true,
          data: null,
          message: "No hay suficientes datos de mercado para este vehículo",
        });
      }

      const prices = byBrandOnly.map((v) => v.price).filter(Boolean);
      const avg   = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
      const min   = Math.min(...prices);
      const max   = Math.max(...prices);

      return NextResponse.json({
        success: true,
        data: {
          avg,
          min,
          max,
          count: byBrandOnly.length,
          scope: "brand", // referencia solo por marca
        },
      });
    }

    const prices = vehicles.map((v) => v.price).filter(Boolean);
    const avg   = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const min   = Math.min(...prices);
    const max   = Math.max(...prices);

    return NextResponse.json({
      success: true,
      data: {
        avg,
        min,
        max,
        count: vehicles.length,
        scope: "exact", // referencia exacta marca/modelo/año
      },
    });
  } catch (error) {
    console.error("Error en /api/vehicles/market-price:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}