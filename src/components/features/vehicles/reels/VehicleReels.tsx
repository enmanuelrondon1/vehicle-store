// src/components/features/vehicles/reels/VehicleReels.tsx
// ✅ OPTIMIZADO: fetch consolidado de favoritos, framer-motion lazy, prefetch del siguiente reel
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { SlidersHorizontal, Settings, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Vehicle } from "@/types/types";
import ReelCard from "./ReelCard";

// ✅ LAZY: framer-motion solo se necesita para la transición entre reels
// El primer render NO necesita motion — se pinta directo
const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => ({ default: m.motion.div })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);
const AnimatePresence = dynamic(
  () => import("framer-motion").then((m) => ({ default: m.AnimatePresence })),
  { ssr: false, loading: () => <></> }
);

// ✅ LAZY: filtros y settings solo cuando el usuario los abre
const ReelsFilters = dynamic(() => import("./ReelsFilters"), {
  ssr: false,
  loading: () => null,
});
const ReelsSettings = dynamic(() => import("./ReelsSettings"), {
  ssr: false,
  loading: () => null,
});

interface ReelsFiltersState {
  category: string;
  condition: string;
  featured: boolean;
  priceRange: [number, number];
  yearRange: [number, number];
  random: boolean; // ✅
}

interface VehicleReelsProps {
  onClose?: () => void;
}

const defaultFilters: ReelsFiltersState = {
  category: "all",
  condition: "all",
  featured: false,
  priceRange: [0, 1000000],
  yearRange: [1900, 2025],
  random: true, // ✅ true para que el orden sea aleatorio por defecto (igual que ReelsFilters)
};

export const VehicleReels: React.FC<VehicleReelsProps> = ({ onClose }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState<ReelsFiltersState>(defaultFilters);

  // ✅ NUEVO: favoriteIds centralizado — un solo fetch para todos los cards
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [motionReady, setMotionReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const prefetchedUrls = useRef<Set<string>>(new Set());

  // ✅ Carga framer-motion después del primer paint
  useEffect(() => {
    const id = requestAnimationFrame(() => setMotionReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // ✅ UN SOLO fetch de favoritos para toda la sesión
  useEffect(() => {
    fetch("/api/user/favorites")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.favorites) {
          setFavoriteIds(data.favorites.map((v: Vehicle) => v._id));
        }
      })
      .catch(() => {});
  }, []);

  const fetchVehicles = useCallback(
    async (pageNum: number, currentFilters: ReelsFiltersState) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "10",
          status: "approved",
          ...(currentFilters.category !== "all" && { category: currentFilters.category }),
          ...(currentFilters.condition !== "all" && { condition: currentFilters.condition }),
          ...(currentFilters.featured && { featured: "true" }),
          minPrice: currentFilters.priceRange[0].toString(),
          maxPrice: currentFilters.priceRange[1].toString(),
          minYear: currentFilters.yearRange[0].toString(),
          maxYear: currentFilters.yearRange[1].toString(),
        });

        const response = await fetch(`/api/vehicles?${params.toString()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        let newVehicles: Vehicle[] = [];

        if (Array.isArray(data))                        newVehicles = data;
        else if (data.success && data.data)             newVehicles = Array.isArray(data.data) ? data.data : [data.data];
        else if (data.vehicles)                         newVehicles = data.vehicles;
        else if (data.data && Array.isArray(data.data)) newVehicles = data.data;

        if (newVehicles.length === 0) {
          setHasMore(false);
          if (vehicles.length === 0) toast.info("No hay vehículos que coincidan con los filtros");
        } else {
          setVehicles((prev) => [...prev, ...newVehicles]);
          setPage(pageNum);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast.error("Error al cargar vehículos. Por favor, intenta de nuevo.");
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, vehicles.length]
  );

  useEffect(() => {
    if (vehicles.length === 0) fetchVehicles(1, filters);
  }, []);

  // ✅ NUEVO: Prefetch de imágenes del siguiente reel
  useEffect(() => {
    const nextVehicle = vehicles[currentIndex + 1];
    if (!nextVehicle?.images?.length) return;

    const nextImageUrl = nextVehicle.images[0];
    if (prefetchedUrls.current.has(nextImageUrl)) return;

    prefetchedUrls.current.add(nextImageUrl);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = nextImageUrl;
    document.head.appendChild(link);
  }, [currentIndex, vehicles]);

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
    if (currentIndex < vehicles.length - 1) setCurrentIndex((prev) => prev + 1);
    else if (hasMore && !isLoading) toast.info("Cargando más vehículos...");
  }, [currentIndex, vehicles.length, hasMore, isLoading]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
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

  // ✅ Callback para que los cards actualicen el estado central de favoritos
  const handleFavoriteChange = useCallback((vehicleId: string, isFavorited: boolean) => {
    setFavoriteIds((prev) =>
      isFavorited ? [...prev, vehicleId] : prev.filter((id) => id !== vehicleId)
    );
  }, []);

 const hasActiveFilters =
  filters.category !== "all" || filters.condition !== "all" || filters.featured ||
  filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000 ||
  filters.yearRange[0] > 1900 || filters.yearRange[1] < 2025 ||
  !filters.random; // ✅ opcional

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
      {/* Control buttons — CSS puro */}
      {onClose && (
        <div className="absolute top-4 right-4 z-50 flex gap-2 animate-in fade-in zoom-in-75 duration-300">
          <Button
            variant="secondary" size="icon"
            onClick={() => setShowFilters(true)}
            className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm relative"
            aria-label="Filtros"
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
            aria-label="Configuración"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary" size="icon"
            onClick={onClose}
            className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Reels feed */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* ✅ PRIMER RENDER: sin motion para no bloquear el LCP */}
        {!motionReady && currentVehicle && (
          <div className="w-full h-full">
            <ReelCard
              vehicle={currentVehicle}
              isActive={true}
              favoriteIds={favoriteIds}
              onFavoriteChange={handleFavoriteChange}
            />
          </div>
        )}

        {/* ✅ DESPUÉS DEL PAINT: motion activo con transiciones */}
        {motionReady && (
          <AnimatePresence mode="wait" initial={false}>
            {currentVehicle && (
              <MotionDiv
                key={currentVehicle._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full"
              >
                <ReelCard
                  vehicle={currentVehicle}
                  isActive={true}
                  favoriteIds={favoriteIds}
                  onFavoriteChange={handleFavoriteChange}
                />
              </MotionDiv>
            )}
          </AnimatePresence>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Cargando más...</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
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

      {/* Filtros — lazy, solo cuando están abiertos */}
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

      {/* Settings — lazy, solo cuando están abiertos */}
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