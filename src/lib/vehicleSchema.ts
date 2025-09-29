// src/lib/vehicleSchema.ts
import { z } from 'zod';
import { 
  VehicleCategory, 
  VehicleCondition, 
  TransmissionType, 
  FuelType, 
  Currency, 
  WarrantyType,
  Documentation
} from '@/types/shared';

// Helper para strings requeridos, para no repetir el mensaje
const requiredString = (message: string) => z.string({ required_error: message }).min(1, { message });

// --- Esquemas para cada paso del formulario ---

const step1SchemaObject = z.object({
  category: z.nativeEnum(VehicleCategory, { required_error: "La categoría es requerida." }),
  subcategory: z.string().optional(),
  brand: requiredString("La marca es requerida."),
  brandOther: z.string().optional(),
  model: requiredString("El modelo es requerido."),
  year: z.number({ required_error: "El año es requerido." }).min(1900, "El año es muy antiguo.").max(new Date().getFullYear() + 1, "El año no puede ser futuro."),
});

export const step1Schema = step1SchemaObject.refine(data => !(data.brand === 'Otra' && !data.brandOther), {
  message: "Debes especificar la marca.",
  path: ["brandOther"],
});

export const step2Schema = z.object({
  price: z.number({ required_error: "El precio es requerido." }).positive("El precio debe ser mayor a 0."),
  currency: z.nativeEnum(Currency).default(Currency.USD),
  isNegotiable: z.boolean().optional(),
  mileage: z.number({ required_error: "El kilometraje es requerido." }).min(0, "El kilometraje no puede ser negativo."),
  condition: z.nativeEnum(VehicleCondition, { required_error: "La condición es requerida." }),
  warranty: z.nativeEnum(WarrantyType).optional(),
});

export const step3Schema = z.object({
  color: requiredString("El color es requerido."),
  transmission: z.nativeEnum(TransmissionType, { required_error: "La transmisión es requerida." }),
  fuelType: z.nativeEnum(FuelType, { required_error: "El tipo de combustible es requerido." }),
  engine: z.string().max(100, "Máximo 100 caracteres.").optional(),
  displacement: z.string().optional(),
  driveType: z.string().optional(),
  doors: z.number().optional(),
  seats: z.number().optional(),
  loadCapacity: z.number().optional(),
});

export const step4Schema = z.object({
  sellerContact: z.object({
    name: requiredString("El nombre es requerido.").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras."),
    email: requiredString("El email es requerido.").email("Formato de email inválido."),
    phone: requiredString("El teléfono es requerido.").regex(/^\d{3}\s\d{7}$/, "El formato del teléfono debe ser '04XX 1234567'"),
  }),
  location: requiredString("La ubicación es requerida.").includes(",", { message: "Debes seleccionar un estado y ciudad." }),
});

export const step5Schema = z.object({
  description: z.string().min(50, "La descripción debe tener al menos 50 caracteres.").max(2000, "Máximo 2000 caracteres.").optional(),
  images: z.array(z.string()).min(1, "Debes subir al menos una foto."),
  features: z.array(z.string()).optional(),
  documentation: z.array(z.nativeEnum(Documentation)).optional(),
});

export const step6Schema = z.object({
  selectedBank: z.object({
      name: z.string(),
      url: z.string().url(),
  }, { required_error: "Debes seleccionar un banco." }),
  referenceNumber: requiredString("El número de referencia es requerido.").min(8, "Mínimo 8 dígitos.").max(20, "Máximo 20 dígitos."),
  paymentProof: z.instanceof(File, { message: "El comprobante de pago es requerido." }),
});


// --- Esquema completo y mapeo de pasos ---

export const fullVehicleSchema = step1SchemaObject
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

export const schemasByStep = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
  6: step6Schema,
};

export type VehicleSchemaType = z.infer<typeof fullVehicleSchema>;

export const formatZodErrors = (errors: z.ZodIssue[]): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  for (const issue of errors) {
    const path = issue.path.join('.');
    formattedErrors[path] = issue.message;
  }
  return formattedErrors;
};