// src/components/features/vehicles/common/FavoritesList.tsx
"use client";

import { useState } from "react";
import { Vehicle } from "@/types/types";
import VehicleCard from "./VehicleCard";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

interface FavoritesListProps {
  initialVehicles: Vehicle[];
}

export default function FavoritesList({ initialVehicles }: FavoritesListProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(
    new Set(initialVehicles.map((v) => v._id))
  );
  const { resolvedTheme } = useTheme();

  const handleFavoriteToggle = (vehicleId: string, isNowFavorited: boolean) => {
    setFavoritedIds((prev) => {
      const newIds = new Set(prev);
      if (isNowFavorited) {
        newIds.add(vehicleId);
      } else {
        newIds.delete(vehicleId);
      }
      return newIds;
    });

    if (!isNowFavorited) {
      setTimeout(() => {
        setVehicles((prevVehicles) =>
          prevVehicles.filter((v) => v._id !== vehicleId)
        );
      }, 300);
    }
  };
  
  const [compareList, setCompareList] = useState<string[]>([]);
  const toggleCompare = (vehicleId: string) => {
      setCompareList((prev) =>
      prev.includes(vehicleId)
          ? prev.filter((id) => id !== vehicleId)
          : [...prev, vehicleId]
      );
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Tu lista de favoritos está vacía.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr mb-12"
    >
      <AnimatePresence>
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle._id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: {duration: 0.2} }}
            transition={{ duration: 0.3 }}
          >
            <VehicleCard
              vehicle={vehicle}
              isDarkMode={resolvedTheme === "dark"}
              viewMode="grid"
              onToggleCompare={toggleCompare}
              isInCompareList={compareList.includes(vehicle._id)}
              isFavorited={favoritedIds.has(vehicle._id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}