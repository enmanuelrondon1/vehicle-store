//src/components/features/vehicles/detail/sections/VehicleSummary.tsx
"use client";

import React from "react";
import { Star, Calendar, Car, MapPin, Eye } from "lucide-react";
import type { VehicleDataFrontend } from "@/types/types";
import { formatPrice, formatMileage } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Vortex } from "@/components/ui/vortex";

interface VehicleSummaryProps {
  vehicle: VehicleDataFrontend;
}

const VehicleSummaryComponent: React.FC<VehicleSummaryProps> = ({ vehicle }) => {
  return (
    <div>
      {/* Bloque del título con el efecto Vortex */}
      <div className="rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900">
        <Vortex
          particleCount={150}
          rangeY={50}
          baseHue={240}
          className="flex items-center flex-col justify-center px-4 py-6 w-full h-full"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent dark:text-white dark:bg-none"
          >
            {vehicle.brand} {vehicle.model} {vehicle.year}
          </motion.h1>
        </Vortex>
      </div>

      {/* Resto del contenido con estilos estándar */}
      <div className="flex items-center gap-3 mb-4">
        {vehicle.isFeatured && (
          <Badge variant="special" className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            Destacado
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          {formatPrice(vehicle.price)}
        </p>
        {vehicle.isNegotiable && (
          <Badge variant="secondary" className="text-sm font-medium ml-2">
            Negociable
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-6 text-muted-foreground mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <span>{vehicle.year}</span>
        </div>
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          <span>{formatMileage(vehicle.mileage)} km</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>{vehicle.location}</span>
        </div>
        {vehicle.views !== undefined && (
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span>{vehicle.views} vistas</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const VehicleSummary = React.memo(VehicleSummaryComponent);