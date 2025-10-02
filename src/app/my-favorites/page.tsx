//src/app/my-favorites/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import FavoritesList from "@/components/features/vehicles/common/FavoritesList";
import { Vehicle } from "@/types/types";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Heart } from "lucide-react";

interface Favorite {
  userId: ObjectId;
  vehicleId: ObjectId;
}

async function getFavoriteVehicles(): Promise<Vehicle[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  try {
    const db = await getDb();
    const favoritesCollection = db.collection<Favorite>("favorites");
    const vehiclesCollection = db.collection("vehicles");

    const userFavorites = await favoritesCollection
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .toArray();

    const vehicleIds = userFavorites.map((fav) => fav.vehicleId);

    if (vehicleIds.length === 0) {
      return [];
    }

    const favoriteVehicles = await vehiclesCollection
      .find({ _id: { $in: vehicleIds } })
      .toArray();
    
    const vehicleMap = new Map(favoriteVehicles.map(v => [v._id.toString(), v]));
    const sortedVehicles = vehicleIds.map(id => vehicleMap.get(id.toString())).filter(Boolean);

    return JSON.parse(JSON.stringify(sortedVehicles));

  } catch (error) {
    console.error("Error fetching favorite vehicles:", error);
    return [];
  }
}

export default async function MyFavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/my-favorites");
  }

  const favoriteVehicles = await getFavoriteVehicles();

  return (
      <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Mis Favoritos</h1>
              {favoriteVehicles.length > 0 && (
                  <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      {favoriteVehicles.length} {favoriteVehicles.length === 1 ? 'vehículo' : 'vehículos'}
                  </span>
              )}
          </div>
          {favoriteVehicles.length > 0 ? (
              <FavoritesList initialVehicles={favoriteVehicles} />
          ) : (
              <div className="text-center py-16">
                  <h2 className="text-2xl font-semibold mb-2">Tu garaje de favoritos está vacío</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                  Usa el ícono del corazón <Heart className="inline w-5 h-5 text-red-500" /> para guardar los vehículos que te interesan.
                  </p>
              </div>
          )}
      </div>
  );
}