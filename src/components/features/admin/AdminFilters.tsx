// src/components/features/admin/AdminFilters.tsx
// VERSIÓN CON DISEÑO UNIFICADO

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { InputField } from "@/components/shared/forms/InputField";
import { 
  Search, 
  Filter, 
  X, 
  Grid, 
  List, 
  Square,
  Calendar,
  DollarSign,
  ArrowUpDown,
  Tag
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { VEHICLE_CATEGORIES_LABELS } from "@/types/shared";
import { SortSelector } from "@/components/ui/seraui-selector";
import { MultiSelectFilter } from "@/components/features/vehicles/list/filters/MultiSelectFilter";
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
  isMobileView: boolean;
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
  isMobileView,
}: AdminFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  // ========== Clase Mejorada de Inputs ==========
  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
    "placeholder:text-muted-foreground/60 " +
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
    "transition-all duration-200 ease-out hover:border-border/80";

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
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-heading">
                Filtros y Búsqueda
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Refina los resultados para encontrar lo que buscas
              </p>
            </div>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} activos
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {totalResults} resultado{totalResults !== 1 ? "s" : ""}
            </span>

            {!isMobileView && (
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
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Búsqueda */}
        <InputField
          label="Búsqueda"
          icon={<Search className="w-4 h-4 text-primary" />}
          tooltip="Busca por marca, modelo, vendedor o número de referencia"
        >
          <Input
            placeholder="Buscar por marca, modelo, vendedor..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={`${inputClass} pl-12`}
          />
        </InputField>

        {/* Acciones de selección masiva */}
        <div className="p-4 rounded-xl border-2 border-border bg-muted/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <label
              htmlFor="select-all"
              className="inline-flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                id="select-all"
                checked={
                  isAllSelected
                    ? true
                    : isPartiallySelected
                      ? "indeterminate"
                      : false
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
              <span className="text-sm font-medium">Seleccionar todos</span>
            </label>
            {selectedCount > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearSelection}
                  className="flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Limpiar
                </Button>
                <Badge variant="secondary">
                  {selectedCount} seleccionado{selectedCount !== 1 ? "s" : ""}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Filtros rápidos por estado */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Estado del Anuncio</h3>
          <div className="flex flex-wrap gap-2">
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

          <CollapsibleContent className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Categoría */}
              <InputField
                label="Categoría"
                icon={<Tag className="w-4 h-4 text-primary" />}
                tooltip="Filtra por una o más categorías de vehículos"
              >
                <MultiSelectFilter
                  options={categoryOptions.filter((o) => o.value !== "all")}
                  selected={filters.category}
                  onChange={(selected) => onFiltersChange({ category: selected })}
                  placeholder="Seleccionar categorías"
                  className="w-full"
                />
              </InputField>

              {/* Ordenamiento */}
              <InputField
                label="Ordenar por"
                icon={<ArrowUpDown className="w-4 h-4 text-primary" />}
                tooltip="Define el criterio de ordenamiento de los resultados"
              >
                <SortSelector
                  value={filters.sortBy}
                  onChange={(value) =>
                    onFiltersChange({ sortBy: value as SortByType })
                  }
                  placeholder="Ordenar por"
                  options={sortOptions}
                />
              </InputField>

              {/* Filtro Destacado */}
              <InputField
                label="Destacado"
                icon={<Tag className="w-4 h-4 text-primary" />}
                tooltip="Filtra por anuncios destacados o no destacados"
              >
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
              </InputField>

              {/* Rango de Fechas */}
              <InputField
                label="Rango de Fechas"
                icon={<Calendar className="w-4 h-4 text-primary" />}
                tooltip="Filtra por fecha de creación del anuncio"
              >
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
              </InputField>

              {/* Rango de precio */}
              <div className="md:col-span-2 lg:col-span-3">
                <InputField
                  label="Rango de precio"
                  icon={<DollarSign className="w-4 h-4 text-primary" />}
                  tooltip="Filtra por rango de precios"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-primary">
                        ${filters.priceRange[0].toLocaleString()}
                      </span>
                      <span className="font-medium text-primary">
                        ${filters.priceRange[1].toLocaleString()}
                      </span>
                    </div>
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
                </InputField>
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