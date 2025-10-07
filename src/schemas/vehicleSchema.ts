import { z } from 'zod';

// Enum for currency, now in a shared location
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  CRC = 'CRC',
}

// Enum for approval status, also shared
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const SellerContactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  userId: z.string().optional(), // userId is optional as it's added by the backend
});

export const FinancingDetailsSchema = z.object({
  interestRate: z.number(),
  loanTerm: z.number(),
});

export const CreateVehicleSchema = z.object({
  category: z.string().min(1, 'La categoría es requerida'),
  subcategory: z.string().optional(),
  brand: z.string().min(1, 'La marca es requerida'),
  brandOther: z.string().optional(),
  model: z.string().min(1, 'El modelo es requerido'),
  year: z.number().min(1900, 'Año inválido'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  currency: z.nativeEnum(Currency).default(Currency.USD),
  isNegotiable: z.boolean().optional(),
  offersFinancing: z.boolean().optional(),
  financingDetails: FinancingDetailsSchema.optional(),
  mileage: z.number().min(0, 'El kilometraje no puede ser negativo'),
  color: z.string().min(1, 'El color es requerido'),
  engine: z.string().optional(),
  displacement: z.string().optional(),
  driveType: z.string().optional(),
  transmission: z.string().min(1, 'La transmisión es requerida'),
  condition: z.string().min(1, 'La condición es requerida'),
  location: z.string().min(1, 'La ubicación es requerida'),
  features: z.array(z.string()).default([]),
  fuelType: z.string().min(1, 'El tipo de combustible es requerido'),
  doors: z.number().min(1, 'El número de puertas debe ser al menos 1').optional(),
  seats: z.number().min(1, 'El número de asientos debe ser al menos 1').optional(),
  weight: z.number().optional(),
  loadCapacity: z.number().optional(),
  sellerContact: SellerContactSchema,
  status: z
    .enum([
      ApprovalStatus.PENDING,
      ApprovalStatus.APPROVED,
      ApprovalStatus.REJECTED,
    ])
    .default(ApprovalStatus.PENDING),
  warranty: z.string().optional(),
  description: z.string().optional(),
  documentation: z.array(z.string()).optional(),
  images: z.array(z.string()).default([]),
  vin: z
    .string()
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/,
      'El VIN debe tener 17 caracteres alfanuméricos (sin I, O, Q)'
    )
    .optional(),
  paymentProof: z.string().url('La URL del comprobante debe ser válida').optional(),
  selectedBank: z.string().min(1, 'El banco es requerido').optional(),
  referenceNumber: z
    .string()
    .min(8, 'La referencia debe tener al menos 8 dígitos')
    .max(20, 'La referencia no puede exceder 20 caracteres')
    .optional(),
});

// Infer the TypeScript type from the schema
export type VehicleData = z.infer<typeof CreateVehicleSchema>;
export type SellerContact = z.infer<typeof SellerContactSchema>;