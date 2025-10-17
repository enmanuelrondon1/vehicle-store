// src/components/features/vehicles/list/ActiveFiltersDisplay.tsx
"use client";

import type { FC } from "react";
import type { AdvancedFilters, FilterOptions } from "@/types/types";
import FilterChip from "./filters/FilterChip";

interface ActiveFiltersDisplayProps {
  filters: AdvancedFilters;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: AdvancedFilters | ((prev: AdvancedFilters) => AdvancedFilters)) => void;
  onClearFilters: () => void;
  // isDarkMode: boolean; // ❌ REMOVED
}

const ActiveFiltersDisplay: FC<ActiveFiltersDisplayProps> = ({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
  // isDarkMode, // ❌ REMOVED
}) => {
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

  // Mapeo de filtros a chips
  if (filters.category !== "all") {
    // Busca la etiqueta correspondiente a la categoría seleccionada
    const categoryLabel = filterOptions.categories.find(c => c.value === filters.category)?.label || filters.category;
    activeChips.push({
      label: `Categoría: ${categoryLabel}`,
      onRemove: () => resetStringFilter("category", "all"),
    });
  }

  filters.brands.forEach((brand) => {
    activeChips.push({ label: brand, onRemove: () => removeFromArrayFilter("brands", brand) });
  });

  filters.colors.forEach((color) => {
    // Busca la etiqueta correspondiente al color seleccionado
    const colorLabel = filterOptions.colors.find(c => c.value === color)?.label || color;
    activeChips.push({ label: `Color: ${colorLabel}`, onRemove: () => removeFromArrayFilter("colors", color) });
  });

  filters.condition.forEach((condition) => {
    const conditionLabel = filterOptions.conditions.find(c => c.value === condition)?.label || condition;
    activeChips.push({ label: `Condición: ${conditionLabel}`, onRemove: () => removeFromArrayFilter("condition", condition) });
  });

  filters.fuelType.forEach((fuel) => {
    const fuelLabel = filterOptions.fuelTypes.find(f => f.value === fuel)?.label || fuel;
    activeChips.push({ label: `Combustible: ${fuelLabel}`, onRemove: () => removeFromArrayFilter("fuelType", fuel) });
  });

  filters.transmission.forEach((transmission) => {
    const transmissionLabel = filterOptions.transmissions.find(t => t.value === transmission)?.label || transmission;
    activeChips.push({ label: `Transmisión: ${transmissionLabel}`, onRemove: () => removeFromArrayFilter("transmission", transmission) });
  });

  filters.driveType.forEach((drive) => {
    const driveLabel = filterOptions.driveTypes.find(d => d.value === drive)?.label || drive;
    activeChips.push({ label: `Tracción: ${driveLabel}`, onRemove: () => removeFromArrayFilter("driveType", drive) });
  });

  filters.location.forEach((location) => {
    // ✅ CORRECCIÓN: Buscar la etiqueta correspondiente al valor (slug)
    const locationLabel = filterOptions.locations.find(l => l.value === location)?.label || location;
    activeChips.push({ label: `Ubicación: ${locationLabel}`, onRemove: () => removeFromArrayFilter("location", location) });
  });

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
    activeChips.push({
      label: `Precio: $${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`,
      onRemove: () => resetRangeFilter("priceRange", [0, 1000000]),
    });
  }

  if (filters.yearRange[0] > 2000 || filters.yearRange[1] < new Date().getFullYear() + 1) {
    activeChips.push({
      label: `Año: ${filters.yearRange[0]} - ${filters.yearRange[1]}`,
      onRemove: () => resetRangeFilter("yearRange", [2000, new Date().getFullYear() + 1]),
    });
  }

  if (filters.mileageRange[0] > 0 || filters.mileageRange[1] < 500000) {
    activeChips.push({
      label: `Km: ${filters.mileageRange[0].toLocaleString()} - ${filters.mileageRange[1].toLocaleString()}`,
      onRemove: () => resetRangeFilter("mileageRange", [0, 500000]),
    });
  }

  if (filters.hasWarranty) {
    activeChips.push({ label: "Con garantía", onRemove: () => resetBooleanFilter("hasWarranty") });
  }

  if (filters.isFeatured) {
    activeChips.push({ label: "Destacados", onRemove: () => resetBooleanFilter("isFeatured") });
  }

  if (activeChips.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center flex-wrap gap-2 mb-6">
      {activeChips.map((chip) => (
        <FilterChip key={chip.label} label={chip.label} onRemove={chip.onRemove} /> // ❌ REMOVED: isDarkMode prop
      ))}
      {activeChips.length > 1 && (
        <button
          onClick={onClearFilters}
          className="text-sm text-destructive hover:underline ml-2"
        >
          Limpiar todo
        </button>
      )}
    </div>
  );
};

export default ActiveFiltersDisplay;