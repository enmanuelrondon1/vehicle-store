"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ChevronDown,
  Filter,
  X,
  Search,
  Heart,
  Phone,
  Star,
  MapPin,
  Fuel,
  Settings,
  Calendar,
} from "lucide-react";
import vehicles from "@/data/vehicles.json";
import { useLanguage } from "@/context/LanguajeContext";
import Image from "next/image";

// Definición del tipo de vehículo
interface Vehicle {
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

interface FilterState {
  category: string;
  brands: string[];
  priceRange: [number, number];
  yearRange: [number, number];
  condition: string;
  fuelType: string;
  transmission: string;
  searchQuery: string;
}

// Hook para debounce
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// Componente Skeleton para las tarjetas
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VehicleCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-12" />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
    </CardContent>
  </Card>
);

// Componente para filtro de precio con slider
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PriceRangeFilter: React.FC<{
  range: [number, number];
  onChange: (range: [number, number]) => void;
  min?: number;
  max?: number;
}> = ({ range, onChange, min = 50000, max = 6000000 }) => {
  const [localRange, setLocalRange] = useState(range);

  useEffect(() => {
    setLocalRange(range);
  }, [range]);

  const handleSliderChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setLocalRange(newRange);
  };

  const handleSliderCommit = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    onChange(newRange);
  };

  const presets = [
    { label: "Hasta $200K", value: [min, 200000] as [number, number] },
    { label: "$200K - $500K", value: [200000, 500000] as [number, number] },
    { label: "$500K - $1M", value: [500000, 1000000] as [number, number] },
    { label: "Más de $1M", value: [1000000, max] as [number, number] },
  ];

  return (
    <div>
      <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
        Rango de Precio
      </label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {presets.map((preset, index) => (
          <Button
            key={index}
            variant={
              localRange[0] === preset.value[0] &&
              localRange[1] === preset.value[1]
                ? "default"
                : "outline"
            }
            size="sm"
            className="text-xs h-8"
            onClick={() => {
              setLocalRange(preset.value);
              onChange(preset.value);
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div className="px-2 pb-4">
        <Slider
          min={min}
          max={max}
          step={1000}
          value={localRange}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>${localRange[0].toLocaleString()}</span>
          <span>${localRange[1].toLocaleString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
            type="number"
            placeholder="Mínimo"
            value={localRange[0]}
            onChange={(e) => {
              const value = Number(e.target.value) || min;
              if (value <= localRange[1] && value >= min) {
                const newRange: [number, number] = [value, localRange[1]];
                setLocalRange(newRange);
                onChange(newRange);
              }
            }}
            className="text-sm"
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Máximo"
            value={localRange[1]}
            onChange={(e) => {
              const value = Number(e.target.value) || max;
              if (value >= localRange[0] && value <= max) {
                const newRange: [number, number] = [localRange[0], value];
                setLocalRange(newRange);
                onChange(newRange);
              }
            }}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};

// Componente para filtros múltiples
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MultiSelectFilter: React.FC<{
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (options: string[]) => void;
  maxItems?: number;
}> = ({ label, options, selectedOptions, onChange, maxItems = 10 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = useCallback(
    (option: string) => {
      onChange(
        selectedOptions.includes(option)
          ? selectedOptions.filter((item) => item !== option)
          : [...selectedOptions, option]
      );
    },
    [selectedOptions, onChange]
  );

  const displayOptions = options.slice(0, maxItems);

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between text-left font-normal text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        >
          <span className="truncate">
            {selectedOptions.length === 0
              ? `Seleccionar ${label.toLowerCase()}`
              : `${selectedOptions.length} seleccionado${
                  selectedOptions.length > 1 ? "s" : ""
                }`}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            } text-gray-600 dark:text-gray-400`}
          />
        </Button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {displayOptions.map((option) => (
              <label
                key={option}
                className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="mr-2 rounded text-blue-600 dark:text-blue-400"
                />
                <span className="text-sm truncate">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.slice(0, 3).map((option) => (
            <Badge
              key={option}
              variant="secondary"
              className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {option}
              <X
                className="ml-1 h-3 w-3 cursor-pointer text-gray-600 dark:text-gray-400"
                onClick={() => toggleOption(option)}
              />
            </Badge>
          ))}
          {selectedOptions.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              +{selectedOptions.length - 3} más
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

// Componente para selecciones únicas
const SingleSelectFilter: React.FC<{
  label: string;
  options: string[];
  selectedOption: string;
  onChange: (option: string) => void;
}> = ({ label, options, selectedOption, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between text-left font-normal text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        >
          <span className="truncate">
            {selectedOption === "all" || selectedOption === ""
              ? `Seleccionar ${label.toLowerCase()}`
              : selectedOption}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            } text-gray-600 dark:text-gray-400`}
          />
        </Button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm truncate text-gray-900 dark:text-gray-100 ${
                  selectedOption === option
                    ? "bg-gray-100 dark:bg-gray-700 font-medium"
                    : ""
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para filtros activos
interface ActiveFilter {
  type: string;
  label: string;
  value?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ActiveFilters: React.FC<{
  filters: FilterState;
  onRemoveFilter: (filterType: string, value?: string) => void;
  onClearAll: () => void;
}> = ({ filters, onRemoveFilter, onClearAll }) => {
  const activeFilters = useMemo(() => {
    const active: ActiveFilter[] = [];
    if (filters.category !== "all")
      active.push({ type: "category", label: filters.category });
    if (filters.condition !== "all")
      active.push({ type: "condition", label: filters.condition });
    if (filters.fuelType !== "all")
      active.push({ type: "fuelType", label: filters.fuelType });
    if (filters.transmission !== "all")
      active.push({ type: "transmission", label: filters.transmission });
    filters.brands.forEach((brand) =>
      active.push({ type: "brands", label: brand, value: brand })
    );
    if (filters.priceRange[0] > 50000 || filters.priceRange[1] < 6000000) {
      active.push({
        type: "priceRange",
        label: `$${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`,
      });
    }
    if (filters.yearRange[0] > 2010 || filters.yearRange[1] < 2025) {
      active.push({
        type: "yearRange",
        label: `${filters.yearRange[0]} - ${filters.yearRange[1]}`,
      });
    }
    return active;
  }, [filters]);

  if (activeFilters.length === 0) return null;

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtros activos ({activeFilters.length})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-gray-600 dark:text-gray-400"
          >
            Limpiar todos
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {filter.label}
              <X
                className="ml-1 h-3 w-3 text-gray-600 dark:text-gray-400"
                onClick={() => onRemoveFilter(filter.type, filter.value)}
              />
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para tarjeta de vehículo
const VehicleCard: React.FC<{
  vehicle: Vehicle;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}> = ({ vehicle, onToggleFavorite, isFavorite }) => {
  const router = useRouter();

  const handleViewMore = () => {
    router.push(`/vehicle/${vehicle.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            width={400}
            height={192}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="sm"
              variant={isFavorite ? "default" : "secondary"}
              className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
              onClick={() => onToggleFavorite(vehicle.id)}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
            <Badge className="bg-white/95 text-black text-xs">
              {vehicle.disponibilidad.es}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < (vehicle.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
              <span className="ml-1">{vehicle.rating || 0}/5</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-blue-600 transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>
            <Badge variant="outline" className="text-xs ml-2">
              {vehicle.year}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {vehicle.location}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {vehicle.mileage.toLocaleString()} km
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-3 w-3" />
              {vehicle.fuelType.es}
            </div>
            <div className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              {vehicle.transmission.es}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                ${vehicle.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{vehicle.condition.es}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
              <Button size="sm" onClick={handleViewMore}>
                Ver más
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Definición de la interfaz para los resultados de useMemo
interface CatalogMemoResult {
  filteredVehicles: Vehicle[];
  stats: {
    total: number;
    avgPrice: number;
    priceRange: { min: number; max: number };
  };
  paginatedVehicles: Vehicle[];
  totalPages: number;
}

// Componente principal del catálogo
const CatalogPage = () => {
  const { language, translations } = useLanguage();
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    brands: [],
    priceRange: [50000, 6000000],
    yearRange: [2010, 2025],
    condition: "all",
    fuelType: "all",
    transmission: "all",
    searchQuery: "",
  });
  const [sortOption, setSortOption] = useState<
    "price-asc" | "price-desc" | "year-desc" | "mileage-asc" | "rating-desc" | ""
  >("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);

  // Simular carga (reemplazar con API en producción)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [filters, sortOption]);

  // Opciones de filtro
  const filterOptions = useMemo(
    () => ({
      categories: [
        "all",
        ...Array.from(
          new Set(
            (vehicles as { items: Vehicle[] }).items.map(
              (v) => v.category[language]
            )
          )
        ),
      ],
      brands: Array.from(
        new Set((vehicles as { items: Vehicle[] }).items.map((v) => v.brand))
      ).sort(),
      conditions: [
        "all",
        ...Array.from(
          new Set(
            (vehicles as { items: Vehicle[] }).items.map(
              (v) => v.condition[language]
            )
          )
        ),
      ],
      fuelTypes: [
        "all",
        ...Array.from(
          new Set(
            (vehicles as { items: Vehicle[] }).items.map(
              (v) => v.fuelType[language]
            )
          )
        ),
      ],
      transmissions: [
        "all",
        ...Array.from(
          new Set(
            (vehicles as { items: Vehicle[] }).items.map(
              (v) => v.transmission[language]
            )
          )
        ),
      ],
    }),
    [language]
  );

  // Opciones para "Ordenar por"
  const sortOptions = [
    { value: "", label: translations.catalog || "Catálogo" },
    { value: "price-asc", label: "Precio: Menor a Mayor" },
    { value: "price-desc", label: "Precio: Mayor a Menor" },
    { value: "year-desc", label: "Año: Más Recientes" },
    { value: "mileage-asc", label: "Kilometraje: Menor" },
    { value: "rating-desc", label: "Mejor Calificados" },
  ];

  // Filtrado y ordenamiento
  const memoResult = useMemo((): CatalogMemoResult => {
    const filtered = (vehicles as { items: Vehicle[] }).items.filter(
      (v: Vehicle) => {
        if (
          filters.category !== "all" &&
          v.category[language] !== filters.category
        )
          return false;
        if (filters.brands.length > 0 && !filters.brands.includes(v.brand))
          return false;
        if (v.price < filters.priceRange[0] || v.price > filters.priceRange[1])
          return false;
        if (
          filters.condition !== "all" &&
          v.condition[language] !== filters.condition
        )
          return false;
        if (v.year < filters.yearRange[0] || v.year > filters.yearRange[1])
          return false;
        if (
          filters.fuelType !== "all" &&
          v.fuelType[language] !== filters.fuelType
        )
          return false;
        if (
          filters.transmission !== "all" &&
          v.transmission[language] !== filters.transmission
        )
          return false;
        if (debouncedSearchQuery) {
          const query = debouncedSearchQuery.toLowerCase();
          return (
            v.model.toLocaleLowerCase().includes(query) ||
            v.brand.toLowerCase().includes(query) ||
            v.description[language].toLowerCase().includes(query)
          );
        }
        return true;
      }
    );

    const stats = {
      total: filtered.length,
      avgPrice:
        filtered.length > 0
          ? Math.round(
              filtered.reduce((sum, v) => sum + v.price, 0) / filtered.length
            )
          : 0,
      priceRange:
        filtered.length > 0
          ? {
              min: Math.min(...filtered.map((v) => v.price)),
              max: Math.max(...filtered.map((v) => v.price)),
            }
          : { min: 0, max: 0 },
    };

    // Crear una copia para ordenar sin modificar el arreglo filtrado original
    const sortedVehicles = [...filtered];
    if (sortOption) {
      sortedVehicles.sort((a, b) => {
        switch (sortOption) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "year-desc":
            return b.year - a.year;
          case "mileage-asc":
            return a.mileage - b.mileage;
          case "rating-desc":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
    }

    const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedVehicles = sortedVehicles.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return { filteredVehicles: filtered, stats, paginatedVehicles, totalPages };
  }, [
    filters,
    debouncedSearchQuery,
    sortOption,
    currentPage,
    itemsPerPage,
    language,
  ]);

  const { stats, paginatedVehicles, totalPages } = memoResult;

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    []
  );

  const removeFilter = useCallback((filterType: string, value?: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      switch (filterType) {
        case "category":
          newFilters.category = "all";
          break;
        case "condition":
          newFilters.condition = "all";
          break;
        case "fuelType":
          newFilters.fuelType = "all";
          break;
        case "transmission":
          newFilters.transmission = "all";
          break;
        case "brands":
          newFilters.brands = value
            ? prev.brands.filter((b) => b !== value)
            : [];
          break;
        case "priceRange":
          newFilters.priceRange = [50000, 6000000];
          break;
        case "yearRange":
          newFilters.yearRange = [2010, 2025];
          break;
      }
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      category: "all",
      brands: [],
      priceRange: [50000, 6000000],
      yearRange: [2010, 2025],
      condition: "all",
      fuelType: "all",
      transmission: "all",
      searchQuery: "",
    });
    setCurrentPage(1);
  }, []);

  const toggleFavorite = useCallback((vehicleId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(vehicleId)) newFavorites.delete(vehicleId);
      else newFavorites.add(vehicleId);
      return newFavorites;
    });
  }, []);

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {translations.catalog}
          </h1>
          {stats.total > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stats.total} {translations.vehicles || "vehículos"} encontrados •
              Precio promedio: ${stats.avgPrice.toLocaleString()}
              {favorites.size > 0 && (
                <span className="ml-2">
                  • {favorites.size} {translations.favorites}
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
            aria-label={translations.filters || "Filtros"}
          >
            <Filter className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
            {translations.filters || "Filtros"}
            {Object.values(filters).some((v) =>
              Array.isArray(v) ? v.length > 0 : v !== "all" && v !== ""
            ) && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 w-5 rounded-full p-0 text-xs text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700"
              >
                {
                  [
                    filters.category !== "all",
                    filters.condition !== "all",
                    filters.fuelType !== "all",
                    filters.transmission !== "all",
                    filters.brands.length > 0,
                    filters.priceRange[0] > 50000 ||
                      filters.priceRange[1] < 6000000,
                    filters.yearRange[0] > 2010 || filters.yearRange[1] < 2025,
                  ].filter(Boolean).length
                }
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              placeholder={
                translations.exploreVehicles || "Explorar vehículos..."
              }
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="pl-10 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col lg:flex-row gap-6">
        <div
          className={`w-full lg:w-80 ${
            showFilters ? "block" : "hidden lg:block"
          }`}
        >
          <Card className="sticky top-4">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {translations.filters || "Filtros"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-gray-600 dark:text-gray-400"
                >
                  {translations.clear || "Limpiar"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <SingleSelectFilter
                label={translations.vehiclesByCategory || "Categoría"}
                options={filterOptions.categories}
                selectedOption={filters.category}
                onChange={(value) => updateFilter("category", value)}
              />
              <MultiSelectFilter
                label={translations.vehiclesByBrand || "Marcas"}
                options={filterOptions.brands}
                selectedOptions={filters.brands}
                onChange={(brands) => updateFilter("brands", brands)}
                maxItems={8}
              />
              <PriceRangeFilter
                range={filters.priceRange}
                onChange={(range) => updateFilter("priceRange", range)}
                min={50000}
                max={6000000}
              />
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  {translations.vehiclesByYear || "Año"}
                </label>
                <div className="px-2 pb-4">
                  <Slider
                    min={2010}
                    max={2025}
                    step={1}
                    value={filters.yearRange}
                    onValueChange={(values: number[]) =>
                      updateFilter("yearRange", values as [number, number])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{filters.yearRange[0]}</span>
                    <span>{filters.yearRange[1]}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SingleSelectFilter
                  label={translations.condition || "Condición"}
                  options={filterOptions.conditions}
                  selectedOption={filters.condition}
                  onChange={(value) => updateFilter("condition", value)}
                />
                <SingleSelectFilter
                  label={translations.fuelType || "Combustible"}
                  options={filterOptions.fuelTypes}
                  selectedOption={filters.fuelType}
                  onChange={(value) => updateFilter("fuelType", value)}
                />
              </div>
              <SingleSelectFilter
                label={translations.transmission || "Transmisión"}
                options={filterOptions.transmissions}
                selectedOption={filters.transmission}
                onChange={(value) => updateFilter("transmission", value)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <ActiveFilters
            filters={filters}
            onRemoveFilter={removeFilter}
            onClearAll={clearAllFilters}
          />

          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{stats.total}</span>{" "}
              {translations.vehicles || "vehículos"} encontrados
              {stats.total > 0 &&
                stats.priceRange.min !== stats.priceRange.max && (
                  <span className="ml-2">
                    • ${stats.priceRange.min.toLocaleString()} - $
                    {stats.priceRange.max.toLocaleString()}
                  </span>
                )}
              {totalPages > 1 && (
                <span className="ml-2">
                  • Página {currentPage} de {totalPages}
                </span>
              )}
            </div>
            <div className="w-full sm:w-48">
              <SingleSelectFilter
                label={translations.sortBy || "Ordenar por"}
                options={sortOptions.map((opt) => opt.label)}
                selectedOption={
                  sortOptions.find((opt) => opt.value === sortOption)?.label ||
                  translations.sortBy ||
                  "Ordenar por"
                }
                onChange={(label) => {
                  const selectedOption =
                    sortOptions.find((opt) => opt.label === label)?.value || "";
                  setSortOption(selectedOption as "price-asc" | "price-desc" | "year-desc" | "mileage-asc" | "rating-desc" | "");
                }}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <VehicleCardSkeleton key={index} />
              ))}
            </div>
          ) : paginatedVehicles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="max-w-md mx-auto">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    {translations.noResults || "No se encontraron resultados"}
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    {translations.seeAll || "Ver todos"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {paginatedVehicles.map((vehicle: Vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.has(vehicle.id)}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Card>
                  <CardContent className="pt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                        {currentPage > 3 && (
                          <>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(1)}
                                className="cursor-pointer"
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                            {currentPage > 4 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                          </>
                        )}
                        {generatePageNumbers().map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        {currentPage < totalPages - 2 && (
                          <>
                            {currentPage < totalPages - 3 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(totalPages)}
                                className="cursor-pointer"
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                      Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
                      {Math.min(currentPage * itemsPerPage, stats.total)} de{" "}
                      {stats.total} {translations.vehicles || "vehículos"}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;