// src/types/types.ts - Solo para el cliente

import {
  ApprovalStatus,
  VehicleCategory,
  VehicleCondition,
  TransmissionType,
  SaleType,
  WarrantyType,
  Currency,
  FuelType,
  DriveType,
} from "./shared";

export {
  VehicleCategory,
  VehicleCondition,
  TransmissionType,
  FuelType,
  Currency,
  WarrantyType,
  ApprovalStatus,
  Documentation,
  DriveType,
  SaleType,
  DRIVE_TYPE_LABELS,
  TRANSMISSION_TYPES_LABELS,
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  SALE_TYPE_LABELS,
  WARRANTY_LABELS,
} from "./shared";

export interface AdvancedFilters {
  search: string;
  category: string;
  subcategory: string;
  brands: string[];
  priceRange: [number, number];
  yearRange: [number, number];
  mileageRange: [number, number];
  colors: string[];
  condition: string[];
  fuelType: string[];
  transmission: string[];
  location: string[];
  features: string[];
  driveType: string[];
  saleType: string[];
  hasWarranty: boolean;
  isFeatured: boolean;
  postedWithin?: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterOptions {
  categories: FilterOption[];
  subcategories: string[];
  brands: FilterOption[];
  conditions: FilterOption[];
  colors: FilterOption[];
  fuelTypes: FilterOption[];
  transmissions: FilterOption[];
  locations: FilterOption[];
  features: string[];
  driveTypes: FilterOption[];
  saleTypes: FilterOption[];
}

export interface SellerContactBackend {
  name: string;
  phone: string;
  email: string;
  userId?: string;
}

export type OwnershipType = "propio" | "tercero" | "concesionario";

export interface FinancingDetails {
  interestRate: number;
  loanTerm: number;
}

export interface VehicleDataBackend {
  _id?: string;
  category: VehicleCategory;
  subcategory?: string;
  brand: string;
  brandOther?: string;
  model: string;
  modelOther?: string;
  version?: string;
  year: number;
  price: number;
  currency?: Currency;
  isNegotiable?: boolean;
  showFinancingTips?: boolean;
  offersFinancing?: boolean;
  financingDetails?: {
    interestRate: number;
    loanTerm: number;
  };
  mileage: number;
  color: string;
  // ✅ Campos "Otro" para Step3
  colorOther?: string;
  engine?: string;
  displacement?: string;
  displacementOther?: string;
  driveType?: DriveType;
  transmission: TransmissionType;
  transmissionOther?: string;
  condition: VehicleCondition;
  location: string;
  features: string[];
  fuelType: FuelType;
  fuelTypeOther?: string;
  // ✅ Puertas y asientos ahora opcionales
  doors?: number;
  seats?: number;
  weight?: number;
  loadCapacity?: number;
  sellerContact: SellerContactBackend;
  postedDate: Date;
  warranty: WarrantyType;
  description: string;
  images: string[];
  vin?: string;
  referenceNumber?: string;
  paymentBank?: string;
  paymentProofPublicId?: string;
  paymentProof?: string;
  telegramUserId?: string;
  ownerTelegramId?: string;
  status: ApprovalStatus;
  createdAt?: Date;
  updatedAt?: Date;
  ownership?: OwnershipType;
  saleType?: SaleType;
  videoUrl?: string;
  views?: number;
  documentation?: string[];
  armorLevel?: string;
  tiresCondition?: string;
  serialsIntact?: boolean;
  isFeatured?: boolean;
  rejectionReason?: string;
}

export interface ApiResponseBackend<T = VehicleDataBackend> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: Record<string, string[]>;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponseFrontend<T = VehicleDataFrontend> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: Record<string, string[]>;
}

export interface VehicleDataFrontend extends Omit<
  VehicleDataBackend,
  "_id" | "postedDate" | "createdAt" | "updatedAt"
> {
  _id?: string;
  postedDate: string;
  createdAt?: string;
  updatedAt?: string;
  status: ApprovalStatus;
  approvalStatus?: ApprovalStatus;
  referenceNumber?: string;
  views?: number;
  isFeatured?: boolean;
  isFavorited?: boolean;
  offersFinancing?: boolean;
  financingDetails?: {
    interestRate: number;
    loanTerm: number;
  };
  averageRating?: number;
  ratingCount?: number;
}

