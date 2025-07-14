// src/types/types-client.ts
import { ApprovalStatus } from "./shared";

export enum VehicleCategory {
  CAR = "car",
  MOTORCYCLE = "motorcycle",
  TRUCK = "truck",
  VAN = "van",
  SUV = "suv"
}

export enum VehicleCondition {
  NEW = "new",
  USED = "used",
  CERTIFIED = "certified"
}

export enum TransmissionType {
  MANUAL = "manual",
  AUTOMATIC = "automatic",
  CVT = "cvt"
}

export enum FuelType {
  GASOLINE = "gasoline",
  DIESEL = "diesel",
  ELECTRIC = "electric",
  HYBRID = "hybrid"
}

export enum WarrantyType {
  NO_WARRANTY = "no-warranty",
  DEALER_WARRANTY = "dealer-warranty",
  MANUFACTURER_WARRANTY = "manufacturer-warranty",
  EXTENDED_WARRANTY = "extended-warranty"
}

export interface SellerContact {
  name: string;
  email: string;
  phone: string;
}

export interface VehicleData {
  category?: VehicleCategory;
  subcategory?: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  mileage?: number;
  condition?: VehicleCondition;
  color?: string;
  transmission?: TransmissionType;
  fuelType?: FuelType;
  doors?: number;
  seats?: number;
  engine?: string;
  features?: string[];
  images?: string[];
  description?: string;
  location?: string;
  sellerContact?: SellerContact;
  status?: ApprovalStatus;
  warranty?: WarrantyType;
}

export interface FormErrors {
  [key: string]: string;
}