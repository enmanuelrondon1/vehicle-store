// src/components/features/vehicles/common/VehicleGrid.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
// CAMBIO: Ya no necesitamos 'Variants' de framer-motion aquí
import { motion, AnimatePresence } from "framer-motion";
import { Vehicle } from "@/types/types";
import VehicleCard from "./VehicleCard";

// CAMBIO: Importamos nuestros componentes de animación reutilizables
import { AnimatedContainer, AnimatedItem } from "@/components/shared/animation/AnimatedContainer";

interface VehicleGridProps {
  vehicles: Vehicle[];
  viewMode: "grid" | "list";
  compareList: string[];
  toggleCompare: (vehicleId: string) => void;
}

// CAMBIO: Eliminamos las variantes de aquí, porque ahora viven en AnimatedContainer

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

  return (
    // CAMBIO: Usamos AnimatedContainer en lugar de motion.div
    <AnimatedContainer
      // La 'key' sigue siendo crucial aquí para reiniciar la animación al filtrar/paginar
      key={
        vehicles.length > 0
          ? `${vehicles[0]._id}-${vehicles.length}`
          : "empty-grid"
      }
      className={`
        ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
            : "space-y-6"
        }
      `}
    >
      <AnimatePresence mode="popLayout">
        {vehicles.map((vehicle) => (
          // CAMBIO: Usamos AnimatedItem en lugar de motion.div
          <AnimatedItem key={vehicle._id}>
            <VehicleCard
              vehicle={vehicle}
              onToggleCompare={toggleCompare}
              isInCompareList={compareList.includes(vehicle._id)}
              isFavorited={favoritedVehicles.has(vehicle._id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </AnimatedItem>
        ))}
      </AnimatePresence>
    </AnimatedContainer>
  );
};

export default VehicleGrid;