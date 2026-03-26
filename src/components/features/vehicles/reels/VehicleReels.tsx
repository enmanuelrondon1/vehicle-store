// src/components/features/vehicles/reels/VehicleReels.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { X, Loader2, SlidersHorizontal, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Vehicle } from "@/types/types";
import { cn } from "@/lib/utils";
import type { ReelsFiltersState } from "./ReelsFilters";

// ✅ Carga inmediata — es el contenido principal
import ReelCard from "./ReelCard";

// ✅ Lazy — solo cargan cuando el usuario abre filtros o settings
const ReelsFilters = dynamic(() => import("./ReelsFilters"), {
  loading: () => (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-background/95 z-50 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  ),
});
const ReelsSettings = dynamic(() => import("./ReelsSettings"), {
  loading: () => (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-background/95 z-50 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface VehicleReelsProps {
  initialVehicles?: Vehicle[];
  onClose?: () => void;
  startIndex?: number;
}

export const VehicleReels: React.FC<VehicleReelsProps> = ({
  initialVehicles = [],
  onClose,
  startIndex = 0,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState<ReelsFiltersState>({
    category: "all",
    condition: "all",
    priceRange: [0, 1000000],
    yearRange: [1900, 2025],
    featured: false,
    random: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const fetchVehicles = useCallback(async (pageNum: number, currentFilters: ReelsFiltersState) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: "10", random: currentFilters.random.toString() });
      if (currentFilters.category !== "all")    params.append("category",  currentFilters.category);
      if (currentFilters.condition !== "all")   params.append("condition",  currentFilters.condition);
      if (currentFilters.featured)              params.append("featured",   "true");
      if (currentFilters.priceRange[0] > 0)     params.append("minPrice",   currentFilters.priceRange[0].toString());
      if (currentFilters.priceRange[1] < 1000000) params.append("maxPrice", currentFilters.priceRange[1].toString());
      if (currentFilters.yearRange[0] > 1900)   params.append("minYear",    currentFilters.yearRange[0].toString());
      if (currentFilters.yearRange[1] < 2025)   params.append("maxYear",    currentFilters.yearRange[1].toString());

      const response = await fetch(`/api/vehicles?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      let newVehicles: Vehicle[] = [];

      if (Array.isArray(data))                           newVehicles = data;
      else if (data.success && data.data)                newVehicles = Array.isArray(data.data) ? data.data : [data.data];
      else if (data.vehicles)                            newVehicles = data.vehicles;
      else if (data.data && Array.isArray(data.data))    newVehicles = data.data;

      if (newVehicles.length === 0) {
        setHasMore(false);
        if (vehicles.length === 0) toast.info("No hay vehículos que coincidan con los filtros");
      } else {
        setVehicles(prev => [...prev, ...newVehicles]);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Error al cargar vehículos. Por favor, intenta de nuevo.");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, vehicles.length]);

  useEffect(() => {
    if (vehicles.length === 0) fetchVehicles(1, filters);
  }, []);

  const handleFiltersChange = (newFilters: ReelsFiltersState) => {
    setFilters(newFilters);
    setVehicles([]);
    setCurrentIndex(0);
    setPage(1);
    setHasMore(true);
    fetchVehicles(1, newFilters);
  };

  useEffect(() => {
    if (currentIndex >= vehicles.length - 3 && hasMore && !isLoading) {
      fetchVehicles(page + 1, filters);
    }
  }, [currentIndex, vehicles.length, hasMore, isLoading, page, filters, fetchVehicles]);

  const goToNext = useCallback(() => {
    if (currentIndex < vehicles.length - 1) setCurrentIndex(prev => prev + 1);
    else if (hasMore && !isLoading) toast.info("Cargando más vehículos...");
  }, [currentIndex, vehicles.length, hasMore, isLoading]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if      (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); goToNext(); }
      else if (e.key === "ArrowUp"   || e.key === "ArrowLeft")  { e.preventDefault(); goToPrevious(); }
      else if (e.key === "Escape" && onClose)                    onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchMove  = (e: React.TouchEvent) => { touchEndY.current   = e.touches[0].clientY; };
  const handleTouchEnd   = () => {
    const deltaY = touchStartY.current - touchEndY.current;
    if (Math.abs(deltaY) > 50) deltaY > 0 ? goToNext() : goToPrevious();
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.deltaY > 0 ? goToNext() : goToPrevious();
  }, [goToNext, goToPrevious]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  const hasActiveFilters =
    filters.category !== "all" || filters.condition !== "all" || filters.featured ||
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000 ||
    filters.yearRange[0] > 1900 || filters.yearRange[1] < 2025;

  const currentVehicle = vehicles[currentIndex];

  if (vehicles.length === 0 && !isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">No hay vehículos disponibles</p>
          {onClose && <Button onClick={onClose} variant="outline">Volver</Button>}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-background z-50 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ✅ Botones de control — CSS puro, sin motion.div */}
      {onClose && (
        <div className="absolute top-4 right-4 z-50 flex gap-2 animate-in fade-in zoom-in-75 duration-300">
          <Button
            variant="secondary" size="icon"
            onClick={() => setShowFilters(true)}
            className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm relative"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {hasActiveFilters && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                !
              </Badge>
            )}
          </Button>
          <Button
            variant="secondary" size="icon"
            onClick={() => setShowSettings(true)}
            className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary" size="icon"
            onClick={onClose}
            className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* ✅ Reels — animación de transición conservada (es la experiencia core) */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {currentVehicle && (
            <motion.div
              key={currentVehicle._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full h-full"
            >
              <ReelCard vehicle={currentVehicle} isActive={true} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading indicator — CSS puro */}
        {isLoading && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Cargando más...</span>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Progress bar — CSS puro */}
      <div className="absolute top-4 left-4 right-20 z-40">
        <div className="flex gap-1">
          {vehicles.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, idx) => {
            const actualIndex = Math.max(0, currentIndex - 2) + idx;
            const isActive = actualIndex === currentIndex;
            return (
              <div
                key={actualIndex}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  isActive ? "flex-1 bg-white" : "w-8 bg-white/30"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* ✅ Filtros — lazy, backdrop CSS */}
      {showFilters && (
        <>
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setShowFilters(false)}
          />
          <ReelsFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClose={() => setShowFilters(false)}
          />
        </>
      )}

      {/* ✅ Settings — lazy, backdrop CSS */}
      {showSettings && (
        <>
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setShowSettings(false)}
          />
          <ReelsSettings onClose={() => setShowSettings(false)} />
        </>
      )}
    </div>
  );
};

export default VehicleReels;