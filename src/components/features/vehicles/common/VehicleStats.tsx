//src/components/sections/VehicleList/VehicleStats.tsx
"use client";

import type React from "react";
import { useMemo } from "react";
import { Vehicle } from "@/types/types";
import { BarChart } from "lucide-react"; // CORRECCIÓN: Se eliminó el texto extra que causaba el error de sintaxis.

const VehicleStats = ({
  filteredVehicles,
  isDarkMode,
}: {
  filteredVehicles: Vehicle[];
  isDarkMode: boolean;
}) => {
  const averagePrice = useMemo(() => {
    if (filteredVehicles.length === 0) return 0;
    const total = filteredVehicles.reduce((sum, v) => sum + v.price, 0);
    return Math.round(total / filteredVehicles.length);
  }, [filteredVehicles]);

  const averageYear = useMemo(() => {
    if (filteredVehicles.length === 0) return 0;
    const total = filteredVehicles.reduce((sum, v) => sum + v.year, 0);
    return Math.round(total / filteredVehicles.length);
  }, [filteredVehicles]);

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-x-8 gap-y-4 p-4 rounded-xl mb-6 shadow-md ${
        isDarkMode ? "bg-gray-800/30" : "bg-white/30"
      } backdrop-blur-sm border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2">
        <BarChart className="w-5 h-5 text-blue-500" />
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          <span className="font-bold">{filteredVehicles.length.toLocaleString()}</span> vehículos
          encontrados
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Precio Promedio:
        </span>
        <span
          className={`font-semibold ${isDarkMode ? "text-green-400" : "text-green-600"}`}
        >
          ${averagePrice.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Año Promedio:
        </span>
        <span
          className={`font-semibold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
        >
          {averageYear}
        </span>
      </div>
    </div>
  );
};

export default VehicleStats;