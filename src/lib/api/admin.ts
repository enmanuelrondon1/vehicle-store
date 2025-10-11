// src/lib/api/admin.ts
import type { VehicleComment, VehicleHistoryEntry } from "@/types/types";

// --- Funciones de Comentarios ---

export const getVehicleComments = async (vehicleId: string): Promise<VehicleComment[]> => {
  console.log(`Cargando comentarios para el vehículo: ${vehicleId}`);
  // TODO: Reemplazar con una llamada real a la API
  const mockComments: VehicleComment[] = [
    {
      id: "1",
      text: "Vehículo revisado, documentación completa",
      author: "Admin",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      type: "comment",
    },
    {
      id: "2",
      text: "Estado cambiado automáticamente a pendiente",
      author: "Sistema",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      type: "comment",
    },
  ];
  return Promise.resolve(mockComments);
};

export const addVehicleComment = async (vehicleId: string, comment: string): Promise<{ success: boolean; newComment?: VehicleComment; newHistoryEntry?: VehicleHistoryEntry }> => {
  console.log(`Agregando comentario al vehículo ${vehicleId}: ${comment}`);
  // TODO: Reemplazar con una llamada real a la API
  const newComment: VehicleComment = {
    id: Date.now().toString(),
    text: comment,
    author: "Admin",
    createdAt: new Date().toISOString(),
    type: "comment",
  };

  const newHistoryEntry: VehicleHistoryEntry = {
    id: Date.now().toString(),
    action: "Comentario agregado", // AÑADIDO: La propiedad que faltaba
    details: `Se agregó un comentario: "${comment.substring(0, 50)}${
      comment.length > 50 ? "..." : ""
    }"`,
    author: "Admin",
    timestamp: new Date().toISOString(),
  };

  return Promise.resolve({ success: true, newComment, newHistoryEntry });
};

// --- Funciones de Historial ---

export const getVehicleHistory = async (
  vehicleId: string
): Promise<VehicleHistoryEntry[]> => {
  console.log(`Fetching history for vehicle ${vehicleId}...`);
  // Simula un retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Datos mock
  const history: VehicleHistoryEntry[] = [
    {
      id: "hist1",
      action: "Publicación Creada", // AÑADIDO: La propiedad que faltaba
      details: "Publicación creada",
      author: "Sistema",
      timestamp: "2023-10-26T10:00:00Z",
    },
    {
      id: "hist2",
      action: "Estado Cambiado", // AÑADIDO: La propiedad que faltaba
      details: "Aprobado por el administrador",
      author: "admin@example.com",
      timestamp: "2023-10-26T12:30:00Z",
    },
  ];

  return history;
};