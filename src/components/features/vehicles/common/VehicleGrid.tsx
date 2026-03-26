// src/components/features/vehicles/common/VehicleGrid.tsx
// ✅ OPTIMIZACIONES:
// 1. staggerChildren 0.1 → 0.04 y eliminado delayChildren (con 12 items = 1.2s delay innecesario)
// 2. itemVariants: eliminado spring con y:20 → solo opacity (0 layout recalculations)
// 3. Doble animación eliminada: motion.div padre + motion.div hijo animaban lo mismo
// 4. index pasado a VehicleCard para priority en primeras 3 imágenes
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Vehicle } from "@/types/types";
import VehicleCard from "./VehicleCard";

interface VehicleGridProps {
  vehicles: Vehicle[];
  viewMode: "grid" | "list";
  compareList: string[];
  toggleCompare: (vehicleId: string) => void;
}

const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  viewMode,
  compareList,
  toggleCompare,
}) => {
  const { data: session } = useSession();
  const [favoritedVehicles, setFavoritedVehicles] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session) {
      setFavoritedVehicles(new Set());
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

  const handleFavoriteToggle = (vehicleId: string, isNowFavorited: boolean) => {
    setFavoritedVehicles((prev) => {
      const newFavorites = new Set(prev);
      if (isNowFavorited) newFavorites.add(vehicleId);
      else newFavorites.delete(vehicleId);
      return newFavorites;
    });
  };

  // ✅ Animación simplificada: solo opacity, stagger mínimo, sin delayChildren
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        ease: "easeOut",
      },
    },
  };

  // ✅ Solo opacity — elimina layout recalculations que causaba y:20 → y:0
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
          : "space-y-6"
      }
    >
      <AnimatePresence mode="popLayout">
        {vehicles.map((vehicle, index) => (
          // ✅ Un solo motion.div por item — antes había doble (padre + hijo animaban igual)
          <motion.div
            key={vehicle._id}
            variants={itemVariants}
            layout
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          >
            <VehicleCard
              vehicle={vehicle}
              onToggleCompare={toggleCompare}
              isInCompareList={compareList.includes(vehicle._id)}
              isFavorited={favoritedVehicles.has(vehicle._id)}
              onFavoriteToggle={handleFavoriteToggle}
              index={index} // ✅ Para priority en primeras 3 imágenes
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default VehicleGrid;