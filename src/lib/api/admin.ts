// src/lib/api/admin.ts
import type { VehicleComment, VehicleHistoryEntry } from "@/types/types";

// --- Funciones de Comentarios ---

export const getVehicleComments = async (vehicleId: string): Promise<VehicleComment[]> => {
  console.log(`Cargando comentarios para el vehículo: ${vehicleId}`);
  try {
    const response = await fetch(`/api/admin/vehicles/${vehicleId}/comments`);
    if (!response.ok) {
      throw new Error("Error al obtener los comentarios del vehículo.");
    }
    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error("Error en getVehicleComments:", error);
    return [];
  }
};

export const addVehicleComment = async (
  vehicleId: string,
  comment: string
): Promise<{
  success: boolean;
  newComment?: VehicleComment;
  newHistoryEntry?: VehicleHistoryEntry;
}> => {
  console.log(`Agregando comentario al vehículo ${vehicleId}: ${comment}`);
  try {
    const response = await fetch(`/api/admin/vehicles/${vehicleId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al agregar el comentario.");
    }

    const data = await response.json();
    return {
      success: true,
      newComment: data.newComment,
      newHistoryEntry: data.newHistoryEntry,
    };
  } catch (error) {
    console.error("Error en addVehicleComment:", error);
    return { success: false };
  }
};


// --- Funciones de Historial ---

export const getVehicleHistory = async (
  vehicleId: string
): Promise<VehicleHistoryEntry[]> => {
  console.log(`Fetching history for vehicle ${vehicleId}...`);
  try {
    const response = await fetch(`/api/admin/vehicles/${vehicleId}/history`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener el historial del vehículo."
      );
    }
    const data = await response.json();
    return data.history || [];
  } catch (error) {
    console.error("Error en getVehicleHistory:", error);
    return []; // Devuelve un array vacío en caso de error para evitar que la UI falle.
  }
};