"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// Importar datos desde vehicles.json
import vehiclesData from "@/data/vehicles.json";

// Tipo para los datos del vehículo (actualizado con los nuevos campos)
interface Vehicle {
  id: string;
  category: { es: string; en: string };
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: { es: string; en: string };
  engine?: { es: string; en: string };
  transmission?: { es: string; en: string };
  condition?: { es: string; en: string };
  location: string;
  features?: { es: string[]; en: string[] };
  fuelType?: { es: string; en: string };
  doors?: number;
  seats?: number;
  dimensions?: {
    largo: number;
    ancho: number;
    alto: number;
  };
  weight?: number;
  images: string[];
  sellerContact?: {
    name: string;
    phone: string;
    email: string;
  };
  postedDate?: string;
  disponibilidad?: { es: string; en: string };
  warranty?: { es: string; en: string };
  description?: { es: string; en: string };
}

// Enum para filtros de categoría
enum CategoryFilter {
  ALL = "all",
  VEHICLES = "vehículos",
  MOTORCYCLES = "motocicletas",
  TRUCKS = "camiones",
  BOATS = "embarcaciones",
}

// Props del componente (actualizado con nuevas opciones)
interface VehicleCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: string;
  className?: string;
  language?: "es" | "en";
  categoryFilter?: CategoryFilter | string;
  showFilters?: boolean;
  maxItems?: number;
  sortBy?: "price" | "year" | "mileage" | "newest";
  showStats?: boolean;
}

