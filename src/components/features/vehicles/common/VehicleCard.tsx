// src/components/features/vehicles/common/VehicleCard.tsx
// ✅ OPTIMIZACIONES v2:
// 1. Reemplazado motion.div wrapper por CSS (elimina layout recalculation)
// 2. Eliminado AnimatePresence del skeleton de imagen → CSS transition puro
// 3. ActionButtons sin motion.div → CSS fade-in
// 4. backdrop-blur solo en hover → no consume GPU en 6 cards simultáneas
// 5. Alt descriptivo con año incluido
// 6. Imports de framer-motion reducidos al mínimo
// ✅ FIX v3: position relative en wrapper de Image fill → elimina warning de consola
// ✅ FIX v4: eliminado framer-motion completamente, quality 80→65

"use client";

import type React from "react";
import { useState, memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  Heart,
  Share2,
  Car,
  Fuel,
  MapPin,
  Settings2,
  Star,
  Layers,
  Sparkles,
  Eye,
  Check,
} from "lucide-react";
import { Vehicle, VehicleCondition } from "@/types/types";
import {
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
} from "@/types/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { StarRating } from "../detail/sections/StarRating";

/* ============================================
   🖼️ VehicleImage — sin AnimatePresence, CSS puro
   ============================================ */
const VehicleImage: React.FC<{
  src: string;
  alt: string;
  priority?: boolean;
}> = memo(({ src, alt, priority = false }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-56 overflow-hidden bg-muted">
      {/* Skeleton CSS puro */}
      <div
        className={cn(
          "absolute inset-0 bg-muted animate-pulse transition-opacity duration-300",
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        aria-hidden="true"
      />
      <div className="relative h-56 transition-transform duration-300 group-hover:scale-105">
        <Image
          src={imageError ? "/placeholder.svg?height=200&width=300" : src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          priority={priority}
          quality={65}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
});
VehicleImage.displayName = "VehicleImage";

/* ============================================
   🎛️ ActionButtons — CSS opacity, sin motion.div
   ============================================ */
const ActionButtons: React.FC<{
  isFavorited: boolean;
  isInCompareList: boolean;
  isSelected?: boolean;
  isLoadingFavorite: boolean;
  onFavorite: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onCompare: (e: React.MouseEvent) => void;
  onSelect?: (e: React.MouseEvent) => void;
}> = memo(({
  isFavorited,
  isInCompareList,
  isSelected = false,
  isLoadingFavorite,
  onFavorite,
  onShare,
  onCompare,
  onSelect,
}) => {
  return (
    <div className="absolute top-3 right-3 flex gap-2 z-10">
      {onSelect && (
        <Button
          variant={isSelected ? "default" : "secondary"}
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95",
            isSelected && "ring-2 ring-offset-2 ring-accent"
          )}
          onClick={onSelect}
          aria-label={isSelected ? "Deseleccionar vehículo" : "Seleccionar vehículo"}
          style={{
            backgroundColor: isSelected ? "var(--accent)" : "var(--card)",
            color: isSelected ? "var(--accent-foreground)" : "var(--card-foreground)",
            border: isSelected ? "2px solid var(--accent)" : "1px solid var(--border)",
          }}
        >
          <Check className={cn("w-4 h-4", isSelected && "text-white")} aria-hidden="true" />
        </Button>
      )}

      <Button
        variant={isInCompareList ? "default" : "secondary"}
        size="icon"
        className="h-8 w-8 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150"
        onClick={onCompare}
        aria-label={isInCompareList ? "Quitar de comparación" : "Agregar a comparación"}
        style={{
          backgroundColor: isInCompareList ? "var(--accent)" : "var(--card)",
          color: isInCompareList ? "var(--accent-foreground)" : "var(--card-foreground)",
          border: isInCompareList ? "1px solid var(--accent)" : "1px solid var(--border)",
        }}
      >
        <Layers className="w-4 h-4" aria-hidden="true" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150"
        onClick={onFavorite}
        aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
        disabled={isLoadingFavorite}
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-colors",
            isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
          )}
          aria-hidden="true"
        />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150"
        onClick={onShare}
        aria-label="Compartir vehículo"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        <Share2 className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
      </Button>
    </div>
  );
});
ActionButtons.displayName = "ActionButtons";

