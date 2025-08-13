// src/components/sections/VehicleList/AdvancedFiltersPanel.tsx
"use client";

import type React from "react";
import { useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  ApprovalStatus,
} from "@/types/types";

interface AdvancedFilters {
  search: string;
  category: string;
  subcategory: string;
  brands: string[];
  priceRange: [number, number];
  yearRange: [number, number];
  mileageRange: [number, number];
  condition: string[];
  fuelType: string[];
  transmission: string[];
  location: string[];
  features: string[];
  status: ApprovalStatus | "all";
  hasWarranty: boolean;
  isFeatured: boolean;
  postedWithin: string;
}

interface FilterOptions {
  categories: string[];
  subcategories: string[];
  brands: string[];
  conditions: string[];
  fuelTypes: string[];
  transmissions: string[];
  locations: string[];
  features: string[];
  statuses: string[];
}

const POSTED_WITHIN_OPTIONS = [
  { value: "all", label: "Cualquier momento" },
  { value: "24h", label: "Últimas 24 horas" },
  { value: "7d", label: "Última semana" },
  { value: "30d", label: "Último mes" },
];

const AdvancedFiltersPanel = ({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
  isDarkMode,
}: {
  filters: AdvancedFilters;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
}) => {
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
    if (filters.brands.length > 0) count++;
    if (filters.condition.length > 0) count++;
    if (filters.fuelType.length > 0) count++;
    if (filters.transmission.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.hasWarranty) count++;
    if (filters.isFeatured) count++;
    if (filters.postedWithin !== "all") count++;
    if (filters.status !== "all") count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) count++;
    if (filters.yearRange[0] > 2000 || filters.yearRange[1] < 2025) count++;
    return count;
  }, [filters]);

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors relative ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros Avanzados
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`p-6 rounded-xl border ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/50 border-gray-200"
      } backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Filtros Avanzados {activeFiltersCount > 0 && `(${activeFiltersCount} activos)`}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-700 transition-colors px-3 py-1 rounded border border-red-200 hover:bg-red-50"
          >
            Limpiar Todo
          </button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className={`w-full p-2 rounded border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            }`}
          >
            <option value="all">Todas las categorías</option>
            {filterOptions.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Precio: ${filters.priceRange[0].toLocaleString()} - $
            {filters.priceRange[1].toLocaleString()}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={filters.priceRange[0]}
              onChange={(e) =>
                updateFilter("priceRange", [
                  Number(e.target.value),
                  filters.priceRange[1],
                ])
              }
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                updateFilter("priceRange", [
                  filters.priceRange[0],
                  Number(e.target.value),
                ])
              }
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Año: {filters.yearRange[0]} - {filters.yearRange[1]}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="2000"
              max="2025"
              value={filters.yearRange[0]}
              onChange={(e) =>
                updateFilter("yearRange", [
                  Number(e.target.value),
                  filters.yearRange[1],
                ])
              }
              className="w-full"
            />
            <input
              type="range"
              min="2000"
              max="2025"
              value={filters.yearRange[1]}
              onChange={(e) =>
                updateFilter("yearRange", [
                  filters.yearRange[0],
                  Number(e.target.value),
                ])
              }
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Marcas ({filters.brands.length} seleccionadas)
          </label>
          <div className="max-h-32 overflow-y-auto space-y-1 border rounded p-2">
            {filterOptions.brands.slice(0, 10).map((brand) => (
              <label key={brand} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() =>
                    toggleArrayFilter("brands", brand, filters.brands)
                  }
                  className="rounded"
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Condición
          </label>
          <div className="space-y-1">
            {filterOptions.conditions.map((condition) => (
              <label key={condition} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.condition.includes(condition)}
                  onChange={() =>
                    toggleArrayFilter("condition", condition, filters.condition)
                  }
                  className="rounded"
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {condition}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Combustible
          </label>
          <div className="space-y-1">
            {filterOptions.fuelTypes.map((fuel) => (
              <label key={fuel} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.fuelType.includes(fuel)}
                  onChange={() =>
                    toggleArrayFilter("fuelType", fuel, filters.fuelType)
                  }
                  className="rounded"
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {fuel}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Transmisión
          </label>
          <div className="space-y-1">
            {filterOptions.transmissions.map((transmission) => (
              <label key={transmission} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.transmission.includes(transmission)}
                  onChange={() =>
                    toggleArrayFilter(
                      "transmission",
                      transmission,
                      filters.transmission
                    )
                  }
                  className="rounded"
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {transmission}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Ubicación
          </label>
          <div className="max-h-32 overflow-y-auto space-y-1 border rounded p-2">
            {filterOptions.locations.slice(0, 8).map((location) => (
              <label key={location} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.location.includes(location)}
                  onChange={() =>
                    toggleArrayFilter("location", location, filters.location)
                  }
                  className="rounded"
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {location}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                updateFilter("status", e.target.value as ApprovalStatus | "all")
              }
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              <option value="all">Todos los estados</option>
              <option value={ApprovalStatus.PENDING}>Pendiente</option>
              <option value={ApprovalStatus.APPROVED}>Aprobado</option>
              <option value={ApprovalStatus.REJECTED}>Rechazado</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Publicado en
            </label>
            <select
              value={filters.postedWithin}
              onChange={(e) => updateFilter("postedWithin", e.target.value)}
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              {POSTED_WITHIN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.hasWarranty}
                onChange={(e) => updateFilter("hasWarranty", e.target.checked)}
                className="rounded"
              />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Con garantía
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.isFeatured}
                onChange={(e) => updateFilter("isFeatured", e.target.checked)}
                className="rounded"
              />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Solo destacados
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersPanel;