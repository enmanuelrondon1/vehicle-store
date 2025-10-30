// src/components/shared/feedback/NoResults.tsx
"use client";

import type React from "react";
import { RefreshCw, SearchX, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"; // ✅ Importamos framer-motion

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
  return (
    // ✅ CONTENEDOR: Ahora es una tarjeta integrada en el diseño
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center py-16 px-8"
    >
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl shadow-md p-8 max-w-md w-full">
        {/* ✅ ICONO: Consistente con el resto de la app */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex justify-center mb-6"
        >
          <SearchX className="w-24 h-24 text-muted-foreground" />
        </motion.div>

        {/* ✅ TÍTULO Y TEXTO: Con animación de entrada escalonada */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-3xl font-heading font-bold mb-4 text-foreground"
        >
          No se encontraron vehículos
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="text-lg mb-8 text-muted-foreground"
        >
          {vehicles === 0
            ? "No hay vehículos disponibles en la base de datos en este momento."
            : "Intenta ajustar tus filtros de búsqueda para encontrar lo que buscas."}
        </motion.p>

        {/* ✅ BOTONES: Con iconos y animación de entrada */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button onClick={clearAllFilters} className="gap-2">
            <FilterX className="w-4 h-4" />
            Limpiar Filtros
          </Button>
          <Button variant="secondary" onClick={handleRetry} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>

          {/* ✅ BOTÓN DE DEBUG: Solo visible en desarrollo */}
          {process.env.NODE_ENV === 'development' && (
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
      </div>
    </motion.div>
  );
};

export default NoResults;