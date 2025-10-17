// src/components/sections/VehicleDetail/components/SimilarVehicles.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, DollarSign, Gauge } from "lucide-react";
import type { VehicleDataFrontend } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";

// Un componente de tarjeta simple para mostrar cada vehículo
const VehicleCard = ({ vehicle }: { vehicle: VehicleDataFrontend }) => {
  return (
    <Link href={`/vehicle/${vehicle._id}`} className="block group">
      <div className="overflow-hidden rounded-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-card/50 border border-border backdrop-blur-sm">
        <div className="relative w-full aspect-video">
          <Image
            src={vehicle.images[0] || "/placeholder.svg"}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold truncate text-foreground">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-sm text-muted-foreground">{vehicle.year}</p>
          <div className="mt-4 flex-grow space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-foreground">
                ${vehicle.price.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-500" />
              <span className="text-foreground">
                {vehicle.mileage.toLocaleString()} km
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-end">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
              Ver más{" "}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Componente para el esqueleto de carga
const SkeletonCard = () => (
  <div className="rounded-lg p-4 bg-card">
    <Skeleton className="w-full aspect-video rounded-md mb-4" />
    <Skeleton className="h-5 w-3/4 rounded-md mb-2" />
    <Skeleton className="h-4 w-1/4 rounded-md mb-4" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
    </div>
  </div>
);

// El componente principal que muestra la sección de vehículos similares
const SimilarVehiclesComponent: React.FC<{
  vehicles: VehicleDataFrontend[];
  isLoading: boolean;
}> = ({ vehicles, isLoading }) => {
  // Si no está cargando y no hay vehículos, no renderizar nada.
  if (!isLoading && vehicles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 py-8 bg-card/50 rounded-xl p-6 border border-border">
      <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
        Vehículos Similares
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
      </div>
    </div>
  );
};

export const SimilarVehicles = React.memo(SimilarVehiclesComponent);