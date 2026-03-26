// src/lib/vehicles.ts
import clientPromise from "@/lib/mongodb";
import { Vehicle, ApprovalStatus } from "@/types/types";

// ✅ Proyección: solo los campos que necesitan las cards
// Evita traer description, features, documentation, etc. en el listado
const VEHICLE_CARD_PROJECTION = {
  _id: 1,
  brand: 1,
  model: 1,
  year: 1,
  price: 1,
  mileage: 1,
  condition: 1,
  fuelType: 1,
  transmission: 1,
  location: 1,
  images: { $slice: 1 }, // solo la primera imagen
  isFeatured: 1,
  category: 1,
  color: 1,
  averageRating: 1,
  ratingCount: 1,
  driveType: 1,
  saleType: 1,
  warranty: 1,
  createdAt: 1,
  postedDate: 1,
  status: 1,
};

/**
 * Obtiene los primeros N vehículos aprobados para el listado inicial.
 * ✅ .limit() evita traer toda la colección de una vez.
 * ✅ Proyección evita campos pesados (description, features, docs).
 * El filtrado client-side opera sobre estos N vehículos.
 */
export async function getApprovedVehicles(limit = 48): Promise<Vehicle[]> {
  try {
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehicles = await db
      .collection<Omit<Vehicle, "_id">>("vehicles")
      .find(
        { status: ApprovalStatus.APPROVED },
        { projection: VEHICLE_CARD_PROJECTION }
      )
      .sort({ isFeatured: -1, createdAt: -1 }) // destacados primero, luego más recientes
      .limit(limit)
      .toArray();

    return vehicles.map((v) => ({
      ...v,
      _id: v._id.toString(),
    })) as Vehicle[];
  } catch (error) {
    console.error("Error al obtener vehículos desde la base de datos:", error);
    return [];
  }
}

/**
 * Conteo total de vehículos aprobados — para mostrar
 * "Mostrando 48 de 312 vehículos" sin traer todos los documentos.
 */
export async function getApprovedVehiclesCount(): Promise<number> {
  try {
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    return await db
      .collection("vehicles")
      .countDocuments({ status: ApprovalStatus.APPROVED });
  } catch {
    return 0;
  }
}