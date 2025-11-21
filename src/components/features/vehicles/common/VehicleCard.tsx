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
  Sparkles,
  Eye,
  Check,
} from "lucide-react";
import { Vehicle, VehicleCondition } from "@/types/types";
import {
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
} from "@/types/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { StarRating } from "../detail/sections/StarRating";

// Sub-componente para la imagen del vehículo
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

// Sub-componente para los botones de acción
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
  onSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-3 right-3 flex gap-2 z-10"
    >
      {onSelect && (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant={isSelected ? "default" : "secondary"}
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full shadow-lg transition-all duration-200",
              isSelected && "ring-2 ring-offset-2 ring-accent"
            )}
            onClick={onSelect}
            title={isSelected ? "Deseleccionar" : "Seleccionar"}
            style={{
              backgroundColor: isSelected ? "var(--accent)" : "var(--card)",
              color: isSelected ? "var(--accent-foreground)" : "var(--card-foreground)",
              border: isSelected ? "2px solid var(--accent)" : "1px solid var(--border)",
              transform: isSelected ? "scale(1.1)" : "scale(1)"
            }}
          >
            <Check className={cn("w-4 h-4", isSelected && "text-white")} />
          </Button>
        </motion.div>
      )}
      
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant={isInCompareList ? "default" : "secondary"}
          size="icon"
          className="h-8 w-8 rounded-full shadow-lg"
          onClick={onCompare}
          title="Comparar"
          style={{
            backgroundColor: isInCompareList ? "var(--accent)" : "var(--card)",
            color: isInCompareList ? "var(--accent-foreground)" : "var(--card-foreground)",
            border: isInCompareList ? "1px solid var(--accent)" : "1px solid var(--border)"
          }}
        >
          <Layers className="w-4 h-4" />
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={onFavorite}
          title="Añadir a favoritos"
          disabled={isLoadingFavorite}
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)"
          }}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )}
          />
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={onShare}
          title="Compartir"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)"
          }}
        >
          <Share2 className="w-4 h-4 text-muted-foreground" />
        </Button>
      </motion.div>
    </motion.div>
  );
});
ActionButtons.displayName = "ActionButtons";

// Componente principal VehicleCard
const VehicleCard: React.FC<{
  vehicle: Vehicle & { averageRating?: number; ratingCount?: number };
  onToggleCompare: (vehicleId: string) => void;
  isInCompareList: boolean;
  isFavorited: boolean;
  onFavoriteToggle: (vehicleId: string, isNowFavorited: boolean) => void;
  isSelected?: boolean;
  onSelectToggle?: (vehicleId: string) => void;
}> = memo(({ 
  vehicle, 
  onToggleCompare, 
  isInCompareList, 
  isFavorited, 
  onFavoriteToggle,
  isSelected = false,
  onSelectToggle
}) => {
  const { data: session } = useSession();
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(vehicle);

  // Lógica de valoración
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

  // Lógica de formato
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat("es-ES").format(mileage);

  // Manejadores de eventos
  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
        
        // Llamar a la función del padre con ambos parámetros como en el original
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
    e.preventDefault();
    e.stopPropagation();
    
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
    e.stopPropagation();
    onToggleCompare(vehicle._id);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelectToggle) {
      onSelectToggle(vehicle._id);
    }
  };

  // Datos traducidos
  const translateValue = (value: string, map: Record<string, string>): string => {
    return map[value] || value;
  };
  const translatedTransmission = translateValue(vehicle.transmission, TRANSMISSION_TYPES_LABELS);
  const translatedFuelType = translateValue(vehicle.fuelType, FUEL_TYPES_LABELS);

  return (
    <motion.div 
      layout 
      className={cn(
        "group h-full relative",
        isSelected && "selection-indicator"
      )}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Indicador de selección en la esquina */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 left-2 z-20"
        >
          <div className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium shadow-lg">
            <Check className="w-3 h-3" />
            Seleccionado
          </div>
        </motion.div>
      )}
      
      <div className={cn(
        "card-glass rounded-xl shadow-hard border border-border/50 overflow-hidden h-full flex flex-col transition-all duration-200",
        isSelected && "ring-2 ring-accent ring-offset-2 shadow-xl transform scale-[1.02]"
      )}>
        {/* Efecto de brillo superior */}
        <div
          className={cn(
            "h-1 w-full",
            isSelected ? "bg-accent" : "bg-gradient-to-r from-primary via-accent to-primary"
          )}
        />
        
        <div className="relative">
          <VehicleImage
            src={vehicle.images[0] || "/placeholder.svg?height=200&width=300"}
            alt={`${vehicle.brand} ${vehicle.model}`}
          />
          
          {/* Badges de estado */}
          <div className="absolute top-3 left-3 flex gap-2">
            {vehicle.isFeatured && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Badge 
                  className="flex items-center gap-1 px-2 py-1"
                  style={{ 
                    background: "var(--gradient-primary)",
                    color: "var(--primary-foreground)"
                  }}
                >
                  <Star className="w-3 h-3" />
                  Destacado
                </Badge>
              </motion.div>
            )}
            
            {vehicle.condition === VehicleCondition.NEW && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Badge 
                  className="px-2 py-1"
                  style={{ 
                    background: "var(--gradient-success)",
                    color: "var(--success-foreground)"
                  }}
                >
                  Nuevo
                </Badge>
              </motion.div>
            )}
          </div>
          
          {/* Botones de acción */}
          <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
            <ActionButtons
              isFavorited={isFavorited}
              isInCompareList={isInCompareList}
              isSelected={isSelected}
              isLoadingFavorite={isLoadingFavorite}
              onFavorite={handleFavorite}
              onShare={handleShare}
              onCompare={handleCompare}
              onSelect={handleSelect}
            />
          </div>
        </div>

        <div className="p-4 md:p-6 flex-grow flex flex-col">
          <div className="mb-3">
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
          </div>
          
          <p className="text-2xl font-bold text-gradient mb-4">
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
        
        <div className="p-4 md:p-6 pt-0 mt-auto">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              className="w-full gap-2"
              style={{
                background: "var(--gradient-primary)",
                color: "var(--primary-foreground)"
              }}
            >
              <Link href={siteConfig.paths.vehicleDetail(vehicle._id)} className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Ver Detalles
              </Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Indicador de mejora con efecto de brillo */}
        <div className="flex items-center justify-center p-3 text-xs text-muted-foreground">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-3 h-3 mr-1" style={{ color: "var(--accent)" }} />
          </motion.div>
          <span>Actualizado recientemente</span>
        </div>
      </div>
    </motion.div>
  );
});

VehicleCard.displayName = "VehicleCard";

export default VehicleCard;