const VehicleCarousel: React.FC<VehicleCarouselProps> = ({
  autoPlay = true,
  autoPlayInterval = 4000,
  showDots = true,
  showArrows = true,
  height = "520px",
  className = "",
  language = "es",
  categoryFilter = CategoryFilter.ALL,
  showFilters = true,
  maxItems = 4,
  sortBy = "newest",
  showStats = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter | string>(categoryFilter);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Transformamos y filtramos los datos
  const allVehicles: Vehicle[] = vehiclesData.items.map((item: Vehicle) => ({
    id: item.id,
    category: item.category,
    brand: item.brand,
    model: item.model,
    year: item.year,
    price: item.price,
    mileage: item.mileage,
    color: item.color,
    engine: item.engine,
    transmission: item.transmission,
    condition: item.condition,
    location: item.location,
    features: item.features,
    fuelType: item.fuelType,
    doors: item.doors,
    seats: item.seats,
    dimensions: item.dimensions,
    weight: item.weight,
    images: item.images,
    sellerContact: item.sellerContact,
    postedDate: item.postedDate,
    disponibilidad: item.disponibilidad,
    warranty: item.warranty,
    description: item.description,
  }));

  // Filtrado y ordenado de vehículos usando useMemo para optimización
  const vehicles = useMemo(() => {
    let filtered = allVehicles;

    // Filtrar por categoría
    if (selectedCategory !== CategoryFilter.ALL) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.category.es.toLowerCase() === selectedCategory.toLowerCase() ||
          vehicle.category.en.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Ordenar según el criterio seleccionado
    switch (sortBy) {
      case "price":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "year":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "mileage":
        filtered.sort((a, b) => a.mileage - b.mileage);
        break;
      case "newest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.postedDate || "2024-01-01");
          const dateB = new Date(b.postedDate || "2024-01-01");
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }

    // Limitar el número de items
    return filtered.slice(0, maxItems);
  }, [allVehicles, selectedCategory, sortBy, maxItems]);

  // Obtener categorías únicas para los filtros
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    allVehicles.forEach((vehicle) => {
      categories.add(vehicle.category.es);
    });
    return Array.from(categories);
  }, [allVehicles]);

  // Duplicamos los vehículos para el bucle infinito
  const totalVehicles = vehicles.length;
  const extendedVehicles = totalVehicles > 0 ? [...vehicles, ...vehicles, ...vehicles] : [];

  // Resetear índice cuando cambia la categoría
  useEffect(() => {
    setCurrentIndex(totalVehicles);
    transitionRef.current = false;
    setTimeout(() => {
      transitionRef.current = true;
    }, 50);
  }, [selectedCategory, totalVehicles]);

  // Función para manejar errores de imagen
  const handleImageError = (vehicleId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [vehicleId]: true,
    }));
  };

  // Función para ir a la siguiente tarjeta
  const nextSlide = () => {
    if (isTransitioning || totalVehicles <= 1) return;
    setIsTransitioning(true);

    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex === totalVehicles * 2) {
        setTimeout(() => {
          transitionRef.current = false;
          setCurrentIndex(totalVehicles);
          setTimeout(() => {
            transitionRef.current = true;
            setIsTransitioning(false);
          }, 50);
        }, 600);
        return newIndex;
      }
      setTimeout(() => setIsTransitioning(false), 600);
      return newIndex;
    });
  };

  // Función para ir a la tarjeta anterior
  const prevSlide = () => {
    if (isTransitioning || totalVehicles <= 1) return;
    setIsTransitioning(true);

    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      if (newIndex === totalVehicles - 1) {
        setTimeout(() => {
          transitionRef.current = false;
          setCurrentIndex(totalVehicles * 2 - 1);
          setTimeout(() => {
            transitionRef.current = true;
            setIsTransitioning(false);
          }, 50);
        }, 600);
        return newIndex;
      }
      setTimeout(() => setIsTransitioning(false), 600);
      return newIndex;
    });
  };

  // Función para ir a una tarjeta específica
  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setCurrentIndex(index + totalVehicles);
  };

  // Auto-play mejorado
  useEffect(() => {
    if (autoPlay && totalVehicles > 1 && !isHovered && !isTransitioning) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, totalVehicles, isHovered, isTransitioning, nextSlide]);

  // Ajustar la transición
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = transitionRef.current
        ? "transform 600ms cubic-bezier(0.4, 0.0, 0.2, 1)"
        : "none";
    }
  }, [currentIndex]);

  // Función para cambiar categoría
  const handleCategoryChange = (category: CategoryFilter | string) => {
    setSelectedCategory(category);
  };

  // Función para obtener el color de disponibilidad
  const getAvailabilityColor = (disponibilidad?: { es: string; en: string }) => {
    if (!disponibilidad) return "bg-green-500";
    const status = disponibilidad[language].toLowerCase();
    if (status.includes("disponible") || status.includes("available")) return "bg-green-500";
    if (status.includes("reservado") || status.includes("reserved")) return "bg-yellow-500";
    if (status.includes("vendido") || status.includes("sold")) return "bg-red-500";
    return "bg-blue-500";
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className={`relative ${className} max-padd-container`} style={{ height }}>
        {/* Header con filtros */}
        {showFilters && (
          <div className="absolute top-6 left-6 right-6 z-20">
            <div className="flex items-center justify-between">
              <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-lg border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold">
                    {language === "es" ? "🚗 Sin resultados" : "🚗 No results"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
                <button
                  onClick={() => handleCategoryChange(CategoryFilter.ALL)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                    selectedCategory === CategoryFilter.ALL
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600"
                  }`}
                >
                  {language === "es" ? "Todos" : "All"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-lg">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold mb-2">
              {language === "es" ? "No hay vehículos para mostrar" : "No vehicles to show"}
            </p>
            <p className="text-sm">
              {language === "es" ? "Intenta cambiar los filtros de búsqueda" : "Try changing the search filters"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ${className} max-padd-container`}
      style={{ height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header mejorado con filtros */}
      <div className="absolute top-6 left-6 right-6 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold">
                  {language === "es" ? "🚗 Los más recientes" : "🚗 Most Recent"}
                </span>
              </div>
            </div>
            {showStats && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-2xl shadow-lg">
                <span className="text-sm font-bold">
                  {vehicles.length} {language === "es" ? "encontrados" : "found"}
                </span>
              </div>
            )}
          </div>

          {/* Filtros de categoría */}
          {showFilters && (
            <div className="flex items-center gap-2">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 backdrop-blur-sm ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-white/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600 hover:scale-105"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
              <button
                onClick={() => handleCategoryChange(CategoryFilter.ALL)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 backdrop-blur-sm ${
                  selectedCategory === CategoryFilter.ALL
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600 hover:scale-105"
                }`}
              >
                {language === "es" ? "Todos" : "All"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contenedor del slider */}
      <div
        ref={sliderRef}
        className="flex h-full pt-24 pb-8 px-8"
        style={{
          transform: `translateX(-${(currentIndex * 100) / Math.min(totalVehicles, 4)}%)`,
          gap: "24px",
        }}
      >
        {extendedVehicles.map((vehicle, index) => (
          <div
            key={`${vehicle.id}-${index}`}
            className="flex-shrink-0"
            style={{
              width: `calc(${100 / Math.min(totalVehicles, 4)}% - ${
                24 * (Math.min(totalVehicles, 4) - 1) / Math.min(totalVehicles, 4)
              }px)`,
            }}
          >
            <Link href={`/vehicle/${vehicle.id}`} className="block h-full">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden h-full flex flex-col border border-slate-200/50 dark:border-slate-700/50 cursor-pointer transition-all duration-500 group hover:scale-[1.02] hover:-translate-y-2">
                {/* Contenedor de imagen optimizado */}
                <div className="relative w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
                  {vehicle.images && vehicle.images.length > 0 && !imageErrors[`${vehicle.id}-${index}`] ? (
                    <>
                      <Image
                        src={vehicle.images[0]}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        onError={() => handleImageError(`${vehicle.id}-${index}`)}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-white/80 dark:bg-slate-700/80 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 5h22M9 5a2 2 0 012-2h2a2 2 0 012 2v0" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {vehicle.brand}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {vehicle.model}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Badges mejorados */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-3 py-1.5 rounded-xl font-medium shadow-lg">
                        {vehicle.category[language]}
                      </div>
                      {vehicle.disponibilidad && (
                        <div className={`${getAvailabilityColor(vehicle.disponibilidad)} text-white text-xs px-3 py-1.5 rounded-xl font-medium shadow-lg flex items-center gap-1`}>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                          {vehicle.disponibilidad[language]}
                        </div>
                      )}
                    </div>
                    <div className="bg-white/95 dark:bg-slate-800/95 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-sm">
                      ${(vehicle.price / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>

                {/* Información del vehículo mejorada */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  {/* Header del vehículo */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{vehicle.year}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-slate-400 to-slate-500 shadow-sm"></div>
                        <span className="text-xs">{vehicle.color[language]}</span>
                      </div>
                    </div>

                    {/* Características adicionales */}
                    {(vehicle.engine || vehicle.transmission || vehicle.doors) && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {vehicle.engine && (
                          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-lg">
                            {vehicle.engine[language]}
                          </span>
                        )}
                        {vehicle.doors && (
                          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-lg">
                            {vehicle.doors} {language === "es" ? "puertas" : "doors"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Precio destacado */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                      ${vehicle.price.toLocaleString("es-MX")}
                    </p>
                  </div>

                  {/* Detalles adicionales */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{vehicle.mileage.toLocaleString()} km</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{vehicle.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer con acciones mejorado */}
                <div className="px-6 pb-6 flex justify-between items-center">
                  <button
                    className="group/fav text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-all duration-300 p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <svg className="w-5 h-5 group-hover/fav:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-2">
                    {vehicle.condition && (
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-lg ${
                          vehicle.condition[language].toLowerCase().includes("nuevo") ||
                          vehicle.condition[language].toLowerCase().includes("new")
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {vehicle.condition[language]}
                      </span>
                    )}
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800/50">
                      {language === "es" ? "Ver detalles" : "View details"}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Flechas de navegación */}
      {showArrows && totalVehicles > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-slate-700 hover:text-blue-600 p-3 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl z-30 hover:scale-110 backdrop-blur-sm border border-white/20 dark:border-slate-600/20 dark:bg-slate-800/95 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={language === "es" ? "Vehículo anterior" : "Previous vehicle"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-slate-700 hover:text-blue-600 p-3 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl z-30 hover:scale-110 backdrop-blur-sm border border-white/20 dark:border-slate-600/20 dark:bg-slate-800/95 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={language === "es" ? "Siguiente vehículo" : "Next vehicle"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicadores de puntos mejorados */}
      {showDots && totalVehicles > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white/90 dark:bg-slate-800/90 px-6 py-3 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20">
          {vehicles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${
                index === currentIndex % totalVehicles
                  ? "w-8 h-3 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg"
                  : "w-3 h-3 bg-slate-300 dark:bg-slate-600 hover:bg-blue-400 dark:hover:bg-blue-500 hover:scale-125"
              }`}
              aria-label={`${language === "es" ? "Ir a vehículo" : "Go to vehicle"} ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Overlay de información adicional en hover */}
      <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {language === "es"
                ? `${totalVehicles} vehículo${totalVehicles !== 1 ? "s" : ""} encontrado${totalVehicles !== 1 ? "s" : ""}`
                : `${totalVehicles} vehicle${totalVehicles !== 1 ? "s" : ""} found`}
            </span>
          </div>
        </div>
      </div>

      {/* Loading indicator durante transiciones */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black/10 dark:bg-white/5 backdrop-blur-[1px] flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-white/90 dark:bg-slate-800/90 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {language === "es" ? "Cargando..." : "Loading..."}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleCarousel;