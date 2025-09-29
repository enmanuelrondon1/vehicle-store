// src/models/Vehicle.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { VehicleDataBackend, ApprovalStatus } from '@/types/types';

const SellerContactSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

const VehicleSchema = new Schema<VehicleDataBackend>({
  category: { type: String, required: true, index: true },
  subcategory: { type: String },
  brand: { type: String, required: true, index: true },
  brandOther: { type: String },
  model: { type: String, required: true, index: true },
  year: { type: Number, required: true, index: true },
  price: { type: Number, required: true, index: true },
  currency: { type: String, default: 'USD' },
  isNegotiable: { type: Boolean, default: false },
  mileage: { type: Number, required: true, index: true },
  color: { type: String, required: true },
  engine: { type: String },
  displacement: { type: String },
  driveType: { type: String },
  transmission: { type: String, required: true },
  condition: { type: String, required: true },
  location: { type: String, required: true, index: true },
  features: [{ type: String }],
  fuelType: { type: String, required: true },
  doors: { type: Number },
  seats: { type: Number },
  loadCapacity: { type: Number },
  sellerContact: { type: SellerContactSchema, required: true },
  postedDate: { type: Date, default: Date.now, index: true },
  warranty: { type: String },
  description: { type: String },
  images: [{ type: String }],
  vin: { type: String },
  referenceNumber: { type: String },
  paymentProof: { type: String },
  status: {
    type: String,
    enum: Object.values(ApprovalStatus),
    required: true,
    default: ApprovalStatus.PENDING,
    index: true
  },
  isFeatured: { type: Boolean, default: false, index: true },
  views: { type: Number, default: 0 },
}, {
  timestamps: true // Esto añade createdAt y updatedAt automáticamente
});

// Evita recompilar el modelo si ya existe
const Vehicle = models.Vehicle || mongoose.model<VehicleDataBackend>('Vehicle', VehicleSchema);

export default Vehicle as Model<VehicleDataBackend & Document>;
