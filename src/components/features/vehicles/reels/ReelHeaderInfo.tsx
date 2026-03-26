// src/components/features/vehicles/reels/ReelHeaderInfo.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Vehicle } from "@/types/types";
import { ViewMode } from "@/hooks/useReelsConfig";
import { Calendar, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VEHICLE_CONDITIONS_LABELS } from "@/types/shared";

interface ReelHeaderInfoProps {
  vehicle: Vehicle;
  mode: ViewMode;
}

export const ReelHeaderInfo: React.FC<ReelHeaderInfoProps> = ({ vehicle, mode }) => {
  const translatedCondition = VEHICLE_CONDITIONS_LABELS[vehicle.condition] || vehicle.condition;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute top-12 left-0 right-0 z-30 px-5"
    >
      <div className="max-w-2xl mx-auto">
        {/* Modo Minimalista: Info básica y compacta */}
        {mode === "minimal" && (
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-white drop-shadow-lg">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="text-white/70 text-xs drop-shadow-md">
              {vehicle.year}
            </p>
          </div>
        )}

        {/* Modo Balanceado: Marca, modelo, año y badges */}
        {mode === "balanced" && (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="text-white/80 text-sm drop-shadow-md flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{vehicle.year}</span>
            </p>
            
            {/* Badges - Nuevo en balanced */}
            <div className="flex flex-wrap gap-2 pt-1">
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
          </div>
        )}

        {/* Modo Detallado: Marca, modelo, año, versión y badges */}
        {mode === "detailed" && (
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              {vehicle.brand} {vehicle.model}
            </h2>
            <div className="flex items-center gap-2 text-white/90 text-sm drop-shadow-md">
              <Calendar className="w-4 h-4" />
              <span className="font-semibold">{vehicle.year}</span>
              {vehicle.version && (
                <>
                  <span className="text-white/50">•</span>
                  <span className="text-white/80">{vehicle.version}</span>
                </>
              )}
            </div>

            {/* Badges - Nuevo en detailed */}
            <div className="flex flex-wrap gap-2 pt-1">
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
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReelHeaderInfo;