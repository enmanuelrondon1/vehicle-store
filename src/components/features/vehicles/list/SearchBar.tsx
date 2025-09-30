// src/components/features/vehicles/list/SearchBar.tsx
"use client";

import { type FC, useMemo } from "react";
import { Search, Grid3X3, List, SlidersHorizontal } from "lucide-react";
import type { AdvancedFilters, FilterOptions } from "@/types/types";
import { SORT_OPTIONS } from "@/types/types";

interface SearchBarProps {
  filters: AdvancedFilters;
  setFilters: (filters: AdvancedFilters | ((prev: AdvancedFilters) => AdvancedFilters)) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  isDarkMode: boolean;
  clearAllFilters: () => void; // ✅ CORRECCIÓN: Usar la interfaz FilterOptions importada
  filterOptions: FilterOptions;
}

const SearchBar: FC<SearchBarProps> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  showAdvancedFilters,
  setShowAdvancedFilters,
  isDarkMode,
}) => {
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
    if (filters.mileageRange[0] > 0 || filters.mileageRange[1] < 500000) count++;
    return count;
  }, [filters]);
  return (
    <div
      className={`p-6 rounded-2xl mb-8 backdrop-blur-sm ${
        isDarkMode
          ? "bg-gray-800/30 border-gray-700"
          : "bg-white/30 border-gray-200"
      } border shadow-xl`}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo, características, ubicación..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev: AdvancedFilters) => ({
                  ...prev,
                  search: e.target.value || "",
                }))
              }
              className={`pl-10 h-12 text-lg w-full ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600"
                  : "bg-white/50 border-gray-300"
              } backdrop-blur-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap ">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors relative ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              title="Vista en cuadrícula"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              title="Vista en lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`p-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;