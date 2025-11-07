// src/components/features/vehicles/list/AdvancedFiltersPanel.tsx
"use client";

import { useMemo, type FC, useState, useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react"; // MEJORA: Iconos para el header
import type { AdvancedFilters, FilterOptions } from "@/types/types";
import FilterGroup from "./filters/FilterGroup";
import CheckboxFilter from "./filters/CheckboxFilter";
import RangeSliderFilter from "./filters/RangeSliderFilter";
import { MultiSelectFilter } from "./filters/MultiSelectFilter";
// MEJORA: Importamos componentes de UI para consistencia
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    // ... (tu lógica de conteo se mantiene igual, es perfecta)
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
    // MEJORA: Usamos el componente Card para unificar el diseño con el resto de la app
    <Card className="shadow-xl border-border card-hover">
      {/* MEJORA: Usamos CardHeader para un header estructurado y accesible */}
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          Filtros Avanzados
          {activeFiltersCount > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({activeFiltersCount} activos)
            </span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            // MEJORA: Usamos el componente Button para consistencia y mejor feedback
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
            >
              Limpiar Todo
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            aria-label="Cerrar filtros avanzados"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* MEJORA: Grid más responsivo para evitar que los grupos sean demasiado anchos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* 
            MEJORA: Sugerencia para el futuro.
            Si tu componente FilterGroup no tiene un borde o fondo, 
            considera añadirle una clase como "p-4 border border-border/50 rounded-lg" 
            para que cada grupo esté visualmente separado.
          */}
          <FilterGroup
            label={`Categoría (${
              filters.category !== "all" ? "1 seleccionada" : "ninguna"
            })`}
          >
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
          </FilterGroup>
          {/* // En AdvancedFiltersPanel.tsx */}
          <FilterGroup
            label={`Precio: $${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`}
          >
            <RangeSliderFilter
              min={0}
              max={1000000}
              step={10000}
              value={filters.priceRange}
              onChange={(value) => updateFilter("priceRange", value)}
              formatValue={(val) => `$${val.toLocaleString()}`} // Para el tooltip y el texto inferior
            />
          </FilterGroup>
          <FilterGroup
            label={`Año: ${filters.yearRange[0]} - ${filters.yearRange[1]}`}
          >
            <RangeSliderFilter
              min={2000}
              max={maxYear}
              step={1}
              value={filters.yearRange}
              onChange={(value) =>
                updateFilter("yearRange", value as [number, number])
              }
            />
          </FilterGroup>
          <FilterGroup
            label={`Kilometraje: ${filters.mileageRange[0].toLocaleString()} - ${filters.mileageRange[1].toLocaleString()} km`}
          >
            <RangeSliderFilter
              min={0}
              max={500000}
              step={5000}
              value={filters.mileageRange}
              onChange={(value) =>
                updateFilter("mileageRange", value as [number, number])
              }
            />
          </FilterGroup>
          <FilterGroup
            label={`Marcas (${filters.brands.length} seleccionadas)`}
          >
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
          </FilterGroup>
          <FilterGroup label={`Color (${filters.colors.length} seleccionados)`}>
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
          </FilterGroup>
          <FilterGroup
            label={`Condición (${filters.condition.length} seleccionadas)`}
          >
            <CheckboxFilter
              options={filterOptions.conditions}
              selected={filters.condition}
              onChange={(condition) =>
                toggleArrayFilter("condition", condition, filters.condition)
              }
              maxHeight="max-h-full"
            />
          </FilterGroup>
          <FilterGroup
            label={`Combustible (${filters.fuelType.length} seleccionadas)`}
          >
            <CheckboxFilter
              options={filterOptions.fuelTypes}
              selected={filters.fuelType}
              onChange={(fuel) =>
                toggleArrayFilter("fuelType", fuel, filters.fuelType)
              }
              maxHeight="max-h-full"
            />
          </FilterGroup>
          <FilterGroup
            label={`Transmisión (${filters.transmission.length} seleccionadas)`}
          >
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
          </FilterGroup>
          <FilterGroup
            label={`Ubicación (${filters.location.length} seleccionadas)`}
          >
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
          </FilterGroup>
          <FilterGroup label="Tipo de Tracción">
            <CheckboxFilter
              options={filterOptions.driveTypes}
              selected={filters.driveType}
              onChange={(driveType) =>
                toggleArrayFilter("driveType", driveType, filters.driveType)
              }
              maxHeight="max-h-full"
            />
          </FilterGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFiltersPanel;
