// src/components/features/vehicles/common/FavoritesList.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Vehicle } from "@/types/types";
import VehicleCard from "./VehicleCard";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Grid, List, SortAsc } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface FavoritesListProps {
  initialVehicles: Vehicle[];
}

export default function FavoritesList({ initialVehicles }: FavoritesListProps) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(
    new Set(initialVehicles.map((v) => v._id))
  );
  const [compareList, setCompareList] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"price" | "year" | "mileage">("price");

  const handleFavoriteToggle = (vehicleId: string, isNowFavorited: boolean) => {
    setFavoritedIds((prev) => {
      const newIds = new Set(prev);
      if (isNowFavorited) {
        newIds.add(vehicleId);
      } else {
        newIds.delete(vehicleId);
      }
      return newIds;
    });

    if (!isNowFavorited) {
      setTimeout(() => {
        setVehicles((prevVehicles) =>
          prevVehicles.filter((v) => v._id !== vehicleId)
        );
      }, 300);
    }
  };

  const toggleCompare = (vehicleId: string) => {
    setCompareList((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handleCompareNavigation = () => {
    if (compareList.length > 1) {
      const params = new URLSearchParams();
      compareList.forEach((id) => params.append("vehicles", id));
      router.push(`${siteConfig.paths.compare}?${params.toString()}`);
    }
  };

  const sortVehicles = (vehicles: Vehicle[]) => {
    const sorted = [...vehicles];
    switch (sortBy) {
      case "price":
        return sorted.sort((a, b) => a.price - b.price);
      case "year":
        return sorted.sort((a, b) => b.year - a.year);
      case "mileage":
        return sorted.sort((a, b) => a.mileage - b.mileage);
      default:
        return sorted;
    }
  };

  const sortedVehicles = sortVehicles(vehicles);

  if (vehicles.length === 0) {
    return (
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2 font-heading">
              Tu lista de favoritos está vacía
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Aún no has añadido vehículos a tu lista de favoritos. Explora
              nuestro catálogo y guarda los que te interesen.
            </p>
            <Button>Explorar vehículos</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera con controles */}
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold font-heading">Mis Favoritos</h2>
              <p className="text-muted-foreground">
                Tienes {vehicles.length} vehículo
                {vehicles.length !== 1 ? "s" : ""} en tu lista de favoritos
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <SortAsc className="w-4 h-4" />
                <span className="hidden sm:inline">Ordenar</span>
              </Button>
            </div>
          </div>

          {/* Filtros de ordenamiento */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={sortBy === "price" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("price")}
            >
              Precio
            </Button>
            <Button
              variant={sortBy === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("year")}
            >
              Año
            </Button>
            <Button
              variant={sortBy === "mileage" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("mileage")}
            >
              Kilometraje
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de vehículos */}
      <motion.div
        layout
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        )}
      >
        <AnimatePresence>
          {sortedVehicles.map((vehicle) => (
            <motion.div
              key={vehicle._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
            >
              <VehicleCard
                vehicle={vehicle}
                // viewMode={viewMode}
                onToggleCompare={toggleCompare}
                isInCompareList={compareList.includes(vehicle._id)}
                isFavorited={favoritedIds.has(vehicle._id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pie con acciones */}
      {compareList.length > 0 && (
        <Card className="fixed bottom-4 right-4 z-50 w-auto shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {compareList.length} vehículo
                  {compareList.length !== 1 ? "s" : ""}
                </Badge>
                <p className="hidden text-sm text-muted-foreground sm:block">
                  {compareList.length < 2
                    ? "Selecciona otro para comparar"
                    : "Listo para comparar"}
                </p>
              </div>
              <Button
                onClick={handleCompareNavigation}
                disabled={compareList.length < 2}
              >
                Comparar vehículos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}