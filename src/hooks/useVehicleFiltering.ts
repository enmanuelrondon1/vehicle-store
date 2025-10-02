// src/hooks/useVehicleFiltering.ts
"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
  DRIVE_TYPE_LABELS,
  SALE_TYPE_LABELS,
  WarrantyType,
  VEHICLE_CATEGORIES_LABELS,
} from "@/types/shared";
import { LOCATION_LABELS } from "@/types/shared";
import type { Vehicle, AdvancedFilters, FilterOptions } from "@/types/types";
import { SORT_OPTIONS } from "@/types/types";
import { CATEGORY_DATA, COMMON_COLORS } from "@/constants/form-constants";

const getOptionsWithCounts = (
  vehicles: Vehicle[],
  key:
    | "brand"
    | "color"
    | "location"
    | "condition"
    | "category"
    | "fuelType"
    | "transmission"
    | "driveType"
) => {
  const counts = vehicles.reduce(
    (acc, vehicle) => {
      const value = vehicle[key];
      if (value) {
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );
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
  postedWithin: "all",
};

export const useVehicleFiltering = (initialVehicles: Vehicle[]) => {
  const [vehicles] = useState<Vehicle[]>(initialVehicles);
  const [filters, setFilters] = useState<AdvancedFilters>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState("relevance");
  const [showOnlyPublishedBrands, setShowOnlyPublishedBrands] = useState(false);
  const [showOnlyPublishedColors, setShowOnlyPublishedColors] = useState(false);
  const [showOnlyPublishedLocations, setShowOnlyPublishedLocations] =
    useState(false);

  useEffect(() => {
    console.log("Valor de sortBy:", sortBy);
  }, [sortBy]);

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
      const parts = locationString.split(",");
      const stateName = parts[parts.length - 1]?.trim().toLowerCase();
      if (!stateName) return undefined;
      return locationStringToSlugMap[stateName];
    },
    [locationStringToSlugMap]
  );

  const filterOptions = useMemo<FilterOptions>(() => {
    const brandCounts = getOptionsWithCounts(vehicles, "brand");
    const colorCounts = getOptionsWithCounts(vehicles, "color");
    const conditionCounts = getOptionsWithCounts(vehicles, "condition");
    const categoryCounts = getOptionsWithCounts(vehicles, "category");
    const fuelTypeCounts = getOptionsWithCounts(vehicles, "fuelType");
    const transmissionCounts = getOptionsWithCounts(vehicles, "transmission");
    const driveTypeCounts = getOptionsWithCounts(vehicles, "driveType");

    const locationCounts = vehicles.reduce(
      (acc, vehicle) => {
        const slug = getCanonicalLocationSlug(vehicle.location);
        if (slug) {
          acc[slug] = (acc[slug] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

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

    const allLocations = Object.entries(LOCATION_LABELS).map(
      ([value, label]) => ({
        value,
        label,
        count: locationCounts[value] || 0,
      })
    );

    const publishedLocations = [
      ...new Set(
        vehicles
          .map((v) => getCanonicalLocationSlug(v.location))
          .filter(Boolean) as string[]
      ),
    ]
      .sort()
      .map((slug) => ({
        value: slug,
        label: LOCATION_LABELS[slug as keyof typeof LOCATION_LABELS] || slug,
        count: locationCounts[slug] || 0,
      }));

    const locations = showOnlyPublishedLocations
      ? publishedLocations
      : allLocations;

    return {
      categories: Object.entries(VEHICLE_CATEGORIES_LABELS).map(
        ([value, label]) => ({
          value,
          label,
          count: categoryCounts[value] || 0,
        })
      ),
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
      transmissions: Object.entries(TRANSMISSION_TYPES_LABELS).map(
        ([value, label]) => ({
          value,
          label,
          count: transmissionCounts[value] || 0,
        })
      ),
      driveTypes: Object.entries(DRIVE_TYPE_LABELS).map(([value, label]) => ({
        value,
        label,
        count: driveTypeCounts[value] || 0,
      })),
      saleTypes: Object.entries(SALE_TYPE_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
      features: [],
    };
  }, [
    vehicles,
    showOnlyPublishedBrands,
    showOnlyPublishedColors,
    showOnlyPublishedLocations,
    getCanonicalLocationSlug,
  ]);

  const debouncedSearchTerm = useDebounce(filters.search, 300);
  const applyFilters = useCallback(() => {
    let filtered = [...vehicles];

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
          (canonicalLocation && canonicalLocation.includes(searchTerm)) ||
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
      filtered = filtered.filter(
        (v) => v.brand && filters.brands.includes(v.brand)
      );
    }
    if (filters.colors.length > 0) {
      filtered = filtered.filter(
        (v) => v.color && filters.colors.includes(v.color)
      );
    }
    if (filters.condition.length > 0) {
      filtered = filtered.filter(
        (v) => v.condition && filters.condition.includes(v.condition)
      );
    }
    if (filters.fuelType.length > 0) {
      filtered = filtered.filter(
        (v) => v.fuelType && filters.fuelType.includes(v.fuelType)
      );
    }
    if (filters.transmission.length > 0) {
      filtered = filtered.filter(
        (v) => v.transmission && filters.transmission.includes(v.transmission)
      );
    }
    if (filters.location.length > 0) {
      filtered = filtered.filter((v) => {
        const vehicleLocationSlug = getCanonicalLocationSlug(v.location);
        return (
          vehicleLocationSlug && filters.location.includes(vehicleLocationSlug)
        );
      });
    }
    if (filters.driveType.length > 0) {
      filtered = filtered.filter(
        (v) => v.driveType && filters.driveType.includes(v.driveType)
      );
    }
    if (filters.saleType.length > 0) {
      filtered = filtered.filter(
        (v) => v.saleType && filters.saleType.includes(v.saleType)
      );
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
    if (filters.postedWithin && filters.postedWithin !== "all") {
      const postedWithinKey = filters.postedWithin as "24h" | "7d" | "30d";
      const now = new Date();
      const timeLimit = {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
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

    if (sortOption) {
      const getDateValue = (vehicle: Vehicle): number => {
        const dateToCheck = vehicle.createdAt || vehicle.postedDate;
        if (!dateToCheck) return 0;
        try {
          const date = new Date(dateToCheck);
          return isNaN(date.getTime()) ? 0 : date.getTime();
        } catch {
          return 0;
        }
      };

      if (sortBy === "relevance") {
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;

          const aDate = getDateValue(a);
          const bDate = getDateValue(b);
          return bDate - aDate;
        });
      } else {
        filtered.sort((a, b) => {
          let aValue: string | number | undefined | null;
          let bValue: string | number | undefined | null;

          if (sortOption.key === "createdAt") {
            aValue = getDateValue(a);
            bValue = getDateValue(b);
          } else {
            const key = sortOption.key as keyof Vehicle;
            const valA = a[key];
            const valB = b[key];

            if (
              (typeof valA === "string" || typeof valA === "number") &&
              (typeof valB === "string" || typeof valB === "number")
            ) {
              aValue = valA;
              bValue = valB;
            } else {
              aValue = null;
              bValue = null;
            }
          }

          // Manejo de valores nulos o indefinidos
          // Si aValue es nulo, se va al final. Si bValue es nulo, se va al final.
          if (aValue == null) return 1;
          if (bValue == null) return -1;

          if (aValue < bValue) {
            return sortOption.order === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortOption.order === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
    }

    return filtered;
  }, [
    vehicles,
    filters,
    sortBy,
    debouncedSearchTerm,
    getCanonicalLocationSlug,
  ]);

  const filteredVehicles = useMemo(() => applyFilters(), [applyFilters]);

  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  return {
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