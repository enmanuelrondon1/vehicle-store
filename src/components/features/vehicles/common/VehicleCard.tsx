// src/components/features/vehicles/common/VehicleCard.tsx
"use client";

import type React from "react";
import { useState, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  Car,
  Fuel,
  Calendar,
  MapPin,
  Settings2,
  Star,
  Layers,
} from "lucide-react";
import { Vehicle, VehicleCondition } from "@/types/types";
import {
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
} from "@/types/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { StarRating } from "../detail/sections/StarRating";

// --- SUB-COMPONENTE: VehicleImage ---
// Memoizado para evitar re-renders si la imagen no cambia.
const VehicleImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = memo(({ src, alt, className }) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageError = () => setImageError(true);
  const handleImageLoad = () => setIsImageLoading(false);

  return (
    <div className="relative w-full h-56 overflow-hidden bg-muted">
      <AnimatePresence>
        {isImageLoading && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-muted animate-pulse"
          />
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Image
          src={imageError ? "/placeholder.svg?height=200&width=300" : src}
          alt={alt}
          width={300}
          height={224}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </motion.div>
    </div>
  );
});
VehicleImage.displayName = "VehicleImage";

// --- SUB-COMPONENTE: ActionButtons ---
// Memoizado para evitar re-renders si el estado de los botones no cambia.
const ActionButtons: React.FC<{
  isFavorited: boolean;
  isInCompareList: boolean;
  isLoadingFavorite: boolean;
  onFavorite: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onCompare: (e: React.MouseEvent) => void;
}> = memo(({ isFavorited, isInCompareList, isLoadingFavorite, onFavorite, onShare, onCompare }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-3 right-3 flex gap-2"
    >
      <Button
        variant={isInCompareList ? "default" : "secondary"}
        size="icon"
        className="h-8 w-8 rounded-full shadow-lg"
        onClick={onCompare}
        title="Comparar"
      >
        <Layers className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full shadow-lg"
        onClick={onFavorite}
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
        onClick={onShare}
        title="Compartir"
      >
        <Share2 className="w-4 h-4 text-muted-foreground" />
      </Button>
    </motion.div>
  );
});
ActionButtons.displayName = "ActionButtons";

