// src/components/features/vehicles/list/VehicleList.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useVehicleFiltering } from "@/hooks/useVehicleFiltering";
import { useDebounce } from "@/hooks/useDebounce";
import type { Vehicle } from "@/types/types";

import VehicleListHeader from "./VehicleListHeader";
import VehicleStats from "../common/VehicleStats";
import SearchBar from "./SearchBar";
import ActiveFiltersDisplay from "./ActiveFiltersDisplay";
import CompareBar from "../common/CompareBar";
import VehicleGrid from "../common/VehicleGrid";
import PaginationControls from "./PaginationControls";
import NoResults from "../../../shared/feedback/NoResults";

// ✅ Lazy — solo carga cuando el usuario abre los filtros avanzados
const AdvancedFiltersPanel = dynamic(() => import("./AdvancedFiltersPanel"), {
  loading: () => (
    <div className="p-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 bg-muted rounded-xl animate-pulse" />
      ))}
    </div>
  ),
});

const VehicleList: React.FC<{
  initialVehicles: Vehicle[];
  totalVehiclesCount?: number; // ✅ nuevo: total real en BD
}> = ({ initialVehicles, totalVehiclesCount = 0 }) => {
  const [viewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const {
    filters, setFilters, sortBy, setSortBy, filteredVehicles, filterOptions,
    clearAllFilters, showOnlyPublishedBrands, setShowOnlyPublishedBrands,
    showOnlyPublishedColors, setShowOnlyPublishedColors,
    showOnlyPublishedLocations, setShowOnlyPublishedLocations,
  } = useVehicleFiltering(initialVehicles);

  const debouncedSearchTerm = useDebounce(filters.search, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filters.category, filters.brands, filters.priceRange, filters.yearRange, sortBy]);

  const handleRetry = useCallback(() => { window.location.reload(); }, []);

  const toggleCompare = useCallback((vehicleId: string) => {
    setCompareList((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : prev.length < 3 ? [...prev, vehicleId] : prev
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
  }, [setFilters]);

  // ✅ Muestra banner solo si hay más vehículos en BD que los cargados
  const hasMoreInDB = totalVehiclesCount > initialVehicles.length;

  return (
    <div className="bg-background text-foreground min-h-screen section-spacing relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5 pointer-events-none" />

      <div className="container-wide relative z-10 space-y-8">

        {/* Header */}
        <div className="card-glass p-6 rounded-xl shadow-hard animate-in fade-in slide-in-from-top-4 duration-500">
          <VehicleListHeader vehicleCount={filteredVehicles.length} />
        </div>

        {/* ✅ Banner informativo si hay más vehículos en BD */}
        {hasMoreInDB && (
          <div
            className="text-center text-sm py-2 px-4 rounded-lg"
            style={{
              backgroundColor: "var(--accent-10)",
              color: "var(--accent)",
              border: "1px solid var(--accent-20)",
            }}
          >
            Mostrando los {initialVehicles.length} vehículos más recientes de{" "}
            <strong>{totalVehiclesCount}</strong> disponibles. Usa los filtros
            para encontrar el tuyo.
          </div>
        )}

        {/* Stats */}
        <div className="animate-in fade-in duration-500 delay-100">
          <VehicleStats filteredVehicles={filteredVehicles} />
        </div>

        {/* Search bar */}
        <div className="relative z-[100] animate-in fade-in duration-500 delay-150">
          <SearchBar
            onSearch={handleSearch}
            onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            isFiltersOpen={showAdvancedFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Filtros activos */}
        <ActiveFiltersDisplay
          filterOptions={filterOptions}
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearAllFilters}
        />

        {/* Panel de filtros avanzados — lazy */}
        <div
          className={`card-glass rounded-xl shadow-hard overflow-hidden transition-all duration-300 ease-in-out ${
            showAdvancedFilters ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0"
          }`}
        >
          {showAdvancedFilters && (
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
          )}
        </div>

        {/* Barra de comparación */}
        {compareList.length > 0 && (
          <div className="card-glass rounded-xl shadow-hard sticky top-20 z-30 backdrop-blur-lg animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-4">
              <CompareBar compareList={compareList} setCompareList={setCompareList} />
            </div>
          </div>
        )}

        {/* Grid de vehículos */}
        {filteredVehicles.length === 0 ? (
          <div className="flex justify-center py-12">
            <NoResults
              vehicles={initialVehicles.length}
              clearAllFilters={clearAllFilters}
              handleRetry={handleRetry}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="card-glass rounded-xl p-6 shadow-hard">
              <VehicleGrid
                vehicles={paginatedVehicles}
                viewMode={viewMode}
                compareList={compareList}
                toggleCompare={toggleCompare}
              />
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalVehicles={filteredVehicles.length}
                  goToPage={goToPage}
                  setItemsPerPage={setItemsPerPage}
                />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default VehicleList;