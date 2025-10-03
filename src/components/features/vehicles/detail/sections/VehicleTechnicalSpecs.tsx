// src/components/features/vehicles/detail/sections/VehicleTechnicalSpecs.tsx
"use client";

import type React from "react";
import type { VehicleDataFrontend } from "@/types/types";

interface VehicleTechnicalSpecsProps {
  vehicle: VehicleDataFrontend;
  isDarkMode: boolean;
  translatedCondition: string;
  translatedTransmission: string;
  translatedFuelType: string;
  translatedWarranty: string;
}

const SpecItem = ({
  isDarkMode,
  label,
  value,
}: {
  isDarkMode: boolean;
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
    <span
      className={`font-medium ${
        isDarkMode ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label}
    </span>
    <span className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      {value}
    </span>
  </div>
);

export const VehicleTechnicalSpecs: React.FC<VehicleTechnicalSpecsProps> = ({
  vehicle,
  isDarkMode,
  translatedCondition,
  translatedTransmission,
  translatedFuelType,
  translatedWarranty,
}) => {
  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat("es-ES").format(mileage);

  return (
    <div
      className={`p-6 rounded-xl border ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/50 border-gray-200"
      } backdrop-blur-sm`}
    >
      <h3
        className={`text-2xl font-bold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Especificaciones Técnicas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <SpecItem
            isDarkMode={isDarkMode}
            label="Marca"
            value={vehicle.brand}
          />
          <SpecItem
            isDarkMode={isDarkMode}
            label="Modelo"
            value={vehicle.model}
          />
          <SpecItem isDarkMode={isDarkMode} label="Año" value={vehicle.year} />
          <SpecItem
            isDarkMode={isDarkMode}
            label="Condición"
            value={translatedCondition}
          />
          <SpecItem
            isDarkMode={isDarkMode}
            label="Color"
            value={vehicle.color}
          />
          <SpecItem
            isDarkMode={isDarkMode}
            label="Tracción"
            value={vehicle.driveType?.toUpperCase() || "N/A"}
          />
          <SpecItem
            isDarkMode={isDarkMode}
            label="Cilindraje"
            value={vehicle.displacement || "N/A"}
          />
        </div>
        <div className="space-y-4">
          <SpecItem
            isDarkMode={isDarkMode}
            label="Kilometraje"
            value={`${formatMileage(vehicle.mileage)} km`}
          />
          <SpecItem
            isDarkMode={isDarkMode}
            label="Transmisión"
            value={translatedTransmission}
          />
          <SpecItem
            isDarkMode={isDarkMode}
            label="Combustible"
            value={translatedFuelType}
          />
          {vehicle.engine && (
            <SpecItem
              isDarkMode={isDarkMode}
              label="Motor"
              value={vehicle.engine}
            />
          )}
          <SpecItem
            isDarkMode={isDarkMode}
            label="Garantía"
            value={translatedWarranty}
          />
        </div>
      </div>
    </div>
  );
};