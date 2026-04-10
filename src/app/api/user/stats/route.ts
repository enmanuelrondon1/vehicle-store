// src/app/api/user/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const userId = session.user.id;

    // 1. Vehículos del usuario
    const vehicles = await db
      .collection("vehicles")
      .find({ "sellerContact.userId": userId })
      .project({ _id: 1, status: 1, views: 1 })
      .toArray();

    // 2. Cuántos usuarios guardaron los anuncios del usuario
    //    vehicleId en favorites es ObjectId — hay que comparar con ObjectId
    const vehicleObjectIds = vehicles.map((v) => v._id); // ya son ObjectId

    const receivedFavorites = vehicleObjectIds.length > 0
      ? await db.collection("favorites").countDocuments({
          vehicleId: { $in: vehicleObjectIds },
        })
      : 0;

    // 3. Cuántos favoritos tiene el usuario (los que él guardó)
    const myFavoritesCount = await db
      .collection("favorites")
      .countDocuments({ userId: new ObjectId(userId) });

    // 4. Stats calculados
    const published = vehicles.filter((v) => v.status === "approved").length;
    const pending = vehicles.filter(
      (v) => v.status === "pending" || v.status === "under_review"
    ).length;
    const views = vehicles.reduce((sum, v) => sum + (v.views || 0), 0);

    return NextResponse.json({
      published,
      pending,
      views,
      favorites: receivedFavorites, // ← cuántos guardaron TUS anuncios
      myFavorites: myFavoritesCount, // ← cuántos guardaste TÚ
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}