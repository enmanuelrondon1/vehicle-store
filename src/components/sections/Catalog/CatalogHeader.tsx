import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { Translation } from "@/context/LanguajeContext";

// Definimos el tipo FilterState para los filtros
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

interface CatalogHeaderProps {
  translations: Translation;
  stats: { total: number; avgPrice: number };
  favoritesSize: number;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: FilterState; // Reemplazamos { [key: string]: any } por FilterState
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  translations,
  stats,
  favoritesSize,
  showFilters,
  setShowFilters,
  filters,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {translations.catalog}
        </h1>
        {stats.total > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {stats.total} {translations.vehicles || "vehículos"} encontrados • Precio promedio: $
            {stats.avgPrice.toLocaleString()}
            {favoritesSize > 0 && (
              <span className="ml-2">
                • {favoritesSize} {translations.favorites}
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
              {[
                filters.category !== "all",
                filters.condition !== "all",
                filters.fuelType !== "all",
                filters.transmission !== "all",
                filters.brands.length > 0,
                filters.priceRange[0] > 50000 || filters.priceRange[1] < 6000000,
                filters.yearRange[0] > 2010 || filters.yearRange[1] < 2025,
              ].filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CatalogHeader;