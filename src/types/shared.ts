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
  NEW = 'new',                 // Nuevo
  EXCELLENT = 'excellent',     // Excelente
  GOOD = 'good',               // Bueno
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
  DUAL_CLUTCH = 'dual-clutch'
}

export enum FuelType {
  GASOLINE = 'gasoline',       // Gasolina
  DIESEL = 'diesel',           // Gasoil
  HYBRID = 'hybrid'            // Híbrido
}

export enum ApprovalStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  SOLD = "sold",
}

export enum WarrantyType {
  NO_WARRANTY = 'no-warranty',
  SELLER_WARRANTY = 'seller-warranty',
  DEALER_WARRANTY = 'dealer-warranty',
  MANUFACTURER_WARRANTY = 'manufacturer-warranty',
  EXTENDED_WARRANTY = 'extended-warranty'
}

export enum SaleType {
  PRIVATE = "privado",
  DEALER = "concesionario",
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
  [TransmissionType.DUAL_CLUTCH]: 'Doble Embrague'
} as const;

export const FUEL_TYPES_LABELS = {
  [FuelType.GASOLINE]: 'Gasolina',
  [FuelType.DIESEL]: 'Gasoil / Diésel',
  [FuelType.HYBRID]: 'Híbrido',
} as const;

export const WARRANTY_LABELS: Record<WarrantyType, string> = {
  [WarrantyType.NO_WARRANTY]: "Sin Garantía",
  [WarrantyType.SELLER_WARRANTY]: "Garantía del Vendedor",
  [WarrantyType.DEALER_WARRANTY]: "Garantía del Concesionario",
  [WarrantyType.MANUFACTURER_WARRANTY]: "Garantía de Fábrica",
  [WarrantyType.EXTENDED_WARRANTY]: "Garantía Extendida"
} as const;

export const SALE_TYPE_LABELS: Record<SaleType, string> = {
  [SaleType.PRIVATE]: "Vendedor Privado",
  [SaleType.DEALER]: "Concesionario",
};

// ✅ CORRECCIÓN: Añadir y exportar el mapa de etiquetas para las ubicaciones.
export const LOCATION_LABELS: Record<string, string> = {
  // Estados venezolanos (originales)
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
  
  // Ciudades/estados mexicanos (basados en los datos reales de vehicles.json)
  "leon": "León",
  "ciudad-de-mexico": "Ciudad de México",
  "monterrey": "Monterrey",
  "queretaro": "Querétaro",
  "puebla": "Puebla",
};