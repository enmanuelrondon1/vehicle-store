"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
} from "lucide-react";

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

  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const validImages = images.filter((_, index) => !imageErrors[index]);

  if (validImages.length === 0) {
    return (
      <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No hay imágenes disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className="relative aspect-video rounded-xl overflow-hidden group">
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
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-between p-4">
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index
                    ? "border-blue-500 scale-105"
                    : "border-transparent hover:border-gray-300"
                }`}
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
              </button>
            ))}
          </div>
        )}
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setIsFullscreen(false)}>
          <div className="relative w-full h-full max-w-[95vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={images[currentImageIndex]} alt={`${vehicleName} - Imagen ${currentImageIndex + 1}`} className="object-contain" fill sizes="95vw" onError={() => handleImageError(currentImageIndex)} />
            <button onClick={() => setIsFullscreen(false)} className="absolute top-2 right-2 w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors z-10"><X className="w-6 h-6" /></button>
            {images.length > 1 && (<><button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors z-10"><ChevronLeft className="w-6 h-6" /></button><button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors z-10"><ChevronRight className="w-6 h-6" /></button><div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">{currentImageIndex + 1} / {images.length}</div></>)}
          </div>
        </div>
      )}
    </>
  );
};