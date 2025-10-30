// src/components/features/vehicles/common/VehicleStats.tsx
"use client";

import type React from "react";
import { useMemo } from "react";
import { Vehicle } from "@/types/types";
import { BarChart } from "lucide-react";

const VehicleStats = ({
  filteredVehicles,
}: {
  filteredVehicles: Vehicle[];
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
    // ✅ MEJORA: Quitamos mb-6 para que el espaciado lo controle el padre con space-y-6
    <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 p-4 rounded-xl shadow-md bg-card/80 backdrop-blur-sm border border-border">
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
        {/* ✅ MEJORA: Usamos color semántico 'primary' para el precio */}
        <span className="font-semibold text-primary">
          ${averagePrice.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">
          Año Promedio:
        </span>
        {/* ✅ MEJORA: Usamos color semántico 'accent' para el año */}
        <span className="font-semibold text-accent">
          {averageYear}
        </span>
      </div>
    </div>
  );
};

export default VehicleStats;