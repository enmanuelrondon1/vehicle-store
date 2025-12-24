// src/components/features/vehicles/reels/ReelCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Eye, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Vehicle } from "@/types/types";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import ReelInfo from "./ReelInfo";
import { useReelAnalytics } from "@/hooks/useReelAnalytics";
import { useReelsConfig } from "@/hooks/useReelsConfig";
import ParticlesEffect from "./ParticlesEffect";

interface ReelCardProps {
  vehicle: Vehicle;
  isActive: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({ 
  vehicle, 
  isActive,
  onNext,
  onPrevious 
}) => {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Obtener configuración del hook - se actualiza en tiempo real
  const { config } = useReelsConfig();

  // Analytics hook
  const { trackInteraction } = useReelAnalytics(vehicle._id, isActive);

  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : ["/placeholder.svg?height=800&width=600"];

  // Determinar qué información mostrar según el modo
  const shouldShowActionButtons = config.viewMode !== "minimal";
  const shouldShowFullInfo = config.viewMode === "detailed";
  const shouldShowBasicInfo = config.viewMode !== "minimal";

  // Check if vehicle is favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (session) {
        try {
          const response = await fetch("/api/user/favorites");
          if (response.ok) {
            const data = await response.json();
            const favoriteIds = data.favorites?.map((v: Vehicle) => v._id) || [];
            setIsFavorited(favoriteIds.includes(vehicle._id));
          }
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };
    
    checkFavoriteStatus();
  }, [session, vehicle._id]);

  // Auto-advance images
  useEffect(() => {
    if (isActive && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, config.autoplaySpeed);
      
      return () => clearInterval(interval);
    }
  }, [isActive, images.length, config.autoplaySpeed]);

  // Record view
  useEffect(() => {
    if (isActive) {
      const recordView = async () => {
        try {
          await fetch(`/api/vehicles/${vehicle._id}/views`, {
            method: "POST",
          });
        } catch (error) {
          console.error("Error recording view:", error);
        }
      };
      
      recordView();
    }
  }, [isActive, vehicle._id]);

  const handleFavorite = async (e: React.MouseEvent) => {
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
        setIsFavorited(isNowFavorited);
        
        if (isNowFavorited) {
          trackInteraction("favorite");
        }
        
        toast.success(
          isNowFavorited ? "❤️ Añadido a favoritos" : "Eliminado de favoritos"
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
    
    const vehicleUrl = `${window.location.origin}${siteConfig.paths.vehicleDetail(vehicle._id)}`;
    const shareData = {
      title: `${vehicle.brand} ${vehicle.model}`,
      text: `Mira este ${vehicle.brand} ${vehicle.model} ${vehicle.year} por ${formatPrice(vehicle.price)}`,
      url: vehicleUrl,
    };
    
    trackInteraction("share");
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Share was cancelled", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(vehicleUrl);
        toast.success("🔗 Enlace copiado al portapapeles");
      } catch {
        toast.error("No se pudo copiar el enlace");
      }
    }
  };

  const handleViewDetails = () => {
    trackInteraction("view_details");
    window.open(siteConfig.paths.vehicleDetail(vehicle._id), "_blank");
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div 
      className="relative w-full h-full bg-black"
    >
      {/* Background Image with Blur */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt="Background"
          fill
          className="object-cover blur-2xl opacity-50 scale-110"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Particles Effect - Solo en modo detallado */}
      <AnimatePresence>
        {config.showParticles && shouldShowFullInfo && (
          <ParticlesEffect />
        )}
      </AnimatePresence>

      {/* Main Content Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Main Image */}
        <div className="relative w-full max-w-2xl h-full flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: config.transitionSpeed / 1000 }}
              className="relative w-full aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            >
              {isImageLoading && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              
              <Image
                src={imageError ? "/placeholder.svg?height=800&width=600" : images[currentImageIndex]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                className={cn(
                  "object-contain transition-opacity duration-500",
                  isImageLoading ? "opacity-0" : "opacity-100"
                )}
                priority={isActive}
                onError={() => setImageError(true)}
                onLoad={() => setIsImageLoading(false)}
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm z-20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm z-20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {images.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-300",
                          idx === currentImageIndex 
                            ? "bg-white w-6" 
                            : "bg-white/50"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons - Right Side */}
        <AnimatePresence>
          {shouldShowActionButtons && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-4 bottom-32 flex flex-col gap-4 z-30"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                  onClick={handleFavorite}
                  disabled={isLoadingFavorite}
                >
                  <Heart
                    className={cn(
                      "w-6 h-6 transition-colors",
                      isFavorited ? "fill-red-500 text-red-500" : "text-white"
                    )}
                  />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                  onClick={handleShare}
                >
                  <Share2 className="w-6 h-6 text-white" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                  onClick={handleViewDetails}
                >
                  <ExternalLink className="w-6 h-6 text-white" />
                </Button>
              </motion.div>

              {vehicle.views !== undefined && shouldShowFullInfo && (
                <div className="flex flex-col items-center gap-1 text-white">
                  <Eye className="w-6 h-6" />
                  <span className="text-xs font-medium">
                    {new Intl.NumberFormat("es-ES").format(vehicle.views)}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vehicle Info - Bottom */}
        <AnimatePresence>
          {shouldShowBasicInfo && (
            <ReelInfo 
              vehicle={vehicle} 
              mode={config.viewMode}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReelCard;