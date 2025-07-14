//src/components/sections/VehicleList/VehicleListHeader.tsx
"use client";

import type React from "react";

interface VehicleListHeaderProps {
  isDarkMode: boolean;
}

const VehicleListHeader: React.FC<VehicleListHeaderProps> = ({ isDarkMode }) => {
  return (
    <div className="text-center mb-8">
      <h1
        className={`text-5xl md:text-6xl font-bold mb-4 ${
          isDarkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Encuentra tu Vehículo Perfecto
        </span>
      </h1>
      <p
        className={`text-xl ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        } mb-6`}
      >
        Búsqueda avanzada con filtros inteligentes y comparación de vehículos
      </p>
    </div>
  );
};

export default VehicleListHeader;