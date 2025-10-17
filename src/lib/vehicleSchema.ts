// src/lib/vehicleSchema.ts
import { z } from 'zod';
import { 
  VehicleCategory, 
  TransmissionType, 
  FuelType, 
  Currency,
  WarrantyType,
  ApprovalStatus,
} from '@/types/shared';

export const SellerContactBackendSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),
  email: z
    .string()
    .email("El formato del email no es válido")
    .max(255, "El email no puede exceder 255 caracteres"),
  phone: z
    .string()
    .regex(
      /^\+?[\d\s\-()]{10,15}$/,
      "El teléfono debe tener entre 10 y 15 dígitos"
    )
    .transform((str) => str.replace(/\s|-|\(|\)/g, "")),
});

const step1Schema = z.object({
  _id: z.string().optional(),
  category: z.nativeEnum(VehicleCategory, {
    errorMap: () => ({ message: "Categoría de vehículo inválida" }),
  }),
  subcategory: z.string().optional(),
  brand: z
    .string()
    .min(1, "La marca es requerida")
    .max(50, "La marca no puede exceder 50 caracteres"),
  brandOther: z.string().max(50, "El nombre de la marca es muy largo").optional(),
  modelOther: z.string().max(50, "El nombre del modelo es muy largo").optional(),
  version: z.string().max(100, "La versión no puede exceder 100 caracteres").optional(),
  model: z
    .string()
    .min(1, "El modelo es requerido")
    .max(100, "El modelo no puede exceder 100 caracteres"),
  year: z
    .number()
    .int("El año debe ser un número entero")
    .min(1900, "El año no puede ser menor a 1900")
    .max(
      new Date().getFullYear() + 1,
      "El año no puede ser mayor al próximo año"
    ),
});

export const FinancingDetailsSchema = z.object({
  interestRate: z
    .number()
    .min(0, "La tasa de interés no puede ser negativa")
    .max(50, "La tasa de interés es demasiado alta"),
  loanTerm: z
    .number()
    .int("El plazo debe ser un número entero")
    .min(1, "El plazo debe ser de al menos 1 mes")
    .max(120, "El plazo no puede exceder 120 meses"),
});

const step2Schema = z.object({
  price: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .max(10000000, "El precio no puede exceder 10,000,000")
    .optional(),
  currency: z.nativeEnum(Currency).optional().default(Currency.USD),
  isNegotiable: z.boolean().optional().default(false),
  offersFinancing: z.boolean().optional().default(false),
  financingDetails: FinancingDetailsSchema.optional(),
  mileage: z
    .number()
    .min(0, "El kilometraje no puede ser negativo")
    .max(1000000, "El kilometraje parece excesivo")
    .optional(),
});

const step3Schema = z.object({
  color: z
    .string()
    .min(1, "El color es requerido")
    .max(30, "El color no puede exceder 30 caracteres"),
  engine: z
    .string()
    .max(100, "La descripción del motor no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),
  displacement: z
    .string()
    .max(20, "El cilindraje no puede exceder 20 caracteres")
    .regex(/^(\d+(\.\d+)?[Ll]|\d+[Cc][Cc])$/, "Formato de cilindraje inválido (ej: 2.0L, 150cc)")
    .optional()
    .or(z.literal("")),
  driveType: z
    .enum(["fwd", "rwd", "awd", "4wd"], {
      errorMap: () => ({ message: "Tipo de tracción inválido" }),
    })
    .optional(),
  transmission: z.nativeEnum(TransmissionType, {
    errorMap: () => ({ message: "Tipo de transmisión inválido" }),
  }).optional(),
  fuelType: z.nativeEnum(FuelType, {
    errorMap: () => ({ message: "Tipo de combustible inválido" }),
  }).optional(),
  doors: z.number().int("El número de puertas debe ser un entero").min(0, "El número de puertas no puede ser negativo").max(10, "El número de puertas parece excesivo").optional(),
  seats: z.number().int("El número de asientos debe ser un entero").min(1, "Debe tener al menos 1 asiento").max(50, "El número de asientos parece excesivo").optional(),
  loadCapacity: z
    .number()
    .min(0, "La capacidad de carga no puede ser negativa")
    .max(50000, "La capacidad de carga parece excesiva")
    .optional()
});

const step4Schema = z.object({
  sellerContact: SellerContactBackendSchema,
  location: z
    .string()
    .min(5, "La ubicación es requerida (ej: Caracas, Distrito Capital)")
    .max(200, "La ubicación no puede exceder 200 caracteres")
    .refine((value) => value.includes(","), {
      message: "El formato debe ser 'Ciudad, Estado'",
    })
    .refine(
      (value) => {
        const parts = value.split(",");
        return parts.length === 2 && parts[0].trim() !== "" && parts[1].trim() !== "";
      },
      {
        message: "Debes especificar tanto la ciudad como el estado",
      }
    ),
});

const step5Schema = z.object({
  warranty: z.nativeEnum(WarrantyType).default(WarrantyType.NO_WARRANTY),
  description: z
    .string()
    .max(2000, "La descripción no puede exceder 2000 caracteres")
    .optional()
    .or(z.literal("")),
  images: z
    .array(z.string().url("URL de imagen inválida"))
    .max(10, "No puede tener más de 10 imágenes")
    .default([]),
  isFeatured: z.boolean().optional(), // ✅ Añadido
});

const otherFieldsSchema = z.object({
    vin: z
    .string()
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/,
      "El VIN debe tener 17 caracteres alfanuméricos (sin I, O, Q)"
    )
    .optional(),
  referenceNumber: z
    .string()
    .min(8, "La referencia debe tener al menos 8 dígitos")
    .max(20, "La referencia no puede exceder 20 caracteres")
    .regex(/^\d+$/, "La referencia solo debe contener números")
    .optional(),
  paymentProof: z
    .string()
    .url("La URL del comprobante debe ser válida")
    .optional(),
  ownership: z.enum(["propio", "tercero", "concesionario"]).optional(),
  saleType: z.enum(["privado", "concesionario"]).optional(),
  videoUrl: z
    .string()
    .url("La URL del video debe ser válida")
    .optional(),
  status: z.nativeEnum(ApprovalStatus).default(ApprovalStatus.PENDING),
  postedDate: z.date(),
  documentation: z.array(z.string()).optional(),
  armorLevel: z
    .string()
    .max(50, "El nivel de blindaje es muy largo")
    .optional(),
  tiresCondition: z
    .string()
    .max(50, "La condición de los cauchos es muy larga")
    .optional(),
  serialsIntact: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  views: z.number().min(0).default(0).optional(),
})

export const schemasByStep = {
  1: step1Schema.refine(data => !(data.brand === 'Otra' && !data.brandOther), {
    message: "Debes especificar la marca si seleccionaste 'Otra'",
    path: ["brandOther"],
  }).refine(data => !(data.model === 'Otro' && !data.modelOther), {
    message: "Debes especificar el modelo si seleccionaste 'Otro'",
    path: ["modelOther"],
  }),
  2: step2Schema.superRefine((data, ctx) => {
    if (data.offersFinancing && !data.financingDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["financingDetails", "interestRate"],
        message:
          "Los detalles de financiación son requeridos si ofreces financiación.",
      });
    }
  }),
  // ✅ CORRECCIÓN: Fusionar con un esquema parcial para obtener el tipo de 'category' de forma segura.
  3: step3Schema
    .merge(z.object({ category: z.nativeEnum(VehicleCategory).optional() }))
    .superRefine((data, ctx) => {
    // Ahora 'data.category' es accesible y tiene el tipo correcto.
    const category = data.category;
    const categoriesRequiringDoorsSeats = [VehicleCategory.CAR, VehicleCategory.SUV, VehicleCategory.VAN, VehicleCategory.BUS];

    if (category && categoriesRequiringDoorsSeats.includes(category)) {
      if (data.doors === undefined || data.doors === null || isNaN(data.doors)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El número de puertas es requerido", path: ["doors"] });
      }
      if (data.seats === undefined || data.seats === null || isNaN(data.seats)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El número de asientos es requerido", path: ["seats"] });
      }
    }
  }),
  4: step4Schema,
  5: step5Schema,
  6: z.object({}), // Payment step has its own logic
};

const VehicleDataBackendObjectSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(otherFieldsSchema);

export const VehicleDataBackendSchema = VehicleDataBackendObjectSchema.superRefine((data, ctx) => {
  if (data.category) {
    const categoriesRequiringDoorsSeats = [VehicleCategory.CAR, VehicleCategory.SUV, VehicleCategory.VAN, VehicleCategory.BUS];
    if (categoriesRequiringDoorsSeats.includes(data.category)) {
      // Additional cross-field validation if needed in the future
    }
    if (data.category === VehicleCategory.TRUCK) {
      if (data.loadCapacity === undefined || data.loadCapacity === null || isNaN(data.loadCapacity)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La capacidad de carga es requerida", path: ["loadCapacity"] });
      }
    }
  }
});

export const CreateVehicleBackendSchema = VehicleDataBackendObjectSchema.omit({
  _id: true,
  postedDate: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const UpdateVehicleBackendSchema =
  VehicleDataBackendObjectSchema.partial().extend({
    _id: z.string(),
    status: z.nativeEnum(ApprovalStatus).optional(),
    rejectionReason: z.string().optional(),
  });

export type VehicleDataBackend = z.infer<typeof VehicleDataBackendSchema>;