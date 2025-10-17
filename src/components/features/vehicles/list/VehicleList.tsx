// src/components/features/vehicles/list/VehicleList.tsx
"use client";

import { useState, useCallback, useEffect } from "react"; // ✅ CAMBIO: Añadimos useEffect
import VehicleListHeader from "./VehicleListHeader";
import VehicleStats from "../common/VehicleStats";
import SearchBar from "./SearchBar";
// import VehicleGrid from "./VehicleGrid";
import PaginationControls from "./PaginationControls";
import NoResults from "../../../shared/feedback/NoResults";
import ErrorMessage from "../../../shared/feedback/ErrorMessage";
import LoadingSkeleton from "../../../shared/feedback/LoadingSkeleton";
import CompareBar from "../common/CompareBar";
import AdvancedFiltersPanel from "./AdvancedFiltersPanel";
import ActiveFiltersDisplay from "./ActiveFiltersDisplay";
import type { Vehicle } from "@/types/types";
import VehicleGrid from "../common/VehicleGrid"; // ✅ CORRECCIÓN: La ruta del hook ahora es global
import { useVehicleFiltering } from "@/hooks/useVehicleFiltering";
import { useDebounce } from "@/hooks/useDebounce"; // ✅ MEJORA: Importar hook para debouncing

const VehicleList: React.FC<{
  initialVehicles: Vehicle[];
}> = ({ initialVehicles }) => {
  // const { isDarkMode } = useDarkMode(); // ❌ REMOVED
  const [vehicles] = useState<Vehicle[]>(initialVehicles);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

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

  // ✅ CORRECCIÓN: Añadir una función de reintento simple para recargar la página.
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

  // ❌ REMOVED: backgroundStyle useMemo is no longer needed.
  // We will use semantic Tailwind classes for a consistent look.

  if (isLoading) {
    return <LoadingSkeleton />; // ❌ REMOVED: isDarkMode prop
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        handleRetry={handleRetry}
        isLoading={isLoading}
        retryCount={0}
        // ❌ REMOVED: isDarkMode prop
      />
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <VehicleListHeader /> {/* ❌ REMOVED: isDarkMode prop */}
        <VehicleStats
          filteredVehicles={filteredVehicles}
          // ❌ REMOVED: isDarkMode prop
        />
        <SearchBar
          onSearch={(term) => setFilters((prev) => ({ ...prev, search: term }))}
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
          // ❌ REMOVED: isDarkMode prop
        />
        <AdvancedFiltersPanel
          filters={filters}
          filterOptions={filterOptions}
          onFiltersChange={setFilters}
          onClearFilters={clearAllFilters}
          isOpen={showAdvancedFilters}
          onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
          // ❌ REMOVED: isDarkMode prop
          showOnlyPublishedBrands={showOnlyPublishedBrands}
          setShowOnlyPublishedBrands={setShowOnlyPublishedBrands}
          showOnlyPublishedColors={showOnlyPublishedColors}
          setShowOnlyPublishedColors={setShowOnlyPublishedColors}
          showOnlyPublishedLocations={showOnlyPublishedLocations}
          setShowOnlyPublishedLocations={setShowOnlyPublishedLocations}
          totalVehicles={vehicles.length}
        />
        {compareList.length > 0 && (
          <CompareBar
            compareList={compareList}
            setCompareList={setCompareList}
            // ❌ REMOVED: isDarkMode prop
          />
        )}
        {filteredVehicles.length === 0 ? (
          <NoResults
            vehicles={vehicles.length}
            clearAllFilters={clearAllFilters}
            handleRetry={handleRetry}
            // ❌ REMOVED: isDarkMode prop
          />
        ) : (
          <>
            <VehicleGrid
              vehicles={paginatedVehicles}
              viewMode={viewMode}
              // ❌ REMOVED: isDarkMode prop
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
                // ❌ REMOVED: isDarkMode prop
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