/* ============================================
   🚗 VehicleCard — Principal
   ============================================ */
const VehicleCard: React.FC<{
  vehicle: Vehicle & { averageRating?: number; ratingCount?: number };
  onToggleCompare: (vehicleId: string) => void;
  isInCompareList: boolean;
  isFavorited: boolean;
  onFavoriteToggle: (vehicleId: string, isNowFavorited: boolean) => void;
  isSelected?: boolean;
  onSelectToggle?: (vehicleId: string) => void;
  index?: number;
}> = memo(({
  vehicle,
  onToggleCompare,
  isInCompareList,
  isFavorited,
  onFavoriteToggle,
  isSelected = false,
  onSelectToggle,
  index = 0,
}) => {
  const { data: session } = useSession();
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(vehicle);

  const imageAlt = `${vehicle.brand} ${vehicle.model} ${vehicle.year}${vehicle.color ? ` color ${vehicle.color}` : ""}`;

  const handleSetRating = useCallback(async (rating: number) => {
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
      } else {
        toast.error(data.error || "No se pudo guardar la valoración.");
      }
    } catch {
      toast.error("Error al enviar la valoración.");
    } finally {
      setIsSubmittingRating(false);
    }
  }, [isSubmittingRating, session, vehicle._id]);

  const formatPrice = useCallback(
    (price: number) =>
      new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price),
    []
  );

  const formatMileage = useCallback(
    (mileage: number) => new Intl.NumberFormat("es-ES").format(mileage),
    []
  );

  const handleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!session) { signIn(); return; }
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
      } catch {
        toast.error("Error al actualizar favoritos");
      } finally {
        setIsLoadingFavorite(false);
      }
    },
    [session, isLoadingFavorite, vehicle._id, onFavoriteToggle]
  );

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const vehicleUrl = `${window.location.origin}${siteConfig.paths.vehicleDetail(vehicle._id)}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${vehicle.brand} ${vehicle.model}`,
            text: `Mira este ${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
            url: vehicleUrl,
          });
        } catch {}
      } else {
        try {
          await navigator.clipboard.writeText(vehicleUrl);
          toast.success("Enlace copiado al portapapeles");
        } catch {
          toast.error("No se pudo copiar el enlace.");
        }
      }
    },
    [vehicle._id, vehicle.brand, vehicle.model, vehicle.year]
  );

  const handleCompare = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleCompare(vehicle._id);
    },
    [onToggleCompare, vehicle._id]
  );

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelectToggle?.(vehicle._id);
    },
    [onSelectToggle, vehicle._id]
  );

  const translatedTransmission =
    TRANSMISSION_TYPES_LABELS[vehicle.transmission] || vehicle.transmission;
  const translatedFuelType =
    FUEL_TYPES_LABELS[vehicle.fuelType] || vehicle.fuelType;

  return (
    <article
      className={cn(
        "group h-full relative",
        "transition-transform duration-300 ease-out hover:-translate-y-1",
        isSelected && "selection-indicator"
      )}
      aria-label={`Vehículo: ${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
    >
      {/* ✅ FIX v4: motion.div → div con CSS animation */}
      {isSelected && (
        <div className="absolute top-2 left-2 z-20 animate-in zoom-in duration-200">
          <div className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium shadow-lg">
            <Check className="w-3 h-3" aria-hidden="true" />
            Seleccionado
          </div>
        </div>
      )}

      <div
        className={cn(
          "card-premium overflow-hidden h-full flex flex-col",
          isSelected && "ring-2 ring-accent ring-offset-2 shadow-xl scale-[1.02]"
        )}
      >
        {/* Barra decorativa superior */}
        <div
          className={cn(
            "h-1 w-full flex-shrink-0",
            isSelected
              ? "bg-accent"
              : "bg-gradient-to-r from-primary via-accent to-primary"
          )}
          aria-hidden="true"
        />

        {/* Imagen */}
        <div className="relative flex-shrink-0">
          <VehicleImage
            src={vehicle.images[0] || "/placeholder.svg?height=200&width=300"}
            alt={imageAlt}
            priority={index < 3}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2" aria-label="Estado del vehículo">
            {vehicle.isFeatured && (
              <Badge
                className="flex items-center gap-1 px-2 py-1"
                style={{
                  background: "var(--gradient-primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                <Star className="w-3 h-3" aria-hidden="true" />
                Destacado
              </Badge>
            )}
            {vehicle.condition === VehicleCondition.NEW && (
              <Badge
                className="px-2 py-1"
                style={{
                  background: "var(--gradient-success)",
                  color: "var(--success-foreground)",
                }}
              >
                Nuevo
              </Badge>
            )}
          </div>

          {/* Botones de acción */}
          <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            <ActionButtons
              isFavorited={isFavorited}
              isInCompareList={isInCompareList}
              isSelected={isSelected}
              isLoadingFavorite={isLoadingFavorite}
              onFavorite={handleFavorite}
              onShare={handleShare}
              onCompare={handleCompare}
              onSelect={onSelectToggle ? handleSelect : undefined}
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 md:p-5 flex-grow flex flex-col">
          <div className="mb-3">
            <Link
              href={siteConfig.paths.vehicleDetail(vehicle._id)}
              className="block group/link"
            >
              <h3 className="text-lg md:text-xl font-bold mb-2 font-heading text-foreground group-hover/link:text-primary transition-colors line-clamp-1">
                {`${currentVehicle.brand} ${currentVehicle.model} (${currentVehicle.year})`}
              </h3>
            </Link>

            <StarRating
              rating={currentVehicle.averageRating ?? 0}
              ratingCount={currentVehicle.ratingCount ?? 0}
              isInteractive={!isSubmittingRating}
              onRating={handleSetRating}
            />
          </div>

          <p
            className="text-xl md:text-2xl font-bold text-gradient mb-4"
            aria-label={`Precio: ${formatPrice(currentVehicle.price)}`}
          >
            {formatPrice(currentVehicle.price)}
          </p>

          {/* Specs grid */}
          <dl className="grid grid-cols-4 gap-2 text-center border-t border-b border-border py-3 my-3">
            <div>
              <dt className="sr-only">Transmisión</dt>
              <Car className="w-4 h-4 mx-auto text-muted-foreground" aria-hidden="true" />
              <dd className="text-xs mt-1 text-muted-foreground line-clamp-1" title={translatedTransmission}>
                {translatedTransmission}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Kilometraje</dt>
              <Settings2 className="w-4 h-4 mx-auto text-muted-foreground" aria-hidden="true" />
              <dd className="text-xs mt-1 text-muted-foreground line-clamp-1">
                {formatMileage(currentVehicle.mileage)} km
              </dd>
            </div>
            <div>
              <dt className="sr-only">Combustible</dt>
              <Fuel className="w-4 h-4 mx-auto text-muted-foreground" aria-hidden="true" />
              <dd className="text-xs mt-1 text-muted-foreground line-clamp-1" title={translatedFuelType}>
                {translatedFuelType}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Ubicación</dt>
              <MapPin className="w-4 h-4 mx-auto text-muted-foreground" aria-hidden="true" />
              <dd className="text-xs mt-1 text-muted-foreground line-clamp-1" title={currentVehicle.location}>
                {currentVehicle.location}
              </dd>
            </div>
          </dl>
        </div>

        {/* Footer CTA */}
        <div className="px-4 md:px-5 pb-4 mt-auto">
          <Button
            asChild
            className="w-full gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150"
            style={{
              background: "var(--gradient-primary)",
              color: "var(--primary-foreground)",
            }}
          >
            <Link
              href={siteConfig.paths.vehicleDetail(vehicle._id)}
              aria-label={`Ver detalles de ${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              Ver Detalles
            </Link>
          </Button>
        </div>

        <div
          className="flex items-center justify-center p-3 text-xs text-muted-foreground"
          aria-label="Publicación reciente"
        >
          <Sparkles
            className="w-3 h-3 mr-1 flex-shrink-0"
            style={{ color: "var(--accent)" }}
            aria-hidden="true"
          />
          <span>Actualizado recientemente</span>
        </div>
      </div>
    </article>
  );
});

VehicleCard.displayName = "VehicleCard";
export default VehicleCard;