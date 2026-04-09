// src/components/features/vehicles/reels/ReelCard.tsx
// ✅ OPTIMIZADO: LCP, framer-motion reducido, fetch consolidado
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import {
  Heart,
  Share2,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Vehicle } from "@/types/types";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import ReelInfo from "./ReelInfo";
import ReelHeaderInfo from "./ReelHeaderInfo";
import { useReelAnalytics } from "@/hooks/useReelAnalytics";
import { useReelsConfig } from "@/hooks/useReelsConfig";

// ✅ LAZY: Solo se cargan cuando se necesitan — eliminados del bundle inicial
const ParticlesEffect = dynamic(() => import("./ParticlesEffect"), {
  ssr: false,
  loading: () => null,
});
const HeartAnimation = dynamic(() => import("./HeartAnimation").then(m => ({ default: m.HeartAnimation })), {
  ssr: false,
  loading: () => (
    <button className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">
      <Heart className="w-6 h-6 text-white" />
    </button>
  ),
});

// ✅ LAZY: framer-motion solo cuando hay interacción de imagen (no en el paint inicial)
const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => ({ default: m.motion.div })),
  { ssr: false, loading: () => <div /> }
);
const AnimatePresenceLazy = dynamic(
  () => import("framer-motion").then((m) => ({ default: m.AnimatePresence })),
  { ssr: false, loading: () => <></> }
);

