"use client";

import React from "react";
import { Star, Calendar, Car, MapPin, Eye } from "lucide-react";
import type { VehicleDataFrontend } from "@/types/types";
import { useDarkMode } from "@/context/DarkModeContext";
import { formatPrice, formatMileage } from "@/lib/utils";

interface VehicleSummaryProps {
  vehicle: VehicleDataFrontend;
}

const VehicleSummaryComponent: React.FC<VehicleSummaryProps> = ({ vehicle }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h1
          className={`text-4xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {vehicle.brand} {vehicle.model} {vehicle.year}
        </h1>
        {vehicle.isFeatured && (
          <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <Star className="w-4 h-4" />
            Destacado
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {formatPrice(vehicle.price)}
          {vehicle.isNegotiable && (
            <span className="text-lg font-medium text-gray-500 dark:text-gray-400 ml-2">
              (Negociable)
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-6 text-gray-500 mb-6">
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