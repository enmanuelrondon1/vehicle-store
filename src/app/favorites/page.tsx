// src/app/favorites/page.tsx
"use client";

import React, { useMemo, useCallback, useState } from "react"; // Eliminamos useEffect ya que no lo usamos
import { useLanguage } from "@/context/LanguajeContext";
import { useFavorites } from "@/context/FavoritesContext"; // Usamos el contexto global
import vehicles from "@/data/vehicles.json";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Heart, Car, Calendar, Gauge, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface Vehicle {
  id: string;
  category: { es: string; en: string };
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: { es: string; en: string };
  engine: { es: string; en: string };
  transmission: { es: string; en: string };
  condition: { es: string; en: string };
  location: string;
  features: { es: string[]; en: string[] };
  fuelType: { es: string; en: string };
  doors: number;
  seats: number;
  dimensions: {
    largo: number;
    ancho: number;
    alto: number;
  };
  weight: number;
  loadCapacity?: number;
  images: string[];
  sellerContact: {
    name: string;
    phone: string;
    email: string;
  };
  postedDate: string;
  disponibilidad: { es: string; en: string };
  warranty: { es: string; en: string };
  description: { es: string; en: string };
}

const VehicleCard: React.FC<{ 
  vehicle: Vehicle; 
  language: string; 
  onRemove: (id: string) => void;
}> = React.memo(({ vehicle, language, onRemove }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleRemove = () => {
    onRemove(vehicle.id);
    toast(
      language === "es"
        ? `${vehicle.brand} ${vehicle.model} ha sido eliminado de tus favoritos.`
        : `${vehicle.brand} ${vehicle.model} has been removed from your favorites.`
    );
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
      <CardHeader className="p-0 relative overflow-hidden">
        {imageLoading && (
          <Skeleton className="w-full h-48 rounded-t-lg" />
        )}
        <div className="relative w-full h-48">
          <Image
            src={imageError ? "/placeholder-vehicle.jpg" : vehicle.images[0].trimEnd()}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className={`rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoading ? "hidden" : "block"
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-700">
            {vehicle.condition[language as keyof typeof vehicle.condition]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
            {vehicle.brand} {vehicle.model}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>{vehicle.mileage.toLocaleString()} km</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4" />
          <span>{vehicle.location}</span>
        </div>

        <div className="text-xl font-bold text-green-600 dark:text-green-400">
          {formatPrice(vehicle.price)}
        </div>

        <div className="flex justify-between items-center pt-2 gap-2">
          <Link href={`/vehicle/${vehicle.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 border-blue-200 dark:border-blue-800"
            >
              <Car className="h-4 w-4 mr-2" />
              {language === "es" ? "Ver detalles" : "View details"}
            </Button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {language === "es" ? "¿Eliminar de favoritos?" : "Remove from favorites?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {language === "es" 
                    ? `¿Estás seguro de que quieres eliminar ${vehicle.brand} ${vehicle.model} de tus favoritos?`
                    : `Are you sure you want to remove ${vehicle.brand} ${vehicle.model} from your favorites?`
                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {language === "es" ? "Cancelar" : "Cancel"}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleRemove} className="bg-red-600 hover:bg-red-700">
                  {language === "es" ? "Eliminar" : "Remove"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
});

VehicleCard.displayName = "VehicleCard";

const EmptyState: React.FC<{ language: string }> = ({ language }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6">
      <Heart className="h-16 w-16 text-gray-400" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
      {language === "es" ? "Sin favoritos" : "No favorites"}
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
      {language === "es"
        ? "Aún no has añadido vehículos a tus favoritos. Explora nuestro catálogo y encuentra el vehículo perfecto para ti."
        : "You haven't added any vehicles to your favorites yet. Explore our catalog and find the perfect vehicle for you."
      }
    </p>
    <Link href="/catalog">
      <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors px-8">
        <Car className="h-4 w-4 mr-2" />
        {language === "es" ? "Explorar catálogo" : "Explore catalog"}
      </Button>
    </Link>
  </div>
);

const Favorites: React.FC = () => {
  const { language } = useLanguage();
  const { favorites, removeFavorite } = useFavorites(); // Solo necesitamos removeFavorite

  const favoriteVehicles = useMemo(() => {
    return (vehicles as { items: Vehicle[] }).items.filter((v) => favorites.has(v.id));
  }, [favorites]);

  const handleRemoveFavorite = useCallback((vehicleId: string) => {
    removeFavorite(vehicleId);
  }, [removeFavorite]);

  const handleClearAll = useCallback(() => {
    favorites.forEach((id: string) => removeFavorite(id));
    toast(
      language === "es"
        ? "Todos los favoritos han sido eliminados."
        : "All favorites have been cleared."
    );
  }, [removeFavorite, language, favorites]);

  if (favoriteVehicles.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <EmptyState language={language} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {language === "es" ? "Tus favoritos" : "Your favorites"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {favoriteVehicles.length} {language === "es" ? "vehículos guardados" : "saved vehicles"}
          </p>
        </div>
        
        {favoriteVehicles.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {language === "es" ? "Limpiar todo" : "Clear all"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {language === "es" ? "¿Eliminar todos los favoritos?" : "Clear all favorites?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {language === "es" 
                    ? "Esta acción eliminará todos los vehículos de tu lista de favoritos. No se puede deshacer."
                    : "This action will remove all vehicles from your favorites list. This cannot be undone."
                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {language === "es" ? "Cancelar" : "Cancel"}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700">
                  {language === "es" ? "Eliminar todo" : "Clear all"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            language={language}
            onRemove={handleRemoveFavorite}
          />
        ))}
      </div>
    </div>
  );
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
};

export default Favorites;

// TODO: "CODIGO DE PRUEBA"

// "use client";

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { useLanguage } from "@/context/LanguajeContext";
// import vehicles from "@/data/vehicles.json";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import {
//   Trash2,
//   Heart,
//   Car,
//   Calendar,
//   Gauge,
//   MapPin,
//   Search,
//   Filter,
//   SortAsc,
//   Star,
//   Grid3X3,
//   List,
//   Eye,
//   Share2,
//   HeartOff,
//   RefreshCw,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Toggle } from "@/components/ui/toggle";
// import Link from "next/link";
// import { toast } from "sonner";
// import Image from "next/image";

// interface Vehicle {
//   id: string;
//   category: { es: string; en: string };
//   brand: string;
//   model: string;
//   year: number;
//   price: number;
//   mileage: number;
//   color: { es: string; en: string };
//   engine: { es: string; en: string };
//   transmission: { es: string; en: string };
//   condition: { es: string; en: string };
//   location: string;
//   features: { es: string[]; en: string[] };
//   fuelType: { es: string; en: string };
//   doors: number;
//   seats: number;
//   dimensions: {
//     largo: number;
//     ancho: number;
//     alto: number;
//   };
//   weight: number;
//   loadCapacity?: number;
//   images: string[];
//   sellerContact: {
//     name: string;
//     phone: string;
//     email: string;
//   };
//   postedDate: string;
//   disponibilidad: { es: string; en: string };
//   warranty: { es: string; en: string };
//   description: { es: string; en: string };
// }

// type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "mileage-low" | "mileage-high" | "alphabetical";
// type ViewMode = "grid" | "list";

// // Utility function for debounce
// function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
//   let timeout: NodeJS.Timeout;
//   return (...args: Parameters<T>) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// }

// // Custom hook for debounced value
// function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// }

// // Hook mejorado para favoritos con mejor rendimiento
// const useFavorites = () => {
//   const [favorites, setFavorites] = useState<Set<string>>(new Set());
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const debouncedSave = useCallback(
//     debounce((newFavorites: Set<string>) => {
//       try {
//         localStorage.setItem("favorites", JSON.stringify(Array.from(newFavorites)));
//       } catch (error) {
//         console.error("Error saving favorites:", error);
//         setError("Error al guardar favoritos");
//       }
//     }, 300),
//     []
//   );

//   useEffect(() => {
//     const loadFavorites = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const savedFavorites = localStorage.getItem("favorites");
//         if (savedFavorites) {
//           const parsedFavorites = JSON.parse(savedFavorites);
//           if (Array.isArray(parsedFavorites)) {
//             setFavorites(new Set<string>(parsedFavorites));
//           }
//         }
//       } catch (error) {
//         console.error("Error loading favorites:", error);
//         setError("Error al cargar favoritos");
//         setFavorites(new Set());
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadFavorites();
//   }, []);

//   const removeFavorite = useCallback(
//     (vehicleId: string) => {
//       setFavorites((prev) => {
//         const newFavorites = new Set(prev);
//         if (newFavorites.has(vehicleId)) {
//           newFavorites.delete(vehicleId);
//           debouncedSave(newFavorites);
//           return newFavorites;
//         }
//         return prev;
//       });
//     },
//     [debouncedSave]
//   );

//   const clearAllFavorites = useCallback(() => {
//     setFavorites(new Set());
//     debouncedSave(new Set());
//   }, [debouncedSave]);

//   return { favorites, isLoading, error, removeFavorite, clearAllFavorites };
// };

// // Hook mejorado para filtros con mejor rendimiento
// const useVehicleFilters = (vehicles: Vehicle[], language: string) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState<SortOption>("newest");
//   const [selectedBrand, setSelectedBrand] = useState<string>("all"); // Default to "all" instead of ""
//   const [selectedCategory, setSelectedCategory] = useState<string>("all"); // Default to "all" instead of ""
//   const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);

//   const debouncedSearchTerm = useDebounce(searchTerm, 300);

//   const filteredAndSortedVehicles = useMemo(() => {
//     let filtered = vehicles;

//     if (debouncedSearchTerm) {
//       const term = debouncedSearchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (vehicle) =>
//           vehicle.brand.toLowerCase().includes(term) ||
//           vehicle.model.toLowerCase().includes(term) ||
//           vehicle.location.toLowerCase().includes(term) ||
//           vehicle.category[language as keyof typeof vehicle.category].toLowerCase().includes(term) ||
//           vehicle.sellerContact.name.toLowerCase().includes(term)
//       );
//     }

//     if (selectedBrand !== "all") {
//       filtered = filtered.filter((vehicle) => vehicle.brand === selectedBrand);
//     }

//     if (selectedCategory !== "all") {
//       filtered = filtered.filter(
//         (vehicle) => vehicle.category[language as keyof typeof vehicle.category] === selectedCategory
//       );
//     }

//     if (priceRange) {
//       filtered = filtered.filter(
//         (vehicle) => vehicle.price >= priceRange.min && vehicle.price <= priceRange.max
//       );
//     }

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "newest":
//           return b.year - a.year;
//         case "oldest":
//           return a.year - b.year;
//         case "price-low":
//           return a.price - b.price;
//         case "price-high":
//           return b.price - a.price;
//         case "mileage-low":
//           return a.mileage - b.mileage;
//         case "mileage-high":
//           return b.mileage - a.mileage;
//         case "alphabetical":
//           return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
//         default:
//           return 0;
//       }
//     });

//     return filtered;
//   }, [vehicles, debouncedSearchTerm, sortBy, selectedBrand, selectedCategory, priceRange, language]);

//   const uniqueBrands = useMemo(() => {
//     return Array.from(new Set(vehicles.map((v) => v.brand))).sort();
//   }, [vehicles]);

//   const uniqueCategories = useMemo(() => {
//     return Array.from(new Set(vehicles.map((v) => v.category[language as keyof typeof v.category]))).sort();
//   }, [vehicles, language]);

//   const priceStats = useMemo(() => {
//     if (vehicles.length === 0) return { min: 0, max: 0 };
//     const prices = vehicles.map((v) => v.price);
//     return {
//       min: Math.min(...prices),
//       max: Math.max(...prices),
//     };
//   }, [vehicles]);

//   const clearFilters = useCallback(() => {
//     setSearchTerm("");
//     setSelectedBrand("all");
//     setSelectedCategory("all");
//     setPriceRange(null);
//     setSortBy("newest");
//   }, []);

//   return {
//     searchTerm,
//     setSearchTerm,
//     sortBy,
//     setSortBy,
//     selectedBrand,
//     setSelectedBrand,
//     selectedCategory,
//     setSelectedCategory,
//     priceRange,
//     setPriceRange,
//     filteredVehicles: filteredAndSortedVehicles,
//     uniqueBrands,
//     uniqueCategories,
//     priceStats,
//     clearFilters,
//     hasActiveFilters: Boolean(debouncedSearchTerm || selectedBrand !== "all" || selectedCategory !== "all" || priceRange),
//   };
// };

// // Componente de tarjeta mejorado con animaciones y mejor UX
// const VehicleCard: React.FC<{
//   vehicle: Vehicle;
//   language: string;
//   onRemove: (id: string) => void;
//   viewMode: ViewMode;
// }> = React.memo(({ vehicle, language, onRemove, viewMode }) => {
//   const [imageError, setImageError] = useState(false);
//   const [imageLoading, setImageLoading] = useState(true);
//   const [isRemoving, setIsRemoving] = useState(false);

//   const handleImageError = useCallback(() => {
//     setImageError(true);
//     setImageLoading(false);
//   }, []);

//   const handleImageLoad = useCallback(() => {
//     setImageLoading(false);
//   }, []);

//   const handleRemove = useCallback(async () => {
//     try {
//       setIsRemoving(true);
//       onRemove(vehicle.id);
//       toast.success(
//         language === "es"
//           ? `${vehicle.brand} ${vehicle.model} eliminado de favoritos`
//           : `${vehicle.brand} ${vehicle.model} removed from favorites`,
//         {
//           duration: 3000,
//         }
//       );
//     } catch (error) {
//       toast.error(language === "es" ? "Error al eliminar de favoritos" : "Error removing from favorites");
//     } finally {
//       setIsRemoving(false);
//     }
//   }, [vehicle, onRemove, language]);

//   const formatPrice = useCallback((price: number): string => {
//     return new Intl.NumberFormat("es-MX", {
//       style: "currency",
//       currency: "MXN",
//       minimumFractionDigits: 0,
//     }).format(price);
//   }, []);

//   const handleShare = useCallback(async () => {
//     try {
//       await navigator.share({
//         title: `${vehicle.brand} ${vehicle.model}`,
//         text: `Mira este ${vehicle.brand} ${vehicle.model} del ${vehicle.year}`,
//         url: `${window.location.origin}/vehicle/${vehicle.id}`,
//       });
//     } catch (error) {
//       navigator.clipboard.writeText(`${window.location.origin}/vehicle/${vehicle.id}`);
//       toast.success(language === "es" ? "Enlace copiado al portapapeles" : "Link copied to clipboard");
//     }
//   }, [vehicle, language]);

//   if (viewMode === "list") {
//     return (
//       <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/20 bg-white dark:bg-gray-800">
//         <CardContent className="p-6">
//           <div className="flex gap-6">
//             <div className="relative w-48 h-32 flex-shrink-0">
//               {imageLoading && <Skeleton className="w-full h-full rounded-lg" />}
//               <Image
//                 src={imageError ? "/placeholder-vehicle.jpg" : vehicle.images[0]}
//                 alt={`${vehicle.brand} ${vehicle.model}`}
//                 width={200}
//                 height={128}
//                 className={`w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 ${
//                   imageLoading ? "hidden" : "block"
//                 }`}
//                 onError={handleImageError}
//                 onLoad={handleImageLoad}
//                 loading="lazy"
//               />
//             </div>

//             <div className="flex-1 min-w-0">
//               <div className="flex justify-between items-start mb-3">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                     {vehicle.brand} {vehicle.model}
//                   </h3>
//                   <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
//                     <span className="flex items-center gap-1">
//                       <Calendar className="h-3 w-3" />
//                       {vehicle.year}
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <Gauge className="h-3 w-3" />
//                       {vehicle.mileage.toLocaleString()} km
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <MapPin className="h-3 w-3" />
//                       {vehicle.location}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Badge variant="secondary" className="bg-blue-600 text-white">
//                     <Star className="h-3 w-3 mr-1" />
//                     {language === "es" ? "Favorito" : "Favorite"}
//                   </Badge>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center">
//                 <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                   {formatPrice(vehicle.price)}
//                 </div>

//                 <div className="flex gap-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={handleShare}
//                     className="text-gray-500 hover:text-blue-600"
//                   >
//                     <Share2 className="h-4 w-4" />
//                   </Button>

//                   <Link href={`/vehicle/${vehicle.id}`}>
//                     <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
//                       <Eye className="h-4 w-4 mr-2" />
//                       {language === "es" ? "Ver" : "View"}
//                     </Button>
//                   </Link>

//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         disabled={isRemoving}
//                         className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
//                       >
//                         <Trash2 className={`h-4 w-4 ${isRemoving ? "animate-pulse" : ""}`} />
//                       </Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>
//                           {language === "es" ? "¿Eliminar de favoritos?" : "Remove from favorites?"}
//                         </AlertDialogTitle>
//                         <AlertDialogDescription>
//                           {language === "es"
//                             ? `¿Estás seguro de que quieres eliminar ${vehicle.brand} ${vehicle.model} de tu lista de favoritos?`
//                             : `Are you sure you want to remove ${vehicle.brand} ${vehicle.model} from your favorites list?`}
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter>
//                         <AlertDialogCancel>{language === "es" ? "Cancelar" : "Cancel"}</AlertDialogCancel>
//                         <AlertDialogAction onClick={handleRemove} className="bg-red-600 hover:bg-red-700">
//                           {language === "es" ? "Eliminar" : "Remove"}
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 bg-white dark:bg-gray-800">
//       <CardHeader className="p-0 relative overflow-hidden">
//         {imageLoading && <Skeleton className="w-full h-48 rounded-t-lg" />}
//         <div className="relative">
//           <Image
//             src={imageError ? "/placeholder-vehicle.jpg" : vehicle.images[0]}
//             alt={`${vehicle.brand} ${vehicle.model}`}
//             width={400}
//             height={200}
//             className={`w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-110 ${
//               imageLoading ? "hidden" : "block"
//             }`}
//             onError={handleImageError}
//             onLoad={handleImageLoad}
//             loading="lazy"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//         </div>

//         <div className="absolute top-3 left-3">
//           <Badge variant="secondary" className="bg-blue-600 text-white shadow-md">
//             <Star className="h-3 w-3 mr-1" />
//             {language === "es" ? "Favorito" : "Favorite"}
//           </Badge>
//         </div>

//         <div className="absolute top-3 right-3 flex gap-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleShare}
//             className="bg-white/90 hover:bg-white text-gray-700 hover:text-blue-600 shadow-md"
//           >
//             <Share2 className="h-3 w-3" />
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent className="p-6 space-y-4">
//         <div className="space-y-2">
//           <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//             {vehicle.brand} {vehicle.model}
//           </h3>
//           <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
//             <div className="flex items-center gap-1">
//               <Calendar className="h-4 w-4 text-blue-500" />
//               <span>{vehicle.year}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Gauge className="h-4 w-4 text-green-500" />
//               <span>{vehicle.mileage.toLocaleString()} km</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
//           <MapPin className="h-4 w-4 text-red-500" />
//           <span className="truncate">{vehicle.location}</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//             {formatPrice(vehicle.price)}
//           </div>
//           <Badge variant="outline" className="text-xs">
//             {vehicle.fuelType[language as keyof typeof vehicle.fuelType]}
//           </Badge>
//         </div>

//         <div className="flex justify-between items-center pt-3 gap-3">
//           <Link href={`/vehicle/${vehicle.id}`} className="flex-1">
//             <Button
//               variant="default"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
//             >
//               <Car className="h-4 w-4 mr-2" />
//               {language === "es" ? "Ver detalles" : "View details"}
//             </Button>
//           </Link>

//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 disabled={isRemoving}
//                 className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800 shadow-sm hover:shadow-md transition-all duration-200"
//               >
//                 <Trash2 className={`h-4 w-4 ${isRemoving ? "animate-pulse" : ""}`} />
//               </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle className="flex items-center gap-2">
//                   <Heart className="h-5 w-5 text-red-500" />
//                   {language === "es" ? "¿Eliminar de favoritos?" : "Remove from favorites?"}
//                 </AlertDialogTitle>
//                 <AlertDialogDescription>
//                   {language === "es"
//                     ? `¿Estás seguro de que quieres eliminar ${vehicle.brand} ${vehicle.model} de tu lista de favoritos?`
//                     : `Are you sure you want to remove ${vehicle.brand} ${vehicle.model} from your favorites list?`}
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>{language === "es" ? "Cancelar" : "Cancel"}</AlertDialogCancel>
//                 <AlertDialogAction
//                   onClick={handleRemove}
//                   className="bg-red-600 hover:bg-red-700"
//                   disabled={isRemoving}
//                 >
//                   {isRemoving ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       {language === "es" ? "Eliminando..." : "Removing..."}
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       {language === "es" ? "Eliminar" : "Remove"}
//                     </>
//                   )}
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//       </CardContent>
//     </Card>
//   );
// });

// VehicleCard.displayName = "VehicleCard";

// // Controles de filtro mejorados
// const FilterControls: React.FC<{
//   language: string;
//   searchTerm: string;
//   setSearchTerm: (term: string) => void;
//   sortBy: SortOption;
//   setSortBy: (sort: SortOption) => void;
//   selectedBrand: string;
//   setSelectedBrand: (brand: string) => void;
//   selectedCategory: string;
//   setSelectedCategory: (category: string) => void;
//   uniqueBrands: string[];
//   uniqueCategories: string[];
//   totalCount: number;
//   onClearFilters: () => void;
//   hasActiveFilters: boolean;
//   viewMode: ViewMode;
//   setViewMode: (mode: ViewMode) => void;
// }> = ({
//   language,
//   searchTerm,
//   setSearchTerm,
//   sortBy,
//   setSortBy,
//   selectedBrand,
//   setSelectedBrand,
//   selectedCategory,
//   setSelectedCategory,
//   uniqueBrands,
//   uniqueCategories,
//   totalCount,
//   onClearFilters,
//   hasActiveFilters,
//   viewMode,
//   setViewMode,
// }) => {
//   const getSortLabel = (option: SortOption) => {
//     const labels = {
//       es: {
//         newest: "Más nuevos",
//         oldest: "Más antiguos",
//         "price-low": "Precio menor",
//         "price-high": "Precio mayor",
//         "mileage-low": "Menor kilometraje",
//         "mileage-high": "Mayor kilometraje",
//         alphabetical: "Alfabético",
//       },
//       en: {
//         newest: "Newest",
//         oldest: "Oldest",
//         "price-low": "Price low to high",
//         "price-high": "Price high to low",
//         "mileage-low": "Lower mileage",
//         "mileage-high": "Higher mileage",
//         alphabetical: "Alphabetical",
//       },
//     };
//     return labels[language as keyof typeof labels][option];
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6 ">
//       <div className="flex flex-col space-y-4">
//         {/* Primera fila: Búsqueda y vista */}
//         <div className="flex flex-col md:flex-row gap-4 items-center">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 type="text"
//                 placeholder={language === "es" ? "Buscar por marca, modelo o ubicación..." : "Search by brand, model or location..."}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-600 dark:text-gray-400">
//               {language === "es" ? "Vista:" : "View:"}
//             </span>
//             <Toggle
//               pressed={viewMode === "grid"}
//               onPressedChange={() => setViewMode("grid")}
//               aria-label="Grid view"
//               size="sm"
//             >
//               <Grid3X3 className="h-4 w-4" />
//             </Toggle>
//             <Toggle
//               pressed={viewMode === "list"}
//               onPressedChange={() => setViewMode("list")}
//               aria-label="List view"
//               size="sm"
//             >
//               <List className="h-4 w-4" />
//             </Toggle>
//           </div>
//         </div>

//         {/* Segunda fila: Filtros */}
//         <div className="flex flex-col md:flex-row gap-3">
//           <Select value={selectedBrand} onValueChange={setSelectedBrand}>
//             <SelectTrigger className="w-full md:w-[180px]">
//               <Filter className="h-4 w-4 mr-2" />
//               <SelectValue placeholder={language === "es" ? "Todas las marcas" : "All brands"} />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">{language === "es" ? "Todas las marcas" : "All brands"}</SelectItem>
//               {uniqueBrands.map((brand) => (
//                 <SelectItem key={brand} value={brand}>
//                   {brand}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//             <SelectTrigger className="w-full md:w-[180px]">
//               <Car className="h-4 w-4 mr-2" />
//               <SelectValue placeholder={language === "es" ? "Todas las categorías" : "All categories"} />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">{language === "es" ? "Todas las categorías" : "All categories"}</SelectItem>
//               {uniqueCategories.map((category) => (
//                 <SelectItem key={category} value={category}>
//                   {category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
//             <SelectTrigger className="w-full md:w-[180px]">
//               <SortAsc className="h-4 w-4 mr-2" />
//               <SelectValue placeholder={language === "es" ? "Ordenar por" : "Sort by"} />
//             </SelectTrigger>
//             <SelectContent>
//               {(["newest", "oldest", "price-low", "price-high", "mileage-low", "mileage-high", "alphabetical"] as SortOption[]).map(
//                 (option) => (
//                   <SelectItem key={option} value={option}>
//                     {getSortLabel(option)}
//                   </SelectItem>
//                 )
//               )}
//             </SelectContent>
//           </Select>

//           {hasActiveFilters && (
//             <Button
//               variant="outline"
//               onClick={onClearFilters}
//               size="sm"
//               className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
//             >
//               <RefreshCw className="h-4 w-4 mr-2" />
//               {language === "es" ? "Limpiar" : "Clear"}
//             </Button>
//           )}
//         </div>

//         {/* Tercera fila: Contador de resultados */}
//         <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
//           <span>
//             {language === "es"
//               ? `${totalCount} vehículo${totalCount !== 1 ? "s" : ""} favorito${totalCount !== 1 ? "s" : ""}`
//               : `${totalCount} favorite vehicle${totalCount !== 1 ? "s" : ""}`}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Componente principal
// const FavoritesPage: React.FC = () => {
//   const { language } = useLanguage();
//   const { favorites, isLoading, error, removeFavorite, clearAllFavorites } = useFavorites();
//   const [viewMode, setViewMode] = useState<ViewMode>("grid");

//   // Filtrar vehículos favoritos
//   const favoriteVehicles = useMemo(() => {
//     return vehicles.items.filter((vehicle: Vehicle) => favorites.has(vehicle.id));
//   }, [favorites]);

//   const {
//     searchTerm,
//     setSearchTerm,
//     sortBy,
//     setSortBy,
//     selectedBrand,
//     setSelectedBrand,
//     selectedCategory,
//     setSelectedCategory,
//     filteredVehicles,
//     uniqueBrands,
//     uniqueCategories,
//     clearFilters,
//     hasActiveFilters,
//   } = useVehicleFilters(favoriteVehicles, language);

//   const handleClearAllFavorites = useCallback(() => {
//     clearAllFavorites();
//     toast.success(language === "es" ? "Todos los favoritos han sido eliminados" : "All favorites have been removed");
//   }, [clearAllFavorites, language]);

//   if (isLoading) {
//     return (
//       <div className=" min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="mb-8">
//             <Skeleton className="h-8 w-64 mb-4" />
//             <Skeleton className="h-4 w-96" />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {Array.from({ length: 8 }).map((_, index) => (
//               <Card key={index} className="animate-pulse">
//                 <CardHeader className="p-0">
//                   <Skeleton className="w-full h-48 rounded-t-lg" />
//                 </CardHeader>
//                 <CardContent className="p-6 space-y-4">
//                   <Skeleton className="h-6 w-3/4" />
//                   <Skeleton className="h-4 w-1/2" />
//                   <Skeleton className="h-8 w-full" />
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className=" min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
//         <Card className="w-full max-w-md">
//           <CardContent className="p-6 text-center">
//             <div className="text-red-500 mb-4">
//               <Heart className="h-12 w-12 mx-auto" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
//               {language === "es" ? "Error al cargar favoritos" : "Error loading favorites"}
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
//             <Button onClick={() => window.location.reload()}>
//               <RefreshCw className="h-4 w-4 mr-2" />
//               {language === "es" ? "Reintentar" : "Retry"}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-6 min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
//                 <Heart className="h-8 w-8 text-red-500" />
//                 {language === "es" ? "Mis Favoritos" : "My Favorites"}
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400 mt-2">
//                 {language === "es"
//                   ? "Aquí encontrarás todos los vehículos que has marcado como favoritos"
//                   : "Here you'll find all the vehicles you've marked as favorites"}
//               </p>
//             </div>

//             {favoriteVehicles.length > 0 && (
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     {language === "es" ? "Limpiar todo" : "Clear all"}
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle className="flex items-center gap-2">
//                       <HeartOff className="h-5 w-5 text-red-500" />
//                       {language === "es" ? "¿Limpiar todos los favoritos?" : "Clear all favorites?"}
//                     </AlertDialogTitle>
//                     <AlertDialogDescription>
//                       {language === "es"
//                         ? "Esta acción eliminará todos los vehículos de tu lista de favoritos. Esta acción no se puede deshacer."
//                         : "This action will remove all vehicles from your favorites list. This action cannot be undone."}
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>{language === "es" ? "Cancelar" : "Cancel"}</AlertDialogCancel>
//                     <AlertDialogAction onClick={handleClearAllFavorites} className="bg-red-600 hover:bg-red-700">
//                       {language === "es" ? "Limpiar todo" : "Clear all"}
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             )}
//           </div>
//         </div>

//         {favoriteVehicles.length === 0 ? (
//           // Estado vacío
//           <div className="text-center py-16">
//             <div className="max-w-md mx-auto">
//               <div className="mb-6">
//                 <HeartOff className="h-24 w-24 text-gray-400 mx-auto" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
//                 {language === "es" ? "No tienes favoritos aún" : "No favorites yet"}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 mb-8">
//                 {language === "es"
//                   ? "Comienza a explorar nuestro catálogo y marca los vehículos que más te interesen como favoritos."
//                   : "Start exploring our catalog and mark the vehicles that interest you most as favorites."}
//               </p>
//               <Link href="/catalog">
//                 <Button className="bg-blue-600 hover:bg-blue-700">
//                   <Car className="h-4 w-4 mr-2" />
//                   {language === "es" ? "Explorar vehículos" : "Explore vehicles"}
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* Controles de filtro */}
//             <FilterControls
//               language={language}
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//               sortBy={sortBy}
//               setSortBy={setSortBy}
//               selectedBrand={selectedBrand}
//               setSelectedBrand={setSelectedBrand}
//               selectedCategory={selectedCategory}
//               setSelectedCategory={setSelectedCategory}
//               uniqueBrands={uniqueBrands}
//               uniqueCategories={uniqueCategories}
//               totalCount={filteredVehicles.length}
//               onClearFilters={clearFilters}
//               hasActiveFilters={hasActiveFilters}
//               viewMode={viewMode}
//               setViewMode={setViewMode}
//             />

//             {/* Lista de vehículos */}
//             {filteredVehicles.length === 0 ? (
//               <div className="text-center py-12">
//                 <div className="max-w-md mx-auto">
//                   <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
//                     {language === "es" ? "No se encontraron resultados" : "No results found"}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400 mb-6">
//                     {language === "es"
//                       ? "Intenta ajustar tus filtros de búsqueda para encontrar más vehículos."
//                       : "Try adjusting your search filters to find more vehicles."}
//                   </p>
//                   <Button variant="outline" onClick={clearFilters}>
//                     <RefreshCw className="h-4 w-4 mr-2" />
//                     {language === "es" ? "Limpiar filtros" : "Clear filters"}
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div
//                 className={
//                   viewMode === "grid"
//                     ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//                     : "space-y-4"
//                 }
//               >
//                 {filteredVehicles.map((vehicle) => (
//                   <VehicleCard
//                     key={vehicle.id}
//                     vehicle={vehicle}
//                     language={language}
//                     onRemove={removeFavorite}
//                     viewMode={viewMode}
//                   />
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FavoritesPage;