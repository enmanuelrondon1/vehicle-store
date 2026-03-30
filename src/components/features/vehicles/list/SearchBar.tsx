// src/components/features/vehicles/list/SearchBar.tsx
// ✅ OPTIMIZADO: eliminado framer-motion completamente.
//    Este componente es sticky — siempre visible en /vehicleList.
//    Tenía motion.div con whileHover en el input, AnimatePresence para el
//    spinner de búsqueda, y motion.div para el dropdown de ordenamiento.
//    Todo reemplazado por CSS transitions — mismo efecto, 0 JS listeners.

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Loader2,
  Sparkles,
  Filter,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { SORT_OPTIONS } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

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
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isSearching = searchTerm !== debouncedSearchTerm;

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (sortValue: string) => {
    onSortChange(sortValue);
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentParams.set("sort", sortValue);
    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
    setIsSortOpen(false);
  };

  const getCurrentLabel = () => {
    const option = SORT_OPTIONS.find((opt) => opt.value === sortBy);
    return option ? option.label : "Seleccionar";
  };

  return (
    // ✅ animate-fade-in CSS en lugar de motion.div con containerVariants
    <div className="sticky top-16 md:top-20 z-50 animate-fade-in">
      <div className="card-glass rounded-2xl shadow-hard border border-border/50 overflow-visible">
        <div className="h-1 w-full" style={{ background: "var(--gradient-accent)" }} />

        <div className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

            {/* Campo de búsqueda */}
            {/* ✅ whileHover scale → hover:scale-[1.01] CSS */}
            <div className="relative flex-grow w-full lg:w-auto hover:scale-[1.01] transition-transform duration-200">
              {/* ✅ AnimatePresence del fondo → CSS transition en background-color */}
              <div
                className="absolute inset-0 rounded-xl transition-colors duration-200"
                style={{
                  backgroundColor: isFocused ? "var(--accent-10)" : "transparent",
                }}
              />

              <div className="relative z-10">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200"
                  style={{ color: isFocused ? "var(--accent)" : undefined }}
                />
                <Input
                  type="text"
                  placeholder="Buscar por marca, modelo, año..."
                  className="w-full pl-12 pr-12 h-12 bg-transparent border-transparent focus:border-accent/50 rounded-xl text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />

                {/* ✅ AnimatePresence del spinner → CSS opacity transition */}
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200"
                  style={{
                    opacity: isSearching ? 1 : searchTerm && !isSearching ? 1 : 0,
                    transform: isSearching || (searchTerm && !isSearching) ? "scale(1)" : "scale(0.5)",
                  }}
                >
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-accent" />
                  )}
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Botón de filtros */}
              {/* ✅ motion.div whileHover/whileTap → hover:scale-[1.05] active:scale-[0.95] CSS */}
              <Button
                variant={isFiltersOpen ? "default" : "outline"}
                onClick={onToggleFilters}
                className={`gap-2 h-12 px-4 rounded-xl font-medium hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 ${
                  isFiltersOpen
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                    : "border-border/50 bg-card hover:bg-accent/10"
                }`}
              >
                {/* ✅ motion.div rotate → CSS rotate con transition */}
                <Filter
                  size={20}
                  className="transition-transform duration-300"
                  style={{ transform: isFiltersOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
                <span className="hidden sm:inline">Filtros</span>
              </Button>

              {/* Selector de ordenamiento */}
              <div ref={sortRef} className="relative">
                {/* ✅ motion.div whileHover/whileTap → CSS */}
                <div
                  className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-2 h-12 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <span className="text-base font-medium">{getCurrentLabel()}</span>
                  {/* ✅ motion.div rotate → CSS rotate con transition */}
                  <ChevronDown
                    className="w-4 h-4 text-muted-foreground transition-transform duration-200"
                    style={{ transform: isSortOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </div>

                {/* Dropdown — CSS opacity/transform en lugar de AnimatePresence */}
                <div
                  className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-hard overflow-visible z-[9999] transition-all duration-200 origin-top-right"
                  style={{
                    opacity: isSortOpen ? 1 : 0,
                    transform: isSortOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(-10px)",
                    pointerEvents: isSortOpen ? "auto" : "none",
                  }}
                >
                  <div className="max-h-64 overflow-y-auto">
                    {SORT_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          option.value === sortBy
                            ? "bg-accent/10 text-accent font-medium"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleSortChange(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso durante búsqueda — CSS transition */}
          <div
            className="mt-2 h-1 w-full rounded-full overflow-hidden transition-opacity duration-200"
            style={{ opacity: isSearching ? 1 : 0 }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                background: "var(--gradient-accent)",
                width: isSearching ? "100%" : "0%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;