// src/components/features/vehicles/common/VehicleGrid.tsx
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
  const [favoritedVehicles, setFavoritedVehicles] = useState<Set<string>>(
    new Set()
  );

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
      if (isNowFavorited) {
        newFavorites.add(vehicleId);
      } else {
        newFavorites.delete(vehicleId);
      }
      return newFavorites;
    });
  };

  // Variantes de animación para el contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  // Variantes de animación para los elementos
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`
        ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
            : "space-y-6"
        }
      `}
    >
      <AnimatePresence mode="popLayout">
        {vehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle._id}
            variants={itemVariants}
            layout
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.05,
              ease: [0.04, 0.62, 0.23, 0.98]
            }}
          >
            <VehicleCard
              vehicle={vehicle}
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