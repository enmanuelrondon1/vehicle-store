// src/components/features/vehicles/detail/sections/ImageGallery.tsx
"use client";

import type React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo, useAnimation } from "framer-motion";
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
  Play,
  Pause,
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const handleImageError = useCallback((index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  }, []);

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    
    setImageLoaded(false);
    controls.start({
      opacity: 0,
      x: 100,
      transition: { duration: 0.3 }
    }).then(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setZoomLevel(1);
      setImageRotation(0);
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.3 }
      });
    });
  }, [images.length, controls]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    
    setImageLoaded(false);
    controls.start({
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 }
    }).then(() => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      setZoomLevel(1);
      setImageRotation(0);
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.3 }
      });
    });
  }, [images.length, controls]);

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
      toast.success("Imagen descargada correctamente", {
        description: `Se ha descargado ${imageName}`,
      });
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

  // Función para el slideshow automático
  const toggleSlideshow = useCallback(() => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      intervalRef.current = setInterval(nextImage, 3000);
      setIsPlaying(true);
    }
  }, [isPlaying, nextImage]);

  // Manejo de gestos táctiles
  const handlePanEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 50) {
      if (info.offset.x > 0) {
        prevImage();
      } else {
        nextImage();
      }
    }
    setIsDragging(false);
  };

  const handlePanStart = () => {
    setIsDragging(true);
  };

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
        case " ":
          e.preventDefault();
          toggleSlideshow();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, nextImage, prevImage, handleZoomIn, handleZoomOut, handleRotate, toggleSlideshow]);

  // Limpieza del intervalo al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const validImages = images.filter((_, index) => !imageErrors[index]);

  if (validImages.length === 0) {
    return (
      <motion.div 
        className="aspect-video rounded-xl bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center shadow-xl card-glass"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center p-6">
          <motion.div 
            className="w-20 h-20 mx-auto mb-4 bg-muted-foreground/10 rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Car className="w-10 h-10 text-muted-foreground" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2 text-gradient-primary">
            Sin imágenes disponibles
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Este vehículo no tiene imágenes disponibles en este momento.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Imagen principal */}
        <div className="relative aspect-video rounded-xl overflow-hidden group shadow-xl card-premium card-hover">
          <div className="relative w-full h-full">
            {/* Efecto de carga */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-shimmer rounded-xl z-10" />
            )}
            
            <motion.div
              ref={imageRef}
              className="relative w-full h-full"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={handlePanStart}
              onDragEnd={handlePanEnd}
              animate={controls}
              initial={{ opacity: 1, x: 0 }}
            >
              <Image
                src={
                  imageErrors[currentImageIndex]
                    ? "/placeholder.svg?height=400&width=600"
                    : images[currentImageIndex]
                }
                alt={`${vehicleName} - Imagen ${currentImageIndex + 1}`}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-500",
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                )}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                onError={() => handleImageError(currentImageIndex)}
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>
          </div>

          {/* Controles superpuestos */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 flex items-center justify-between p-4">
              {images.length > 1 && (
                <>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevImage}
                      className="w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 backdrop-blur-sm card-glass"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextImage}
                      className="w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 backdrop-blur-sm card-glass"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </motion.div>
                </>
              )}
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              {images.length > 1 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleSlideshow}
                          className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 backdrop-blur-sm card-glass"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isPlaying ? "Pausar" : "Reproducir"} presentación</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowImageInfo(!showImageInfo)}
                        className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 backdrop-blur-sm card-glass"
                      >
                        <Info className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Información de la imagen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsFullscreen(true)}
                        className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 backdrop-blur-sm card-glass"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pantalla completa</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>

          {/* Indicador de imagen actual */}
          {images.length > 1 && (
            <motion.div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Badge
                variant="secondary"
                className="bg-black/60 text-white border-none backdrop-blur-sm px-3 py-1 text-sm card-glass"
              >
                {currentImageIndex + 1} / {images.length}
              </Badge>
            </motion.div>
          )}

          {/* Información de la imagen */}
          <AnimatePresence>
            {showImageInfo && (
              <motion.div 
                className="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-xl max-w-xs backdrop-blur-md border border-white/10 card-glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-semibold mb-1">{vehicleName}</h4>
                <p className="text-sm opacity-90">
                  Imagen {currentImageIndex + 1} de {images.length}
                </p>
                <p className="text-xs opacity-75 mt-1">
                  Haz clic en los botones para navegar o usa las flechas del teclado
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <motion.div 
            className="mt-6 flex gap-3 overflow-x-auto pb-2 px-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300",
                  currentImageIndex === index
                    ? "border-primary shadow-lg scale-105 ring-2 ring-primary/30 glow-effect"
                    : "border-transparent hover:border-muted-foreground/30 hover:scale-105"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={
                    imageErrors[index]
                      ? "/placeholder.svg?height=80&width=96"
                      : image
                  }
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                  fill
                  sizes="96px"
                  onError={() => handleImageError(index)}
                />
                {currentImageIndex === index && (
                  <motion.div 
                    className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Vista de pantalla completa */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            className="fixed inset-0 bg-black/95 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Barra de herramientas superior */}
            <motion.div 
              className="flex items-center justify-between p-4 bg-black/70 backdrop-blur-md card-glass"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
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
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleZoomOut}
                          className="text-white hover:bg-white/20 transition-all duration-200"
                        >
                          <ZoomOut className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reducir ({Math.round(zoomLevel * 100)}%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleZoomIn}
                          className="text-white hover:bg-white/20 transition-all duration-200"
                        >
                          <ZoomIn className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ampliar ({Math.round(zoomLevel * 100)}%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleRotate}
                          className="text-white hover:bg-white/20 transition-all duration-200"
                        >
                          <RotateCw className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rotar ({imageRotation}°)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleDownload}
                          disabled={isDownloading}
                          className="text-white hover:bg-white/20 transition-all duration-200"
                        >
                          {isDownloading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Download className="w-5 h-5" />
                          )}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Descargar imagen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullscreen(false)}
                    className="text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Contenedor de imagen */}
            <motion.div 
              className="flex-1 flex items-center justify-center p-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div
                  className="relative w-full h-full"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${imageRotation}deg)`,
                    transition: "transform 0.3s ease",
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
                </motion.div>

                {/* Botones de navegación */}
                {images.length > 1 && (
                  <>
                    <motion.div 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      initial={{ x: -100 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={prevImage}
                          className="w-14 h-14 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 backdrop-blur-sm card-glass"
                        >
                          <ChevronLeft className="w-7 h-7" />
                        </Button>
                      </motion.div>
                    </motion.div>
                    <motion.div 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      initial={{ x: 100 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={nextImage}
                          className="w-14 h-14 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 backdrop-blur-sm card-glass"
                        >
                          <ChevronRight className="w-7 h-7" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Miniaturas en pantalla completa */}
            {images.length > 1 && (
              <motion.div 
                className="p-4 bg-black/70 backdrop-blur-md card-glass"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex gap-3 overflow-x-auto justify-center">
                  {images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "relative w-20 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all duration-300",
                        currentImageIndex === index
                          ? "border-white scale-110 shadow-lg ring-2 ring-white/50 glow-effect"
                          : "border-transparent hover:border-white/50 hover:scale-105"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};