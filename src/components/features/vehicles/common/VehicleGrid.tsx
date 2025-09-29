//src/components/sections/VehicleList/VehicleGrid.tsx
"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ MEJORA: Importar framer-motion
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
    <motion.div
      layout // ✅ MEJORA: Anima el cambio de layout (grid vs list)
      className={`
        ${viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
          : "space-y-6"}
        mb-12
      `}
    >
      <AnimatePresence>
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle._id}
            layout // ✅ MEJORA: Anima la posición del elemento cuando la lista se reordena
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <VehicleCard
              vehicle={vehicle}
              isDarkMode={isDarkMode}
              viewMode={viewMode}
              onToggleCompare={toggleCompare}
              isInCompareList={compareList.includes(vehicle._id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default VehicleGrid;