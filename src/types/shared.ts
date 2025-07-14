// src/types/shared.ts
export enum VehicleCategory {
  CAR = 'car',
  TRUCK = 'truck',
  MOTORCYCLE = 'motorcycle',
  BUS = 'bus',
  VAN = 'van',
  SUV = 'suv'
}

export enum VehicleCondition {
  NEW = 'new',
  USED = 'used',
  CERTIFIED = 'certified'
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  CVT = 'cvt',
  DUAL_CLUTCH = 'dual-clutch'
}

export enum FuelType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  PLUG_IN_HYBRID = 'plug-in-hybrid',
  GAS = 'gas',
  HYDROGEN = 'hydrogen'
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export enum WarrantyType {
  NO_WARRANTY = 'no-warranty',
  DEALER_WARRANTY = 'dealer-warranty',
  MANUFACTURER_WARRANTY = 'manufacturer-warranty',
  EXTENDED_WARRANTY = 'extended-warranty'
}

export const VEHICLE_CATEGORIES_LABELS = {
  [VehicleCategory.CAR]: 'Automóvil',
  [VehicleCategory.TRUCK]: 'Camión',
  [VehicleCategory.MOTORCYCLE]: 'Motocicleta',
  [VehicleCategory.BUS]: 'Autobús',
  [VehicleCategory.VAN]: 'Camioneta',
  [VehicleCategory.SUV]: 'SUV'
} as const;

export const VEHICLE_CONDITIONS_LABELS = {
  [VehicleCondition.NEW]: 'Nuevo',
  [VehicleCondition.USED]: 'Usado',
  [VehicleCondition.CERTIFIED]: 'Certificado'
} as const;

export const TRANSMISSION_TYPES_LABELS = {
  [TransmissionType.MANUAL]: 'Manual',
  [TransmissionType.AUTOMATIC]: 'Automático',
  [TransmissionType.CVT]: 'CVT',
  [TransmissionType.DUAL_CLUTCH]: 'Doble Embrague'
} as const;

export const FUEL_TYPES_LABELS = {
  [FuelType.GASOLINE]: 'Gasolina',
  [FuelType.DIESEL]: 'Diésel',
  [FuelType.ELECTRIC]: 'Eléctrico',
  [FuelType.HYBRID]: 'Híbrido',
  [FuelType.PLUG_IN_HYBRID]: 'Híbrido Enchufable',
  [FuelType.GAS]: 'Gas',
  [FuelType.HYDROGEN]: 'Hidrógeno'
} as const;