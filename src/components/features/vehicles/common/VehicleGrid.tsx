// src/components/features/vehicles/common/VehicleGrid.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Vehicle } from "@/types/types";
import VehicleCard from "./VehicleCard";

interface VehicleGridProps {
  vehicles: Vehicle[];
  viewMode: "grid" | "list";
  compareList: string[];
  toggleCompare: (vehicleId: string) => void;
}

// ✅ VARIANTES DE ANIMACIÓN: Para el efecto "stagger" (escalonado)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // ✅ Cada card aparecerá 0.1s después del anterior
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  viewMode,
  compareList,
  toggleCompare,
}) => {
  const { data: session } = useSession();
  const [favoritedVehicles, setFavoritedVehicles] = useState<Set<string>>(new Set());

  useEffect(() => {
    // ✅ MEJORA: No hacer fetch si no hay sesión
    if (!session) {
      setFavoritedVehicles(new Set()); // Aseguramos que esté vacío si no hay sesión
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/user/favorites");
        if (response.ok) {
          const data = await response.json();
          setFavoritedVehicles(new Set(data.favorites));
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [session]);

  const handleFavoriteToggle = (
    vehicleId: string,
    isNowFavorited: boolean
  ) => {
    setFavoritedVehicles((prev) => {
      const newFavorites = new Set(prev);
      if (isNowFavorited) {
        newFavorites.add(vehicleId);
      } else {
        newFavorites.delete(vehicleId);
      }
      return newFavorites;
    });
  };

  return (
    // ✅ CONTENEDOR CON ANIMACIÓN STAGGER
    <motion.div
      layout
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`
        ${viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
          : "space-y-6"}
      `}
    >
      <AnimatePresence mode="popLayout">
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle._id}
            layout
            variants={itemVariants} // ✅ Aplicamos las variantes del item
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          >
            <VehicleCard
              vehicle={vehicle}
              // viewMode={viewMode}
              onToggleCompare={toggleCompare}
              isInCompareList={compareList.includes(vehicle._id)}
              isFavorited={favoritedVehicles.has(vehicle._id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default VehicleGrid;