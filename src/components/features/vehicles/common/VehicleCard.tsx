// src/components/features/vehicles/common/VehicleCard.tsx
"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  Heart,
  Share2,
  Car,
  Fuel,
  Calendar,
  MapPin,
  Settings2,
  Eye,
  Star,
  Layers,
} from "lucide-react";
import { Vehicle, VehicleCondition } from "@/types/types";
import {
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
  WARRANTY_LABELS,
} from "@/types/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const VehicleCard = ({
  vehicle,
  viewMode,
  onToggleCompare,
  isInCompareList,
  isFavorited,
  onFavoriteToggle,
}: {
  vehicle: Vehicle;
  viewMode: "grid" | "list";
  onToggleCompare: (vehicleId: string) => void;
  isInCompareList: boolean;
  isFavorited: boolean;
  onFavoriteToggle: (vehicleId: string, isNowFavorited: boolean) => void;
}) => {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat("es-ES").format(mileage);

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!session) {
      signIn();
      return;
    }

    if (isLoadingFavorite) return;

    setIsLoadingFavorite(true);

    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleId: vehicle._id }),
      });

      if (response.ok) {
        const data = await response.json();
        const isNowFavorited = data.action === "added";
        onFavoriteToggle(vehicle._id, isNowFavorited);
        toast.success(
          isNowFavorited ? "Añadido a favoritos" : "Eliminado de favoritos"
        );
      } else {
        toast.error("No se pudo actualizar favoritos");
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos");
      console.error("Error updating favorite status:", error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const vehicleUrl = `${window.location.origin}${siteConfig.paths.vehicleDetail(vehicle._id)}`;
    const shareData = {
      title: `${vehicle.brand} ${vehicle.model}`,
      text: `Mira este ${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      url: vehicleUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Share was cancelled or failed", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(vehicleUrl);
        toast.success("Enlace copiado al portapapeles");
      } catch {
        toast.error("No se pudo copiar el enlace.");
      }
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleCompare(vehicle._id);
  };

  const translateValue = (value: string, map: Record<string, string>): string => {
    return map[value] || value;
  };

  const translatedCondition = translateValue(
    vehicle.condition,
    VEHICLE_CONDITIONS_LABELS
  );
  const translatedFuelType = translateValue(
    vehicle.fuelType,
    FUEL_TYPES_LABELS
  );
  const translatedTransmission = translateValue(
    vehicle.transmission,
    TRANSMISSION_TYPES_LABELS
  );

  const ActionButtons = ({ isGrid = false }: { isGrid?: boolean }) => (
    <div
      className={cn(
        "flex gap-2",
        isGrid
          ? "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          : "absolute bottom-3 right-3"
      )}
    >
      <Button
        variant={isInCompareList ? "default" : "secondary"}
        size="icon"
        className="rounded-full shadow-lg"
        onClick={handleCompare}
        title="Comparar"
      >
        <Layers className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full shadow-lg"
        onClick={handleFavorite}
        title="Añadir a favoritos"
        disabled={isLoadingFavorite}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-colors",
            isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
          )}
        />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full shadow-lg"
        onClick={handleShare}
        title="Compartir"
      >
        <Share2 className="w-4 h-4 text-muted-foreground" />
      </Button>
    </div>
  );

  if (viewMode === "list") {
    return (
      <Link
        href={siteConfig.paths.vehicleDetail(vehicle._id)}
        className="bg-card border-border hover:bg-accent/50 transition-all duration-300 hover:shadow-xl group rounded-lg border relative block"
      >
        {vehicle.isFeatured && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-bold z-10 flex items-center gap-1">
            <Star className="w-3 h-3 inline" />
            Destacado
          </div>
        )}
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-80 h-48 md:h-auto overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none">
            {isImageLoading && (
              <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <Image
              src={
                imageError || !vehicle.images[0]
                  ? "/placeholder.svg?height=200&width=300"
                  : vehicle.images[0]
              }
              alt={`${vehicle.brand} ${vehicle.model}`}
              width={320}
              height={200}
              className={cn(
                "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {vehicle.condition === VehicleCondition.NEW && (
              <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Nuevo
              </span>
            )}
            <ActionButtons />
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {`${vehicle.brand} ${vehicle.model}`}
                </h3>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{vehicle.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    <span>{formatMileage(vehicle.mileage)} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{vehicle.location}</span>
                  </div>
                  {/* FIX: Add explicit check for vehicle.views */}
                  {vehicle.views !== undefined && vehicle.views > 0 && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{vehicle.views} vistas</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {formatPrice(vehicle.price)}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Condición</span>
                <span className="font-medium text-foreground">
                  {translatedCondition}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">
                  Transmisión
                </span>
                <span className="font-medium text-foreground">
                  {translatedTransmission}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">
                  Combustible
                </span>
                <span className="font-medium text-foreground">
                  {translatedFuelType}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Estado</span>
                <span className="font-medium text-foreground">
                  {vehicle.status}
                </span>
              </div>
            </div>
            {vehicle.features.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.slice(0, 3).map((feature: string) => (
                    <span
                      key={feature}
                      className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {vehicle.features.length > 3 && (
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                      +{vehicle.features.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
            {vehicle.warranty && WARRANTY_LABELS[vehicle.warranty] && (
              <div className="mt-3">
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                  {WARRANTY_LABELS[vehicle.warranty]}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link
      href={siteConfig.paths.vehicleDetail(vehicle._id)}
      className="flex flex-col bg-card/80 border-border hover:bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm group overflow-hidden rounded-lg border relative"
    >
      {vehicle.isFeatured && (
        <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-bold z-10 flex items-center gap-1">
          <Star className="w-3 h-3 inline" />
          Destacado
        </div>
      )}
      <div className="relative w-full h-56 overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={
            imageError || !vehicle.images[0]
              ? "/placeholder.svg?height=200&width=300"
              : vehicle.images[0]
          }
          alt={`${vehicle.brand} ${vehicle.model}`}
          width={300}
          height={224}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 group-hover:scale-110",
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {vehicle.condition === VehicleCondition.NEW && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">
            Nuevo
          </span>
        )}
        <ActionButtons isGrid />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {`${vehicle.brand} ${vehicle.model} (${vehicle.year})`}
        </h3>
        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          {formatPrice(vehicle.price)}
        </p>
        <div className="grid grid-cols-4 gap-2 text-center border-t border-b border-border py-3 my-4">
          <div>
            <Car
              className="w-5 h-5 mx-auto text-muted-foreground"
              // Removed title prop from Lucide icon
            />
            <p
              className="text-xs mt-1 text-muted-foreground line-clamp-1"
              title={translatedTransmission}
            >
              {translatedTransmission}
            </p>
          </div>
          <div>
            <Settings2 className="w-5 h-5 mx-auto text-muted-foreground" />
            <p className="text-xs mt-1 text-muted-foreground line-clamp-1">
              {formatMileage(vehicle.mileage)} km
            </p>
          </div>
          <div>
            <Fuel
              className="w-5 h-5 mx-auto text-muted-foreground"
              // Removed title prop from Lucide icon
            />
            <p
              className="text-xs mt-1 text-muted-foreground line-clamp-1"
              title={translatedFuelType}
            >
              {translatedFuelType}
            </p>
          </div>
          <div>
            <MapPin
              className="w-5 h-5 mx-auto text-muted-foreground"
              // Removed title prop from Lucide icon
            />
            <p
              className="text-xs mt-1 text-muted-foreground line-clamp-1"
              title={vehicle.location}
            >
              {vehicle.location}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 mt-auto">
        <div className="flex items-center justify-center w-full p-2 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground transition-all duration-300 transform group-hover:scale-105 shadow-lg group-hover:shadow-xl rounded">
          Ver Detalles
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;