interface ReelCardProps {
  vehicle: Vehicle;
  isActive: boolean;
  // ✅ NUEVO: favoriteIds precargado desde el padre — evita N fetches
  favoriteIds?: string[];
  onFavoriteChange?: (vehicleId: string, isFavorited: boolean) => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  vehicle,
  isActive,
  favoriteIds = [],
  onFavoriteChange,
}) => {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(() =>
    favoriteIds.includes(vehicle._id)
  );
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  // ✅ NUEVO: controla si framer-motion ya está hidratado
  const [motionReady, setMotionReady] = useState(false);

  const { config } = useReelsConfig();
  const { trackInteraction } = useReelAnalytics(vehicle._id, isActive);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const images =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images
      : ["/placeholder.svg?height=800&width=600"];

  const shouldShowActionButtons = config.viewMode !== "minimal";
  const shouldShowFullInfo = config.viewMode === "detailed";

  // ✅ ELIMINADO: checkFavoriteStatus — ahora viene del padre como prop
  useEffect(() => {
    setIsFavorited(favoriteIds.includes(vehicle._id));
  }, [favoriteIds, vehicle._id]);

  // ✅ OPTIMIZADO: motion se carga después del paint inicial
  useEffect(() => {
    const id = requestAnimationFrame(() => setMotionReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // ✅ OPTIMIZADO: autoplay con ref en lugar de state para evitar re-renders
  useEffect(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (isActive && images.length > 1) {
      autoplayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, config.autoplaySpeed);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isActive, images.length, config.autoplaySpeed]);

  // ✅ OPTIMIZADO: view tracking con debounce — no disparar si el usuario solo pasa rápido
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => {
      fetch(`/api/vehicles/${vehicle._id}/views`, { method: "POST" }).catch(
        () => {}
      );
    }, 1500); // solo cuenta vista si estuvo 1.5s en el reel
    return () => clearTimeout(timer);
  }, [isActive, vehicle._id]);

  const handleFavorite = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!session) { signIn(); return; }
      if (isLoadingFavorite) return;

      setIsLoadingFavorite(true);
      const optimisticValue = !isFavorited;
      setIsFavorited(optimisticValue); // ✅ Optimistic update

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
          onFavoriteChange?.(vehicle._id, isNowFavorited);
          if (isNowFavorited) trackInteraction("favorite");
          toast.success(isNowFavorited ? "❤️ Añadido a favoritos" : "Eliminado de favoritos");
        } else {
          setIsFavorited(!optimisticValue); // revert
          toast.error("No se pudo actualizar favoritos");
        }
      } catch {
        setIsFavorited(!optimisticValue); // revert
        toast.error("Error al actualizar favoritos");
      } finally {
        setIsLoadingFavorite(false);
      }
    },
    [session, isFavorited, isLoadingFavorite, vehicle._id, trackInteraction, onFavoriteChange]
  );

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const vehicleUrl = `${window.location.origin}${siteConfig.paths.vehicleDetail(vehicle._id)}`;
      trackInteraction("share");
      if (navigator.share) {
        await navigator.share({
          title: `${vehicle.brand} ${vehicle.model}`,
          text: `Mira este ${vehicle.brand} ${vehicle.model} ${vehicle.year} por ${formatPrice(vehicle.price)}`,
          url: vehicleUrl,
        }).catch(() => {});
      } else {
        await navigator.clipboard.writeText(vehicleUrl).catch(() => {});
        toast.success("🔗 Enlace copiado al portapapeles");
      }
    },
    [vehicle, trackInteraction]
  );

  const handleViewDetails = useCallback(() => {
    trackInteraction("view_details");
    window.open(siteConfig.paths.vehicleDetail(vehicle._id), "_blank");
  }, [vehicle._id, trackInteraction]);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const previousImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const currentSrc = imageError
    ? "/placeholder.svg?height=800&width=600"
    : images[currentImageIndex];

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {/* ✅ Background blur — CSS puro, sin motion.div (evita recalc de layout) */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={images[0]} // ✅ Siempre la primera imagen, sin cambiar con el índice
          alt=""
          fill
          className="object-cover blur-3xl opacity-40 scale-110"
          aria-hidden="true"
          // ✅ NO priority aquí — el LCP es la imagen principal, no el fondo
          sizes="100vw"
          quality={10} // ✅ Calidad baja para el fondo difuminado — nadie lo nota
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* ✅ Particles — solo desktop y solo cuando motion está listo */}
      {motionReady && config.showParticles && shouldShowFullInfo && (
        <div className="hidden md:block">
          <ParticlesEffect />
        </div>
      )}

      {/* Main Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-full max-w-2xl h-full flex items-center justify-center px-4">

          {/* ✅ CONTENEDOR DE IMAGEN — sin AnimatePresence en el LCP element */}
          <div className="relative w-full aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Skeleton mientras carga */}
            {isImageLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
            )}

            {/* ✅ IMAGEN PRINCIPAL — priority en el card activo = LCP correcto */}
            <Image
              src={currentSrc}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className={cn(
                "object-contain transition-opacity duration-300",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
              priority={isActive} // ✅ Solo el card activo tiene priority
              onError={() => setImageError(true)}
              onLoad={() => setIsImageLoading(false)}
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={85}
            />

            {/* Header Info */}
            <ReelHeaderInfo vehicle={vehicle} mode={config.viewMode} />

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  aria-label="Imagen anterior"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Imagen siguiente"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      idx === currentImageIndex ? "bg-white w-6" : "bg-white/40 w-1.5"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Action Buttons — CSS transitions, sin motion.div */}
        {shouldShowActionButtons && (
          <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-30 animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* Heart */}
            {motionReady ? (
              <HeartAnimation
                isFavorited={isFavorited}
                onToggle={() => handleFavorite()}
              />
            ) : (
              <button
                onClick={() => handleFavorite()}
                className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center"
              >
                <Heart className={cn("w-6 h-6", isFavorited ? "fill-red-500 text-red-500" : "text-white")} />
              </button>
            )}

            {/* Share */}
            <Button
              variant="secondary"
              size="icon"
              className="w-14 h-14 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-md transition-colors active:scale-90"
              onClick={handleShare}
              aria-label="Compartir"
            >
              <Share2 className="w-6 h-6 text-white" />
            </Button>

            {/* Details */}
            <Button
              variant="secondary"
              size="icon"
              className="w-14 h-14 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-md transition-colors active:scale-90"
              onClick={handleViewDetails}
              aria-label="Ver detalles"
            >
              <ExternalLink className="w-6 h-6 text-white" />
            </Button>

            {/* Views — solo modo detailed */}
            {vehicle.views !== undefined && shouldShowFullInfo && (
              <div className="flex flex-col items-center gap-1 text-white bg-black/50 backdrop-blur-md px-3 py-2 rounded-full">
                <Eye className="w-5 h-5" />
                <span className="text-xs font-semibold">
                  {new Intl.NumberFormat("es-ES").format(vehicle.views)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Vehicle Info Bottom */}
        <ReelInfo vehicle={vehicle} mode={config.viewMode} />
      </div>
    </div>
  );
};

export default ReelCard;