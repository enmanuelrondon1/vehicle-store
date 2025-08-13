//src/components/sections/VehicleList/NoResults.tsx
"use client";

import type React from "react";
import { RefreshCw } from "lucide-react";

interface NoResultsProps {
  vehicles: number;
  clearAllFilters: () => void;
  handleRetry: () => void;
  isDarkMode: boolean;
  isLoading?: boolean;
}

const NoResults: React.FC<NoResultsProps> = ({
  vehicles,
  clearAllFilters,
  handleRetry,
  isDarkMode,
  isLoading = false,
}) => {
  return (
    <div className="text-center py-20">
      <div className="text-8xl mb-6 animate-bounce">🔍</div>
      <h2
        className={`text-3xl font-bold mb-4 ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        No se encontraron vehículos
      </h2>
      <p
        className={`text-lg mb-8 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {vehicles === 0
          ? "No hay vehículos disponibles en la base de datos."
          : "Intenta ajustar tus filtros de búsqueda."}
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={clearAllFilters}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Limpiar Filtros
        </button>
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Actualizar
        </button>
        <button
          onClick={() => {
            console.log("🔍 Debug Info:");
            console.log("Total vehicles:", vehicles);
          }}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          🔍 Debug
        </button>
      </div>
    </div>
  );
};

export default NoResults;