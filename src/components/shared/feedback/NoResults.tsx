//src/components/sections/VehicleList/NoResults.tsx
"use client";

import type React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoResultsProps {
  vehicles: number;
  clearAllFilters: () => void;
  handleRetry: () => void;
  // isDarkMode: boolean; // ❌ REMOVED
  isLoading?: boolean;
}

const NoResults: React.FC<NoResultsProps> = ({
  vehicles,
  clearAllFilters,
  handleRetry,
  // isDarkMode, // ❌ REMOVED
  isLoading = false,
}) => {
  return (
    <div className="text-center py-20">
      <div className="text-8xl mb-6 animate-bounce">🔍</div>
      <h2 className="text-3xl font-bold mb-4 text-foreground">
        No se encontraron vehículos
      </h2>
      <p className="text-lg mb-8 text-muted-foreground">
        {vehicles === 0
          ? "No hay vehículos disponibles en la base de datos."
          : "Intenta ajustar tus filtros de búsqueda."}
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={clearAllFilters}>Limpiar Filtros</Button>
        <Button variant="secondary" onClick={handleRetry}>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            console.log("🔍 Debug Info:");
            console.log("Total vehicles:", vehicles);
          }}
        >
          🔍 Debug
        </Button>
      </div>
    </div>
  );
};

export default NoResults;