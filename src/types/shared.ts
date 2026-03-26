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
  NEW = 'new',
  EXCELLENT = 'excellent',
  GOOD = 'good',
}

export enum DriveType {
  FWD = "fwd",
  RWD = "rwd",
  AWD = "awd",
  FOUR_WD = "4wd",
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  CVT = 'cvt',
  DUAL_CLUTCH = 'dual-clutch',
  OTHER = 'other',        // ✅ NUEVO
}

export enum FuelType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
  GAS = 'gas',            // ✅ NUEVO: Gas/GNV (muy común en Venezuela)
  ELECTRIC = 'electric',  // ✅ NUEVO: Eléctrico
  OTHER = 'other',        // ✅ NUEVO: Otro
}

export enum ApprovalStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  SOLD = "sold",
}

// ✅ Reducido a 2 opciones relevantes para Venezuela
export enum WarrantyType {
  NO_WARRANTY = 'no-warranty',
  SELLER_WARRANTY = 'seller-warranty',
}

export enum SaleType {
  PRIVATE = "privado",
  DEALER = "concesionario",
}

export enum Currency {
  USD = 'USD',
  VES = 'VES',
  BOTH = 'BOTH'
}

export enum Documentation {
  TITLE = 'title',
  ORIGIN_CERTIFICATE = 'origin_certificate',
  TRANSIT_REVIEW = 'transit_review',
  BOLIVARIAN_PLATES = 'bolivarian_plates'
}

export const VEHICLE_CATEGORIES_LABELS = {
  [VehicleCategory.CAR]: 'Automóvil',
  [VehicleCategory.SUV]: 'SUV',
  [VehicleCategory.VAN]: 'Furgonetas',
  [VehicleCategory.TRUCK]: 'Camión',
  [VehicleCategory.MOTORCYCLE]: 'Motocicleta',
  [VehicleCategory.BUS]: 'Autobús',
} as const;

export const VEHICLE_CONDITIONS_LABELS = {
  [VehicleCondition.NEW]: 'Nuevo',
  [VehicleCondition.EXCELLENT]: 'Excelente',
  [VehicleCondition.GOOD]: 'Bueno',
} as const;

export const DRIVE_TYPE_LABELS: Record<DriveType, string> = {
  [DriveType.FWD]: "Delantera (FWD)",
  [DriveType.RWD]: "Trasera (RWD)",
  [DriveType.AWD]: "Integral (AWD)",
  [DriveType.FOUR_WD]: "4x4",
};

export const TRANSMISSION_TYPES_LABELS = {
  [TransmissionType.MANUAL]: 'Manual',
  [TransmissionType.AUTOMATIC]: 'Automático',
  [TransmissionType.CVT]: 'CVT',
  [TransmissionType.DUAL_CLUTCH]: 'Doble Embrague',
  [TransmissionType.OTHER]: 'Otro',  // ✅ NUEVO
} as const;

export const FUEL_TYPES_LABELS = {
  [FuelType.GASOLINE]: 'Gasolina',
  [FuelType.DIESEL]: 'Gasoil / Diésel',
  [FuelType.HYBRID]: 'Híbrido',
  [FuelType.GAS]: 'Gas / GNV',       // ✅ NUEVO
  [FuelType.ELECTRIC]: 'Eléctrico',  // ✅ NUEVO
  [FuelType.OTHER]: 'Otro',          // ✅ NUEVO
} as const;

// ✅ Reducido a 2 opciones
export const WARRANTY_LABELS: Record<WarrantyType, string> = {
  [WarrantyType.NO_WARRANTY]: "Sin Garantía",
  [WarrantyType.SELLER_WARRANTY]: "Garantía del Vendedor",
} as const;

export const SALE_TYPE_LABELS: Record<SaleType, string> = {
  [SaleType.PRIVATE]: "Vendedor Privado",
  [SaleType.DEALER]: "Concesionario",
};

export const LOCATION_LABELS: Record<string, string> = {
  amazonas: "Amazonas",
  anzoategui: "Anzoátegui",
  apure: "Apure",
  aragua: "Aragua",
  barinas: "Barinas",
  bolivar: "Bolívar",
  carabobo: "Carabobo",
  cojedes: "Cojedes",
  "delta-amacuro": "Delta Amacuro",
  "distrito-capital": "Distrito Capital",
  falcon: "Falcón",
  guarico: "Guárico",
  lara: "Lara",
  merida: "Mérida",
  miranda: "Miranda",
  monagas: "Monagas",
  "nueva-esparta": "Nueva Esparta",
  portuguesa: "Portuguesa",
  sucre: "Sucre",
  tachira: "Táchira",
  trujillo: "Trujillo",
  vargas: "Vargas",
  yaracuy: "Yaracuy",
  zulia: "Zulia",
  "leon": "León",
  "ciudad-de-mexico": "Ciudad de México",
  "monterrey": "Monterrey",
  "queretaro": "Querétaro",
  "puebla": "Puebla",
};