// src/components/sections/Catalog/CatalogPages.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import vehicles from "@/data/vehicles.json";
import { useLanguage } from "@/context/LanguajeContext";
import { useFavorites } from "@/context/FavoritesContext"; // Importamos el hook del contexto
import CatalogHeader from "./CatalogHeader";
import SearchBar from "./SearchBar";
import FiltersSidebar from "./FiltersSidebar";
import ActiveFiltersDisplay from "./ActiveFiltersDisplay";
import VehiclesGrid from "./VehiclesGrid";
import SortAndStatsBar from "./SortAndStatsBar";
import PaginationControls from "./PaginationControls";

export interface Vehicle {
  id: string;
  category: { es: string; en: string };
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: { es: string; en: string };
  engine: { es: string; en: string };
  transmission: { es: string; en: string };
  fuelType: { es: string; en: string };
  condition: { es: string; en: string };
  description: { es: string; en: string };
  images: string[];
  location: string;
  disponibilidad: { es: string; en: string };
  rating?: number;
  loadCapacity?: number;
}

export interface FilterState {
  category: string;
  brands: string[];
  priceRange: [number, number];
  yearRange: [number, number];
  condition: string;
  fuelType: string;
  transmission: string;
  searchQuery: string;
}

export type SortOption = "price-asc" | "price-desc" | "year-desc" | "mileage-asc" | "rating-desc" | "";

const initialFilters: FilterState = {
  category: "all",
  brands: [],
  priceRange: [50000, 6000000],
  yearRange: [2010, 2025],
  condition: "all",
  fuelType: "all",
  transmission: "all",
  searchQuery: "",
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const CatalogPages = () => {
  const { language, translations } = useLanguage();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortOption, setSortOption] = useState<SortOption>("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const { favorites, toggleFavorite } = useFavorites(); // Usamos toggleFavorite del contexto

  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [filters, sortOption]);

  const filterOptions = useMemo(
    () => ({
      categories: [
        "all",
        ...Array.from(new Set((vehicles as { items: Vehicle[] }).items.map((v) => v.category[language]))),
      ],
      brands: Array.from(new Set((vehicles as { items: Vehicle[] }).items.map((v) => v.brand))).sort(),
      conditions: [
        "all",
        ...Array.from(new Set((vehicles as { items: Vehicle[] }).items.map((v) => v.condition[language]))),
      ],
      fuelTypes: [
        "all",
        ...Array.from(new Set((vehicles as { items: Vehicle[] }).items.map((v) => v.fuelType[language]))),
      ],
      transmissions: [
        "all",
        ...Array.from(new Set((vehicles as { items: Vehicle[] }).items.map((v) => v.transmission[language]))),
      ],
    }),
    [language]
  );

  const sortOptions = [
    { value: "", label: translations.catalog },
    { value: "price-asc", label: translations["price-asc"] },
    { value: "price-desc", label: translations["price-desc"] },
    { value: "year-desc", label: translations["year-desc"] },
    { value: "mileage-asc", label: translations["mileage-asc"] },
    { value: "rating-desc", label: translations["rating-desc"] },
  ];

  const memoResult = useMemo(() => {
    const filtered = (vehicles as { items: Vehicle[] }).items.filter((v: Vehicle) => {
      if (filters.category !== "all" && v.category[language] !== filters.category) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(v.brand)) return false;
      if (v.price < filters.priceRange[0] || v.price > filters.priceRange[1]) return false;
      if (filters.condition !== "all" && v.condition[language] !== filters.condition) return false;
      if (v.year < filters.yearRange[0] || v.year > filters.yearRange[1]) return false;
      if (filters.fuelType !== "all" && v.fuelType[language] !== filters.fuelType) return false;
      if (filters.transmission !== "all" && v.transmission[language] !== filters.transmission) return false;
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        return (
          v.model.toLowerCase().includes(query) ||
          v.brand.toLowerCase().includes(query) ||
          v.description[language].toLowerCase().includes(query)
        );
      }
      return true;
    });

    const stats = {
      total: filtered.length,
      avgPrice: filtered.length > 0 ? Math.round(filtered.reduce((sum, v) => sum + v.price, 0) / filtered.length) : 0,
      priceRange: filtered.length > 0 ? { min: Math.min(...filtered.map((v) => v.price)), max: Math.max(...filtered.map((v) => v.price)) } : { min: 0, max: 0 },
    };

    const sortedVehicles = [...filtered];
    if (sortOption) {
      sortedVehicles.sort((a, b) => {
        switch (sortOption) {
          case "price-asc": return a.price - b.price;
          case "price-desc": return b.price - a.price;
          case "year-desc": return b.year - a.year;
          case "mileage-asc": return a.mileage - b.mileage;
          case "rating-desc": return (b.rating || 0) - (a.rating || 0);
          default: return 0;
        }
      });
    }

    const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedVehicles = sortedVehicles.slice(startIndex, startIndex + itemsPerPage);

    return { filteredVehicles: filtered, stats, paginatedVehicles, totalPages };
  }, [filters, debouncedSearchQuery, sortOption, currentPage, itemsPerPage, language]);

  const { stats, paginatedVehicles, totalPages } = memoResult;

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const removeFilter = useCallback((filterType: string, value?: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      switch (filterType) {
        case "category": newFilters.category = "all"; break;
        case "condition": newFilters.condition = "all"; break;
        case "fuelType": newFilters.fuelType = "all"; break;
        case "transmission": newFilters.transmission = "all"; break;
        case "brands": newFilters.brands = value ? prev.brands.filter((b) => b !== value) : []; break;
        case "priceRange": newFilters.priceRange = [50000, 6000000]; break;
        case "yearRange": newFilters.yearRange = [2010, 2025]; break;
      }
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, []);

  return (
    <div className="container mx-auto py-6 px-4">
      <CatalogHeader
        translations={translations}
        stats={stats}
        favoritesSize={favorites.size}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
      />
      <SearchBar
        translations={translations}
        searchQuery={filters.searchQuery}
        onSearchChange={(value) => updateFilter("searchQuery", value)}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <FiltersSidebar
          translations={translations}
          filterOptions={filterOptions}
          filters={filters}
          showFilters={showFilters}
          updateFilter={updateFilter}
          clearAllFilters={clearAllFilters}
        />
        <div className="flex-1">
          <ActiveFiltersDisplay
            filters={filters}
            onRemoveFilter={removeFilter}
            onClearAll={clearAllFilters}
          />
          <SortAndStatsBar
            translations={translations}
            stats={stats}
            totalPages={totalPages}
            currentPage={currentPage}
            sortOption={sortOption}
            sortOptions={sortOptions}
            setSortOption={setSortOption}
          />
          <VehiclesGrid
            translations={translations}
            isLoading={isLoading}
            paginatedVehicles={paginatedVehicles}
            favorites={favorites}
            itemsPerPage={itemsPerPage}
            toggleFavorite={toggleFavorite} // Ya está definido en el contexto
            clearAllFilters={clearAllFilters}
          />
          <PaginationControls
            translations={translations}
            totalPages={totalPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={stats.total}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogPages;