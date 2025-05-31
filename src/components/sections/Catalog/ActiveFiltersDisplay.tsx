import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface ActiveFilter {
  type: string;
  label: string;
  value?: string;
}

interface ActiveFiltersDisplayProps {
  filters: {
    category: string;
    brands: string[];
    priceRange: [number, number];
    yearRange: [number, number];
    condition: string;
    fuelType: string;
    transmission: string;
    searchQuery: string;
  };
  onRemoveFilter: (filterType: string, value?: string) => void;
  onClearAll: () => void;
}

const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  const activeFilters = useMemo(() => {
    const active: ActiveFilter[] = [];
    if (filters.category !== "all") active.push({ type: "category", label: filters.category });
    if (filters.condition !== "all") active.push({ type: "condition", label: filters.condition });
    if (filters.fuelType !== "all") active.push({ type: "fuelType", label: filters.fuelType });
    if (filters.transmission !== "all") active.push({ type: "transmission", label: filters.transmission });
    filters.brands.forEach((brand) => active.push({ type: "brands", label: brand, value: brand }));
    if (filters.priceRange[0] > 50000 || filters.priceRange[1] < 6000000) {
      active.push({
        type: "priceRange",
        label: `$${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`,
      });
    }
    if (filters.yearRange[0] > 2010 || filters.yearRange[1] < 2025) {
      active.push({ type: "yearRange", label: `${filters.yearRange[0]} - ${filters.yearRange[1]}` });
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
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs text-gray-600 dark:text-gray-400">
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

export default ActiveFiltersDisplay;