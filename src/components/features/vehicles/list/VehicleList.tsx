// src/components/features/vehicles/list/VehicleList.tsx
"use client";

// React y Core
import { useState, useCallback, useEffect } from "react";

// Third-party libraries
import { motion, AnimatePresence } from "framer-motion";

// Hooks y Types internos
import { useVehicleFiltering } from "@/hooks/useVehicleFiltering";
import { useDebounce } from "@/hooks/useDebounce";
import type { Vehicle } from "@/types/types";

// Componentes internos (ordenados por render)
import VehicleListHeader from "./VehicleListHeader";
import VehicleStats from "../common/VehicleStats";
import SearchBar from "./SearchBar";
import ActiveFiltersDisplay from "./ActiveFiltersDisplay";
import AdvancedFiltersPanel from "./AdvancedFiltersPanel";
import CompareBar from "../common/CompareBar";
import VehicleGrid from "../common/VehicleGrid";
import PaginationControls from "./PaginationControls";
import NoResults from "../../../shared/feedback/NoResults";

// ... el resto de tu componente

const VehicleList: React.FC<{ initialVehicles: Vehicle[] }> = ({
  initialVehicles,
}) => {
  const [viewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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

   // ✅ AÑADE ESTA FUNCIÓN MEMOIZADA
  const handleSearch = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, search: term }));
  }, []); // <-- No tiene dependencias, por lo que nunca se volverá a crear.


  return (
    <div className="bg-background text-foreground min-h-screen pt-8 pb-16 px-4 mt-16 md:mt-16">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* CAMBIO: Le pasamos el conteo de vehículos para que el header sea dinámico */}
        <VehicleListHeader vehicleCount={filteredVehicles.length} />

        <VehicleStats filteredVehicles={filteredVehicles} />
        <SearchBar
          onSearch={handleSearch}
          onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
          isFiltersOpen={showAdvancedFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <ActiveFiltersDisplay
          filterOptions={filterOptions}
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearAllFilters}
        />

        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <CompareBar
                compareList={compareList}
                setCompareList={setCompareList}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {filteredVehicles.length === 0 ? (
          <NoResults
            vehicles={initialVehicles.length}
            clearAllFilters={clearAllFilters}
            handleRetry={handleRetry}
          />
        ) : (
          <>
            {/* 
              CAMBIO: El VehicleGrid ahora es mucho más simple.
              No necesita props de animación, se encarga él mismo.
            */}
            <VehicleGrid
              vehicles={paginatedVehicles}
              viewMode={viewMode}
              compareList={compareList}
              toggleCompare={toggleCompare}
            />

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalVehicles={filteredVehicles.length}
                goToPage={goToPage}
                setItemsPerPage={setItemsPerPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
