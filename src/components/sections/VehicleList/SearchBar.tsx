// src/components/sections/VehicleList/SearchBar.tsx
"use client";

import type React from "react";
import { Search, Grid3X3, List } from "lucide-react";
import AdvancedFiltersPanel from "./AdvancedFiltersPanel";
import { AdvancedFilters } from "./VehicleList";

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
  clearAllFilters: () => void;
  filterOptions: {
    categories: string[];
    subcategories: string[];
    brands: string[];
    conditions: string[];
    fuelTypes: string[];
    transmissions: string[];
    locations: string[];
    features: string[];
    statuses: string[];
  };
}

const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  showAdvancedFilters,
  setShowAdvancedFilters,
  isDarkMode,
  clearAllFilters,
  filterOptions,
}) => {
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
        <div className="flex items-center gap-3 flex-wrap">
          <AdvancedFiltersPanel
            filters={filters}
            filterOptions={filterOptions}
            onFiltersChange={setFilters}
            onClearFilters={clearAllFilters}
            isOpen={showAdvancedFilters}
            onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
            isDarkMode={isDarkMode}
          />
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
            {[
              {
                value: "relevance",
                label: "Más Relevantes",
                key: "relevance" as const,
                order: "desc" as const,
              },
              {
                value: "price_asc",
                label: "Precio: Menor a Mayor",
                key: "price" as const,
                order: "asc" as const,
              },
              {
                value: "price_desc",
                label: "Precio: Mayor a Menor",
                key: "price" as const,
                order: "desc" as const,
              },
              {
                value: "year_desc",
                label: "Año: Más Nuevo",
                key: "year" as const,
                order: "desc" as const,
              },
              {
                value: "year_asc",
                label: "Año: Más Antiguo",
                key: "year" as const,
                order: "asc" as const,
              },
              {
                value: "mileage_asc",
                label: "Kilometraje: Menor",
                key: "mileage" as const,
                order: "asc" as const,
              },
              {
                value: "mileage_desc",
                label: "Kilometraje: Mayor",
                key: "mileage" as const,
                order: "desc" as const,
              },
              {
                value: "date_desc",
                label: "Más Recientes",
                key: "createdAt" as const,
                order: "desc" as const,
              },
            ].map((option) => (
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