//src/lib/actions/vehicle.actions.ts
"use server";

import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import { FinancingDetailsSchema } from "@/lib/vehicleSchema";
import { revalidatePath } from "next/cache";

// Tipos para los parámetros
interface UpdateFinancingDetailsParams {
  vehicleId: string;
  interestRate: number;
  loanTerm: number;
}

/**
 * Obtiene un vehículo por su ID.
 * @param vehicleId - El ID del vehículo a buscar.
 */
export async function getVehicleById(vehicleId: string) {
  try {
    const db = await getDb();
    const vehicle = await db.collection("vehicles").findOne({ _id: new ObjectId(vehicleId) });

    if (!vehicle) {
      return null;
    }

    // Convertir el _id a string para que sea serializable
    return JSON.parse(JSON.stringify({ ...vehicle, _id: vehicle._id.toString() }));
  } catch (error) {
    console.error("Error al obtener el vehículo por ID:", error);
    return null;
  }
}

/**
 * Actualiza los detalles de financiación de un vehículo.
 * @param params - Los parámetros para la actualización.
 */
export async function updateFinancingDetails({
  vehicleId,
  interestRate,
  loanTerm,
}: UpdateFinancingDetailsParams) {
  try {
    // Validar los datos con el esquema de Zod
    const validationResult = FinancingDetailsSchema.safeParse({
      interestRate,
      loanTerm,
    });

    if (!validationResult.success) {
      // Si la validación falla, devuelve el primer error
      const firstError = validationResult.error.errors[0];
      return { success: false, error: `${firstError.path.join('.')} - ${firstError.message}` };
    }

    const db = await getDb();
    const result = await db.collection("vehicles").updateOne(
      { _id: new ObjectId(vehicleId) },
      {
        $set: {
          financingDetails: validationResult.data,
          offersFinancing: true, // Asumimos que si edita, quiere ofrecer financiación
        },
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "El vehículo no fue encontrado." };
    }

    // Revalidar la caché para que los cambios se reflejen inmediatamente
    revalidatePath(`/vehicles/${vehicleId}`);
    revalidatePath(`/profile/edit-ad/${vehicleId}`);
    revalidatePath("/profile/my-ads");

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar los detalles de financiación:", error);
    return { success: false, error: "Ocurrió un error en el servidor." };
  }
}