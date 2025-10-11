// src/app/api/user/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Definimos el tipo para la colección de favoritos
interface Favorite {
  _id?: ObjectId;
  userId: ObjectId;
  vehicleId: ObjectId;
  createdAt: Date;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const favoritesCollection = db.collection<Favorite>("favorites");
    const userFavorites = await favoritesCollection
      .find({ userId: new ObjectId(session.user.id) })
      .toArray();

    const vehicleIds = userFavorites.map((fav) => fav.vehicleId.toString());

    return NextResponse.json({ success: true, favorites: vehicleIds });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { vehicleId } = await request.json();

    if (!vehicleId || !ObjectId.isValid(vehicleId)) {
      return NextResponse.json(
        { error: "ID de vehículo inválido" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const favoritesCollection = db.collection<Favorite>("favorites");
    const userId = new ObjectId(session.user.id);
    const vehicleObjectId = new ObjectId(vehicleId);

    const existingFavorite = await favoritesCollection.findOne({
      userId,
      vehicleId: vehicleObjectId,
    });

    if (existingFavorite) {
      // Si ya es favorito, lo eliminamos (toggle)
      await favoritesCollection.deleteOne({ _id: existingFavorite._id });
      return NextResponse.json({
        success: true,
        message: "Vehículo eliminado de favoritos",
        action: "removed",
      });
    } else {
      // Si no es favorito, lo añadimos
      await favoritesCollection.insertOne({
        userId,
        vehicleId: vehicleObjectId,
        createdAt: new Date(),
      });
      return NextResponse.json({
        success: true,
        message: "Vehículo añadido a favoritos",
        action: "added",
      });
    }
  } catch (error) {
    console.error("Error al actualizar favoritos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}