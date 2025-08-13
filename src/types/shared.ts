// src/types/shared.ts
export enum VehicleCategory {
  CAR = 'car',
  SUV = 'suv',
  VAN = 'van',
  TRUCK = 'truck',
  MOTORCYCLE = 'motorcycle',
  BUS = 'bus'
}

export enum VehicleCondition {
  EXCELLENT = 'excellent',     // Excelente
  VERY_GOOD = 'very_good',     // Muy Bueno  
  GOOD = 'good',               // Bueno
  REGULAR = 'regular',         // Regular
  NEEDS_REPAIR = 'needs_repair', // Necesita Reparación
  NEW = 'new'                  // Nuevo (para vehículos 0km)
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  CVT = 'cvt',
  DUAL_CLUTCH = 'dual-clutch'
}

export enum FuelType {
  GASOLINE_95 = 'gasoline_95', // Gasolina 95
  GASOLINE_91 = 'gasoline_91', // Gasolina 91
  DIESEL = 'diesel',           // Gasoil
  LPG = 'lpg',                 // GLP / Gas
  ELECTRIC = 'electric',
  HYBRID = 'hybrid'
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export enum WarrantyType {
  NO_WARRANTY = 'no-warranty',
  SELLER_WARRANTY = 'seller-warranty',
  DEALER_WARRANTY = 'dealer-warranty',
  MANUFACTURER_WARRANTY = 'manufacturer-warranty',
  EXTENDED_WARRANTY = 'extended-warranty'
}

// Nuevo: Moneda para el precio
export enum Currency {
  USD = 'USD',
  VES = 'VES',
  BOTH = 'BOTH' // Ambas
}

// Nuevo: Documentación del vehículo
export enum Documentation {
  TITLE = 'title', // Título de Propiedad
  ORIGIN_CERTIFICATE = 'origin_certificate', // Certificado de Origen
  TRANSIT_REVIEW = 'transit_review', // Revisión de Tránsito (INTT)
  BOLIVARIAN_PLATES = 'bolivarian_plates' // Placas Bolivarianas
}

export const VEHICLE_CATEGORIES_LABELS = {
  [VehicleCategory.CAR]: 'Automóvil',
  [VehicleCategory.SUV]: 'SUV',
  [VehicleCategory.VAN]: 'Camioneta de Carga/Pasajeros',
  [VehicleCategory.TRUCK]: 'Camión',
  [VehicleCategory.MOTORCYCLE]: 'Motocicleta',
  [VehicleCategory.BUS]: 'Autobús',
} as const;

export const VEHICLE_CONDITIONS_LABELS = {
  [VehicleCondition.EXCELLENT]: 'Excelente',
  [VehicleCondition.VERY_GOOD]: 'Muy Bueno',
  [VehicleCondition.GOOD]: 'Bueno', 
  [VehicleCondition.REGULAR]: 'Regular',
  [VehicleCondition.NEEDS_REPAIR]: 'Necesita Reparación',
  [VehicleCondition.NEW]: 'Nuevo (0km)'
} as const;

export const TRANSMISSION_TYPES_LABELS = {
  [TransmissionType.MANUAL]: 'Manual',
  [TransmissionType.AUTOMATIC]: 'Automático',
  [TransmissionType.CVT]: 'CVT',
  [TransmissionType.DUAL_CLUTCH]: 'Doble Embrague'
} as const;

export const FUEL_TYPES_LABELS = {
  [FuelType.GASOLINE_95]: 'Gasolina 95 Octanos',
  [FuelType.GASOLINE_91]: 'Gasolina 91 Octanos',
  [FuelType.DIESEL]: 'Gasoil / Diésel',
  [FuelType.LPG]: 'GLP / Gas',
  [FuelType.ELECTRIC]: 'Eléctrico',
  [FuelType.HYBRID]: 'Híbrido'
} as const;

export const WARRANTY_LABELS: Record<WarrantyType, string> = {
  [WarrantyType.NO_WARRANTY]: "Sin Garantía",
  [WarrantyType.SELLER_WARRANTY]: "Garantía del Vendedor",
  [WarrantyType.DEALER_WARRANTY]: "Garantía del Concesionario",
  [WarrantyType.MANUFACTURER_WARRANTY]: "Garantía de Fábrica",
  [WarrantyType.EXTENDED_WARRANTY]: "Garantía Extendida"
} as const;