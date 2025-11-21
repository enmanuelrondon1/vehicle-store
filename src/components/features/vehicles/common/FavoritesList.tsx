// src/components/features/vehicles/common/FavoritesList.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Vehicle } from "@/types/types";
import VehicleCard from "./VehicleCard";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Grid, SortAsc, Search, Filter, Download, Share2, Trash2, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());

  // Filtrar vehículos basado en búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter(
        (vehicle) =>
          vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.year.toString().includes(searchTerm)
      );
      setFilteredVehicles(filtered);
    }
  }, [searchTerm, vehicles]);

  const handleFavoriteToggle = async (vehicleId: string) => {
    // Determinar si el vehículo está actualmente en favoritos
    const isCurrentlyFavorited = favoritedIds.has(vehicleId);
    
    // Actualizar el estado inmediatamente para respuesta instantánea
    setFavoritedIds((prev) => {
      const newIds = new Set(prev);
      if (isCurrentlyFavorited) {
        newIds.delete(vehicleId);
      } else {
        newIds.add(vehicleId);
      }
      return newIds;
    });

    // Si no está en favoritos, no hay necesidad de hacer más
    if (!isCurrentlyFavorited) return;

    // Si está eliminando de favoritos, eliminar de la lista después de un pequeño retraso
    if (isCurrentlyFavorited) {
      setTimeout(() => {
        setVehicles((prevVehicles) =>
          prevVehicles.filter((v) => v._id !== vehicleId)
        );
      }, 300);
    }

    // Si hay sesión, sincronizar con la API
    if (session) {
      try {
        const response = await fetch("/api/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicleId }),
        });

        if (response.ok) {
          const data = await response.json();
          const isNowFavorited = data.action === "added";
          
          // Si la API dice algo diferente a lo que esperábamos, corregir el estado
          if (isNowFavorited === isCurrentlyFavorited) {
            setFavoritedIds((prev) => {
              const newIds = new Set(prev);
              if (isNowFavorited) {
                newIds.add(vehicleId);
              } else {
                newIds.delete(vehicleId);
              }
              return newIds;
            });
          }
          
          toast.success(
            isNowFavorited ? "Añadido a favoritos" : "Eliminado de favoritos"
          );
        } else {
          // Revertir el cambio si hay error
          setFavoritedIds((prev) => {
            const newIds = new Set(prev);
            if (isCurrentlyFavorited) {
              newIds.add(vehicleId);
            } else {
              newIds.delete(vehicleId);
            }
            return newIds;
          });
          toast.error("No se pudo actualizar favoritos.");
        }
      } catch (error) {
        // Revertir el cambio si hay error
        setFavoritedIds((prev) => {
          const newIds = new Set(prev);
          if (isCurrentlyFavorited) {
            newIds.add(vehicleId);
          } else {
            newIds.delete(vehicleId);
          }
          return newIds;
        });
        toast.error("Error al actualizar favoritos.");
      }
    }
  };

  const toggleCompare = (vehicleId: string) => {
    setCompareList((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const toggleSelect = (vehicleId: string) => {
    setSelectedVehicles((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(vehicleId)) {
        newSelected.delete(vehicleId);
      } else {
        newSelected.add(vehicleId);
      }
      return newSelected;
    });
  };

  const selectAll = () => {
    if (selectedVehicles.size === filteredVehicles.length) {
      setSelectedVehicles(new Set());
    } else {
      setSelectedVehicles(new Set(filteredVehicles.map(v => v._id)));
    }
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
    case "rating":
      // Usamos type assertion para acceder a las propiedades que podrían existir
      return sorted.sort((a, b) => ((b as any).averageRating || 0) - ((a as any).averageRating || 0));
    default:
      return sorted;
  }
};

  const sortedVehicles = sortVehicles(filteredVehicles);

  const handleShareFavorites = () => {
    const shareUrl = `${window.location.origin}/my-favorites`;
    if (navigator.share) {
      navigator.share({
        title: "Mis vehículos favoritos",
        text: `Echa un vistazo a mis ${vehicles.length} vehículos favoritos en 1AutoMarket`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  const handleExportFavorites = () => {
    // Implementar exportación a PDF o CSV
    toast.info("Función de exportación próximamente");
  };

  const handleDeleteSelected = () => {
    if (selectedVehicles.size === 0) return;
    
    // Eliminar todos los vehículos seleccionados de favoritos
    selectedVehicles.forEach(async (vehicleId) => {
      try {
        await fetch("/api/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicleId }),
        });
      } catch (error) {
        console.error("Error al eliminar favorito:", error);
      }
    });

    // Actualizar estado local
    setVehicles((prev) => prev.filter((v) => !selectedVehicles.has(v._id)));
    setFavoritedIds((prev) => {
      const newIds = new Set(prev);
      selectedVehicles.forEach((id) => newIds.delete(id));
      return newIds;
    });
    setSelectedVehicles(new Set());
    toast.success(`${selectedVehicles.size} vehículo(s) eliminado(s) de favoritos`);
  };

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-8 pb-16 px-4 mt-16 md:mt-16">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-lg card-glass">
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-6 mb-6 shimmer-effect">
                  <Heart className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 font-heading text-gradient-primary">
                  Tu lista de favoritos está vacía
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Aún no has añadido vehículos a tu lista de favoritos. Explora
                  nuestro catálogo y guarda los que te interesen.
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
        {/* Header premium */}
        <Card className="shadow-lg border-0 overflow-hidden card-glass">
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
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
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportFavorites}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Barra de búsqueda y filtros */}
        <Card className="shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por marca, modelo o año..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
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
              <Button
                variant={sortBy === "rating" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("rating")}
              >
                Valoración
              </Button>
            </div>

            {/* Acciones en lote */}
            {filteredVehicles.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAll}
                  >
                    {selectedVehicles.size === filteredVehicles.length
                      ? "Deseleccionar todo"
                      : "Seleccionar todo"}
                  </Button>
                  {selectedVehicles.size > 0 && (
                    <>
                      <Badge variant="secondary">
                        {selectedVehicles.size} seleccionado
                        {selectedVehicles.size !== 1 ? "s" : ""}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteSelected}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
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

        {/* Grid de vehículos - Solo vista de grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                  onToggleCompare={toggleCompare}
                  isInCompareList={compareList.includes(vehicle._id)}
                  isFavorited={favoritedIds.has(vehicle._id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  isSelected={selectedVehicles.has(vehicle._id)}
                  onSelectToggle={() => toggleSelect(vehicle._id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pie con acciones de comparación */}
        {compareList.length > 0 && (
          <Card className="fixed bottom-4 right-4 z-50 w-auto shadow-lg card-glass">
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