// src/components/features/vehicles/reels/ReelInfo.tsx
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Car, Fuel, MapPin, Gauge, Star } from "lucide-react";
import { Vehicle } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { ViewMode, useReelsConfig, PRICE_GRADIENTS } from "@/hooks/useReelsConfig";
import {
  TRANSMISSION_TYPES_LABELS,
  FUEL_TYPES_LABELS,
  VEHICLE_CONDITIONS_LABELS,
} from "@/types/shared";
import { cn } from "@/lib/utils";

interface ReelInfoProps {
  vehicle: Vehicle;
  mode: ViewMode;
}

export const ReelInfo: React.FC<ReelInfoProps> = ({ 
  vehicle, 
  mode
}) => {
  const { config } = useReelsConfig();

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

  const priceGradientClass = useMemo(() => {
    return PRICE_GRADIENTS[config.priceGradient];
  }, [config.priceGradient]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-0 left-0 right-0 z-30 p-4 pt-12 pb-6"
      style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* ===== MINIMAL: Solo precio ===== */}
        {mode === "minimal" && (
          <div>
            <div className={cn(
              "text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r",
              priceGradientClass
            )}>
              {formatPrice(vehicle.price)}
            </div>
          </div>
        )}

        {/* ===== BALANCED: Info esencial sin badges (ya están arriba) ===== */}
        {mode === "balanced" && (
          <>
            {/* Price */}
            <div className={cn(
              "text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r mb-4",
              priceGradientClass
            )}>
              {formatPrice(vehicle.price)}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-white/60">Km</p>
                  <p className="text-sm font-semibold">{formatMileage(vehicle.mileage)}</p>
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
            <div className="flex items-center gap-2 text-white/80 mt-3">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{vehicle.location}</span>
            </div>
          </>
        )}

        {/* ===== DETAILED: Toda la información mejorada y compacta ===== */}
        {mode === "detailed" && (
          <div className="space-y-2.5 max-h-96 overflow-y-auto scrollbar-hide">
            {/* --- Price Section --- */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-0.5 font-medium">Precio</p>
              <div className={cn(
                "text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r",
                priceGradientClass
              )}>
                {formatPrice(vehicle.price)}
              </div>
            </div>

            {/* --- Main Stats Grid (3 columnas) --- */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/10">
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Gauge className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-0.5">Km</p>
                <p className="text-xs font-bold text-white">{formatMileage(vehicle.mileage)}</p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Car className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-0.5">Trans</p>
                <p className="text-xs font-bold text-white">{translatedTransmission}</p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Fuel className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-0.5">Combustible</p>
                <p className="text-xs font-bold text-white">{translatedFuelType}</p>
              </div>
            </div>

            {/* --- Location --- */}
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded px-2.5 py-1.5 border border-white/10">
              <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-white/60 uppercase tracking-wider">Ubicación</p>
                <p className="text-xs font-medium text-white truncate">{vehicle.location}</p>
              </div>
            </div>

            {/* --- Description --- */}
            {vehicle.description && (
              <div className="bg-white/5 backdrop-blur-sm rounded px-2.5 py-1.5 border border-white/10">
                <p className="text-xs text-white/60 uppercase tracking-wider mb-0.5">Descripción</p>
                <p className="text-xs text-white/80 line-clamp-2">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* --- Features --- */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1.5 font-medium">Características</p>
                <div className="flex flex-wrap gap-1.5">
                  {vehicle.features.slice(0, 4).map((feature, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-gradient-to-r from-white/15 to-white/5 text-white border-white/20 backdrop-blur-sm text-xs font-medium hover:from-white/25 hover:to-white/10 transition-all"
                    >
                      ✓ {feature}
                    </Badge>
                  ))}
                  {vehicle.features.length > 4 && (
                    <Badge 
                      className="bg-gradient-to-r from-blue-500/30 to-blue-600/20 text-blue-300 border-blue-500/30 backdrop-blur-sm text-xs font-medium"
                    >
                      +{vehicle.features.length - 4} más
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReelInfo;