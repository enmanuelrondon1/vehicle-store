//src/components/features/admin/AdminFilters.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  X,
  Grid,
  List,
  CheckSquare,
  Square,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { DateRange } from "react-day-picker";
import { VEHICLE_CATEGORIES_LABELS } from "@/types/shared";
import { SortSelector } from "@/components/ui/seraui-selector";
import { MultiSelectFilter } from "@/components/ui/MultiSelectFilter";

import {
  AdminPanelFilters,
  SortByType,
} from "@/hooks/use-admin-panel-enhanced";

interface AdminFiltersProps {
  filters: AdminPanelFilters;
  onFiltersChange: (filters: Partial<AdminPanelFilters>) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  totalResults: number;
  isDarkMode: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  selectedCount: number;
}
 
export const AdminFilters = ({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  totalResults,
  isDarkMode,
  onSelectAll,
  onClearSelection,
  selectedCount,
}: AdminFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  const sortOptions: { value: SortByType; label: string }[] = [
    { value: "newest", label: "Más nuevos" },
    { value: "oldest", label: "Más antiguos" },
    { value: "price-low", label: "Precio: Bajo a Alto" },
    { value: "price-high", label: "Precio: Alto a Bajo" },
    { value: "views", label: "Más vistos" },
  ];

  const categoryOptions = [
    { value: "all", label: "Todas las categorías" },
    ...Object.entries(VEHICLE_CATEGORIES_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ search: searchInput });
      }
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, onFiltersChange, filters.search]);

  const clearFilters = () => {
    setSearchInput("");
    onFiltersChange({
      search: "",
      status: "all",
      category: [],
      priceRange: [0, 1000000],
      sortBy: "newest",
      dateRange: [null, null],
      featured: "all",
    });
  };

  const activeFiltersCount = [
    filters.search !== "",
    filters.category.length > 0,
    filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000000,
    filters.status !== "all",
    filters.sortBy !== "newest",
    filters.dateRange[0] !== null || filters.dateRange[1] !== null,
    filters.featured !== "all",
  ].filter(Boolean).length;

  return (
    <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}>
      <CardHeader className={isDarkMode ? "border-gray-700" : "border-gray-200"}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Filter className="w-5 h-5" />
            Filtros y Búsqueda
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center gap-3">
            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {totalResults} resultado{totalResults !== 1 ? "s" : ""}
            </span>

            <div className={`flex items-center border rounded-lg p-1 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-100"}`}>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="p-2 h-8 w-8"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="p-2 h-8 w-8"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por marca, modelo, vendedor, referencia..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={`pl-10 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300"}`}
          />
        </div>

        {/* Acciones de selección masiva */}
        <div className="flex flex-wrap items-center gap-2 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className={`flex items-center gap-2 ${isDarkMode ? "border-gray-600 hover:bg-gray-700" : ""}`}
          >
            <CheckSquare className="w-4 h-4" />
            Seleccionar todos
          </Button>
          {selectedCount > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className={`flex items-center gap-2 ${isDarkMode ? "border-gray-600 hover:bg-gray-700" : ""}`}
              >
                <Square className="w-4 h-4" />
                Limpiar selección
              </Button>
              <Badge variant="secondary" className={isDarkMode ? "bg-gray-600" : ""}>
                {selectedCount} seleccionado{selectedCount !== 1 ? "s" : ""}
              </Badge>
            </>
          )}
        </div>

        {/* Filtros rápidos por estado */}
        <div className="flex flex-wrap gap-2 py-2">
          {[
            { value: "all", label: "Todos" },
            { value: "pending", label: "Pendientes" },
            { value: "approved", label: "Aprobados" },
            { value: "rejected", label: "Rechazados" },
          ].map((status) => (
            <Button
              key={status.value}
              variant={filters.status === status.value ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onFiltersChange({
                  status: status.value as AdminPanelFilters["status"],
                })
              }
              className={isDarkMode && filters.status !== status.value ? "border-gray-600 hover:bg-gray-700" : ""}
            >
              {status.label}
            </Button>
          ))}
        </div>

        {/* Filtros avanzados */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className={`w-full bg-transparent ${isDarkMode ? "border-gray-600 hover:bg-gray-700 text-white" : "hover:bg-gray-50"}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avanzados
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className={`ml-2 ${isDarkMode ? "bg-gray-600" : ""}`}>
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-6 mt-4 pt-4 border-t-2 border-gray-400 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Categoría */}
              <div className={`p-5 rounded-lg border-2 ${isDarkMode ? "bg-blue-900 border-blue-600" : "bg-blue-100 border-blue-500"}`}>
                <label className={`text-sm font-semibold mb-3 block ${isDarkMode ? "text-blue-200" : "text-blue-900"}`}>
                  Categoría
                </label>
                <MultiSelectFilter
                  options={categoryOptions.filter(o => o.value !== 'all')}
                  selectedValues={filters.category}
                  onChange={(selected) => onFiltersChange({ category: selected })}
                  placeholder="Seleccionar categorías"
                  className={`w-full ${isDarkMode ? "bg-gray-600 border-blue-500 text-white" : "bg-white border-blue-300"}`}
                />
              </div>

              {/* Ordenamiento */}
              <div className={`p-5 rounded-lg border-2 ${isDarkMode ? "bg-purple-900 border-purple-600" : "bg-purple-100 border-purple-500"}`}>
                <label className={`text-sm font-semibold mb-3 block ${isDarkMode ? "text-purple-200" : "text-purple-900"}`}>
                  Ordenar por
                </label>
                <div className={isDarkMode ? "bg-purple-800 rounded-md" : "bg-white rounded-md"}>
                  <SortSelector
                    value={filters.sortBy}
                    onChange={(value) =>
                      onFiltersChange({ sortBy: value as SortByType })
                    }
                    placeholder="Ordenar por"
                    options={sortOptions}
                  />
                </div>
              </div>

              {/* Filtro Destacado */}
              <div className={`p-5 rounded-lg border-2 ${isDarkMode ? "bg-orange-900 border-orange-600" : "bg-orange-100 border-orange-500"}`}>
                <label className={`text-sm font-semibold mb-3 block ${isDarkMode ? "text-orange-200" : "text-orange-900"}`}>
                  Destacado
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "Todos" },
                    { value: true, label: "Sí" },
                    { value: false, label: "No" },
                  ].map((item) => (
                    <Button
                      key={String(item.value)}
                      variant={
                        filters.featured === item.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        onFiltersChange({
                          featured: item.value as boolean | "all",
                        })
                      }
                      className={isDarkMode && filters.featured !== item.value ? "border-gray-500 hover:bg-gray-600 text-gray-200" : ""}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Rango de Fechas */}
              <div className={`lg:col-span-2 p-5 rounded-lg border-2 ${isDarkMode ? "bg-green-900 border-green-600" : "bg-green-100 border-green-500"}`}>
                <label className={`text-sm font-semibold mb-3 block ${isDarkMode ? "text-green-200" : "text-green-900"}`}>
                  Rango de Fechas
                </label>
                <div className={`rounded-md border-2 p-4 ${isDarkMode ? "border-green-600 bg-green-800" : "border-green-300 bg-white"}`}>
                  <DateRangePicker
                    date={{
                      from: filters.dateRange[0] || undefined,
                      to: filters.dateRange[1] || undefined,
                    }}
                    onDateChange={(range: DateRange | undefined) => {
                      onFiltersChange({
                        dateRange: [range?.from || null, range?.to || null],
                      });
                    }}
                  />
                </div>
              </div>

              {/* Rango de precio */}
              <div className={`md:col-span-2 lg:col-span-3 p-5 rounded-lg border-2 ${isDarkMode ? "bg-yellow-900 border-yellow-600" : "bg-yellow-100 border-yellow-500"}`}>
                <label className={`text-sm font-semibold mb-4 block ${isDarkMode ? "text-yellow-200" : "text-yellow-900"}`}>
                  Rango de precio: <span className={`font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-800"}`}>${filters.priceRange[0].toLocaleString()}</span> - <span className={`font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-800"}`}>${filters.priceRange[1].toLocaleString()}</span>
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    onFiltersChange({ priceRange: value as [number, number] })
                  }
                  max={1000000}
                  min={0}
                  step={5000}
                  className="mt-3"
                />
              </div>
            </div>

            {/* Limpiar filtros */}
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className={`w-full bg-transparent ${isDarkMode ? "border-red-600/50 hover:bg-red-600/10 text-red-400 hover:text-red-300" : "border-red-300 text-red-600 hover:bg-red-50"}`}
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar {activeFiltersCount} filtros
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};