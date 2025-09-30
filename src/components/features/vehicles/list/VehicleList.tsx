// src/components/features/vehicles/list/VehicleList.tsx
"use client";

import { useState, useCallback, useMemo, useEffect } from "react"; // ✅ CAMBIO: Añadimos useEffect
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
import { useDarkMode } from "@/context/DarkModeContext";
import VehicleGrid from "../common/VehicleGrid"; // ✅ CORRECCIÓN: La ruta del hook ahora es global
import { useVehicleFiltering } from "@/hooks/useVehicleFiltering";
import { useDebounce } from "@/hooks/useDebounce"; // ✅ MEJORA: Importar hook para debouncing

// ✅ CAMBIO: El componente ahora acepta `initialVehicles` como prop
const VehicleList: React.FC<{ initialVehicles: Vehicle[] }> = ({
  initialVehicles,
}) => {
  const { isDarkMode } = useDarkMode();
  const [vehicles] = useState<Vehicle[]>(initialVehicles);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // ✅ MEJORA: Usar el hook de filtrado para encapsular la lógica
  const {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    filteredVehicles,
    filterOptions, // ✅ USAR LAS OPCIONES DEL HOOK
    clearAllFilters,
  } = useVehicleFiltering(initialVehicles);

  // ✅ MEJORA: Aplicar "debouncing" a la búsqueda para mejorar el rendimiento
  const debouncedSearchTerm = useDebounce(filters.search, 300);

  useEffect(() => {
    // El filtrado se recalcula automáticamente por el hook,
    // pero reseteamos la página a 1 cuando los filtros cambian.
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

  const backgroundStyle = useMemo(
    () => ({
      background: isDarkMode
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
        : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
    }),
    [isDarkMode]
  );

  if (isLoading) {
    return <LoadingSkeleton isDarkMode={isDarkMode} />;
  }

  if (error) {
    // ✅ CAMBIO: Simplificamos el manejo de errores, ya que el error crítico se maneja en la página del servidor.
    // Esto podría ser para errores de filtrado o acciones futuras.
    return (
      <ErrorMessage
        error={error}
        handleRetry={handleRetry}
        isLoading={isLoading}
        retryCount={0} // Ya no tenemos reintentos, pasamos 0
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={backgroundStyle}>
      <div className="max-w-7xl mx-auto">
        <VehicleListHeader isDarkMode={isDarkMode} />
        <VehicleStats
          filteredVehicles={filteredVehicles}
          isDarkMode={isDarkMode}
        />
        <SearchBar
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showAdvancedFilters={showAdvancedFilters}
          setShowAdvancedFilters={setShowAdvancedFilters}
          isDarkMode={isDarkMode}
          clearAllFilters={clearAllFilters}
          filterOptions={filterOptions}
        />
        {/* ✅ AÑADIR: Renderizar los chips de filtros activos */}
        <ActiveFiltersDisplay
          filterOptions={filterOptions} // ✅ AÑADIR: Pasar las opciones de filtro
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearAllFilters}
          isDarkMode={isDarkMode}
        />
        <AdvancedFiltersPanel
          filters={filters}
          filterOptions={filterOptions}
          onFiltersChange={setFilters}
          onClearFilters={clearAllFilters}
          isOpen={showAdvancedFilters}
          onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
          isDarkMode={isDarkMode}
        />

        {compareList.length > 0 && (
          <CompareBar
            compareList={compareList}
            setCompareList={setCompareList}
            isDarkMode={isDarkMode}
          />
        )}
        {filteredVehicles.length === 0 ? (
          <NoResults
            vehicles={vehicles.length}
            clearAllFilters={clearAllFilters}
            handleRetry={handleRetry}
            isDarkMode={isDarkMode}
          />
        ) : (
          <>
            <VehicleGrid
              vehicles={paginatedVehicles}
              viewMode={viewMode}
              isDarkMode={isDarkMode}
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
                isDarkMode={isDarkMode}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleList;