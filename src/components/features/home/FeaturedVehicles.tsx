// src/components/features/home/FeaturedVehicles.tsx
// ✅ OPTIMIZADO: index prop para priority images, semántica HTML, useCallback
"use client";
import React, { useState, useCallback } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import VehicleCard from "@/components/features/vehicles/common/VehicleCard";
import { Vehicle } from "@/types/types";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

interface FeaturedVehiclesProps {
  vehicles: Vehicle[];
}

const FeaturedVehicles = ({ vehicles }: FeaturedVehiclesProps) => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [compareList, setCompareList] = useState<Set<string>>(new Set());

  const handleFavoriteToggle = useCallback(
    (vehicleId: string, isNowFavorited: boolean) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        isNowFavorited ? next.add(vehicleId) : next.delete(vehicleId);
        return next;
      });
    },
    []
  );

  const handleToggleCompare = useCallback((vehicleId: string) => {
    setCompareList((prev) => {
      const next = new Set(prev);
      if (next.has(vehicleId)) {
        next.delete(vehicleId);
      } else {
        if (next.size >= 3) {
          alert("Solo puedes comparar hasta 3 vehículos");
          return prev;
        }
        next.add(vehicleId);
      }
      return next;
    });
  }, []);

  const handleViewAll = useCallback(
    () => router.push(siteConfig.paths.vehicleList),
    [router]
  );

  if (vehicles.length === 0) return null;

  return (
    <div className="container-wide">
      {/* Cabecera */}
      <header className="text-center mb-10 sm:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-600">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 card-glass" aria-hidden="true">
          <Sparkles className="w-4 h-4 animate-pulse" style={{ color: "var(--accent)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
            Selección Destacada
          </span>
        </div>

        <h2
          id="featured-vehicles-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold mb-3 sm:mb-4"
          style={{
            background: "var(--gradient-primary)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Vehículos Destacados
        </h2>

        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--muted-foreground)" }}>
          Explora nuestra selección de vehículos disponibles
        </p>
      </header>

      {/* ✅ Lista semántica de vehículos */}
      <ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12 list-none p-0"
        aria-label={`${vehicles.length} vehículos destacados`}
      >
        {vehicles.map((vehicle, index) => (
          <li
            key={vehicle._id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* ✅ index se pasa para que priority=true solo en los primeros 3 */}
            <VehicleCard
              vehicle={vehicle}
              index={index}
              onToggleCompare={handleToggleCompare}
              isInCompareList={compareList.has(vehicle._id)}
              isFavorited={favorites.has(vehicle._id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="text-center animate-in fade-in duration-600">
        <Button
          onClick={handleViewAll}
          size="lg"
          className="btn-accent text-base sm:text-lg py-5 sm:py-6 px-8 sm:px-10 font-bold group"
          aria-label="Ver todos los vehículos disponibles"
        >
          Ver Todos los Vehículos
          <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default FeaturedVehicles;