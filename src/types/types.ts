//src/types/types.ts
import { z } from "zod";
import { ObjectId } from "mongodb";
import { VehicleCategory } from "./types";
import { TransmissionType } from "./types";
import { VehicleCondition } from "./types";
import { FuelType } from "./types";
import { AvailabilityStatus } from "./types";
import { WarrantyType } from "./types";

// Importar enums compartidos
export {
  VehicleCategory,
  VehicleCondition,
  TransmissionType,
  FuelType,
  AvailabilityStatus,
  WarrantyType,
} from "@/types/shared";

export interface SellerContactBackend {
  name: string;
  phone: string;
  email: string;
}

export interface VehicleDataBackend {
  _id?: ObjectId;
  category: VehicleCategory;
  subcategory?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  engine: string;
  transmission: TransmissionType;
  condition: VehicleCondition;
  location: string;
  features: string[];
  fuelType: FuelType;
  doors: number;
  seats: number;
  weight?: number;
  loadCapacity?: number;
  sellerContact: SellerContactBackend;
  postedDate: Date;
  availability: AvailabilityStatus;
  warranty: WarrantyType;
  description: string;
  images: string[];
  vin?: string;
  paymentProof?: string; // Nuevo campo para el comprobante de pago
  createdAt?: Date;
  updatedAt?: Date;
}

// Tipo genérico para las respuestas de la API
export interface ApiResponseBackend<T = VehicleDataBackend> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: Record<string, string[]>;
}

// Agregar al final del archivo types.ts
export interface FormErrors {
  [key: string]: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
// Agregar al final de tu archivo types.ts

// Tipo genérico para las respuestas de la API del frontend
export interface ApiResponseFrontend<T = VehicleDataFrontend> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: Record<string, string[]>;
}



export interface ValidationError {
  field: string;
  message: string;
}

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
      /^\+?[\d\s\-\(\)]{10,15}$/,
      "El teléfono debe tener entre 10 y 15 dígitos"
    )
    .transform((str) => str.replace(/\s|-|\(|\)/g, "")),
});

export const VehicleDataBackendSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  category: z.nativeEnum(VehicleCategory, {
    errorMap: () => ({ message: "Categoría de vehículo inválida" }),
  }),
  subcategory: z.string().optional(),
  brand: z
    .string()
    .min(1, "La marca es requerida")
    .max(50, "La marca no puede exceder 50 caracteres"),
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
  price: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .max(10000000, "El precio no puede exceder $10,000,000"),
  mileage: z
    .number()
    .min(0, "El kilometraje no puede ser negativo")
    .max(1000000, "El kilometraje parece excesivo"),
  color: z
    .string()
    .min(1, "El color es requerido")
    .max(30, "El color no puede exceder 30 caracteres"),
  engine: z
    .string()
    .max(100, "La descripción del motor no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),
  transmission: z.nativeEnum(TransmissionType, {
    errorMap: () => ({ message: "Tipo de transmisión inválido" }),
  }),
  condition: z.nativeEnum(VehicleCondition, {
    errorMap: () => ({ message: "Condición del vehículo inválida" }),
  }),
  location: z
    .string()
    .min(1, "La ubicación es requerida")
    .max(200, "La ubicación no puede exceder 200 caracteres"),
  features: z
    .array(z.string())
    .max(20, "No puede tener más de 20 características")
    .default([]),
  fuelType: z.nativeEnum(FuelType, {
    errorMap: () => ({ message: "Tipo de combustible inválido" }),
  }),
  doors: z
    .number()
    .int("El número de puertas debe ser un entero")
    .min(0, "El número de puertas no puede ser negativo")
    .max(10, "El número de puertas parece excesivo"),
  seats: z
    .number()
    .int("El número de asientos debe ser un entero")
    .min(1, "Debe tener al menos 1 asiento")
    .max(50, "El número de asientos parece excesivo"),
  weight: z
    .number()
    .positive("El peso debe ser positivo")
    .max(100000, "El peso parece excesivo")
    .optional(),
  loadCapacity: z
    .number()
    .min(0, "La capacidad de carga no puede ser negativa")
    .max(50000, "La capacidad de carga parece excesiva")
    .optional(),
  sellerContact: SellerContactBackendSchema,
  availability: z
    .nativeEnum(AvailabilityStatus)
    .default(AvailabilityStatus.PENDING),
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
  vin: z
    .string()
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/,
      "El VIN debe tener 17 caracteres alfanuméricos (sin I, O, Q)"
    )
    .optional(),
  paymentProof: z
    .string()
    .url("La URL del comprobante debe ser válida")
    .optional(), // Nuevo campo para la URL del comprobante
  postedDate: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateVehicleBackendSchema = VehicleDataBackendSchema.omit({
  _id: true,
  postedDate: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateVehicleBackendSchema =
  VehicleDataBackendSchema.partial().extend({
    _id: z.instanceof(ObjectId),
  });

// Tipo para los datos del frontend (con _id como string)
export interface VehicleDataFrontend extends Omit<VehicleDataBackend, '_id' | 'postedDate' | 'createdAt' | 'updatedAt'> {
  _id?: string;
  postedDate: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para datos genéricos con fechas que pueden ser string o Date
export interface VehicleDataGeneric {
  _id?: string | ObjectId;
  category: VehicleCategory;
  subcategory?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  engine: string;
  transmission: TransmissionType;
  condition: VehicleCondition;
  location: string;
  features: string[];
  fuelType: FuelType;
  doors: number;
  seats: number;
  weight?: number;
  loadCapacity?: number;
  sellerContact: SellerContactBackend;
  postedDate: string | Date;
  availability: AvailabilityStatus;
  warranty: WarrantyType;
  description: string;
  images: string[];
  vin?: string;
  paymentProof?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export const convertToBackend = (frontendData: VehicleDataGeneric): VehicleDataBackend => {
  return {
    ...frontendData,
    _id: frontendData._id ? new ObjectId(frontendData._id) : undefined,
    postedDate: new Date(frontendData.postedDate),
    createdAt: frontendData.createdAt
      ? new Date(frontendData.createdAt)
      : undefined,
    updatedAt: frontendData.updatedAt
      ? new Date(frontendData.updatedAt)
      : undefined,
  };
};

export const convertToFrontend = (backendData: VehicleDataBackend): VehicleDataFrontend => {
  if (!backendData) {
    throw new Error('Backend data is required');
  }

  return {
    ...backendData,
    _id: backendData._id?.toString(),
    postedDate: backendData.postedDate?.toISOString?.() || backendData.postedDate.toString(),
    createdAt: backendData.createdAt?.toISOString?.() || backendData.createdAt?.toString(),
    updatedAt: backendData.updatedAt?.toISOString?.() || backendData.updatedAt?.toString(),
  };
};