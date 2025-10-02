// src/app/api/vehicles/by-ids/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Se requiere un array de IDs" },
        { status: 400 }
      );
    }

    const validObjectIds = ids
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    if (validObjectIds.length !== ids.length) {
        return NextResponse.json(
            { error: "Uno o más IDs de vehículos son inválidos" },
            { status: 400 }
        );
    }

        const db = await getDb();
        const vehiclesCollection = db.collection("vehicles");

        const vehicles = await vehiclesCollection
          .find({ _id: { $in: validObjectIds } })
          .toArray();

        const vehiclesById = new Map(vehicles.map(v => [v._id.toString(), v]));
    const sortedVehicles = ids.map(id => vehiclesById.get(id)).filter(Boolean);

    return NextResponse.json({ success: true, vehicles: sortedVehicles });
  } catch (error) {
    console.error("Error al obtener vehículos por IDs:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}