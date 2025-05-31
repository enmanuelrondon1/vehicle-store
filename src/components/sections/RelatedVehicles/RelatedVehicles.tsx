// src/components/sections/RelatedVehicles/RelatedVehicles.tsx
"use client";

import React, { useMemo } from "react";
import VehicleCard from "../Catalog/VehicleCard";
import { Vehicle } from "../Catalog/CatalogPages";

interface RelatedVehiclesProps {
  currentVehicle: Vehicle;
  vehicles: Vehicle[] | undefined;
  onToggleFavorite: (id: string) => void;
  onVehicleClick: (id: string) => void;
  favorites: Set<string>;
}

const RelatedVehicles: React.FC<RelatedVehiclesProps> = ({
  currentVehicle,
  vehicles,
  onToggleFavorite,
  onVehicleClick,
  favorites,
}) => {
  const relatedVehicles = useMemo(() => {
    return (vehicles ?? []).filter(
      (vehicle) =>
        vehicle.id !== currentVehicle.id &&
        (vehicle.brand === currentVehicle.brand ||
          vehicle.category.es === currentVehicle.category.es)
    ).slice(0, 4);
  }, [currentVehicle, vehicles]);

  if (relatedVehicles.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Vehículos Relacionados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onToggleFavorite={onToggleFavorite}
            onVehicleClick={onVehicleClick}
            isFavorite={favorites.has(vehicle.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedVehicles;