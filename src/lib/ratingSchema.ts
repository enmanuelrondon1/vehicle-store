// src/lib/ratingSchema.ts
import { z } from "zod";

export const RatingSchema = z.object({
  // ✅ CAMBIO: Acepta cualquier string no vacío para userId
  userId: z.string().min(1, "El ID de usuario es requerido"),
  
  vehicleId: z.string().refine((val) => /^[a-f\d]{24}$/i.test(val), {
    message: "El ID de vehículo debe ser un ObjectId válido",
  }),
  
  rating: z
    .number()
    .int("La calificación debe ser un número entero")
    .min(1, "La calificación mínima es 1")
    .max(5, "La calificación máxima es 5"),
});

export type Rating = z.infer<typeof RatingSchema>;