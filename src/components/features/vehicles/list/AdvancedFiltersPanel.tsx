// src/components/features/vehicles/list/AdvancedFiltersPanel.tsx
"use client";

import { useMemo, type FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Sparkles, Filter } from "lucide-react";
import type { AdvancedFilters, FilterOptions } from "@/types/types";
import CheckboxFilter from "./filters/CheckboxFilter";
import RangeSliderFilter from "./filters/RangeSliderFilter";
import { MultiSelectFilter } from "./filters/MultiSelectFilter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdvancedFiltersPanelProps {
  filters: AdvancedFilters;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
  showOnlyPublishedBrands: boolean;
  setShowOnlyPublishedBrands: (value: boolean) => void;
  showOnlyPublishedColors: boolean;
  setShowOnlyPublishedColors: (value: boolean) => void;
  showOnlyPublishedLocations: boolean;
  setShowOnlyPublishedLocations: (value: boolean) => void;
  totalVehicles: number;
}

const AdvancedFiltersPanel: FC<AdvancedFiltersPanelProps> = ({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
  showOnlyPublishedBrands,
  setShowOnlyPublishedBrands,
  showOnlyPublishedColors,
  setShowOnlyPublishedColors,
  showOnlyPublishedLocations,
  setShowOnlyPublishedLocations,
  totalVehicles,
}) => {
  const [maxYear, setMaxYear] = useState(new Date().getFullYear() + 1);

  useEffect(() => {
    setMaxYear(new Date().getFullYear() + 1);
  }, []);

  const updateFilter = <K extends keyof AdvancedFilters>(
    key: K,
    value: AdvancedFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <K extends keyof AdvancedFilters>(
    key: K,
    value: string,
    currentArray: string[]
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray as AdvancedFilters[K]);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.colors.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.condition.length > 0) count++;
    if (filters.fuelType.length > 0) count++;
    if (filters.transmission.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.hasWarranty) count++;
    if (filters.isFeatured) count++;
    if (filters.category && filters.category !== "all") count++;
    if (filters.driveType.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) count++;
    if (filters.yearRange[0] > 2000 || filters.yearRange[1] < 2025) count++;
    if (filters.mileageRange[0] > 0 || filters.mileageRange[1] < 500000)
      count++;
    return count;
  }, [filters]);

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full overflow-hidden"
    >
      <div className="card-glass rounded-xl shadow-hard border border-border/50 overflow-hidden">
        {/* Efecto de brillo superior */}
        <div
          className="h-1 w-full"
          style={{ background: "var(--gradient-accent)" }}
        />
        
        {/* Header mejorado */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-lg"
              style={{ backgroundColor: "var(--primary-10)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal className="w-5 h-5" style={{ color: "var(--primary)" }} />
            </motion.div>
            
            <h3 className="text-lg font-semibold font-heading">Filtros Avanzados</h3>
            
            {/* Contador con efecto de brillo */}
            {activeFiltersCount > 0 && (
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
                  {activeFiltersCount}
                </Badge>
                
                {/* Efecto de pulso en el contador */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--accent-20)" }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 gap-2"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.div>
                  <span className="hidden sm:inline">Limpiar</span>
                </Button>
              </motion.div>
            )}
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                aria-label="Cerrar filtros avanzados"
                className="rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Contenido de filtros */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Categoría */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Categoría</h4>
                {filters.category !== "all" && (
                  <Badge 
                    className="text-xs px-2 py-0.5" 
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "#ffffff"
                    }}
                  >
                    1 seleccionada
                  </Badge>
                )}
              </div>
              <MultiSelectFilter
                options={[
                  {
                    value: "all",
                    label: "Todas las categorías",
                    count: totalVehicles,
                  },
                  ...filterOptions.categories,
                ]}
                selected={filters.category === "all" ? [] : [filters.category]}
                onChange={(newSelection) => {
                  if (newSelection.length === 0) {
                    updateFilter("category", "all");
                  } else {
                    const singleSelection = newSelection[newSelection.length - 1];
                    updateFilter("category", singleSelection);
                  }
                }}
                placeholder="Seleccionar categoría..."
                singleSelect={true}
              />
            </div>

            {/* Precio */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Precio</h4>
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) && (
                  <Badge 
                    className="text-xs px-2 py-0.5" 
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "#ffffff"
                    }}
                  >
                    Activo
                  </Badge>
                )}
              </div>
              <RangeSliderFilter
                min={0}
                max={1000000}
                step={10000}
                value={filters.priceRange}
                onChange={(value) => updateFilter("priceRange", value)}
                formatValue={(val) => `$${val.toLocaleString()}`}
              />
            </div>

            {/* Año */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Año</h4>
                {(filters.yearRange[0] > 2000 || filters.yearRange[1] < 2025) && (
                  <Badge 
                    className="text-xs px-2 py-0.5" 
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "#ffffff"
                    }}
                  >
                    Activo
                  </Badge>
                )}
              </div>
              <RangeSliderFilter
                min={2000}
                max={maxYear}
                step={1}
                value={filters.yearRange}
                onChange={(value) =>
                  updateFilter("yearRange", value as [number, number])
                }
              />
            </div>

            {/* Kilometraje */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Kilometraje</h4>
                {(filters.mileageRange[0] > 0 || filters.mileageRange[1] < 500000) && (
                  <Badge 
                    className="text-xs px-2 py-0.5" 
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "#ffffff"
                    }}
                  >
                    Activo
                  </Badge>
                )}
              </div>
              <RangeSliderFilter
                min={0}
                max={500000}
                step={5000}
                value={filters.mileageRange}
                onChange={(value) =>
                  updateFilter("mileageRange", value as [number, number])
                }
              />
            </div>

            {/* Marcas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Marcas</h4>
                {filters.brands.length > 0 && (
                  <Badge 
                    className="text-xs px-2 py-0.5" 
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "#ffffff"
                    }}
                  >
                    {filters.brands.length} seleccionadas
                  </Badge>
                )}
              </div>
              <MultiSelectFilter
                options={filterOptions.brands}
                selected={filters.brands}
                onChange={(newSelection) => updateFilter("brands", newSelection)}
                placeholder="Seleccionar marcas..."
                showPublishedToggle={true}
                isPublishedOnly={showOnlyPublishedBrands}
                onPublishedOnlyChange={setShowOnlyPublishedBrands}
                publishedOnlyLabel="Mostrar solo marcas con vehículos publicados"
              />
            </div>

            {/* Colores */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Color</h4>
                {filters.colors.length > 0 && (
                  <Badge 
                    className="text-xs px-2 py-0.5" 
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "#ffffff"
                    }}
                  >
                    {filters.colors.length} seleccionados
                  </Badge>
                )}
              </div>
              <MultiSelectFilter
                options={filterOptions.colors}
                selected={filters.colors}
                onChange={(newSelection) => updateFilter("colors", newSelection)}
                placeholder="Seleccionar colores..."
                showPublishedToggle={true}
                isPublishedOnly={showOnlyPublishedColors}
                onPublishedOnlyChange={setShowOnlyPublishedColors}
                publishedOnlyLabel="Mostrar solo colores con vehículos publicados"
              />
            </div>

            {/* Condición */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Condición</h4>
                {filters.condition.length > 0 && (
                  <Badge 
                    className="text-xs px-2 py-0.5" 
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "#ffffff"
                    }}
                  >
                    {filters.condition.length} seleccionadas
                  </Badge>
                )}
              </div>
              <CheckboxFilter
                options={filterOptions.conditions}
                selected={filters.condition}
                onChange={(condition) =>
                  toggleArrayFilter("condition", condition, filters.condition)
                }
                maxHeight="max-h-full"
              />
            </div>

            {/* Combustible */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Combustible</h4>
                {filters.fuelType.length > 0 && (
                  <Badge 
                    className="text-xs px-2 py-0.5" 
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "#ffffff"
                    }}
                  >
                    {filters.fuelType.length} seleccionadas
                  </Badge>
                )}
              </div>
              <CheckboxFilter
                options={filterOptions.fuelTypes}
                selected={filters.fuelType}
                onChange={(fuel) =>
                  toggleArrayFilter("fuelType", fuel, filters.fuelType)
                }
                maxHeight="max-h-full"
              />
            </div>

            {/* Transmisión */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Transmisión</h4>
                {filters.transmission.length > 0 && (
                  <Badge 
                    className="text-xs px-2 py-0.5" 
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "#ffffff"
                    }}
                  >
                    {filters.transmission.length} seleccionadas
                  </Badge>
                )}
              </div>
              <CheckboxFilter
                options={filterOptions.transmissions}
                selected={filters.transmission}
                onChange={(transmission) =>
                  toggleArrayFilter(
                    "transmission",
                    transmission,
                    filters.transmission
                  )
                }
                maxHeight="max-h-full"
              />
            </div>

            {/* Ubicación */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Ubicación</h4>
                {filters.location.length > 0 && (
                  <Badge 
                    className="text-xs px-2 py-0.5" 
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "#ffffff"
                    }}
                  >
                    {filters.location.length} seleccionadas
                  </Badge>
                )}
              </div>
              <MultiSelectFilter
                options={filterOptions.locations}
                selected={filters.location}
                onChange={(newSelection) =>
                  updateFilter("location", newSelection)
                }
                placeholder="Seleccionar ubicaciones..."
                showPublishedToggle={true}
                isPublishedOnly={showOnlyPublishedLocations}
                onPublishedOnlyChange={setShowOnlyPublishedLocations}
                publishedOnlyLabel="Mostrar solo ubicaciones con vehículos publicados"
              />
            </div>

            {/* Tipo de Tracción */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Tipo de Tracción</h4>
                {filters.driveType.length > 0 && (
                  <Badge 
                    className="text-xs px-2 py-0.5" 
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "#ffffff"
                    }}
                  >
                    {filters.driveType.length} seleccionadas
                  </Badge>
                )}
              </div>
              <CheckboxFilter
                options={filterOptions.driveTypes}
                selected={filters.driveType}
                onChange={(driveType) =>
                  toggleArrayFilter("driveType", driveType, filters.driveType)
                }
                maxHeight="max-h-full"
              />
            </div>
          </div>
        </div>
        
        {/* Footer con indicador de mejora */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-3 h-3" style={{ color: "var(--accent)" }} />
            </motion.div>
            <span>Los filtros se aplican automáticamente</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedFiltersPanel;