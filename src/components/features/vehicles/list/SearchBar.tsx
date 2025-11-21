// src/components/features/vehicles/list/SearchBar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Loader2, Sparkles, Filter, ChevronDown, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [isFocused, setIsFocused] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Usamos el hook useDebounce para una lógica más limpia
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isSearching = searchTerm !== debouncedSearchTerm; // Para mostrar el indicador de carga

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  // Cerrar el selector al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSortChange = (sortValue: string) => {
    onSortChange(sortValue);
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    currentParams.set("sort", sortValue);
    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
    setIsSortOpen(false);
  };

  // Variantes de animación para el contenedor
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  // Variantes de animación para los elementos internos
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  // Obtener la etiqueta del valor actual
  const getCurrentLabel = () => {
    const option = SORT_OPTIONS.find(opt => opt.value === sortBy);
    return option ? option.label : "Seleccionar";
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-16 md:top-20 z-50"
    >
      <div className="card-glass rounded-2xl shadow-hard border border-border/50 overflow-visible">
        {/* Efecto de brillo superior */}
        <div
          className="h-1 w-full"
          style={{ background: "var(--gradient-accent)" }}
        />
        
        <div className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Campo de búsqueda mejorado */}
            <motion.div
              variants={itemVariants}
              className="relative flex-grow w-full lg:w-auto"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Efecto de fondo animado cuando está enfocado */}
              <AnimatePresence>
                {isFocused && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: "var(--accent-10)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              
              <div className="relative z-10">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
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
                
                {/* Indicador de carga mejorado */}
                <AnimatePresence>
                  {isSearching && (
                    <motion.div
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Loader2 className="w-5 h-5 text-accent animate-spin" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Efecto de brillo cuando hay texto */}
                {searchTerm && !isSearching && (
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sparkles className="w-5 h-5 text-accent" />
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            {/* Controles de filtros y ordenamiento */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 w-full lg:w-auto"
            >
              {/* Botón de filtros mejorado */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={isFiltersOpen ? "default" : "outline"}
                  onClick={onToggleFilters}
                  className={`gap-2 h-12 px-4 rounded-xl font-medium ${
                    isFiltersOpen
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                      : "border-border/50 bg-card hover:bg-accent/10"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: isFiltersOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Filter size={20} />
                  </motion.div>
                  <span className="hidden sm:inline">Filtros</span>
                </Button>
              </motion.div>
              
              {/* Selector de ordenamiento mejorado - SIMPLIFICADO Y CORREGIDO */}
              <div ref={sortRef} className="relative">
                <motion.div
                  className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-2 h-12 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <span className="text-base font-medium">{getCurrentLabel()}</span>
                  <motion.div
                    animate={{ rotate: isSortOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </motion.div>
                
                {/* Menú desplegable con posicionamiento absoluto y z-index alto */}
                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-hard overflow-visible z-[9999]"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
          
          {/* Barra de progreso sutil durante la búsqueda */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                className="mt-2 h-1 w-full rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="h-full"
                  style={{ background: "var(--gradient-accent)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchBar;