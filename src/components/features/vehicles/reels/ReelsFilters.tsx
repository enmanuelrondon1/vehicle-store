// src/components/features/vehicles/reels/ReelsFilters.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  VehicleCategory,
  VehicleCondition,
  VEHICLE_CATEGORIES_LABELS,
  VEHICLE_CONDITIONS_LABELS,
} from "@/types/shared";

export interface ReelsFiltersState {
  category: VehicleCategory | "all";
  condition: VehicleCondition | "all";
  priceRange: [number, number];
  yearRange: [number, number];
  featured: boolean;
  random: boolean;
}

interface ReelsFiltersProps {
  filters: ReelsFiltersState;
  onFiltersChange: (filters: ReelsFiltersState) => void;
  onClose?: () => void;
}

export const ReelsFilters: React.FC<ReelsFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<ReelsFiltersState>(filters);

  const categories = [
    { value: "all", label: "Todos", icon: "🎯" },
    { value: VehicleCategory.MOTORCYCLE, label: VEHICLE_CATEGORIES_LABELS[VehicleCategory.MOTORCYCLE], icon: "🏍️" },
    { value: VehicleCategory.CAR, label: VEHICLE_CATEGORIES_LABELS[VehicleCategory.CAR], icon: "🚗" },
    { value: VehicleCategory.SUV, label: VEHICLE_CATEGORIES_LABELS[VehicleCategory.SUV], icon: "🚙" },
    { value: VehicleCategory.TRUCK, label: VEHICLE_CATEGORIES_LABELS[VehicleCategory.TRUCK], icon: "🚚" },
    { value: VehicleCategory.VAN, label: VEHICLE_CATEGORIES_LABELS[VehicleCategory.VAN], icon: "🚐" },
    { value: VehicleCategory.BUS, label: VEHICLE_CATEGORIES_LABELS[VehicleCategory.BUS], icon: "🚌" },
  ];

  const conditions = [
    { value: "all", label: "Todas las condiciones" },
    { value: VehicleCondition.NEW, label: VEHICLE_CONDITIONS_LABELS[VehicleCondition.NEW] },
    { value: VehicleCondition.EXCELLENT, label: VEHICLE_CONDITIONS_LABELS[VehicleCondition.EXCELLENT] },
    { value: VehicleCondition.GOOD, label: VEHICLE_CONDITIONS_LABELS[VehicleCondition.GOOD] },
  ];

  const priceRanges = [
    { label: "Todos los precios", min: 0, max: 1000000 },
    { label: "Hasta $5,000", min: 0, max: 5000 },
    { label: "$5,000 - $10,000", min: 5000, max: 10000 },
    { label: "$10,000 - $20,000", min: 10000, max: 20000 },
    { label: "$20,000 - $50,000", min: 20000, max: 50000 },
    { label: "Más de $50,000", min: 50000, max: 1000000 },
  ];

  const yearRanges = [
    { label: "Todos los años", min: 1900, max: 2025 },
    { label: "2020 - 2025", min: 2020, max: 2025 },
    { label: "2015 - 2019", min: 2015, max: 2019 },
    { label: "2010 - 2014", min: 2010, max: 2014 },
    { label: "2000 - 2009", min: 2000, max: 2009 },
    { label: "Antes de 2000", min: 1900, max: 1999 },
  ];

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const handleReset = () => {
    const defaultFilters: ReelsFiltersState = {
      category: "all",
      condition: "all",
      priceRange: [0, 1000000],
      yearRange: [1900, 2025],
      featured: false,
      random: true,
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const activeFiltersCount = [
    localFilters.category !== "all",
    localFilters.condition !== "all",
    localFilters.priceRange[0] !== 0 || localFilters.priceRange[1] !== 1000000,
    localFilters.yearRange[0] !== 1900 || localFilters.yearRange[1] !== 2025,
    localFilters.featured,
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-full md:w-96 bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Filtros</h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Orden Aleatorio Toggle */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Modo de Visualización
          </h3>
          <div className="flex gap-2">
            <Button
              variant={localFilters.random ? "default" : "outline"}
              className="flex-1"
              onClick={() => setLocalFilters(prev => ({ ...prev, random: true }))}
            >
              🎲 Aleatorio
            </Button>
            <Button
              variant={!localFilters.random ? "default" : "outline"}
              className="flex-1"
              onClick={() => setLocalFilters(prev => ({ ...prev, random: false }))}
            >
              📅 Recientes
            </Button>
          </div>
        </div>

        {/* Solo Destacados */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Especiales
          </h3>
          <Button
            variant={localFilters.featured ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setLocalFilters(prev => ({ ...prev, featured: !prev.featured }))}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {localFilters.featured ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Solo Destacados
              </>
            ) : (
              "Mostrar Solo Destacados"
            )}
          </Button>
        </div>

        {/* Categoría */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Categoría
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={localFilters.category === cat.value ? "default" : "outline"}
                className="justify-start"
                onClick={() => setLocalFilters(prev => ({ ...prev, category: cat.value as any }))}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Condición */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Condición
          </h3>
          <div className="space-y-2">
            {conditions.map((cond) => (
              <Button
                key={cond.value}
                variant={localFilters.condition === cond.value ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setLocalFilters(prev => ({ ...prev, condition: cond.value as any }))}
              >
                {localFilters.condition === cond.value && (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {cond.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Rango de Precio */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Rango de Precio
          </h3>
          <div className="space-y-2">
            {priceRanges.map((range) => {
              const isSelected = 
                localFilters.priceRange[0] === range.min && 
                localFilters.priceRange[1] === range.max;
              
              return (
                <Button
                  key={range.label}
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setLocalFilters(prev => ({ 
                    ...prev, 
                    priceRange: [range.min, range.max] 
                  }))}
                >
                  {isSelected && <Check className="w-4 h-4 mr-2" />}
                  {range.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Rango de Año */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Año del Vehículo
          </h3>
          <div className="space-y-2">
            {yearRanges.map((range) => {
              const isSelected = 
                localFilters.yearRange[0] === range.min && 
                localFilters.yearRange[1] === range.max;
              
              return (
                <Button
                  key={range.label}
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setLocalFilters(prev => ({ 
                    ...prev, 
                    yearRange: [range.min, range.max] 
                  }))}
                >
                  {isSelected && <Check className="w-4 h-4 mr-2" />}
                  {range.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 space-y-2">
        <Button
          className="w-full"
          size="lg"
          onClick={handleApply}
        >
          Aplicar Filtros
          {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
        </Button>
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleReset}
          >
            Limpiar Filtros
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ReelsFilters;