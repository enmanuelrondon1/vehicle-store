// src/components/features/vehicles/list/VehicleList.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useVehicleFiltering } from "@/hooks/useVehicleFiltering";
import { useDebounce } from "@/hooks/useDebounce";
import type { Vehicle } from "@/types/types";

import VehicleListHeader from "./VehicleListHeader";
import VehicleStats from "../common/VehicleStats";
import SearchBar from "./SearchBar";
import ActiveFiltersDisplay from "./ActiveFiltersDisplay";
import AdvancedFiltersPanel from "./AdvancedFiltersPanel";
import CompareBar from "../common/CompareBar";
import VehicleGrid from "../common/VehicleGrid";
import PaginationControls from "./PaginationControls";
import NoResults from "../../../shared/feedback/NoResults";

const VehicleList: React.FC<{ initialVehicles: Vehicle[] }> = ({
  initialVehicles,
}) => {
  const [viewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Efecto de scroll para elementos parallax
  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -20]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  const {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    filteredVehicles,
    filterOptions,
    clearAllFilters,
    showOnlyPublishedBrands,
    setShowOnlyPublishedBrands,
    showOnlyPublishedColors,
    setShowOnlyPublishedColors,
    showOnlyPublishedLocations,
    setShowOnlyPublishedLocations,
  } = useVehicleFiltering(initialVehicles);

  const debouncedSearchTerm = useDebounce(filters.search, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearchTerm,
    filters.category,
    filters.brands,
    filters.priceRange,
    filters.yearRange,
    sortBy,
  ]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const toggleCompare = useCallback((vehicleId: string) => {
    setCompareList((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : prev.length < 3
        ? [...prev, vehicleId]
        : prev
    );
  }, []);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, search: term }));
  }, []);

  // Variantes de animación premium para un movimiento más fluido
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const filterPanelVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  return (
    <div className="bg-background text-foreground min-h-screen section-spacing relative">
      {/* Fondo decorativo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5 pointer-events-none" />
      
      {/* Elemento decorativo flotante */}
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 rounded-full bg-accent/10 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <div className="container-wide relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header con efecto glassmorphism y parallax */}
          <motion.div 
            variants={itemVariants} 
            className="card-glass p-6 rounded-xl shadow-hard"
            style={{ y: headerY, opacity: headerOpacity }}
          >
            <VehicleListHeader vehicleCount={filteredVehicles.length} />
          </motion.div>

          {/* Estadísticas con animación de entrada y efecto de brillo */}
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent shimmer-effect rounded-xl" />
            <VehicleStats filteredVehicles={filteredVehicles} />
          </motion.div>

          {/* CAMBIO CLAVE: Contenedor separado para la barra de búsqueda con overflow-visible y z-index alto */}
          <div className="relative z-[100]">
            <motion.div 
              variants={itemVariants}
              className="glow-effect"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <SearchBar
                onSearch={handleSearch}
                onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
                isFiltersOpen={showAdvancedFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </motion.div>
          </div>

          {/* Filtros activos con animación suave */}
          <motion.div variants={itemVariants}>
            <ActiveFiltersDisplay
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearAllFilters}
            />
          </motion.div>

          {/* Panel de filtros avanzados con animación mejorada */}
          <AnimatePresence mode="wait">
            {showAdvancedFilters && (
              <motion.div
                variants={filterPanelVariants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{ overflow: "hidden" }}
                className="card-glass rounded-xl shadow-hard"
              >
                <div className="p-6">
                  <AdvancedFiltersPanel
                    filters={filters}
                    filterOptions={filterOptions}
                    onFiltersChange={setFilters}
                    onClearFilters={clearAllFilters}
                    isOpen={showAdvancedFilters}
                    onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    showOnlyPublishedBrands={showOnlyPublishedBrands}
                    setShowOnlyPublishedBrands={setShowOnlyPublishedBrands}
                    showOnlyPublishedColors={showOnlyPublishedColors}
                    setShowOnlyPublishedColors={setShowOnlyPublishedColors}
                    showOnlyPublishedLocations={showOnlyPublishedLocations}
                    setShowOnlyPublishedLocations={setShowOnlyPublishedLocations}
                    totalVehicles={initialVehicles.length}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Barra de comparación con efecto de entrada mejorado - REDUCIDO z-index */}
          <AnimatePresence mode="wait">
            {compareList.length > 0 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="card-glass rounded-xl shadow-hard sticky top-20 z-30 backdrop-blur-lg"
              >
                <div className="p-4">
                  <CompareBar
                    compareList={compareList}
                    setCompareList={setCompareList}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid de vehículos o mensaje de no resultados */}
          {filteredVehicles.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="flex justify-center py-12"
            >
              <NoResults
                vehicles={initialVehicles.length}
                clearAllFilters={clearAllFilters}
                handleRetry={handleRetry}
              />
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Contenedor con efecto de vidrio para el grid */}
              <div className="card-glass rounded-xl p-6 shadow-hard">
                <VehicleGrid
                  vehicles={paginatedVehicles}
                  viewMode={viewMode}
                  compareList={compareList}
                  toggleCompare={toggleCompare}
                />
              </div>
              
              {totalPages > 1 && (
                <motion.div 
                  variants={itemVariants}
                  className="flex justify-center"
                >
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalVehicles={filteredVehicles.length}
                    goToPage={goToPage}
                    setItemsPerPage={setItemsPerPage}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Elemento decorativo inferior */}
      <motion.div
        className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
};

export default VehicleList;