// --- COMPONENTE PRINCIPAL: VehicleCard ---
// Memoizado para evitar re-renders en la lista si las props no han cambiado.
const VehicleCard: React.FC<{
  vehicle: Vehicle & { averageRating?: number; ratingCount?: number };
  onToggleCompare: (vehicleId: string) => void;
  isInCompareList: boolean;
  isFavorited: boolean;
  onFavoriteToggle: (vehicleId: string, isNowFavorited: boolean) => void;
}> = memo(({ vehicle, onToggleCompare, isInCompareList, isFavorited, onFavoriteToggle }) => {
  const { data: session } = useSession();
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(vehicle);

  // --- Lógica de Valoración ---
  useEffect(() => {
    const fetchUserRating = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/vehicles/${vehicle._id}/user-rating`);
          const data = await response.json();
          if (response.ok && data.userRating !== null) {
            setUserRating(data.userRating);
          }
        } catch (error) {
          console.error("Error fetching user rating:", error);
        }
      }
    };
    fetchUserRating();
  }, [session, vehicle._id]);

  const handleSetRating = async (rating: number) => {
    if (isSubmittingRating) return;
    if (!session) {
      toast.info("Debes iniciar sesión para valorar un vehículo.");
      signIn();
      return;
    }
    setIsSubmittingRating(true);
    try {
      const response = await fetch(`/api/vehicles/${vehicle._id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("¡Gracias por tu valoración!");
        setCurrentVehicle((prev) => ({
          ...prev,
          averageRating: data.averageRating,
          ratingCount: data.ratingCount,
        }));
        setUserRating(rating);
      } else {
        toast.error(data.error || "No se pudo guardar la valoración.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Error al enviar la valoración.");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // --- Lógica de Formato ---
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat("es-ES").format(mileage);

  // --- Manejadores de Eventos ---
  const handleFavorite = async (e: React.MouseEvent) => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId: vehicle._id }),
      });
      if (response.ok) {
        const data = await response.json();
        const isNowFavorited = data.action === "added";
        onFavoriteToggle(vehicle._id, isNowFavorited);
        toast.success(isNowFavorited ? "Añadido a favoritos" : "Eliminado de favoritos");
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
    e.preventDefault();
    onToggleCompare(vehicle._id);
  };

  // --- Datos Traducidos ---
  const translateValue = (value: string, map: Record<string, string>): string => {
    return map[value] || value;
  };
  const translatedTransmission = translateValue(vehicle.transmission, TRANSMISSION_TYPES_LABELS);
  const translatedFuelType = translateValue(vehicle.fuelType, FUEL_TYPES_LABELS);

  // --- Renderizado JSX ---
  return (
    <motion.div layout className="group">
      <Card className="overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
        <CardContent className="p-0 flex-grow flex flex-col">
          <div className="relative">
            <VehicleImage
              src={vehicle.images[0] || "/placeholder.svg?height=200&width=300"}
              alt={`${vehicle.brand} ${vehicle.model}`}
            />
            {vehicle.isFeatured && (
              <div className="absolute top-3 left-3 z-10">
                <Badge variant="default" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Destacado
                </Badge>
              </div>
            )}
            {vehicle.condition === VehicleCondition.NEW && (
              <Badge variant="default" className="absolute top-3 right-3">
                Nuevo
              </Badge>
            )}
            <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
              <ActionButtons
                isFavorited={isFavorited}
                isInCompareList={isInCompareList}
                isLoadingFavorite={isLoadingFavorite}
                onFavorite={handleFavorite}
                onShare={handleShare}
                onCompare={handleCompare}
              />
            </div>
          </div>

          <div className="p-6 flex-grow flex flex-col">
            <Link
              href={siteConfig.paths.vehicleDetail(vehicle._id)}
              className="block"
              aria-label={`Ver detalles de ${vehicle.brand} ${vehicle.model}`}
            >
              <h3 className="text-xl font-bold mb-2 font-heading text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {`${currentVehicle.brand} ${currentVehicle.model} (${currentVehicle.year})`}
              </h3>
            </Link>
            
            <div className="mb-3">
              <StarRating
                rating={userRating ?? currentVehicle.averageRating ?? 0}
                ratingCount={currentVehicle.ratingCount ?? 0}
                isInteractive={!isSubmittingRating}
                onRating={handleSetRating}
              />
            </div>
            <p className="text-2xl font-bold text-primary mb-4">
              {formatPrice(currentVehicle.price)}
            </p>
            <div className="grid grid-cols-4 gap-2 text-center border-t border-b border-border py-3 my-4">
              <div>
                <Car className="w-5 h-5 mx-auto text-muted-foreground" />
                <p className="text-xs mt-1 text-muted-foreground line-clamp-1" title={translatedTransmission}>
                  {translatedTransmission}
                </p>
              </div>
              <div>
                <Settings2 className="w-5 h-5 mx-auto text-muted-foreground" />
                <p className="text-xs mt-1 text-muted-foreground line-clamp-1">
                  {formatMileage(currentVehicle.mileage)} km
                </p>
              </div>
              <div>
                <Fuel className="w-5 h-5 mx-auto text-muted-foreground" />
                <p className="text-xs mt-1 text-muted-foreground line-clamp-1" title={translatedFuelType}>
                  {translatedFuelType}
                </p>
              </div>
              <div>
                <MapPin className="w-5 h-5 mx-auto text-muted-foreground" />
                <p className="text-xs mt-1 text-muted-foreground line-clamp-1" title={currentVehicle.location}>
                  {currentVehicle.location}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 pt-0 mt-auto">
            <Button asChild className="w-full">
              <Link href={siteConfig.paths.vehicleDetail(vehicle._id)}>
                Ver Detalles
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

VehicleCard.displayName = "VehicleCard";

export default VehicleCard;