// src/components/shared/feedback/NoResults.tsx
"use client";

import type React from "react";
import { RefreshCw, SearchX, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NoResultsProps {
  vehicles: number;
  clearAllFilters: () => void;
  handleRetry: () => void;
  isLoading?: boolean;
}

const NoResults: React.FC<NoResultsProps> = ({
  vehicles,
  clearAllFilters,
  handleRetry,
  isLoading = false,
}) => {
  const hasVehiclesInDB = vehicles > 0;
  const title = hasVehiclesInDB ? "Sin resultados para tu búsqueda" : "No hay vehículos publicados";
  const description = hasVehiclesInDB
    ? "Intenta ajustar o limpiar tus filtros para encontrar lo que buscas."
    : "Parece que no hay vehículos disponibles todavía. ¡Vuelve a comprobarlo más tarde!";

  return (
    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="max-w-md w-full shadow-lg border-border card-hover">
        <CardHeader className="text-center">
          <div className="flex justify-center animate-in zoom-in duration-300 delay-100">
            <SearchX className="w-16 h-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-heading">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground animate-in fade-in duration-300 delay-200">
            {description}
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center gap-3 animate-in fade-in duration-300 delay-300"
            id="no-results-actions"
          >
            {hasVehiclesInDB && (
              <Button onClick={clearAllFilters} className="gap-2" aria-describedby="no-results-actions">
                <FilterX className="w-4 h-4" />
                Limpiar Filtros
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={handleRetry}
              className="gap-2"
              aria-describedby="no-results-actions"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            {process.env.NODE_ENV === "development" && (
              <Button
                variant="outline"
                onClick={() => {
                  console.log("🔍 Debug Info:");
                  console.log("Total vehicles:", vehicles);
                }}
              >
                🔍 Debug
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoResults;