// src/components/features/vehicles/detail/sections/ImageGallery.tsx
"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageGalleryProps {
  images: string[];
  vehicleName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  vehicleName,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageErrors, setImageErrors] = useState<boolean[]>(
    new Array(images.length).fill(false)
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [showImageInfo, setShowImageInfo] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleImageError = useCallback((index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
    setImageRotation(0);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
    setImageRotation(0);
  }, [images.length]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  }, []);

  const handleRotate = useCallback(() => {
    setImageRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleDownload = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    const imageUrl = images[currentImageIndex];
    const imageName = `${vehicleName.replace(
      /\s+/g,
      "_"
    )}_${currentImageIndex + 1}.jpg`;

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Error al descargar la imagen", {
        description:
          "No se pudo completar la descarga. Verifica tu conexión o intenta más tarde.",
      });
    } finally {
      setIsDownloading(false);
    }
  }, [images, currentImageIndex, vehicleName, isDownloading]);

  // Manejo de teclado para navegación
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "Escape":
          setIsFullscreen(false);
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
        case "_":
          handleZoomOut();
          break;
        case "r":
          handleRotate();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, nextImage, prevImage, handleZoomIn, handleZoomOut, handleRotate]);

  const validImages = images.filter((_, index) => !imageErrors[index]);

  if (validImages.length === 0) {
    return (
      <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            Sin imágenes disponibles
          </h3>
          <p className="text-muted-foreground">
            Este vehículo no tiene imágenes disponibles en este momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Imagen principal */}
        <div className="relative aspect-video rounded-lg overflow-hidden group">
          <div className="relative w-full h-full">
            <Image
              src={
                imageErrors[currentImageIndex]
                  ? "/placeholder.svg?height=400&width=600"
                  : images[currentImageIndex]
              }
              alt={`${vehicleName} - Imagen ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              onError={() => handleImageError(currentImageIndex)}
            />
          </div>

          {/* Controles superpuestos */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-between p-4">
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowImageInfo(!showImageInfo)}
                      className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <Info className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Información de la imagen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsFullscreen(true)}
                      className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pantalla completa</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Indicador de imagen actual */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Badge
                variant="secondary"
                className="bg-black/50 text-white border-none"
              >
                {currentImageIndex + 1} / {images.length}
              </Badge>
            </div>
          )}

          {/* Información de la imagen */}
          {showImageInfo && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg max-w-xs">
              <h4 className="font-semibold mb-1">{vehicleName}</h4>
              <p className="text-sm opacity-90">
                Imagen {currentImageIndex + 1} de {images.length}
              </p>
              <p className="text-xs opacity-75 mt-1">
                Haz clic en los botones para navegar o usa las flechas del
                teclado
              </p>
            </div>
          )}
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                  currentImageIndex === index
                    ? "border-primary scale-105 shadow-md"
                    : "border-transparent hover:border-muted-foreground/30"
                )}
              >
                <Image
                  src={
                    imageErrors[index]
                      ? "/placeholder.svg?height=64&width=80"
                      : image
                  }
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                  fill
                  sizes="80px"
                  onError={() => handleImageError(index)}
                />
                {currentImageIndex === index && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Vista de pantalla completa */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          {/* Barra de herramientas superior */}
          <div className="flex items-center justify-between p-4 bg-black/50">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-black/50 text-white border-none"
              >
                {currentImageIndex + 1} / {images.length}
              </Badge>
              <h3 className="text-white font-medium">{vehicleName}</h3>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleZoomOut}
                      className="text-white hover:bg-white/20"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reducir ({Math.round(zoomLevel * 100)}%)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleZoomIn}
                      className="text-white hover:bg-white/20"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ampliar ({Math.round(zoomLevel * 100)}%)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRotate}
                      className="text-white hover:bg-white/20"
                    >
                      <RotateCw className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Rotar ({imageRotation}°)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="text-white hover:bg-white/20"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Descargar imagen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Contenedor de imagen */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="relative w-full h-full transition-transform duration-300"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${imageRotation}deg)`,
                }}
              >
                <Image
                  src={
                    imageErrors[currentImageIndex]
                      ? "/placeholder.svg?height=800&width=1200"
                      : images[currentImageIndex]
                  }
                  alt={`${vehicleName} - Imagen ${currentImageIndex + 1}`}
                  className="object-contain"
                  fill
                  sizes="95vw"
                  onError={() => handleImageError(currentImageIndex)}
                />
              </div>

              {/* Botones de navegación */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Miniaturas en pantalla completa */}
          {images.length > 1 && (
            <div className="p-4 bg-black/50">
              <div className="flex gap-2 overflow-x-auto justify-center">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "relative w-16 h-12 flex-shrink-0 rounded overflow-hidden border-2 transition-all",
                      currentImageIndex === index
                        ? "border-white scale-110"
                        : "border-transparent hover:border-white/50"
                    )}
                  >
                    <Image
                      src={
                        imageErrors[index]
                          ? "/placeholder.svg?height=48&width=64"
                          : image
                      }
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                      fill
                      sizes="64px"
                      onError={() => handleImageError(index)}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};