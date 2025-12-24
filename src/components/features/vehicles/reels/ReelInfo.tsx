// src/components/features/vehicles/reels/ReelInfo.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Car, Fuel, Calendar, MapPin, Gauge, Star } from "lucide-react";
import { Vehicle } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import {
  TRANSMISSION_TYPES_LABELS,
  FUEL_TYPES_LABELS,
  VEHICLE_CONDITIONS_LABELS,
} from "@/types/shared";
import { cn } from "@/lib/utils";

interface ReelInfoProps {
  vehicle: Vehicle;
}

export const ReelInfo: React.FC<ReelInfoProps> = ({ vehicle }) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat("es-ES").format(mileage);

  const translatedTransmission = TRANSMISSION_TYPES_LABELS[vehicle.transmission] || vehicle.transmission;
  const translatedFuelType = FUEL_TYPES_LABELS[vehicle.fuelType] || vehicle.fuelType;
  const translatedCondition = VEHICLE_CONDITIONS_LABELS[vehicle.condition] || vehicle.condition;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-8"
      style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {vehicle.isFeatured && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none">
              <Star className="w-3 h-3 mr-1" />
              Destacado
            </Badge>
          )}
          
          <Badge className="bg-white/10 backdrop-blur-sm text-white border-white/20">
            {translatedCondition}
          </Badge>
          
          {vehicle.isNegotiable && (
            <Badge className="bg-green-500/20 backdrop-blur-sm text-green-300 border-green-500/30">
              Negociable
            </Badge>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {vehicle.brand} {vehicle.model}
        </h2>

        {/* Year and Version */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-lg text-white/80">{vehicle.year}</span>
          {vehicle.version && (
            <>
              <span className="text-white/50">•</span>
              <span className="text-lg text-white/80">{vehicle.version}</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
          {formatPrice(vehicle.price)}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="flex items-center gap-2 text-white/90">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/60">Año</p>
              <p className="text-sm font-semibold">{vehicle.year}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/90">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/60">Kilometraje</p>
              <p className="text-sm font-semibold">{formatMileage(vehicle.mileage)} km</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/90">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/60">Transmisión</p>
              <p className="text-sm font-semibold">{translatedTransmission}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/90">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/60">Combustible</p>
              <p className="text-sm font-semibold">{translatedFuelType}</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-white/80">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{vehicle.location}</span>
        </div>

        {/* Description Preview (if exists) */}
        {vehicle.description && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-sm text-white/70 line-clamp-2">
              {vehicle.description}
            </p>
          </div>
        )}

        {/* Features Preview (show first 3) */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {vehicle.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80"
              >
                {feature}
              </span>
            ))}
            {vehicle.features.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80">
                +{vehicle.features.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Tap to hide/show info hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-white/40">
            Toca para ocultar/mostrar información
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReelInfo;