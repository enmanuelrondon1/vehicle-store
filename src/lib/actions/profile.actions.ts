// src/lib/actions/profile.actions.ts
import { getDb } from "@/lib/mongodb";
import { ApprovalStatus, Vehicle } from "@/types/types";
import { Collection, ObjectId } from "mongodb";

// Una interfaz simplificada para la consulta de favoritos
interface Favorite {
    _id: ObjectId;
    userId: ObjectId;
    vehicleId: ObjectId;
}

export interface UserStats {
  published: number;
  pending: number;
  views: number;
  favorites: number;
}

/**
 * Obtiene las estadísticas de un usuario directamente desde la base de datos.
 * @param userId - El ID del usuario para el que se calculan las estadísticas.
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  // Si no hay ID de usuario, no hay nada que hacer.
  if (!userId) {
    return { published: 0, pending: 0, views: 0, favorites: 0 };
  }

  try {
    const db = await getDb();
    const vehiclesCollection: Collection<Vehicle> = db.collection("vehicles");
    const favoritesCollection: Collection<Favorite> = db.collection("favorites");

    // 1. Obtener solo los campos necesarios de los vehículos del usuario
    const userVehicles = await vehiclesCollection
      .find(
        { "sellerContact.userId": userId },
        { projection: { _id: 1, status: 1, views: 1 } }
      )
      .toArray();

    // Si el usuario no tiene vehículos, devolvemos ceros.
    if (userVehicles.length === 0) {
      return { published: 0, pending: 0, views: 0, favorites: 0 };
    }

    // 2. Calcular estadísticas básicas iterando sobre los resultados
    let published = 0;
    let pending = 0;
    let views = 0;

    for (const vehicle of userVehicles) {
      if (vehicle.status === ApprovalStatus.APPROVED) {
        published++;
      } else if (vehicle.status === ApprovalStatus.PENDING) {
        pending++;
      }
      views += vehicle.views || 0;
    }

    // 3. Calcular el total de "favoritos" para los vehículos de este usuario, excluyendo al propio usuario.
    const vehicleIds = userVehicles.map(v => new ObjectId(v._id));
    const favorites = await favoritesCollection.countDocuments({
      vehicleId: { $in: vehicleIds },
      userId: { $ne: new ObjectId(userId) }, // Excluir al propio usuario
    });

    return {
      published,
      pending,
      views,
      favorites,
    };
  } catch (error) {
    console.error(`Error al obtener las estadísticas para el usuario ${userId}:`, error);
    // Devolver cero en caso de error para no romper la UI
    return {
      published: 0,
      pending: 0,
      views: 0,
      favorites: 0,
    };
  }
}