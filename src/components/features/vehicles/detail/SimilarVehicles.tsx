// src/components/sections/VehicleDetail/components/SimilarVehicles.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, DollarSign, Gauge } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import type { VehicleDataFrontend } from "@/types/types";

// Un componente de tarjeta simple para mostrar cada vehículo
const VehicleCard = ({ vehicle, isDarkMode }: { vehicle: VehicleDataFrontend, isDarkMode: boolean }) => {
  return (
    <Link href={`/vehicle/${vehicle._id}`} className="block group">
      <div className={`overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
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
          <h3 className={`text-lg font-bold truncate ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{vehicle.year}</p>
          <div className="mt-4 flex-grow space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span>${vehicle.price.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-500" />
              <span>{vehicle.mileage.toLocaleString()} km</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
             <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
                Ver más <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
             </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Componente para el esqueleto de carga
const SkeletonCard = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className={`rounded-lg p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
    <div className={`w-full aspect-video rounded-md mb-4 animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}></div>
    <div className={`h-5 w-3/4 rounded-md mb-2 animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}></div>
    <div className={`h-4 w-1/4 rounded-md mb-4 animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}></div>
    <div className="space-y-2">
      <div className={`h-4 w-1/2 rounded-md animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}></div>
      <div className={`h-4 w-1/2 rounded-md animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}></div>
    </div>
  </div>
);

// El componente principal que muestra la sección de vehículos similares
export const SimilarVehicles = ({ vehicles, isLoading }: { vehicles: VehicleDataFrontend[], isLoading: boolean }) => {
  const { isDarkMode } = useDarkMode();

  // Si no está cargando y no hay vehículos, no renderizar nada.
  if (!isLoading && vehicles.length === 0) {
    return null;
  }

  return (
    <div className={`mt-12 py-8 ${isDarkMode ? "bg-gray-800/50" : "bg-white/50"} rounded-xl p-6 border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
      <h2 className={`text-3xl font-bold mb-6 text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        Vehículos Similares
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} isDarkMode={isDarkMode} />
            ))
          : vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} isDarkMode={isDarkMode} />
            ))}
      </div>
    </div>
  );
};
