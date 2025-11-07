// src/components/features/vehicles/list/SearchBar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react"; // MEJORA: Añadimos Loader2
import { motion } from "framer-motion"; // MEJORA: Añadimos Framer Motion
import { SortSelector } from "@/components/ui/seraui-selector";
import { SORT_OPTIONS } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // MEJORA: Añadimos Card
import { useDebounce } from "@/hooks/useDebounce"; // MEJORA: Añadimos el hook personalizado

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

  // MEJORA: Usamos el hook useDebounce para una lógica más limpia
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isSearching = searchTerm !== debouncedSearchTerm; // Para mostrar el indicador de carga

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSortChange = (sortValue: string) => {
    onSortChange(sortValue);
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    currentParams.set("sort", sortValue);
    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
  };

  return (
    // MEJORA: Usamos el componente Card para unificar el diseño y añadir efectos
    <Card className="shadow-lg border-border card-hover sticky top-16 md:top-20 z-50">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por marca, modelo, año..."
              className="w-full pl-10 pr-10" // MEJORA: Añadimos pr-10 para el spinner
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* MEJORA: Indicador de carga sutil dentro del input */}
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
            )}
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button
              variant={isFiltersOpen ? "default" : "outline"}
              onClick={onToggleFilters}
              className="gap-2"
            >
              {/* MEJORA: Animamos el icono cuando los filtros están abiertos */}
              <motion.div
                animate={{ rotate: isFiltersOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <SlidersHorizontal size={20} />
              </motion.div>
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
      </CardContent>
    </Card>
  );
};

export default SearchBar;