// ✅ FIX #9: tipo derivado de VehicleDataBackend
export type VehicleDataGeneric = Omit<
  VehicleDataBackend,
  "postedDate" | "createdAt" | "updatedAt"
> & {
  postedDate: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export const convertToBackend = (
  frontendData: VehicleDataGeneric,
): VehicleDataBackend => {
  return {
    ...frontendData,
    _id: frontendData._id || undefined,
    referenceNumber: frontendData.referenceNumber,
    postedDate: new Date(frontendData.postedDate),
    createdAt: frontendData.createdAt
      ? new Date(frontendData.createdAt)
      : undefined,
    updatedAt: frontendData.updatedAt
      ? new Date(frontendData.updatedAt)
      : undefined,
    status: frontendData.status || ApprovalStatus.PENDING,
    isFeatured: frontendData.isFeatured || false,
  };
};

export const convertToFrontend = (
  backendData: VehicleDataBackend,
): VehicleDataFrontend => {
  if (!backendData) {
    throw new Error("Backend data is required");
  }

  return {
    ...backendData,
    _id: backendData._id?.toString(),
    postedDate: backendData.postedDate.toISOString(),
    createdAt: backendData.createdAt?.toISOString(),
    updatedAt: backendData.updatedAt?.toISOString(),
    referenceNumber: backendData.referenceNumber,
    status: backendData.status || ApprovalStatus.PENDING,
    views: backendData.views,
    isFeatured: backendData.isFeatured,
    rejectionReason: backendData.rejectionReason,
  };
};

export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export interface User {
  _id?: string;
  email: string;
  name?: string;
  password?: string;
  role: "user" | "admin";
}

export interface Vehicle {
  _id: string;
  brand: string;
  brandOther?: string;
  model: string;
  modelOther?: string;
  version?: string;
  year: number;
  price: number;
  currency: Currency;
  isNegotiable?: boolean;
  offersFinancing?: boolean;
  financingDetails?: {
    interestRate: number;
    loanTerm: number;
  };
  status: ApprovalStatus;
  mileage: number;
  color: string;
  colorOther?: string;
  engine?: string;
  displacement?: string;
  displacementOther?: string;
  driveType?: string;
  transmission: TransmissionType;
  transmissionOther?: string;
  condition: VehicleCondition;
  location: string;
  features: string[];
  fuelType: FuelType;
  fuelTypeOther?: string;
  doors?: number;
  seats?: number;
  description: string;
  images: string[];
  category: VehicleCategory;
  subcategory?: string;
  warranty: WarrantyType;
  sellerContact: SellerContactBackend;
  postedDate: string;
  createdAt?: string;
  updatedAt?: string;
  isFeatured?: boolean;
  views?: number;
  saleType?: SaleType;
  documentation?: string[];
  vin?: string;
}

export const SORT_OPTIONS = [
  {
    value: "relevance",
    label: "Predeterminado",
    key: "relevance" as const,
    order: "desc" as const,
  },
  {
    value: "price_asc",
    label: "Precio: Menor a Mayor",
    key: "price" as const,
    order: "asc" as const,
  },
  {
    value: "price_desc",
    label: "Precio: Mayor a Menor",
    key: "price" as const,
    order: "desc" as const,
  },
  {
    value: "year_desc",
    label: "Año: Más Nuevo",
    key: "year" as const,
    order: "desc" as const,
  },
  {
    value: "year_asc",
    label: "Año: Más Antiguo",
    key: "year" as const,
    order: "asc" as const,
  },
  {
    value: "mileage_asc",
    label: "Kilometraje: Menor",
    key: "mileage" as const,
    order: "asc" as const,
  },
  {
    value: "mileage_desc",
    label: "Kilometraje: Mayor",
    key: "mileage" as const,
    order: "desc" as const,
  },
  {
    value: "date_desc",
    label: "Más Recientes",
    key: "createdAt" as const,
    order: "desc" as const,
  },
];

export interface VehicleComment {
  _id: string;
  username: string;
  userId?: string;
  text: string;
  createdAt: string;
  type?: "rejection" | "comment";
}

export interface VehicleHistoryEntry {
  id: string;
  action: string;
  details?: string;
  author: string;
  authorId?: string;
  timestamp: string;
}