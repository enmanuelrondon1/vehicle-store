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
  Square,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { VEHICLE_CATEGORIES_LABELS } from "@/types/shared";
import { SortSelector } from "@/components/ui/seraui-selector";
import { MultiSelectFilter } from "@/components/ui/MultiSelectFilter";

import {
  AdminPanelFilters,
  SortByType,
} from "@/hooks/use-admin-panel-enhanced";
import { DatePicker } from "@/components/ui/DateRangePicker";
import { Checkbox } from "@/components/ui/checkbox";

interface AdminFiltersProps {
  filters: AdminPanelFilters;
  onFiltersChange: (filters: Partial<AdminPanelFilters>) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  totalResults: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  selectedCount: number;
  categoryCounts: Record<string, number>;
}

export const AdminFilters = ({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  totalResults,
  onSelectAll,
  onClearSelection,
  selectedCount,
  categoryCounts,
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
      count: categoryCounts?.[value] || 0,
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

  const isAllSelected = totalResults > 0 && selectedCount === totalResults;
  const isPartiallySelected = selectedCount > 0 && !isAllSelected;

  return (
    <Card>
      <CardHeader>
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
            <span className="text-sm text-muted-foreground">
              {totalResults} resultado{totalResults !== 1 ? "s" : ""}
            </span>

            <div className="flex items-center border rounded-lg p-1 bg-muted">
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por marca, modelo, vendedor, referencia..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Acciones de selección masiva */}
        <div className="flex flex-wrap items-center gap-2 py-2">
          <label
            htmlFor="select-all"
            className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-3 text-sm h-9 font-medium transition-colors hover:bg-muted"
          >
            <Checkbox
              id="select-all"
              checked={
                isAllSelected ? true : isPartiallySelected ? "indeterminate" : false
              }
              onCheckedChange={(checked) => {
                if (checked === true) {
                  onSelectAll();
                } else {
                  onClearSelection();
                }
              }}
              aria-label="Seleccionar o deseleccionar todos"
            />
            <span>Seleccionar todos</span>
          </label>
          {selectedCount > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className="flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Limpiar selección
              </Button>
              <Badge variant="secondary">
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
            >
              {status.label}
            </Button>
          ))}
        </div>

        {/* Filtros avanzados */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avanzados
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-6 mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Categoría */}
              <div className="p-5 rounded-lg border bg-card">
                <label className="text-sm font-semibold mb-3 block text-foreground">
                  Categoría
                </label>
                <MultiSelectFilter
                  options={categoryOptions.filter((o) => o.value !== "all")}
                  selectedValues={filters.category}
                  onChange={(selected) => onFiltersChange({ category: selected })}
                  placeholder="Seleccionar categorías"
                  className="w-full"
                />
              </div>

              {/* Ordenamiento */}
              <div className="p-5 rounded-lg border bg-card">
                <label className="text-sm font-semibold mb-3 block text-foreground">
                  Ordenar por
                </label>
                <div>
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
              <div className="p-5 rounded-lg border bg-card">
                <label className="text-sm font-semibold mb-3 block text-foreground">
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
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Rango de Fechas */}
              <div className="p-5 rounded-lg border bg-card">
                <label className="text-sm font-semibold mb-3 block text-foreground">
                  Rango de Fechas
                </label>
                <DatePicker
                  onDateChange={(range) => {
                    if (range) {
                      onFiltersChange({
                        dateRange: [range.from ?? null, range.to ?? null],
                      });
                    } else {
                      onFiltersChange({ dateRange: [null, null] });
                    }
                  }}
                  date={{
                    from: filters.dateRange[0] ?? undefined,
                    to: filters.dateRange[1] ?? undefined,
                  }}
                />
              </div>

              {/* Rango de precio */}
              <div className="md:col-span-2 lg:col-span-3 p-5 rounded-lg border bg-card">
                <label className="text-sm font-semibold mb-4 block text-foreground">
                  Rango de precio:{" "}
                  <span className="font-bold text-primary">
                    ${filters.priceRange[0].toLocaleString()}
                  </span>{" "}
                  -{" "}
                  <span className="font-bold text-primary">
                    ${filters.priceRange[1].toLocaleString()}
                  </span>
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
                variant="destructive"
                onClick={clearFilters}
                className="w-full"
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