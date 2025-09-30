// src/hooks/useVehicleFiltering.ts
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
import { CATEGORY_DATA, COMMON_COLORS } from "@/constants/form-constants";

// ✅ NUEVO: Función para contar opciones
const getOptionsWithCounts = (
  vehicles: Vehicle[],
  key: "brand" | "color" | "location" | "condition" | "category" | "fuelType" | "transmission" | "driveType"
) => {
  const counts = vehicles.reduce((acc, vehicle) => {
    const value = vehicle[key];
    if (value) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  return counts;
};

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



export const useVehicleFiltering = (initialVehicles: Vehicle[]) => {
  const [vehicles] = useState<Vehicle[]>(initialVehicles);
  const [filters, setFilters] = useState<AdvancedFilters>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState("relevance");
  const [showOnlyPublishedBrands, setShowOnlyPublishedBrands] = useState(false);
  const [showOnlyPublishedColors, setShowOnlyPublishedColors] = useState(false);
  const [showOnlyPublishedLocations, setShowOnlyPublishedLocations] = useState(false);

  // ✅ INICIO: Solución definitiva y centralizada para la normalización de ubicaciones
  const locationStringToSlugMap = useMemo(() => {
    const slugToLabelMap = LOCATION_LABELS;
    return Object.entries(slugToLabelMap).reduce(
      (acc, [slug, label]) => {
        acc[label.toLowerCase().trim()] = slug;
        acc[slug.toLowerCase().trim()] = slug;
        return acc;
      },
      {} as Record<string, string>
    );
  }, []);

  const getCanonicalLocationSlug = useCallback(
    (locationString?: string) => {
      if (!locationString) return undefined;
      const parts = locationString.split(',');
      const stateName = parts[parts.length - 1]?.trim().toLowerCase();
      if (!stateName) return undefined;
      return locationStringToSlugMap[stateName];
    },
    [locationStringToSlugMap]
  );
  // ✅ FIN: Solución definitiva

  const filterOptions = useMemo<FilterOptions>(() => {
    const uniqueVehicleLocations = [...new Set(vehicles.map(v => v.location).filter(Boolean))];
    console.log("Ubicaciones de vehículos en los datos:", uniqueVehicleLocations);

    const brandCounts = getOptionsWithCounts(vehicles, "brand");
    const colorCounts = getOptionsWithCounts(vehicles, "color");
    const conditionCounts = getOptionsWithCounts(vehicles, "condition");
    const categoryCounts = getOptionsWithCounts(vehicles, "category");
    const fuelTypeCounts = getOptionsWithCounts(vehicles, "fuelType");
    const transmissionCounts = getOptionsWithCounts(vehicles, "transmission");
    const driveTypeCounts = getOptionsWithCounts(vehicles, "driveType");

    // ✅ CÁLCULO SEGURO: Contar solo ubicaciones normalizables
    const locationCounts = vehicles.reduce((acc, vehicle) => {
      const slug = getCanonicalLocationSlug(vehicle.location);
      if (slug) {
        acc[slug] = (acc[slug] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);


    const allBrands = [
      ...new Set(
        Object.values(CATEGORY_DATA).flatMap((category) =>
          Object.keys(category.brands)
        )
      ),
    ].sort();

    const publishedBrands = [
      ...new Set(vehicles.map((v) => v.brand).filter(Boolean)),
    ].sort();
    const brandsSource = showOnlyPublishedBrands ? publishedBrands : allBrands;
    const brands = brandsSource.map((brand) => ({
      value: brand,
      label: brand,
      count: brandCounts[brand] || 0,
    }));

    const allColorValues = COMMON_COLORS;
    const publishedColorValues = [
      ...new Set(vehicles.map((v) => v.color).filter(Boolean)),
    ].sort();
    const colorsSource = showOnlyPublishedColors
      ? publishedColorValues
      : allColorValues;
    const colors = colorsSource.map((color) => ({
      value: color,
      label: color,
      count: colorCounts[color] || 0,
    }));

    const allLocations = Object.entries(LOCATION_LABELS).map(([value, label]) => ({
      value,
      label,
      count: locationCounts[value] || 0,
    }));

    const publishedLocations = [
      ...new Set(
        vehicles.map((v) => getCanonicalLocationSlug(v.location)).filter(Boolean) as string[]
      ),
    ].sort().map((slug) => ({
      value: slug,
      label: LOCATION_LABELS[slug as keyof typeof LOCATION_LABELS] || slug,
      count: locationCounts[slug] || 0,
    }));

    const locations = showOnlyPublishedLocations ? publishedLocations : allLocations;

    return {
      categories: Object.entries(VEHICLE_CATEGORIES_LABELS).map(([value, label]) => ({
        value,
        label,
        count: categoryCounts[value] || 0,
      })),
      subcategories: [],
      brands,
      colors,
      locations,
      conditions: Object.entries(VEHICLE_CONDITIONS_LABELS).map(
        ([value, label]) => ({
          value,
          label,
          count: conditionCounts[value] || 0,
        })
      ),
      fuelTypes: Object.entries(FUEL_TYPES_LABELS).map(([value, label]) => ({
        value,
        label,
        count: fuelTypeCounts[value] || 0,
      })),
      transmissions: Object.entries(TRANSMISSION_TYPES_LABELS).map(([value, label]) => ({
        value,
        label,
        count: transmissionCounts[value] || 0,
      })),
      driveTypes: Object.entries(DRIVE_TYPE_LABELS).map(([value, label]) => ({
        value,
        label,
        count: driveTypeCounts[value] || 0,
      })),
      saleTypes: Object.entries(SALE_TYPE_LABELS).map(([value, label]) => ({ value, label })),
      features: [],
    };
  }, [vehicles, showOnlyPublishedBrands, showOnlyPublishedColors, showOnlyPublishedLocations, getCanonicalLocationSlug]);

  const debouncedSearchTerm = useDebounce(filters.search, 300);
  const applyFilters = useCallback(() => {
    let filtered = vehicles;

    if (debouncedSearchTerm) {
      const searchTerm = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((vehicle) => {
        const canonicalLocation = getCanonicalLocationSlug(vehicle.location);
        return (
          (vehicle.brand && vehicle.brand.toLowerCase().includes(searchTerm)) ||
          (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm)) ||
          (vehicle.description &&
            vehicle.description.toLowerCase().includes(searchTerm)) ||
          (vehicle.features &&
            vehicle.features.some(
              (feature) => feature && feature.toLowerCase().includes(searchTerm)
            )) ||
          (canonicalLocation && canonicalLocation.includes(searchTerm)) || // ✅ Búsqueda con ubicación normalizada
          (vehicle.category &&
            vehicle.category.toLowerCase().includes(searchTerm))
        );
      });
    }

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
      filtered = filtered.filter((v) => v.condition && filters.condition.includes(v.condition));
    }
    if (filters.fuelType.length > 0) {
      filtered = filtered.filter((v) => v.fuelType && filters.fuelType.includes(v.fuelType));
    }
    if (filters.transmission.length > 0) {
      filtered = filtered.filter((v) => filters.transmission.includes(v.transmission));
    }
    if (filters.location.length > 0) {
      filtered = filtered.filter((v) => {
        const vehicleLocationSlug = getCanonicalLocationSlug(v.location);
        return vehicleLocationSlug && filters.location.includes(vehicleLocationSlug);
      });
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
  }, [vehicles, filters, sortBy, debouncedSearchTerm, getCanonicalLocationSlug]); // ✅ CORRECCIÓN: Añadir getCanonicalLocationSlug

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
    showOnlyPublishedBrands,
    setShowOnlyPublishedBrands,
    showOnlyPublishedColors,
    setShowOnlyPublishedColors,
    showOnlyPublishedLocations,
    setShowOnlyPublishedLocations,
  };
};