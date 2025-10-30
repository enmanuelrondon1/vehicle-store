// src/components/features/vehicles/list/SearchBar.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { SortSelector } from "@/components/ui/seraui-selector";
import { SORT_OPTIONS } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchBarProps = {
  onSearch: (term: string) => void;
  onToggleFilters: () => void;
  isFiltersOpen: boolean;
  sortBy: string;
  onSortChange: (sortValue: string) => void;
};

const SearchBar = ({
  onSearch,
  onToggleFilters,
  isFiltersOpen,
  sortBy,
  onSortChange,
}: SearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const handleSortChange = (sortValue: string) => {
    onSortChange(sortValue);
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    currentParams.set("sort", sortValue);
    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
  };

  return (
    // ✅ MEJORA: Eliminamos mb-6 para que el espaciado lo controle el padre.
    <div className="bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-md sticky top-20 z-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-grow w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por marca, modelo, año..."
              className="w-full pl-10 pr-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button
            variant={isFiltersOpen ? "default" : "outline"}
            onClick={onToggleFilters}
            className="gap-2"
          >
            <SlidersHorizontal size={20} />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Ordenar por:
            </span>
            <SortSelector
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={handleSortChange}
              placeholder="Seleccionar orden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;