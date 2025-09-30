// src/components/features/vehicles/list/AdvancedFiltersPanel.tsx
"use client";

import { useMemo, type FC, useState, useEffect } from "react";
import { X } from "lucide-react";
import type { AdvancedFilters, FilterOptions } from "@/types/types";
import FilterGroup from "./filters/FilterGroup";
import CheckboxFilter from "./filters/CheckboxFilter";
import RangeSliderFilter from "./filters/RangeSliderFilter";
import { MultiSelectFilter } from "./filters/MultiSelectFilter";

interface AdvancedFiltersPanelProps {
  filters: AdvancedFilters;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
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
  isDarkMode,
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
    // Esto asegura que el valor se establezca en el cliente, evitando el mismatch de hidratación.
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
    // ✅ CORRECCIÓN: Añadir 'category' al conteo de filtros activos
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
    <div
      className={`p-6 rounded-xl border shadow-2xl ${
        isDarkMode
          ? "bg-gray-800/90 border-gray-700"
          : "bg-white/80 border-gray-200"
      } backdrop-blur-lg`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Filtros Avanzados{" "}
          {activeFiltersCount > 0 && `(${activeFiltersCount} activos)`}
        </h3>
        <div className="flex gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-sm text-red-600 hover:text-red-700 transition-colors px-3 py-1 rounded border border-red-200 hover:bg-red-50"
            >
              Limpiar Todo
            </button>
          )}
          <button
            onClick={onToggle}
            className={`p-1 rounded ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FilterGroup
          label={`Categoría (${
            filters.category !== "all" ? "1 seleccionada" : "ninguna"
          })`}
          isDarkMode={isDarkMode}
        >
          <MultiSelectFilter
            options={[{ value: "all", label: "Todas las categorías", count: totalVehicles }, ...filterOptions.categories]}
            selected={filters.category === "all" ? [] : [filters.category]}
            onChange={(newSelection) => {
              // Si se deselecciona la última categoría, se vuelve a "all"
              if (newSelection.length === 0) {
                updateFilter("category", "all");
              } else {
                // Tomar solo el último elemento seleccionado para simular una selección única
                const singleSelection = newSelection[newSelection.length - 1];
                updateFilter("category", singleSelection);
              }
            }}
            isDarkMode={isDarkMode}
            placeholder="Seleccionar categoría..."
            singleSelect={true} // Prop para modo de selección única
          />
        </FilterGroup>

        <FilterGroup
          label={`Precio: $${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`}
          isDarkMode={isDarkMode}
        >
          <RangeSliderFilter
            min={0}
            max={1000000}
            step={10000}
            value={filters.priceRange}
            onChange={(value) =>
              updateFilter("priceRange", value as [number, number])
            }
            isDarkMode={isDarkMode}
          />
        </FilterGroup>

        <FilterGroup
          label={`Año: ${filters.yearRange[0]} - ${filters.yearRange[1]}`}
          isDarkMode={isDarkMode}
        >
          <RangeSliderFilter
            min={2000}
            max={maxYear}
            step={1}
            value={filters.yearRange}
            onChange={(value) =>
              updateFilter("yearRange", value as [number, number])
            }
            isDarkMode={isDarkMode}
          />
        </FilterGroup>

        <FilterGroup
          label={`Kilometraje: ${filters.mileageRange[0].toLocaleString()} - ${filters.mileageRange[1].toLocaleString()} km`}
          isDarkMode={isDarkMode}
        >
          <RangeSliderFilter
            min={0}
            max={500000}
            step={5000}
            value={filters.mileageRange}
            onChange={(value) =>
              updateFilter("mileageRange", value as [number, number])
            }
            isDarkMode={isDarkMode}
          />
        </FilterGroup>

        <FilterGroup
          label={`Marcas (${filters.brands.length} seleccionadas)`}
          isDarkMode={isDarkMode}
        >
          <MultiSelectFilter
            options={filterOptions.brands}
            selected={filters.brands}
            onChange={(newSelection) => updateFilter("brands", newSelection)}
            isDarkMode={isDarkMode}
            placeholder="Seleccionar marcas..."
            showPublishedToggle={true}
            isPublishedOnly={showOnlyPublishedBrands}
            onPublishedOnlyChange={setShowOnlyPublishedBrands}
            publishedOnlyLabel="Mostrar solo marcas con vehículos publicados"
          />
        </FilterGroup>

        <FilterGroup
          label={`Color (${filters.colors.length} seleccionados)`}
          isDarkMode={isDarkMode}
        >
          <MultiSelectFilter
            options={filterOptions.colors}
            selected={filters.colors}
            onChange={(newSelection) => updateFilter("colors", newSelection)}
            isDarkMode={isDarkMode}
            placeholder="Seleccionar colores..."
            showPublishedToggle={true}
            isPublishedOnly={showOnlyPublishedColors}
            onPublishedOnlyChange={setShowOnlyPublishedColors}
            publishedOnlyLabel="Mostrar solo colores con vehículos publicados"
          />
        </FilterGroup>

        <FilterGroup
          label={`Condición (${filters.condition.length} seleccionadas)`}
          isDarkMode={isDarkMode}
        >
          <CheckboxFilter
            options={filterOptions.conditions}
            selected={filters.condition}
            onChange={(condition) =>
              toggleArrayFilter("condition", condition, filters.condition)
            }
            isDarkMode={isDarkMode}
            maxHeight="max-h-full"
          />
        </FilterGroup>

        <FilterGroup
          label={`Combustible (${filters.fuelType.length} seleccionadas)`}
          isDarkMode={isDarkMode}
        >
          <CheckboxFilter
            options={filterOptions.fuelTypes}
            selected={filters.fuelType}
            onChange={(fuel) =>
              toggleArrayFilter("fuelType", fuel, filters.fuelType)
            }
            isDarkMode={isDarkMode}
            maxHeight="max-h-full"
          />
        </FilterGroup>

        <FilterGroup
          label={`Transmisión (${filters.transmission.length} seleccionadas)`}
          isDarkMode={isDarkMode}
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
            isDarkMode={isDarkMode}
            maxHeight="max-h-full"
          />
        </FilterGroup>

        <FilterGroup
          label={`Ubicación (${filters.location.length} seleccionadas)`}
          isDarkMode={isDarkMode}
        >
          <MultiSelectFilter
            options={filterOptions.locations}
            selected={filters.location}
            onChange={(newSelection) => updateFilter("location", newSelection)}
            isDarkMode={isDarkMode}
            placeholder="Seleccionar ubicaciones..."
            showPublishedToggle={true}
            isPublishedOnly={showOnlyPublishedLocations}
            onPublishedOnlyChange={setShowOnlyPublishedLocations}
            publishedOnlyLabel="Mostrar solo ubicaciones con vehículos publicados"
          />
        </FilterGroup>
        <FilterGroup label="Tipo de Tracción" isDarkMode={isDarkMode}>
          <CheckboxFilter
            options={filterOptions.driveTypes}
            selected={filters.driveType}
            onChange={(driveType) =>
              toggleArrayFilter("driveType", driveType, filters.driveType)
            }
            isDarkMode={isDarkMode}
            maxHeight="max-h-full"
          />
        </FilterGroup>
      </div>
    </div>
  );
};

export default AdvancedFiltersPanel;