// src/components/features/vehicles/list/useVehicleFiltering.ts
"use client";

import { useDebounce } from "@/hooks/useDebounce"; // ✅ SOLUCIÓN: Importar el hook useDebounce
import { useState, useMemo, useCallback } from "react";
import {
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
  DRIVE_TYPE_LABELS,
  SALE_TYPE_LABELS,
  WarrantyType,
  VEHICLE_CATEGORIES_LABELS,
} from "@/types/shared"; // ✅ CORRECCIÓN: Importar desde 'shared'
import { LOCATION_LABELS } from "@/types/shared"; // ✅ CORRECCIÓN: Importar LOCATION_LABELS
import type { Vehicle, AdvancedFilters, FilterOptions } from "@/types/types";
import { SORT_OPTIONS } from "@/types/types"; // ✅ CORRECCIÓN: Importar SORT_OPTIONS desde types.ts

const INITIAL_FILTERS: AdvancedFilters = {
  search: "",
  category: "all",
  subcategory: "all",
  brands: [],
  priceRange: [0, 1000000],
  yearRange: [2000, 2025],
  mileageRange: [0, 500000],
  condition: [],
  colors: [],
  fuelType: [],
  transmission: [],
  location: [],
  features: [],
  driveType: [],
  saleType: [],
  hasWarranty: false,
  isFeatured: false,
  postedWithin: "all", // Ahora esto es válido gracias a la corrección en types.ts
};

const translateValue = (value: string, map: Record<string, string>): string => {
  return map[value] || value;
};

