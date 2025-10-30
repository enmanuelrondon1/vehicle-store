// src/components/features/vehicles/list/VehicleList.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import VehicleListHeader from "./VehicleListHeader";
import VehicleStats from "../common/VehicleStats";
import SearchBar from "./SearchBar";
import PaginationControls from "./PaginationControls";
import NoResults from "../../../shared/feedback/NoResults";
import CompareBar from "../common/CompareBar";
import AdvancedFiltersPanel from "./AdvancedFiltersPanel";
import ActiveFiltersDisplay from "./ActiveFiltersDisplay";
import type { Vehicle } from "@/types/types";
import VehicleGrid from "../common/VehicleGrid";
import { useVehicleFiltering } from "@/hooks/useVehicleFiltering";
import { useDebounce } from "@/hooks/useDebounce";

const VehicleList: React.FC<{
  initialVehicles: Vehicle[];
}> = ({ initialVehicles }) => {
  const [vehicles] = useState<Vehicle[]>(initialVehicles);

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

  return (
    // ✅ CAMBIO FINAL: Contenedor principal con espaciado controlado
    <div className="bg-background text-foreground min-h-screen pt-8 pb-16 px-4 mt-16 md:mt-16">
      <div className="max-w-7xl mx-auto space-y-6">
        <VehicleListHeader />
        <VehicleStats filteredVehicles={filteredVehicles} />
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
        />
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
          totalVehicles={vehicles.length}
        />
        {compareList.length > 0 && (
          <CompareBar
            compareList={compareList}
            setCompareList={setCompareList}
          />
        )}
        {filteredVehicles.length === 0 ? (
          <NoResults
            vehicles={vehicles.length}
            clearAllFilters={clearAllFilters}
            handleRetry={handleRetry}
          />
        ) : (
          <>
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