//src/components/sections/VehicleList/VehicleStats.tsx
"use client";

import type React from "react";
import { useMemo } from "react";
import { Vehicle } from "@/types/types";
import { VehicleCondition } from "@/types/types";

const VehicleStats = ({
  filteredVehicles,
  isDarkMode,
}: {
  filteredVehicles: Vehicle[];
  isDarkMode: boolean;
}) => {
  const stats = useMemo(() => {
    const avgPrice =
      filteredVehicles.reduce((sum, v) => sum + v.price, 0) /
      filteredVehicles.length || 0;
    const avgYear =
      filteredVehicles.reduce((sum, v) => sum + v.year, 0) /
      filteredVehicles.length || 0;
    const avgMileage =
      filteredVehicles.reduce((sum, v) => sum + v.mileage, 0) /
      filteredVehicles.length || 0;
    const featuredCount = filteredVehicles.filter((v) => v.isFeatured).length;

    return {
      total: filteredVehicles.length,
      avgPrice: Math.round(avgPrice),
      avgYear: Math.round(avgYear),
      avgMileage: Math.round(avgMileage),
      featured: featuredCount,
      newCount: filteredVehicles.filter(
        (v) => v.condition === VehicleCondition.NEW
      ).length,
    };
  }, [filteredVehicles]);

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-6 gap-4 p-4 rounded-xl mb-6 ${
        isDarkMode ? "bg-gray-800/30" : "bg-white/30"
      } backdrop-blur-sm border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="text-center">
        <div
          className={`text-2xl font-bold ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}
        >
          {stats.total}
        </div>
        <div
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Vehículos
        </div>
      </div>
      <div className="text-center">
        <div
          className={`text-2xl font-bold ${
            isDarkMode ? "text-green-400" : "text-green-600"
          }`}
        >
          ${(stats.avgPrice / 1000).toFixed(0)}K
        </div>
        <div
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Precio Prom.
        </div>
      </div>
      <div className="text-center">
        <div
          className={`text-2xl font-bold ${
            isDarkMode ? "text-purple-400" : "text-purple-600"
          }`}
        >
          {stats.avgYear}
        </div>
        <div
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Año Prom.
        </div>
      </div>
      <div className="text-center">
        <div
          className={`text-2xl font-bold ${
            isDarkMode ? "text-orange-400" : "text-orange-600"
          }`}
        >
          {(stats.avgMileage / 1000).toFixed(0)}K
        </div>
        <div
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          KM Prom.
        </div>
      </div>
      <div className="text-center">
        <div
          className={`text-2xl font-bold ${
            isDarkMode ? "text-yellow-400" : "text-yellow-600"
          }`}
        >
          {stats.featured}
        </div>
        <div
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Destacados
        </div>
      </div>
      <div className="text-center">
        <div
          className={`text-2xl font-bold ${
            isDarkMode ? "text-emerald-400" : "text-emerald-600"
          }`}
        >
          {stats.newCount}
        </div>
        <div
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Nuevos
        </div>
      </div>
    </div>
  );
};

export default VehicleStats;