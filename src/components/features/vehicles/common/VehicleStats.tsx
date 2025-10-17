//src/components/sections/VehicleList/VehicleStats.tsx
"use client";

import type React from "react";
import { useMemo } from "react";
import { Vehicle } from "@/types/types";
import { BarChart } from "lucide-react";

const VehicleStats = ({
  filteredVehicles,
}: {
  filteredVehicles: Vehicle[];
}) => { // ❌ REMOVED: isDarkMode prop
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
      className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 p-4 rounded-xl mb-6 shadow-md bg-card/80 backdrop-blur-sm border border-border"
    >
      <div className="flex items-center gap-2">
        <BarChart className="w-5 h-5 text-primary" />
        <p className="text-muted-foreground">
          <span className="font-bold text-foreground">{filteredVehicles.length.toLocaleString()}</span> vehículos
          encontrados
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">
          Precio Promedio:
        </span>
        <span
          className="font-semibold text-green-600 dark:text-green-400"
        >
          ${averagePrice.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">
          Año Promedio:
        </span>
        <span
          className="font-semibold text-purple-600 dark:text-purple-400"
        >
          {averageYear}
        </span>
      </div>
    </div>
  );
};

export default VehicleStats;