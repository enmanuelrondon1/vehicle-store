// src/components/features/vehicles/list/ActiveFiltersDisplay.tsx
"use client";

import React, { useRef } from "react";
import type { FC } from "react";
import type { AdvancedFilters, FilterOptions } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Sparkles } from "lucide-react";
import FilterChip from "./filters/FilterChip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ActiveFiltersDisplayProps {
  filters: AdvancedFilters;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: AdvancedFilters | ((prev: AdvancedFilters) => AdvancedFilters)) => void;
  onClearFilters: () => void;
}

// Variantes de animación mejoradas para los chips
const chipVariants = {
  initial: { opacity: 0, scale: 0.8, y: -10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 10,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
};

// Variantes de animación para el contenedor
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.04, 0.62, 0.23, 0.98],
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const ActiveFiltersDisplay: FC<ActiveFiltersDisplayProps> = ({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
}) => {
  const ref = useRef(null);
  
  // Lógica para generar el array de chips activos
  const activeChips: { label: string; onRemove: () => void }[] = [];

  const removeFromArrayFilter = (key: keyof AdvancedFilters, value: string) => {
    onFiltersChange((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).filter((item: string) => item !== value),
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

  // Mapeo de filtros a chips
  if (filters.category !== "all") {
    const categoryLabel = filterOptions.categories.find(c => c.value === filters.category)?.label || filters.category;
    activeChips.push({
      label: `Categoría: ${categoryLabel}`,
      onRemove: () => resetStringFilter("category", "all"),
    });
  }

  filters.brands.forEach((brand: string) => {
    activeChips.push({ label: brand, onRemove: () => removeFromArrayFilter("brands", brand) });
  });

  filters.colors.forEach((color: string) => {
    activeChips.push({ label: color, onRemove: () => removeFromArrayFilter("colors", color) });
  });

  // CORREGIDO: Tratamos location como un array y lo iteramos
  filters.location.forEach((loc: string) => {
    activeChips.push({ label: loc, onRemove: () => removeFromArrayFilter("location", loc) });
  });

  if (filters.fuelType.length > 0) {
    filters.fuelType.forEach(fuel => {
      const fuelLabel = filterOptions.fuelTypes.find(f => f.value === fuel)?.label || fuel;
      activeChips.push({
        label: `Combustible: ${fuelLabel}`,
        onRemove: () => removeFromArrayFilter("fuelType", fuel),
      });
    });
  }

  if (filters.transmission.length > 0) {
    filters.transmission.forEach(trans => {
      const transLabel = filterOptions.transmissions.find(t => t.value === trans)?.label || trans;
      activeChips.push({
        label: `Transmisión: ${transLabel}`,
        onRemove: () => removeFromArrayFilter("transmission", trans),
      });
    });
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
    activeChips.push({
      label: `Precio: $${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`,
      onRemove: () => resetRangeFilter("priceRange", [0, 1000000]),
    });
  }

  if (filters.yearRange[0] > 2000 || filters.yearRange[1] < 2025) {
    activeChips.push({
      label: `Año: ${filters.yearRange[0]} - ${filters.yearRange[1]}`,
      onRemove: () => resetRangeFilter("yearRange", [2000, 2025]),
    });
  }

  if (filters.hasWarranty) {
    activeChips.push({ label: "Con garantía", onRemove: () => resetBooleanFilter("hasWarranty") });
  }

  // CORREGIDO: Eliminamos la referencia a isNew que no existe en el tipo
  // Si necesitas esta funcionalidad, deberás añadir la propiedad isNew al tipo AdvancedFilters

  // Si no hay filtros activos, no renderizamos nada
  if (activeChips.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div className="card-glass rounded-xl shadow-hard border border-border/50 overflow-hidden">
        {/* Efecto de brillo superior */}
        <div
          className="h-1 w-full"
          style={{ background: "var(--gradient-accent)" }}
        />
        
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            {/* Título con icono y efecto de brillo */}
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "var(--primary-10)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-5 h-5" style={{ color: "var(--primary)" }} />
              </motion.div>
              
              <h3 className="text-lg font-semibold font-heading">Filtros Activos</h3>
              
              {/* Contador con efecto de brillo */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Badge 
                  className="text-xs font-bold px-2 py-1" 
                  style={{ 
                    background: "var(--gradient-accent)",
                    color: "var(--accent-foreground)"
                  }}
                >
                  {activeChips.length}
                </Badge>
                
                {/* Efecto de pulso en el contador */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--accent-20)" }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
            
            {/* Botón de limpiar mejorado */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 font-medium"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <X className="w-4 h-4" />
                </motion.div>
                <span className="hidden sm:inline">Limpiar todo</span>
                <span className="sm:hidden">Limpiar</span>
              </Button>
            </motion.div>
          </div>
          
          {/* Contenedor de chips con animación mejorada */}
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {activeChips.map((chip, index: number) => (
                <motion.div
                  key={chip.label}
                  layout
                  variants={chipVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ 
                    duration: 0.2, 
                    ease: "easeInOut",
                    delay: index * 0.05
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FilterChip label={chip.label} onRemove={chip.onRemove} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Indicador de mejora con efecto de brillo */}
          <motion.div
            className="flex items-center gap-2 mt-4 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + activeChips.length * 0.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-3 h-3" style={{ color: "var(--accent)" }} />
            </motion.div>
            <span>Los filtros se aplican automáticamente</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActiveFiltersDisplay;