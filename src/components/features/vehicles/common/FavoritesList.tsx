// src/components/features/vehicles/common/FavoritesList.tsx
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
import { Heart, SortAsc, Search, Download, Share2, Trash2, Car, Loader } from "lucide-react";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// ✅ framer-motion lazy — solo después del primer paint
const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => ({ default: m.motion.div })),
  { ssr: false, loading: () => <div className="contents" /> }
);
const AnimatePresence = dynamic(
  () => import("framer-motion").then((m) => ({ default: m.AnimatePresence })),
  { ssr: false, loading: () => <></> }
);

const SORT_LABELS = {
  price: "Precio",
  year: "Año",
  mileage: "Kilometraje",
  rating: "Valoración",
} as const;
type SortKey = keyof typeof SORT_LABELS;

interface FavoritesListProps {
  initialVehicles: Vehicle[];
}

export default function FavoritesList({ initialVehicles }: FavoritesListProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(
    new Set(initialVehicles.map((v) => v._id))
  );
  const [isLoading, setIsLoading] = useState(initialVehicles.length === 0);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortKey>("price");
  const [searchTerm, setSearchTerm] = useState("");
  const [motionReady, setMotionReady] = useState(false);

  // ✅ Activar framer-motion después del primer paint — evita hydration mismatch
  useEffect(() => {
    const id = requestAnimationFrame(() => setMotionReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // ✅ Carga favorites al montar Y al volver a la pestaña
  // Sin fetch en servidor — mejor rendimiento y Lighthouse
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        const resFavs = await fetch("/api/user/favorites");
        if (!resFavs.ok) return;
        const { favorites: ids } = await resFavs.json();

        if (!ids?.length) {
          setVehicles([]);
          setFavoritedIds(new Set());
          return;
        }

        const resVehicles = await fetch("/api/vehicles/by-ids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });
        if (!resVehicles.ok) return;

        const { vehicles: fresh } = await resVehicles.json();
        setVehicles(fresh ?? []);
        setFavoritedIds(new Set(fresh?.map((v: Vehicle) => v._id) ?? []));
      } catch {
        toast.error("Error al cargar favoritos");
      } finally {
        setIsLoading(false);
      }
    };

    // Carga inicial + recarga al volver a la pestaña
    loadFavorites();
    window.addEventListener("focus", loadFavorites);
    return () => window.removeEventListener("focus", loadFavorites);
  }, [session?.user?.id, status]);

  // ✅ FIX toggle doble: solo actualiza estado local
  // VehicleCard ya hizo el fetch y el toast
  const handleFavoriteToggle = useCallback((vehicleId: string, isNowFavorited: boolean) => {
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      isNowFavorited ? next.add(vehicleId) : next.delete(vehicleId);
      return next;
    });
    if (!isNowFavorited) {
      setTimeout(() => setVehicles((prev) => prev.filter((v) => v._id !== vehicleId)), 300);
    }
  }, []);

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
      prev.size === vehicles.length ? new Set() : new Set(vehicles.map((v) => v._id))
    );
  }, [vehicles]);

  const handleCompareNavigation = useCallback(() => {
    if (compareList.length < 2) return;
    const params = new URLSearchParams();
    compareList.forEach((id) => params.append("vehicles", id));
    router.push(`${siteConfig.paths.compare}?${params.toString()}`);
  }, [compareList, router]);

  const handleShareFavorites = useCallback(() => {
    const url = `${window.location.origin}/my-favorites`;
    if (navigator.share) {
      navigator.share({ title: "Mis vehículos favoritos", url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles");
    }
  }, []);

  // ✅ Eliminación masiva en paralelo con Promise.all
  const handleDeleteSelected = useCallback(async () => {
    if (!selectedVehicles.size) return;
    const ids = Array.from(selectedVehicles);

    setVehicles((prev) => prev.filter((v) => !selectedVehicles.has(v._id)));
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setSelectedVehicles(new Set());

    await Promise.all(
      ids.map((vehicleId) =>
        fetch("/api/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicleId }),
        }).catch(console.error)
      )
    );

    toast.success(
      `${ids.length} vehículo${ids.length !== 1 ? "s" : ""} eliminado${ids.length !== 1 ? "s" : ""} de favoritos`
    );
  }, [selectedVehicles]);

  // ─── Filtrado y ordenamiento ───────────────────────────────────────────────
  const filtered = searchTerm.trim()
    ? vehicles.filter((v) => {
        const t = searchTerm.toLowerCase();
        return (
          v.brand.toLowerCase().includes(t) ||
          v.model.toLowerCase().includes(t) ||
          v.year.toString().includes(t)
        );
      })
    : vehicles;

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price":   return a.price - b.price;
      case "year":    return b.year - a.year;
      case "mileage": return a.mileage - b.mileage;
      case "rating":  return ((b as any).averageRating || 0) - ((a as any).averageRating || 0);
      default:        return 0;
    }
  });

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-8 pb-16 px-4 mt-16">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-lg card-glass">
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
            <CardContent className="p-12 flex flex-col items-center text-center">
              <Loader className="w-12 h-12 animate-spin text-primary mb-6" />
              <h3 className="text-xl font-semibold font-heading mb-2">Cargando favoritos</h3>
              <p className="text-sm text-muted-foreground">Esto solo tomará un momento...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Estado vacío ──────────────────────────────────────────────────────────
  if (!vehicles.length) {
    return (
      <div className="min-h-screen bg-background pt-8 pb-16 px-4 mt-16">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-lg card-glass">
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
            <CardContent className="p-12 flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-6 mb-6">
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Render principal ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pt-4 pb-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <Card className="shadow-lg border-0 overflow-hidden card-glass">
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
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
              <div className="flex gap-2">
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

        {/* Búsqueda, orden y acciones */}
        <Card className="shadow-sm border-0">
          <CardContent className="p-4 space-y-4">
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

            <div className="flex flex-wrap gap-2">
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <Button
                  key={key}
                  variant={sortBy === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(key)}
                >
                  {SORT_LABELS[key]}
                </Button>
              ))}
            </div>

            {filtered.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    {selectedVehicles.size === filtered.length ? "Deseleccionar todo" : "Seleccionar todo"}
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
                <span className="text-sm text-muted-foreground">
                  {filtered.length} de {vehicles.length} vehículos
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grid — CSS antes del paint, framer-motion después */}
        {!motionReady ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {sorted.map((vehicle) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {sorted.map((vehicle) => (
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

        {/* Barra comparación flotante */}
        {compareList.length > 0 && (
          <Card className="fixed bottom-4 right-4 z-50 w-auto shadow-lg card-glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {compareList.length} vehículo{compareList.length !== 1 ? "s" : ""}
                  </Badge>
                  <p className="hidden text-sm text-muted-foreground sm:block">
                    {compareList.length < 2 ? "Selecciona otro para comparar" : "Listo para comparar"}
                  </p>
                </div>
                <Button
                  onClick={handleCompareNavigation}
                  disabled={compareList.length < 2}
                  className="btn-primary"
                >
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