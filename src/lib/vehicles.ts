// src/lib/vehicles.ts
import clientPromise from "@/lib/mongodb";
import { Vehicle, ApprovalStatus } from "@/types/types";
import { unstable_noStore as noStore } from 'next/cache';

/**
 * Obtiene todos los vehículos aprobados directamente desde la base de datos.
 * Esta función está diseñada para ser usada en Server Components.
 */
export async function getApprovedVehicles(): Promise<Vehicle[]> {
  noStore(); // Asegura que los datos siempre sean frescos en cada petición

  try {
    const client = await clientPromise;
    const db = client.db("vehicle_store");

    const vehicles = await db
      .collection<Omit<Vehicle, '_id'>>("vehicles")
      .find({ status: ApprovalStatus.APPROVED })
      .sort({ createdAt: -1 })
      .toArray();

    // Mapear para convertir ObjectId a string y asegurar que los datos son serializables
    return vehicles.map(v => ({
      ...v,
      _id: v._id.toString(),
    })) as Vehicle[];

  } catch (error) {
    console.error("Error al obtener vehículos desde la base de datos:", error);
    return []; // Devolver un array vacío en caso de error para no romper la página
  }
}