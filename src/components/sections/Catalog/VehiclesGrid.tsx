import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Heart, Phone, Star, MapPin, Fuel, Settings, Calendar } from "lucide-react";
import { Translation, useLanguage } from "@/context/LanguajeContext";
import Image from "next/image";

interface Vehicle {
  id: string;
  category: { es: string; en: string };
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: { es: string; en: string };
  engine: { es: string; en: string };
  transmission: { es: string; en: string };
  fuelType: { es: string; en: string };
  condition: { es: string; en: string };
  description: { es: string; en: string };
  images: string[];
  location: string;
  disponibilidad: { es: string; en: string };
  rating?: number;
  loadCapacity?: number;
}

const VehicleCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-12" />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
    </CardContent>
  </Card>
);

const VehicleCard: React.FC<{ vehicle: Vehicle; onToggleFavorite: (id: string) => void; isFavorite: boolean }> = ({
  vehicle,
  onToggleFavorite,
  isFavorite,
}) => {
  const router = useRouter();
  const { language } = useLanguage();

  const handleViewMore = () => {
    router.push(`/vehicle/${vehicle.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={vehicle.images[0].trimEnd()} // Añadimos trimEnd() por seguridad
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="rounded-t-lg object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-vehicle.jpg";
            }}
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="sm"
              variant={isFavorite ? "default" : "secondary"}
              className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
              onClick={() => onToggleFavorite(vehicle.id)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button>
            <Badge className="bg-white/95 text-black text-xs">
              {vehicle.disponibilidad[language]}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < (vehicle.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                />
              ))}
              <span className="ml-1">{vehicle.rating || 0}/5</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-blue-600 transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>
            <Badge variant="outline" className="text-xs ml-2">{vehicle.year}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {vehicle.location}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {vehicle.mileage.toLocaleString()} km
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-3 w-3" />
              {vehicle.fuelType[language]}
            </div>
            <div className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              {vehicle.transmission[language]}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{formatPrice(vehicle.price)}</p>
              <p className="text-xs text-gray-500">{vehicle.condition[language]}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
              <Button size="sm" onClick={handleViewMore}>
                {language === "es" ? "Ver más" : "View more"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface VehiclesGridProps {
  translations: Translation;
  isLoading: boolean;
  paginatedVehicles: Vehicle[];
  favorites: Set<string>;
  itemsPerPage: number;
  toggleFavorite: (vehicleId: string) => void;
  clearAllFilters: () => void;
}

const VehiclesGrid: React.FC<VehiclesGridProps> = ({
  isLoading,
  paginatedVehicles,
  favorites,
  itemsPerPage,
  toggleFavorite,
  clearAllFilters,
}) => {
  const { language } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <VehicleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (paginatedVehicles.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="max-w-md mx-auto">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {language === "es" ? "No se encontraron resultados" : "No results found"}
            </p>
            <Button onClick={clearAllFilters} variant="outline" className="text-gray-600 dark:text-gray-400">
              {language === "es" ? "Ver todos" : "View all"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
      {paginatedVehicles.map((vehicle: Vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onToggleFavorite={toggleFavorite}
          isFavorite={favorites.has(vehicle.id)}
        />
      ))}
    </div>
  );
};

export default VehiclesGrid;