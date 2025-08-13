//src/components/sections/VehicleList/VehicleGrid.tsx
"use client";

import type React from "react";
import { Vehicle } from "@/types/types";
import VehicleCard from "./VehicleCard";

interface VehicleGridProps {
  vehicles: Vehicle[];
  viewMode: "grid" | "list";
  isDarkMode: boolean;
  compareList: string[];
  toggleCompare: (vehicleId: string) => void;
}

const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  viewMode,
  isDarkMode,
  compareList,
  toggleCompare,
}) => {
  return (
    <div
      className={`${
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-6"
      } mb-12`}
    >
      {vehicles.map((vehicle) => (
        <div key={vehicle._id}>
          <VehicleCard
            vehicle={vehicle}
            isDarkMode={isDarkMode}
            viewMode={viewMode}
            onToggleCompare={toggleCompare}
            isInCompareList={compareList.includes(vehicle._id)}
          />
        </div>
      ))}
    </div>
  );
};

export default VehicleGrid;