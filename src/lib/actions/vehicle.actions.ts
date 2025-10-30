//src/lib/actions/vehicle.actions.ts
"use server";

import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import { FinancingDetailsSchema } from "@/lib/vehicleSchema";
import { revalidatePath } from "next/cache";
import { RatingSchema } from "@/lib/ratingSchema";

// Tipos para los parámetros
interface UpdateFinancingDetailsParams {
  vehicleId: string;
  interestRate: number;
  loanTerm: number;
}

interface RemoveFinancingDetailsParams {
  vehicleId: string;
  userId: string;
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

/**
 * Elimina los detalles de financiación de un vehículo.
 * @param params - Los parámetros para la eliminación.
 */
export async function removeFinancingDetails({
  vehicleId,
  userId,
}: RemoveFinancingDetailsParams) {
  console.log("[Acción de Servidor] Iniciando removeFinancingDetails");
  console.log("[Acción de Servidor] Parámetros recibidos:", { vehicleId, userId });

  try {
    if (!ObjectId.isValid(vehicleId) || !userId) {
      console.error("[Acción de Servidor] ID inválido.", { vehicleId, userId });
      return { success: false, error: "ID de vehículo o usuario inválido." };
    }

    const db = await getDb();
    
    // ✅ CORRECCIÓN: Buscar por sellerContact.userId en lugar de userId directo
    const result = await db
      .collection("vehicles")
      .updateOne(
        { 
          _id: new ObjectId(vehicleId), 
          "sellerContact.userId": userId  // ✅ CAMPO CORRECTO
        },
        {
          $unset: {
            financingDetails: "",
          },
          $set: {
            offersFinancing: false,
          },
        }
      );

    console.log("[Acción de Servidor] Resultado de la consulta a la BD:", result);

    if (result.matchedCount === 0) {
      console.warn("[Acción de Servidor] No se encontró el vehículo o el usuario no coincide.");
      return {
        success: false,
        error:
          "El vehículo no fue encontrado o no tienes permiso para modificarlo.",
      };
    }

    // Revalidar la caché para que los cambios se reflejen inmediatamente
    revalidatePath(`/vehicles/${vehicleId}`);
    revalidatePath(`/profile/edit-ad/${vehicleId}`);
    revalidatePath("/profile/my-ads");

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar los detalles de financiación:", error);
    return { success: false, error: "Ocurrió un error en el servidor." };
  }
}

interface AddOrUpdateRatingParams {
  vehicleId: string;
  userId: string;
  rating: number;
}

export async function addOrUpdateRating({
  vehicleId,
  userId,
  rating,
}: AddOrUpdateRatingParams) {
  const validationResult = RatingSchema.safeParse({
    vehicleId,
    userId,
    rating,
  });

  if (!validationResult.success) {
    const firstError = validationResult.error.errors[0];
    return {
      success: false,
      error: `${firstError.path.join(".")} - ${firstError.message}`,
    };
  }

  try {
    const db = await getDb();
    const ratingsCollection = db.collection("ratings");
    const vehiclesCollection = db.collection("vehicles");

    const vehicleObjectId = new ObjectId(validationResult.data.vehicleId);
    const userObjectId = new ObjectId(validationResult.data.userId);

    // Upsert the rating. This will create a new rating or update an existing one.
    await ratingsCollection.updateOne(
      {
        vehicleId: vehicleObjectId,
        userId: userObjectId,
      },
      {
        $set: {
          rating: validationResult.data.rating,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Now, recalculate the average rating for the vehicle.
    const ratingAggr = await ratingsCollection
      .aggregate([
        { $match: { vehicleId: vehicleObjectId } },
        {
          $group: {
            _id: "$vehicleId",
            avgRating: { $avg: "$rating" },
            ratingCount: { $sum: 1 },
          },
        },
      ])
      .toArray();

    if (ratingAggr.length > 0) {
      const { avgRating, ratingCount } = ratingAggr[0];
      await vehiclesCollection.updateOne(
        { _id: vehicleObjectId },
        {
          $set: {
            averageRating: parseFloat(avgRating.toFixed(1)), // Round to 1 decimal place
            ratingCount,
          },
        }
      );

      // Revalidate paths to reflect the changes on the UI.
      revalidatePath(`/vehicle/${vehicleId}`);
      revalidatePath(`/`);

      return {
        success: true,
        message: "Rating submitted successfully.",
        averageRating: parseFloat(avgRating.toFixed(1)),
        ratingCount,
      };
    }

    // Revalidate paths to reflect the changes on the UI.
    revalidatePath(`/vehicle/${vehicleId}`);
    revalidatePath(`/`);

    return { success: true, message: "Rating submitted successfully." };
  } catch (error) {
    console.error("Error in addOrUpdateRating:", error);
    return { success: false, error: "An error occurred on the server." };
  }
}