// src/components/features/vehicles/reels/VehicleReels.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, SlidersHorizontal, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ReelCard from "./ReelCard";
import ReelControls from "./ReelControls";
import ReelsFilters, { ReelsFiltersState } from "./ReelsFilters";
import ReelsSettings from "./ReelsSettings";
import { Vehicle } from "@/types/types";
import { cn } from "@/lib/utils";

interface VehicleReelsProps {
  initialVehicles?: Vehicle[];
  onClose?: () => void;
  startIndex?: number;
}

export const VehicleReels: React.FC<VehicleReelsProps> = ({ 
  initialVehicles = [],
  onClose,
  startIndex = 0
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

  // Fetch vehicles from API
  const fetchVehicles = useCallback(async (pageNum: number, currentFilters: ReelsFiltersState) => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      console.log(`🔍 Fetching vehicles - Page: ${pageNum}`, currentFilters);
      
      // Build query params
      const params = new URLSearchParams({
        limit: '10',
        random: currentFilters.random.toString(),
      });

      // Add filters
      if (currentFilters.category !== "all") {
        params.append("category", currentFilters.category);
      }
      if (currentFilters.condition !== "all") {
        params.append("condition", currentFilters.condition);
      }
      if (currentFilters.featured) {
        params.append("featured", "true");
      }
      if (currentFilters.priceRange[0] > 0) {
        params.append("minPrice", currentFilters.priceRange[0].toString());
      }
      if (currentFilters.priceRange[1] < 1000000) {
        params.append("maxPrice", currentFilters.priceRange[1].toString());
      }
      if (currentFilters.yearRange[0] > 1900) {
        params.append("minYear", currentFilters.yearRange[0].toString());
      }
      if (currentFilters.yearRange[1] < 2025) {
        params.append("maxYear", currentFilters.yearRange[1].toString());
      }
      
      const response = await fetch(`/api/vehicles?${params.toString()}`);
      
      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📦 Data received:", data);
      
      // Manejar diferentes estructuras de respuesta
      let newVehicles = [];
      
      if (Array.isArray(data)) {
        newVehicles = data;
      } else if (data.success && data.data) {
        newVehicles = Array.isArray(data.data) ? data.data : [data.data];
      } else if (data.vehicles) {
        newVehicles = data.vehicles;
      } else if (data.data && Array.isArray(data.data)) {
        newVehicles = data.data;
      }
      
      console.log("✅ Processed vehicles:", newVehicles.length);
      
      if (newVehicles.length === 0) {
        setHasMore(false);
        if (vehicles.length === 0) {
          toast.info("No hay vehículos que coincidan con los filtros");
        }
      } else {
        setVehicles(prev => {
          const combined = [...prev, ...newVehicles];
          console.log(`📊 Total vehicles now: ${combined.length}`);
          return combined;
        });
        setPage(pageNum);
      }
    } catch (error) {
      console.error("❌ Error fetching vehicles:", error);
      toast.error("Error al cargar vehículos. Por favor, intenta de nuevo.");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, vehicles.length]);

  // Initial load
  useEffect(() => {
    if (vehicles.length === 0) {
      fetchVehicles(1, filters);
    }
  }, []);

  // Reload when filters change
  const handleFiltersChange = (newFilters: ReelsFiltersState) => {
    setFilters(newFilters);
    setVehicles([]);
    setCurrentIndex(0);
    setPage(1);
    setHasMore(true);
    fetchVehicles(1, newFilters);
  };

  // Preload next vehicles
  useEffect(() => {
    if (currentIndex >= vehicles.length - 3 && hasMore && !isLoading) {
      fetchVehicles(page + 1, filters);
    }
  }, [currentIndex, vehicles.length, hasMore, isLoading, page, filters, fetchVehicles]);

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (currentIndex < vehicles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (hasMore && !isLoading) {
      toast.info("Cargando más vehículos...");
    }
  }, [currentIndex, vehicles.length, hasMore, isLoading]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, onClose]);

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaY = touchStartY.current - touchEndY.current;
    const threshold = 50;

    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // Swipe up - next
        goToNext();
      } else {
        // Swipe down - previous
        goToPrevious();
      }
    }
  };

  // Mouse wheel handler
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (e.deltaY > 0) {
      goToNext();
    } else if (e.deltaY < 0) {
      goToPrevious();
    }
  }, [goToNext, goToPrevious]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  const currentVehicle = vehicles[currentIndex];

  if (vehicles.length === 0 && !isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">
            No hay vehículos disponibles
          </p>
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Volver
            </Button>
          )}
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
      {/* Close Button */}
      {onClose && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 z-50 flex gap-2"
        >
          {/* Filters Button */}
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setShowFilters(true)}
            className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm relative"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {(filters.category !== "all" || 
              filters.condition !== "all" || 
              filters.featured ||
              filters.priceRange[0] > 0 ||
              filters.priceRange[1] < 1000000 ||
              filters.yearRange[0] > 1900 ||
              filters.yearRange[1] < 2025) && (
              <Badge 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs"
              >
                !
              </Badge>
            )}
          </Button>

          {/* Settings Button */}
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          >
            <Settings className="w-5 h-5" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={onClose}
            className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </Button>
        </motion.div>
      )}

      {/* Reels Container */}
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
              <ReelCard
                vehicle={currentVehicle}
                isActive={true}
                onNext={goToNext}
                onPrevious={goToPrevious}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Cargando más...</span>
            </div>
          </motion.div>
        )}

        {/* Navigation Controls */}
        <ReelControls
          currentIndex={currentIndex}
          totalItems={vehicles.length}
          onNext={goToNext}
          onPrevious={goToPrevious}
          canGoNext={currentIndex < vehicles.length - 1 || hasMore}
          canGoPrevious={currentIndex > 0}
        />
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 left-4 right-20 z-40">
        <div className="flex gap-1">
          {vehicles.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, idx) => {
            const actualIndex = Math.max(0, currentIndex - 2) + idx;
            const isActive = actualIndex === currentIndex;
            
            return (
              <motion.div
                key={actualIndex}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  isActive ? "flex-1 bg-white" : "w-8 bg-white/30"
                )}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            );
          })}
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowFilters(false)}
            />
            {/* Filters */}
            <ReelsFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClose={() => setShowFilters(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowSettings(false)}
            />
            {/* Settings */}
            <ReelsSettings onClose={() => setShowSettings(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleReels;