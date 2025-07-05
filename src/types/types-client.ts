// // types/client-types.ts - Solo tipos para el cliente
// export enum VehicleCategory {
//   CAR = "car",
//   MOTORCYCLE = "motorcycle",
//   TRUCK = "truck",
//   VAN = "van",
//   SUV = "suv"
// }

// export enum VehicleCondition {
//   NEW = "new",
//   USED = "used",
//   CERTIFIED = "certified"
// }

// export enum TransmissionType {
//   MANUAL = "manual",
//   AUTOMATIC = "automatic",
//   CVT = "cvt"
// }

// export enum FuelType {
//   GASOLINE = "gasoline",
//   DIESEL = "diesel",
//   ELECTRIC = "electric",
//   HYBRID = "hybrid"
// }

// export enum AvailabilityStatus {
//   AVAILABLE = "available",
//   SOLD = "sold",
//   RESERVED = "reserved"
// }

// export enum WarrantyType {
//   NO_WARRANTY = "no_warranty",
//   MANUFACTURER = "manufacturer",
//   EXTENDED = "extended"
// }

// // Tipo para contacto del vendedor
// export interface SellerContact {
//   name: string;
//   email: string;
//   phone: string;
// }

// // Tipo base del vehículo (sin campos de MongoDB)
// export interface VehicleData {
//   category?: VehicleCategory;
//   subcategory?: string;
//   brand?: string;
//   model?: string;
//   year?: number;
//   price?: number;
//   mileage?: number;
//   condition?: VehicleCondition;
//   color?: string;
//   transmission?: TransmissionType;
//   fuelType?: FuelType;
//   doors?: number;
//   seats?: number;
//   engine?: string;
//   features?: string[];
//   images?: string[];
//   description?: string;
//   location?: string;
//   sellerContact?: SellerContact;
//   availability?: AvailabilityStatus;
//   warranty?: WarrantyType;
// }

// // Tipo para errores del formulario
// export interface FormErrors {
//   [key: string]: string;
// }