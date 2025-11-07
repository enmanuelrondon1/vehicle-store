// src/components/shared/feedback/NoResults.tsx
"use client";

import type React from "react";
import { RefreshCw, SearchX, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // MEJORA: Para consistencia

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
    // MEJORA: Usamos el componente Card para consistencia total
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex justify-center"
    >
      <Card className="max-w-md w-full shadow-lg border-border card-hover">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex justify-center"
          >
            <SearchX className="w-16 h-16 text-muted-foreground" />
          </motion.div>
          <CardTitle className="text-2xl font-heading">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-muted-foreground"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-3"
            id="no-results-actions" // MEJORA: ID para accesibilidad
          >
            {hasVehiclesInDB && (
              <Button
                onClick={clearAllFilters}
                className="gap-2"
                aria-describedby="no-results-actions"
              >
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
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NoResults;