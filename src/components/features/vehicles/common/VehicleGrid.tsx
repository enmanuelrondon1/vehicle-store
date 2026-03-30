// src/components/features/vehicles/common/VehicleGrid.tsx
// ✅ OPTIMIZADO: eliminado AnimatePresence y layout prop.
//    - AnimatePresence + layout en cada tarjeta causaba layout recalculations
//      en cada cambio de filtro (hasta 48 recalculations simultáneos).
//    - Reemplazado por CSS animate-fade-in con delay escalonado.
//    - containerVariants/itemVariants con motion.div → div con CSS.
//    - La única animación que queda es fade-in de entrada, que ocurre UNA vez.

"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
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

  const handleFavoriteToggle = useCallback((vehicleId: string, isNowFavorited: boolean) => {
    setFavoritedVehicles((prev) => {
      const next = new Set(prev);
      if (isNowFavorited) next.add(vehicleId);
      else next.delete(vehicleId);
      return next;
    });
  }, []);

  return (
    // ✅ Sin motion.div — el grid aparece con animate-fade-in CSS simple
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
          : "space-y-6"
      }
    >
      {vehicles.map((vehicle, index) => (
        // ✅ Sin motion.div ni layout prop — animate-fade-in con delay escalonado CSS
        // El delay está limitado a 400ms para que no haya esperas largas con muchas tarjetas
        <div
          key={vehicle._id}
          className="animate-fade-in"
          style={{
            animationDelay: `${Math.min(index * 40, 400)}ms`,
            animationFillMode: "both",
          }}
        >
          <VehicleCard
            vehicle={vehicle}
            onToggleCompare={toggleCompare}
            isInCompareList={compareList.includes(vehicle._id)}
            isFavorited={favoritedVehicles.has(vehicle._id)}
            onFavoriteToggle={handleFavoriteToggle}
            index={index}
          />
        </div>
      ))}
    </div>
  );
};

export default VehicleGrid;