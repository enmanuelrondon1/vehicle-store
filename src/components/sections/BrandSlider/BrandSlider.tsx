"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { dataBrands } from "../../../data/dataBrands.data";

// Tipo para las imágenes
interface ImageData {
  id: number;
  src: string;
  alt: string;
  title?: string;
}

// Props del componente
interface BrandSliderProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: string;
  className?: string;
}

const BrandSlider: React.FC<BrandSliderProps> = ({
  autoPlay = true,
  autoPlayInterval = 2500,
  showDots = false,
  showArrows = false,
  height = "150px",
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const transitionRef = useRef(true); // Para controlar si se aplica transición
  const sliderRef = useRef<HTMLDivElement>(null);

  // Transformamos dataBrands al formato esperado por el componente
  const images: ImageData[] = dataBrands.map((brand, index) => ({
    id: index,
    src: brand.url,
    alt: `Brand ${index + 1}`,
  }));

  // Duplicamos las imágenes para crear el efecto de bucle infinito
  const totalImages = images.length;
  const extendedImages = [...images, ...images, ...images]; // Triplicamos para asegurar continuidad

  // Función para ir a la siguiente imagen
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex === totalImages * 2) {
        transitionRef.current = false;
        return totalImages; // Saltamos al inicio del segundo set
      }
      transitionRef.current = true;
      return newIndex;
    });
  }, [totalImages]);

  // Función para ir a la imagen anterior
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      if (newIndex === totalImages - 1) {
        transitionRef.current = false;
        return totalImages * 2 - 1; // Saltamos al final del segundo set
      }
      transitionRef.current = true;
      return newIndex;
    });
  }, [totalImages]);

  // Función para ir a una imagen específica
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index + totalImages); // Aseguramos que siempre estemos en el segundo set
  }, [totalImages]);

  // Auto-play
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, images.length, nextSlide]);

  // Ajustar la transición cuando cambie currentIndex
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = transitionRef.current
        ? "transform 500ms ease-in-out"
        : "none";
    }
  }, [currentIndex]);

  if (!images || images.length === 0) {
    return <div className="text-center text-[#111827] dark:text-[#F9FAFB] py-12">No hay imágenes para mostrar</div>;
  }

  return (
    <div
      className={`max-padd-container relative overflow-hidden rounded-lg mt-8 ${className}`}
      style={{ height }}
    >
      {/* Contenedor de imágenes */}
      <div
        ref={sliderRef}
        className="flex h-full"
        style={{
          transform: `translateX(-${(currentIndex * 100) / totalImages}%)`,
        }}
      >
        {extendedImages.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className="min-w-[25%] sm:min-w-[16.66%] h-full flex items-center justify-center bg-transparent dark:bg-[#1F2937]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={90}
              height={90}
              className="object-contain aspect-[3/2] bg-transparent dark:bg-[#1F2937]"
            />
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#1E3A8A] bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
            aria-label="Imagen anterior"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1E3A8A] bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
            aria-label="Siguiente imagen"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Indicadores de puntos */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex % totalImages
                  ? "bg-[#F9FAFB]"
                  : "bg-[#E5E7EB] dark:bg-[#1F2937] hover:bg-[#D1D5DB] dark:hover:bg-[#374151]"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandSlider;