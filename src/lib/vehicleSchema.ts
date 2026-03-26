// src/lib/vehicleSchema.ts
import { z } from "zod";
import {
  VehicleCategory,
  TransmissionType,
  FuelType,
  Currency,
  ApprovalStatus,
  WarrantyType,
} from "@/types/shared";
import { getAvailableFeatures } from "@/constants/form-constants";

// ✅ FIX #18: Validación estructural del VIN con dígito verificador (ISO 3779 / NHTSA)
// El 9no carácter del VIN es matemáticamente calculable — detecta VINs falsos o con errores.
function isValidVinCheckDigit(vin: string): boolean {
  if (vin.length !== 17) return false;
  const transliteration: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5,         P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    "0": 0, "1": 1, "2": 2, "3": 3, "4": 4,
    "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
  };
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i].toUpperCase();
    if (transliteration[char] === undefined) return false;
    sum += transliteration[char] * weights[i];
  }
  const remainder = sum % 11;
  const checkDigit = vin[8].toUpperCase();
  const expectedDigit = remainder === 10 ? "X" : String(remainder);
  return checkDigit === expectedDigit;
}

export const SellerContactBackendSchema = z.object({
  name: z
    .string()
    .min(4, "El nombre debe tener al menos 4 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios",
    ),
  email: z
    .string()
    .email("El formato del email no es válido")
    .max(255, "El email no puede exceder 255 caracteres"),
  phone: z.string().refine(
    (phone) => {
      if (!phone) return false;
      const parts = phone.trim().split(/\s+/);
      const numberPart = parts[parts.length - 1];
      return /^\d{7}$/.test(numberPart);
    },
    { message: "El número de teléfono debe tener exactamente 7 dígitos." },
  ),
  userId: z.string().optional(),
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
  brandOther: z
    .string()
    .max(50, "El nombre de la marca es muy largo")
    .optional(),
  modelOther: z
    .string()
    .max(50, "El nombre del modelo es muy largo")
    .optional(),
  version: z
    .string()
    .min(5, "La versión debe tener al menos 5 caracteres")
    .max(100, "La versión no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),
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
      "El año no puede ser mayor al próximo año",
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
    .number({
      required_error: "El precio es requerido.",
      invalid_type_error: "El precio debe ser un número.",
    })
    .min(500, "El precio debe ser de al menos $500 USD.")
    .max(200000, "El precio no puede exceder $200,000 USD."),
  currency: z.nativeEnum(Currency).optional().default(Currency.USD),
  isNegotiable: z.boolean().optional().default(false),
  offersFinancing: z.boolean().optional().default(false),
  financingDetails: FinancingDetailsSchema.optional(),
  mileage: z
    .number({
      required_error: "El kilometraje es requerido.",
      invalid_type_error: "El kilometraje debe ser un número.",
    })
    .min(0, "El kilometraje no puede ser negativo.")
    .max(1000000, "El kilometraje parece excesivo"),
  warranty: z.nativeEnum(WarrantyType, {
    required_error: "Debes seleccionar un estado de garantía.",
    invalid_type_error: "El valor de la garantía no es válido.",
  }),
});

const step3Schema = z.object({
  color: z
    .string()
    .min(1, "El color es requerido")
    .max(50, "El color no puede exceder 50 caracteres"),
  colorOther: z
    .string()
    .max(30, "El color personalizado no puede exceder 30 caracteres")
    .optional()
    .or(z.literal("")),
  engine: z
    .string()
    .min(4, "La descripción del motor debe tener al menos 4 caracteres")
    .max(100, "La descripción del motor no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),
  displacement: z
    .string()
    .max(30, "El cilindraje no puede exceder 30 caracteres")
    .optional()
    .or(z.literal("")),
  displacementOther: z
    .string()
    .max(20, "El cilindraje personalizado no puede exceder 20 caracteres")
    .optional()
    .or(z.literal("")),
  driveType: z
    .enum(["fwd", "rwd", "awd", "4wd"], {
      errorMap: () => ({ message: "Tipo de tracción inválido" }),
    })
    .optional(),
  transmission: z
    .nativeEnum(TransmissionType, {
      errorMap: () => ({ message: "Tipo de transmisión inválido" }),
    })
    .optional(),
  transmissionOther: z
    .string()
    .max(50, "La transmisión personalizada no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
  fuelType: z
    .nativeEnum(FuelType, {
      errorMap: () => ({ message: "Tipo de combustible inválido" }),
    })
    .optional(),
  fuelTypeOther: z
    .string()
    .max(50, "El combustible personalizado no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
  doors: z
    .number()
    .int("El número de puertas debe ser un entero")
    .min(0, "El número de puertas no puede ser negativo")
    .max(10, "El número de puertas parece excesivo")
    .optional(),
  seats: z
    .number()
    .int("El número de asientos debe ser un entero")
    .min(1, "Debe tener al menos 1 asiento")
    .max(50, "El número de asientos parece excesivo")
    .optional(),
  loadCapacity: z
    .number()
    .min(0, "La capacidad de carga no puede ser negativa")
    .max(50000, "La capacidad de carga parece excesiva")
    .optional(),
  // ✅ FIX #18: VIN con validación de dígito verificador
  vin: z
    .string()
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/,
      "El VIN debe tener 17 caracteres alfanuméricos (sin I, O, Q)",
    )
    .refine(
      (vin) => isValidVinCheckDigit(vin),
      "El VIN no es válido — verifica que lo hayas copiado correctamente",
    )
    .optional()
    .or(z.literal("")),
});

const step4Schema = z.object({
  sellerContact: SellerContactBackendSchema,
  location: z
    .string()
    .min(5, "La ubicación es requerida (ej: Caracas, Distrito Capital)")
    .max(200, "La ubicación no puede exceder 200 caracteres")
    .refine(
      (value) => {
        if (!value) return false;
        const parts = value.split(",");
        if (parts.length !== 2) return false;
        const city = parts[0].trim();
        const state = parts[1].trim();
        return city.length >= 4 && state.length > 0;
      },
      {
        message:
          "Formato: 'Ciudad, Estado'. La ciudad debe tener al menos 4 caracteres.",
      },
    ),
});

export const step5Schema = z.object({
  description: z
    .string()
    .min(50, "La descripción debe tener al menos 50 caracteres")
    .max(2000, "La descripción no puede exceder 2000 caracteres")
    .optional()
    .or(z.literal("")),
  images: z
    .array(z.string().url("URL de imagen inválida"))
    .min(1, "Debes subir al menos una imagen")
    .max(10, "No puedes subir más de 10 imágenes"),
  isFeatured: z.boolean().optional(),
  features: z.array(z.string()).optional(),
  documentation: z.array(z.string()).optional(),
});

const otherFieldsSchema = z.object({
  referenceNumber: z
    .string()
    .min(8, "La referencia debe tener al menos 8 dígitos")
    .max(20, "La referencia no puede exceder 20 caracteres")
    .regex(/^[0-9]+$/, "La referencia solo debe contener números")
    .optional()
    .or(z.literal("")),
  paymentProof: z
    .string()
    .url("La URL del comprobante debe ser válida")
    .optional()
    .or(z.literal("")),
  ownership: z.enum(["propio", "tercero", "concesionario"]).optional(),
  saleType: z.enum(["privado", "concesionario"]).optional(),
  videoUrl: z
    .string()
    .url("La URL del video debe ser válida")
    .optional()
    .or(z.literal("")),
  status: z.nativeEnum(ApprovalStatus).default(ApprovalStatus.PENDING),
  postedDate: z.date().optional(),
  armorLevel: z
    .string()
    .max(50, "El nivel de blindaje es muy largo")
    .optional()
    .or(z.literal("")),
  tiresCondition: z
    .string()
    .max(50, "La condición de los cauchos es muy larga")
    .optional()
    .or(z.literal("")),
  serialsIntact: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  views: z.number().min(0).default(0).optional(),
});

export const schemasByStep = {
  1: step1Schema.superRefine((data, ctx) => {
    if (data.brand === "Otra") {
      if (!data.brandOther) {
        ctx.addIssue({
          path: ["brandOther"],
          message: "Debes especificar la marca si seleccionaste 'Otra'",
          code: "custom",
        });
      } else if (data.brandOther.length < 5) {
        ctx.addIssue({
          path: ["brandOther"],
          message: "La marca debe tener al menos 5 caracteres",
          code: "custom",
        });
      }
    }
    if (data.model === "Otro") {
      if (!data.modelOther) {
        ctx.addIssue({
          path: ["modelOther"],
          message: "Debes especificar el modelo si seleccionaste 'Otro'",
          code: "custom",
        });
      } else if (data.modelOther.length < 5) {
        ctx.addIssue({
          path: ["modelOther"],
          message: "El modelo debe tener al menos 5 caracteres",
          code: "custom",
        });
      }
    }
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
  3: step3Schema
    .merge(z.object({ category: z.nativeEnum(VehicleCategory).optional() }))
    .superRefine((data, ctx) => {
      if (data.color === "Otro" && !data.colorOther) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["colorOther"],
          message: "Debes especificar el color si seleccionaste 'Otro'",
        });
      }
      if (data.displacement === "Otro" && !data.displacementOther) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["displacementOther"],
          message: "Debes especificar el cilindraje si seleccionaste 'Otro'",
        });
      }
      if (data.fuelType === FuelType.OTHER && !data.fuelTypeOther) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fuelTypeOther"],
          message: "Debes especificar el combustible si seleccionaste 'Otro'",
        });
      }
      if (
        data.transmission === TransmissionType.OTHER &&
        !data.transmissionOther
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["transmissionOther"],
          message: "Debes especificar la transmisión si seleccionaste 'Otro'",
        });
      }
      const category = data.category;
      const categoriesRequiringDoorsSeats = [
        VehicleCategory.CAR,
        VehicleCategory.SUV,
        VehicleCategory.VAN,
        VehicleCategory.BUS,
      ];
      if (category && categoriesRequiringDoorsSeats.includes(category)) {
        if (data.doors !== undefined && (isNaN(data.doors) || data.doors < 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El número de puertas no es válido",
            path: ["doors"],
          });
        }
        if (data.seats !== undefined && (isNaN(data.seats) || data.seats < 1)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El número de asientos no es válido",
            path: ["seats"],
          });
        }
      }
    }),
  4: step4Schema,
  5: step5Schema
    .merge(z.object({ category: z.nativeEnum(VehicleCategory).optional() }))
    .superRefine((data, ctx) => {
      if (data.category) {
        const availableFeatures = getAvailableFeatures(data.category);
        const hasFeatures = Object.keys(availableFeatures).length > 0;
        if (hasFeatures && (!data.features || data.features.length === 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["features"],
            message: "Debes seleccionar al menos una característica.",
          });
        }
      }
    }),
  6: z.object({}),
};

const VehicleDataBackendObjectSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(otherFieldsSchema);

export const VehicleDataBackendSchema =
  VehicleDataBackendObjectSchema.superRefine((data, ctx) => {
    if (data.category) {
      if (data.category === VehicleCategory.TRUCK) {
        if (
          data.loadCapacity === undefined ||
          data.loadCapacity === null ||
          isNaN(data.loadCapacity)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La capacidad de carga es requerida",
            path: ["loadCapacity"],
          });
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