export const useVehicleFiltering = (initialVehicles: Vehicle[]) => {
  const [vehicles] = useState<Vehicle[]>(initialVehicles);
  const [filters, setFilters] = useState<AdvancedFilters>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState("relevance");

  // ✅ MEJORA: Generar opciones de filtro dinámicamente a partir de los vehículos
  const filterOptions = useMemo<FilterOptions>(() => {
    const brands = [...new Set(vehicles.map((v) => v.brand).filter(Boolean))].sort(); // ✅ SOLUCIÓN: Debe ser string[]
    const colors = [...new Set(vehicles.map((v) => v.color).filter(Boolean))].sort().map(c => ({ value: c, label: c }));
    const locations = [...new Set(vehicles.map((v) => v.location).filter(Boolean))].sort().map(l => ({ value: l, label: translateValue(l, LOCATION_LABELS) }));

    return {
      categories: Object.entries(VEHICLE_CATEGORIES_LABELS).map(([value, label]) => ({ value, label })),
      subcategories: [],
      brands,
      colors,
      locations,
      conditions: Object.entries(VEHICLE_CONDITIONS_LABELS).map(([value, label]) => ({ value, label })),
      fuelTypes: Object.values(FUEL_TYPES_LABELS).map(label => ({ value: label, label })),
      transmissions: Object.values(TRANSMISSION_TYPES_LABELS).map(label => ({ value: label, label })),
      driveTypes: Object.entries(DRIVE_TYPE_LABELS).map(([value, label]) => ({ value, label })),
      saleTypes: Object.entries(SALE_TYPE_LABELS).map(([value, label]) => ({ value, label })),
      features: [], // Se puede implementar después
    };
  }, [vehicles]);

  // ✅ MEJORA: Usar el término de búsqueda con retardo para el filtrado
  const debouncedSearchTerm = useDebounce(filters.search, 300);
  const applyFilters = useCallback(() => {
    let filtered = vehicles;

    // Lógica de búsqueda
    if (debouncedSearchTerm) { // ✅ CORRECCIÓN: Usar el valor con retardo
      const searchTerm = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          (vehicle.brand && vehicle.brand.toLowerCase().includes(searchTerm)) ||
          (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm)) ||
          (vehicle.description &&
            vehicle.description.toLowerCase().includes(searchTerm)) ||
          (vehicle.features &&
            vehicle.features.some(
              (feature) => feature && feature.toLowerCase().includes(searchTerm)
            )) ||
          (vehicle.location &&
            vehicle.location.toLowerCase().includes(searchTerm)) ||
          (vehicle.category &&
            vehicle.category.toLowerCase().includes(searchTerm))
      );
    }

    // Filtros avanzados
    if (filters.category !== "all") {
      filtered = filtered.filter((v) => v.category === filters.category);
    }
    if (filters.subcategory !== "all") {
      filtered = filtered.filter((v) => v.subcategory === filters.subcategory);
    }
    if (filters.brands.length > 0) {
      filtered = filtered.filter((v) => filters.brands.includes(v.brand));
    }
    if (filters.colors.length > 0) {
      filtered = filtered.filter((v) => v.color && filters.colors.includes(v.color));
    }
    if (filters.condition.length > 0) {
      filtered = filtered.filter((v) => filters.condition.includes(v.condition));
    }
    if (filters.fuelType.length > 0) {
      filtered = filtered.filter((v) => filters.fuelType.includes(v.fuelType));
    }
    if (filters.transmission.length > 0) {
      filtered = filtered.filter((v) => filters.transmission.includes(v.transmission));
    }
    if (filters.location.length > 0) {
      // La comparación directa es correcta porque tanto `filters.location` como `v.location`
      // usan el formato "slug" (ej: "distrito-capital").
      filtered = filtered.filter(
        (v) => v.location && filters.location.includes(v.location)
      );
    }
    if (filters.driveType.length > 0) {
      filtered = filtered.filter(
        (v) =>
          v.driveType && filters.driveType.includes(v.driveType)
      );
    }
    if (filters.saleType.length > 0) {
      filtered = filtered.filter((v) => v.saleType && filters.saleType.includes(v.saleType));
    }
    filtered = filtered.filter(
      (v) =>
        v.price >= filters.priceRange[0] &&
        v.price <= filters.priceRange[1] &&
        v.year >= filters.yearRange[0] &&
        v.year <= filters.yearRange[1] &&
        v.mileage >= filters.mileageRange[0] &&
        v.mileage <= filters.mileageRange[1]
    );
    if (filters.hasWarranty) {
      filtered = filtered.filter(
        (v) => v.warranty && v.warranty !== WarrantyType.NO_WARRANTY
      );
    }
    if (filters.isFeatured) { 
      filtered = filtered.filter((v) => v.isFeatured);
    }
    // ✅ CORRECCIÓN: Refactorizar para que TypeScript entienda que `postedWithin` no es undefined.
    if (filters.postedWithin && filters.postedWithin !== 'all') {
      const postedWithinKey = filters.postedWithin as '24h' | '7d' | '30d';
      const now = new Date();
      const timeLimit = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
      }[postedWithinKey];

      if (timeLimit) {
        filtered = filtered.filter((v) => {
          const dateToCheck = v.createdAt || v.postedDate;
          if (!dateToCheck) return false;
          try {
            const vehicleDate = new Date(dateToCheck);
            if (isNaN(vehicleDate.getTime())) return false;
            return now.getTime() - vehicleDate.getTime() <= timeLimit;
          } catch {
            return false;
          }
        });
      }
    }

    // Lógica de ordenamiento
    const sortOption = SORT_OPTIONS.find((option) => option.value === sortBy);
    if (sortOption && sortOption.key !== "relevance") {
      filtered.sort((a, b) => {
        const getSortableValue = (val: unknown): string | number | Date => {
          if (val === undefined || val === null) return sortOption.key === "createdAt" ? 0 : "";
          if (typeof val === "string" || typeof val === "number") {
            if (sortOption.key === "createdAt" && typeof val === "string") {
              try {
                const date = new Date(val);
                return isNaN(date.getTime()) ? 0 : date;
              } catch { return 0; }
            }
            return val;
          }
          if (val instanceof Date) return val;
          return sortOption.key === "createdAt" ? 0 : "";
        };

        let aValue = getSortableValue(a[sortOption.key as keyof Vehicle]);
        let bValue = getSortableValue(b[sortOption.key as keyof Vehicle]);

        if (sortOption.key === "createdAt") {
          const getDateValue = (vehicle: Vehicle): number => {
            const dateToCheck = vehicle.createdAt || vehicle.postedDate;
            if (!dateToCheck) return 0;
            try {
              const date = new Date(dateToCheck);
              return isNaN(date.getTime()) ? 0 : date.getTime();
            } catch { return 0; }
          };
          aValue = getDateValue(a);
          bValue = getDateValue(b);
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOption.order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortOption.order === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });
    }

    return filtered;
  }, [vehicles, filters, sortBy, debouncedSearchTerm]); // ✅ CORRECCIÓN: Añadir debouncedSearchTerm a las dependencias de applyFilters

  // ✅ SOLUCIÓN: Simplificar las dependencias del useMemo. applyFilters ya contiene todo lo necesario.
  const filteredVehicles = useMemo(() => applyFilters(), [applyFilters]);

  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  return {
    // ✅ DEVOLVER LAS OPCIONES GENERADAS
    filterOptions,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    filteredVehicles,
    clearAllFilters,
  };
};