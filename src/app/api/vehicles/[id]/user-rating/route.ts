// src/app/api/vehicles/[id]/user-rating/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  console.log("🔐 Session:", session);

  // @ts-ignore
  if (!session || !session.user || !session.user.id) {
    console.log("❌ No hay sesión válida");
    return NextResponse.json({ userRating: null });
  }

  const vehicleId = params.id;
  // @ts-ignore
  const userId = session.user.id;

  console.log("🔍 Buscando rating:");
  console.log("  - vehicleId:", vehicleId);
  console.log("  - userId:", userId);
  console.log("  - userId type:", typeof userId);

  try {
    if (!ObjectId.isValid(vehicleId)) {
      console.log("❌ vehicleId inválido:", vehicleId);
      return NextResponse.json(
        { error: "ID de vehículo inválido" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const ratingsCollection = db.collection("ratings");

    // 🔍 PRIMERO: Ver TODOS los ratings de este vehículo
    const allRatings = await ratingsCollection.find({
      vehicleId: new ObjectId(vehicleId)
    }).toArray();
    
    console.log("📊 TODOS los ratings de este vehículo:", allRatings);

    // ✅ Buscar con userId como ObjectId (formato correcto)
    const userRatingDoc = await ratingsCollection.findOne({
      vehicleId: new ObjectId(vehicleId),
      userId: new ObjectId(userId),
    });

    console.log("👤 Rating del usuario encontrado:", userRatingDoc);

    return NextResponse.json({
      userRating: userRatingDoc ? userRatingDoc.rating : null,
    });
  } catch (error) {
    console.error("❌ Error al obtener la valoración del usuario:", error);
    return NextResponse.json(
      { error: "Error al obtener la valoración" },
      { status: 500 }
    );
  }
}