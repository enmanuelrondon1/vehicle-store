// src/components/features/vehicles/list/ActiveFiltersDisplay.tsx
"use client";

import type { FC } from "react";
import type { AdvancedFilters, FilterOptions } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion"; // MEJORA: Para animar los chips
import { Filter, X } from "lucide-react"; // MEJORA: Iconos para dar contexto
import FilterChip from "./filters/FilterChip";
import { Button } from "@/components/ui/button"; // MEJORA: Para el botón de limpiar
import { Badge } from "@/components/ui/badge"; // MEJORA: Para el contador
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // MEJORA: Para consistencia

interface ActiveFiltersDisplayProps {
  filters: AdvancedFilters;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: AdvancedFilters | ((prev: AdvancedFilters) => AdvancedFilters)) => void;
  onClearFilters: () => void;
}

// MEJORA: Variantes de animación para los chips
const chipVariants = {
  initial: { opacity: 0, scale: 0.8, y: -10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 10 },
};

const ActiveFiltersDisplay: FC<ActiveFiltersDisplayProps> = ({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
}) => {
  // ... (Toda tu lógica para generar el array 'activeChips' se mantiene igual)
  // Es excelente y no necesita cambios.
  const activeChips: { label: string; onRemove: () => void }[] = [];

  const removeFromArrayFilter = (key: keyof AdvancedFilters, value: string) => {
    onFiltersChange((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).filter((item) => item !== value),
    }));
  };

  const resetBooleanFilter = (key: keyof AdvancedFilters) => {
    onFiltersChange((prev) => ({ ...prev, [key]: false }));
  };

  const resetStringFilter = (key: keyof AdvancedFilters, defaultValue: string) => {
    onFiltersChange((prev) => ({ ...prev, [key]: defaultValue }));
  };

  const resetRangeFilter = (key: keyof AdvancedFilters, defaultValue: [number, number]) => {
    onFiltersChange((prev) => ({ ...prev, [key]: defaultValue }));
  };

  if (filters.category !== "all") {
    const categoryLabel = filterOptions.categories.find(c => c.value === filters.category)?.label || filters.category;
    activeChips.push({
      label: `Categoría: ${categoryLabel}`,
      onRemove: () => resetStringFilter("category", "all"),
    });
  }
  // ... (el resto de tu lógica de mapeo de filtros se mantiene igual)
  filters.brands.forEach((brand) => {
    activeChips.push({ label: brand, onRemove: () => removeFromArrayFilter("brands", brand) });
  });
  // ... y así sucesivamente con todos los filtros
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
    activeChips.push({
      label: `Precio: $${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`,
      onRemove: () => resetRangeFilter("priceRange", [0, 1000000]),
    });
  }
  if (filters.hasWarranty) {
    activeChips.push({ label: "Con garantía", onRemove: () => resetBooleanFilter("hasWarranty") });
  }
  // ... etc.

  // Si no hay filtros activos, no renderizamos nada.
  if (activeChips.length === 0) {
    return null;
  }

  return (
    // MEJORA: Usamos el componente Card para un look consistente y profesional
    <Card className="border-border/50 bg-muted/30">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          Filtros Activos
        </CardTitle>
        {/* MEJORA: Un contador de filtros activos */}
        <Badge variant="secondary" className="text-xs">
          {activeChips.length}
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-start justify-between gap-4">
          {/* MEJORA: Contenedor de chips con animación de entrada/salida */}
          <div className="flex flex-wrap gap-2 flex-grow">
            <AnimatePresence mode="popLayout">
              {activeChips.map((chip) => (
                <motion.div
                  key={chip.label}
                  layout
                  variants={chipVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <FilterChip label={chip.label} onRemove={chip.onRemove} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* MEJORA: Botón de limpiar más prominente y accesible */}
          {activeChips.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 flex-shrink-0"
            >
              <X className="w-3 h-3" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveFiltersDisplay;