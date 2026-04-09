// src/components/features/vehicles/common/FavoritesList.tsx
// ✅ OPTIMIZADO: framer-motion lazy, Promise.all en eliminación masiva, CSS animations
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Vehicle } from "@/types/types";
import VehicleCard from "./VehicleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Heart, SortAsc, Search, Download, Share2, Trash2, Car,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// ✅ LAZY: framer-motion solo para las animaciones del grid
// En el primer render el grid aparece con CSS animation, framer-motion se activa después
const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => ({ default: m.motion.div })),
  { ssr: false, loading: () => <div className="contents" /> }
);
const AnimatePresence = dynamic(
  () => import("framer-motion").then((m) => ({ default: m.AnimatePresence })),
  { ssr: false, loading: () => <></> }
);

interface FavoritesListProps {
  initialVehicles: Vehicle[];
}

export default function FavoritesList({ initialVehicles }: FavoritesListProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(initialVehicles);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(
    new Set(initialVehicles.map((v) => v._id))
  );
  const [compareList, setCompareList] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"price" | "year" | "mileage" | "rating">("price");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());
  const [motionReady, setMotionReady] = useState(false);

  // ✅ Activar framer-motion después del primer paint
  useEffect(() => {
    const id = requestAnimationFrame(() => setMotionReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Filtrar vehículos
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredVehicles(vehicles);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredVehicles(
      vehicles.filter(
        (v) =>
          v.brand.toLowerCase().includes(term) ||
          v.model.toLowerCase().includes(term) ||
          v.year.toString().includes(term)
      )
    );
  }, [searchTerm, vehicles]);

  const handleFavoriteToggle = useCallback(async (vehicleId: string) => {
    const isCurrentlyFavorited = favoritedIds.has(vehicleId);

    // ✅ Optimistic update inmediato
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      isCurrentlyFavorited ? next.delete(vehicleId) : next.add(vehicleId);
      return next;
    });

    // Si estaba en favoritos y lo quitamos, removerlo de la lista con delay
    if (isCurrentlyFavorited) {
      setTimeout(() => {
        setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
      }, 300);
    }

    if (!session) return;

    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.action === "added" ? "Añadido a favoritos" : "Eliminado de favoritos");
      } else {
        // Revert
        setFavoritedIds((prev) => {
          const next = new Set(prev);
          isCurrentlyFavorited ? next.add(vehicleId) : next.delete(vehicleId);
          return next;
        });
        toast.error("No se pudo actualizar favoritos.");
      }
    } catch {
      // Revert
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        isCurrentlyFavorited ? next.add(vehicleId) : next.delete(vehicleId);
        return next;
      });
      toast.error("Error al actualizar favoritos.");
    }
  }, [favoritedIds, session]);

  const toggleCompare = useCallback((vehicleId: string) => {
    setCompareList((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    );
  }, []);

  const toggleSelect = useCallback((vehicleId: string) => {
    setSelectedVehicles((prev) => {
      const next = new Set(prev);
      next.has(vehicleId) ? next.delete(vehicleId) : next.add(vehicleId);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedVehicles((prev) =>
      prev.size === filteredVehicles.length
        ? new Set()
        : new Set(filteredVehicles.map((v) => v._id))
    );
  }, [filteredVehicles]);

  const handleCompareNavigation = useCallback(() => {
    if (compareList.length > 1) {
      const params = new URLSearchParams();
      compareList.forEach((id) => params.append("vehicles", id));
      router.push(`${siteConfig.paths.compare}?${params.toString()}`);
    }
  }, [compareList, router]);

  const sortVehicles = useCallback((list: Vehicle[]) => {
    const sorted = [...list];
    switch (sortBy) {
      case "price":   return sorted.sort((a, b) => a.price - b.price);
      case "year":    return sorted.sort((a, b) => b.year - a.year);
      case "mileage": return sorted.sort((a, b) => a.mileage - b.mileage);
      case "rating":  return sorted.sort((a, b) => ((b as any).averageRating || 0) - ((a as any).averageRating || 0));
      default:        return sorted;
    }
  }, [sortBy]);

  const handleShareFavorites = useCallback(() => {
    const shareUrl = `${window.location.origin}/my-favorites`;
    if (navigator.share) {
      navigator.share({ title: "Mis vehículos favoritos", url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Enlace copiado al portapapeles");
    }
  }, []);

  // ✅ OPTIMIZADO: Promise.all en vez de forEach async sin await
  const handleDeleteSelected = useCallback(async () => {
    if (selectedVehicles.size === 0) return;

    const idsToDelete = Array.from(selectedVehicles);

    // Optimistic: remover de la UI inmediatamente
    setVehicles((prev) => prev.filter((v) => !selectedVehicles.has(v._id)));
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      idsToDelete.forEach((id) => next.delete(id));
      return next;
    });
    setSelectedVehicles(new Set());

    // ✅ Todos los fetches en paralelo
    await Promise.all(
      idsToDelete.map((vehicleId) =>
        fetch("/api/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicleId }),
        }).catch(console.error)
      )
    );

    toast.success(`${idsToDelete.length} vehículo${idsToDelete.length !== 1 ? "s" : ""} eliminado${idsToDelete.length !== 1 ? "s" : ""} de favoritos`);
  }, [selectedVehicles]);

  const sortedVehicles = sortVehicles(filteredVehicles);

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-8 pb-16 px-4 mt-16 md:mt-16">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-lg card-glass">
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-6 mb-6 shimmer-effect">
                  <Heart className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 font-heading text-gradient-primary">
                  Tu lista de favoritos está vacía
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Aún no has añadido vehículos. Explora nuestro catálogo y guarda los que te interesen.
                </p>
                <Button className="btn-primary" onClick={() => router.push("/vehicleList")}>
                  <Car className="mr-2 h-4 w-4" />
                  Explorar vehículos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-4 pb-8 px-4 mt-16 md:mt-16">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <Card className="shadow-lg border-0 overflow-hidden card-glass">
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 shimmer-effect">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-heading text-gradient-primary">
                    Mis Favoritos
                  </CardTitle>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Car className="h-4 w-4" />
                    {vehicles.length} vehículo{vehicles.length !== 1 ? "s" : ""} en tu lista
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Button variant="outline" size="sm" onClick={handleShareFavorites}>
                  <Share2 className="mr-2 h-4 w-4" />Compartir
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.info("Función de exportación próximamente")}>
                  <Download className="mr-2 h-4 w-4" />Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Búsqueda y filtros */}
        <Card className="shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por marca, modelo o año..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SortAsc className="w-4 h-4" />
                <span className="hidden sm:inline">Ordenar</span>
              </Button>
            </div>

            {/* Ordenamiento */}
            <div className="flex flex-wrap gap-2 mt-4">
              {(["price", "year", "mileage", "rating"] as const).map((key) => (
                <Button
                  key={key}
                  variant={sortBy === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(key)}
                >
                  {{ price: "Precio", year: "Año", mileage: "Kilometraje", rating: "Valoración" }[key]}
                </Button>
              ))}
            </div>

            {/* Acciones en lote */}
            {filteredVehicles.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    {selectedVehicles.size === filteredVehicles.length ? "Deseleccionar todo" : "Seleccionar todo"}
                  </Button>
                  {selectedVehicles.size > 0 && (
                    <>
                      <Badge variant="secondary">
                        {selectedVehicles.size} seleccionado{selectedVehicles.size !== 1 ? "s" : ""}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={handleDeleteSelected}>
                        <Trash2 className="h-4 w-4 mr-1" />Eliminar
                      </Button>
                    </>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredVehicles.length} de {vehicles.length} vehículos
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grid de vehículos */}
        {/* ✅ Primer render: CSS animation sin framer-motion */}
        {!motionReady && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {sortedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onToggleCompare={toggleCompare}
                isInCompareList={compareList.includes(vehicle._id)}
                isFavorited={favoritedIds.has(vehicle._id)}
                onFavoriteToggle={handleFavoriteToggle}
                isSelected={selectedVehicles.has(vehicle._id)}
                onSelectToggle={() => toggleSelect(vehicle._id)}
              />
            ))}
          </div>
        )}

        {/* ✅ Después del paint: framer-motion activo para animaciones de entrada/salida */}
        {motionReady && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {sortedVehicles.map((vehicle) => (
                <MotionDiv
                  key={vehicle._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                >
                  <VehicleCard
                    vehicle={vehicle}
                    onToggleCompare={toggleCompare}
                    isInCompareList={compareList.includes(vehicle._id)}
                    isFavorited={favoritedIds.has(vehicle._id)}
                    onFavoriteToggle={handleFavoriteToggle}
                    isSelected={selectedVehicles.has(vehicle._id)}
                    onSelectToggle={() => toggleSelect(vehicle._id)}
                  />
                </MotionDiv>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Barra de comparación flotante */}
        {compareList.length > 0 && (
          <Card className="fixed bottom-4 right-4 z-50 w-auto shadow-lg card-glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {compareList.length} vehículo{compareList.length !== 1 ? "s" : ""}
                  </Badge>
                  <p className="hidden text-sm text-muted-foreground sm:block">
                    {compareList.length < 2 ? "Selecciona otro para comparar" : "Listo para comparar"}
                  </p>
                </div>
                <Button onClick={handleCompareNavigation} disabled={compareList.length < 2} className="btn-primary">
                  Comparar vehículos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}