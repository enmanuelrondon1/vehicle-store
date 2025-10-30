// src/app/api/vehicles/[id]/rate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const vehicleId = params.id;
  // @ts-ignore
  const userId = session.user.id;

  try {
    const body = await req.json();
    const { rating } = body;

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La valoración debe ser un número entre 1 y 5." },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(vehicleId) || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "IDs inválidos" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const ratingsCollection = db.collection("ratings");
    const vehiclesCollection = db.collection("vehicles");

    // ✅ Guardar userId como ObjectId para consistencia
    const userIdObj = new ObjectId(userId);
    const vehicleIdObj = new ObjectId(vehicleId);

    // Actualizar o insertar la valoración
    const result = await ratingsCollection.updateOne(
      { userId: userIdObj, vehicleId: vehicleIdObj },
      {
        $set: {
          rating,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId: userIdObj,
          vehicleId: vehicleIdObj,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Calcular el nuevo promedio y contar valoraciones
    const allRatings = await ratingsCollection
      .find({ vehicleId: vehicleIdObj })
      .toArray();

    const totalRatings = allRatings.length;
    const averageRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    // Actualizar el vehículo con el nuevo promedio
    await vehiclesCollection.updateOne(
      { _id: vehicleIdObj },
      {
        $set: {
          averageRating: Math.round(averageRating * 10) / 10,
          ratingCount: totalRatings,
        },
      }
    );

    console.log("✅ Valoración guardada:", {
      userId: userId,
      vehicleId: vehicleId,
      rating,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingCount: totalRatings,
    });

    return NextResponse.json({
      message: result.upsertedCount > 0 
        ? "Valoración registrada exitosamente" 
        : "Valoración actualizada exitosamente",
      averageRating: Math.round(averageRating * 10) / 10,
      ratingCount: totalRatings,
    });
  } catch (error) {
    console.error(`Error al procesar la valoración:`, error);
    return NextResponse.json(
      { error: "Ocurrió un error interno en el servidor." },
      { status: 500 }
    );
  }
}