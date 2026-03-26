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
import ReelHeaderInfo from "./ReelHeaderInfo";
import { useReelAnalytics } from "@/hooks/useReelAnalytics";
import { useReelsConfig } from "@/hooks/useReelsConfig";
import ParticlesEffect from "./ParticlesEffect";
import { HeartAnimation } from "./HeartAnimation";

interface ReelCardProps {
  vehicle: Vehicle;
  isActive: boolean;
}

export const ReelCard: React.FC<ReelCardProps> = ({ 
  vehicle, 
  isActive,
}) => {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const { config } = useReelsConfig();
  const { trackInteraction } = useReelAnalytics(vehicle._id, isActive);

  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : ["/placeholder.svg?height=800&width=600"];

  // IMPORTANTE: Los botones de acción se ocultan SOLO en modo minimal
  const shouldShowActionButtons = config.viewMode !== "minimal";
  const shouldShowFullInfo = config.viewMode === "detailed";

  // Check favorite status
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
    <div className="relative w-full h-full bg-black overflow-hidden" style={{ touchAction: "none" }}>
      {/* Background Image with Blur */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isActive ? 1.05 : 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentImageIndex]}
            alt="Background"
            fill
            className="object-cover blur-3xl opacity-40 scale-110"
            onError={() => setImageError(true)}
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* Particles Effect */}
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
              initial={{ 
                opacity: 0, 
                scale: 0.95,
                rotateY: 90,
                filter: "blur(10px)"
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotateY: 0,
                filter: "blur(0px)"
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                rotateY: -90,
                filter: "blur(10px)"
              }}
              transition={{ 
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1]
              }}
              style={{ perspective: "1000px" }}
              className="relative w-full aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            >
              {isImageLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
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

              {/* ===== Header Info - SIEMPRE VISIBLE EN TODAS LAS VISTAS ===== */}
              <AnimatePresence>
                <ReelHeaderInfo 
                  vehicle={vehicle}
                  mode={config.viewMode}
                />
              </AnimatePresence>

              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={previousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </>
              )}

              {/* Image Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                        idx === currentImageIndex 
                          ? "bg-white w-6" 
                          : "bg-white/40"
                      )}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons - Right Side - OCULTOS EN MINIMAL */}
        <AnimatePresence>
          {shouldShowActionButtons && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="absolute right-4 bottom-32 flex flex-col gap-6 z-30"
            >
              {/* Heart Button */}
              <div className="flex justify-center">
                <HeartAnimation
                  isFavorited={isFavorited}
                  onToggle={() => handleFavorite({ stopPropagation: () => {} } as any)}
                />
              </div>

              {/* Share Button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-md transition-colors"
                  onClick={handleShare}
                >
                  <Share2 className="w-6 h-6 text-white" />
                </Button>
              </motion.div>

              {/* Details Button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-md transition-colors"
                  onClick={handleViewDetails}
                >
                  <ExternalLink className="w-6 h-6 text-white" />
                </Button>
              </motion.div>

              {/* Views Counter - Solo en modo detallado */}
              {vehicle.views !== undefined && shouldShowFullInfo && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-2 text-white bg-black/50 backdrop-blur-md px-3 py-2 rounded-full"
                >
                  <Eye className="w-5 h-5" />
                  <span className="text-xs font-semibold">
                    {new Intl.NumberFormat("es-ES").format(vehicle.views)}
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vehicle Info - Bottom - Se adapta según el modo */}
        <AnimatePresence>
          <ReelInfo 
            vehicle={vehicle} 
            mode={config.viewMode}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReelCard;