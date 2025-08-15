// src/components/features/vehicles/detail/VehicleDetail.tsx
"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Share2,

  MapPin,
  Calendar,
  Car,
  Eye,
  Star,
  Shield,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Flag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDarkMode } from "@/context/DarkModeContext";
import { SimilarVehicles } from "./SimilarVehicles";
import Image from "next/image";
import {
  VehicleDataFrontend,
  WarrantyType,
  ApprovalStatus,
  Documentation,
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
  WARRANTY_LABELS,
} from "@/types/types";

// Extiende el tipo Session para incluir accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const DOCUMENTATION_MAP: Record<Documentation, string> = {
  [Documentation.TITLE]: "Título de Propiedad",
  [Documentation.ORIGIN_CERTIFICATE]: "Certificado de Origen",
  [Documentation.TRANSIT_REVIEW]: "Revisión de Tránsito (INTT)",
  [Documentation.BOLIVARIAN_PLATES]: "Placas Bolivarianas",
};

const STATUS_MAP = {
  [ApprovalStatus.PENDING]: "Pendiente",
  [ApprovalStatus.APPROVED]: "Aprobado",
  [ApprovalStatus.REJECTED]: "Rechazado",
} as const;

// Función helper para traducir valores
const translateValue = <T extends string, M extends Record<T, string>>(
  value: T,
  map: M
): M[T] | T => {
  return map[value] || value;
};

// Componente de galería de imágenes
const ImageGallery = ({
  images,
  vehicleName,
  isDarkMode,
}: {
  images: string[];
  vehicleName: string;
  isDarkMode: boolean;
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
      <div
        className={`aspect-video rounded-xl ${
          isDarkMode ? "bg-gray-800" : "bg-gray-200"
        } flex items-center justify-center`}
      >
        <div className="text-center">
          <Car
            className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
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

      {/* Fullscreen Modal - CORREGIDO */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Contenedor principal del modal */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Contenedor de la imagen - CORREGIDO */}
            <div className="relative w-full h-full max-w-[95vw] max-h-[90vh]">
              <Image
                src={
                  imageErrors[currentImageIndex]
                    ? "/placeholder.svg?height=600&width=800"
                    : images[currentImageIndex]
                }
                alt={`${vehicleName} - Imagen ${currentImageIndex + 1}`}
                className="object-contain"
                fill
                sizes="95vw"
                onError={() => handleImageError(currentImageIndex)}
              />
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors z-10 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navegación - solo si hay más de una imagen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors z-10 backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors z-10 backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Contador de imágenes */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* Cerrar al hacer clic en el fondo */}
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setIsFullscreen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

// Componente de información de contacto
const ContactInfo = ({
  sellerContact,
  vehicleName,
  price,
  isDarkMode,
}: {
  sellerContact: VehicleDataFrontend["sellerContact"];
  vehicleName: string;
  price: number;
  isDarkMode: boolean;
}) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const handleCall = () => {
    window.open(`tel:${sellerContact.phone}`, "_self");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Interés en ${vehicleName}`);
    const body = encodeURIComponent(
      `Hola ${
        sellerContact.name
      },\n\nEstoy interesado en tu ${vehicleName} por ${formatPrice(
        price
      )}.\n\n¿Podrías darme más información?\n\nGracias.`
    );
    window.open(
      `mailto:${sellerContact.email}?subject=${subject}&body=${body}`,
      "_self"
    );
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola ${
        sellerContact.name
      }, estoy interesado en tu ${vehicleName} por ${formatPrice(
        price
      )}. ¿Podrías darme más información?`
    );
    window.open(
      `https://wa.me/${sellerContact.phone.replace(/\D/g, "")}?text=${message}`,
      "_blank"
    );
  };

  return (
    <div
      className={`p-6 rounded-xl border ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/50 border-gray-200"
      } backdrop-blur-sm`}
    >
      <h3
        className={`text-xl font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>
        Información de Contacto
      </h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            } flex items-center justify-center`}>
            <span
              className={`text-lg font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {sellerContact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p
              className={`font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {sellerContact.name}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>
              Vendedor
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleCall}
            className="flex items-center gap-3 p-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
           >
            <div className="text-left">
              <p className="font-semibold">Llamar</p>
              <p className="text-sm opacity-90">{sellerContact.phone}</p>
            </div>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-3 p-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
           >
            <div className="text-left">
              <p className="font-semibold">WhatsApp</p>
              <p className="text-sm opacity-90">Enviar mensaje</p>
            </div>
          </button>

          <button
            onClick={handleEmail}
            className="flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
           >
            <div className="text-left">
              <p className="font-semibold">Email</p>
              <p className="text-sm opacity-90">{sellerContact.email}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const VehicleDetail: React.FC<{ vehicleId: string }> = ({ vehicleId }) => {
  const { isDarkMode } = useDarkMode();
  // const { data: session } = useSession();
  const router = useRouter();

  const [vehicle, setVehicle] = useState<VehicleDataFrontend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [similarVehicles, setSimilarVehicles] = useState<VehicleDataFrontend[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);

  const fetchVehicle = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      // 1. Llamar a la nueva ruta unificada y pública
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Error ${response.status}` }));
         throw new Error(errorData.error || `Error ${response.status}`);      }

      const result = await response.json();      if (!result.success || !result.data) {
        throw new Error(result.error || "No se pudieron obtener los datos del vehículo.");
      }

      const vehicleData = result.data;
      setVehicle(vehicleData);

      // 2. Incrementar vistas después de obtener el vehículo.
      // Esto se hace en un 'try/catch' separado para que un fallo aquí
      // no impida que el usuario vea la página del vehículo.
      try {
        const viewApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/views`;
        const viewResponse = await fetch(viewApiUrl, { method: 'POST' });
        if (viewResponse.ok) {
          const updatedData = await viewResponse.json();
          if (updatedData.success && typeof updatedData.data?.views === 'number') {
            // Actualizar el estado con el conteo de vistas devuelto por la API
            setVehicle(prev => prev ? { ...prev, views: updatedData.data.views } : null);
          }
        }
      } catch (viewError) {
        console.warn("No se pudo incrementar la vista, pero la página se muestra:", viewError);
      }
    } catch (error) {
      console.error("❌ Error obteniendo vehículo:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);
     } finally {      setIsLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  useEffect(() => {
    if (vehicle?._id) {
      const fetchSimilar = async () => {
        setIsLoadingSimilar(true);
        try {
          const similarApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicle._id}/similar`;
          const response = await fetch(similarApiUrl);
          const result = await response.json();          if (result.success) {
            setSimilarVehicles(result.data);
          }
        } catch (err) {
          console.error("Error fetching similar vehicles:", err);
           setSimilarVehicles([]);      } finally {
          setIsLoadingSimilar(false);
        }
      };
      fetchSimilar();
    }
  }, [vehicle]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat("es-ES").format(mileage);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Fecha desconocida";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `${vehicle?.brand} ${vehicle?.model} ${vehicle?.year}`,
      text: `Mira este ${vehicle?.brand} ${vehicle?.model} por ${formatPrice(
        vehicle?.price || 0
      )}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleReport = () => {
    alert("Funcionalidad de reporte en desarrollo");
  };

  const backgroundStyle = {
    background: isDarkMode
      ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4" style={backgroundStyle}>
        <div className="max-w-7xl mx-auto">
          <Skeleton className={`h-8 w-32 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            } animate-pulse rounded mb-8`}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div
                className={`aspect-video ${

                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                } animate-pulse rounded-xl mb-6`}
              />
              <Skeleton className={`h-64 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                } animate-pulse rounded-xl`}
              />
            </div>
            <div className="space-y-6">
              <Skeleton className={`h-48 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                } animate-pulse rounded-xl`}
              />
              <Skeleton className={`h-32 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                } animate-pulse rounded-xl`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen py-8 px-4" style={backgroundStyle}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className={`p-8 rounded-2xl backdrop-blur-sm ${
              isDarkMode
                ? "bg-gray-800/30 border-gray-700"
                : "bg-white/30 border-gray-200"
            } border shadow-2xl`}
          >
            <div className="text-6xl mb-6">😔</div>
            <h2
              className={`text-3xl font-bold mb-4 ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {error === "Vehículo no encontrado"
                ? "Vehículo no encontrado"
                : "Error al cargar"}
            </h2>
            <p
              className={`mb-8 text-lg ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {error || "No se pudo cargar la información del vehículo"}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.back()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2 inline" />
                Volver
              </button>
              <button
                onClick={fetchVehicle}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 text-lg rounded-lg transition-all duration-300"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const translatedCondition = translateValue(vehicle.condition, VEHICLE_CONDITIONS_LABELS);
  const translatedFuelType = translateValue(vehicle.fuelType, FUEL_TYPES_LABELS);
  const translatedTransmission = translateValue(
    vehicle.transmission,
    TRANSMISSION_TYPES_LABELS
  );
  const translatedWarranty = translateValue(vehicle.warranty, WARRANTY_LABELS);
  const translatedStatus = translateValue(vehicle.status, STATUS_MAP);

  return (
    <div className="min-h-screen py-8 px-4" style={backgroundStyle}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "bg-white hover:bg-gray-50 text-gray-700"
            } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                isFavorited
                  ? "bg-red-100 text-red-600"
                  : isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-white hover:bg-gray-50 text-gray-700"
              } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <Heart
                className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
              />
            </button>
            <button
              onClick={handleShare}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-white hover:bg-gray-50 text-gray-700"
              } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleReport}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-white hover:bg-gray-50 text-gray-700"
              } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">                <h1 className={`text-4xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {vehicle.brand} {vehicle.model} {vehicle.year}
                </h1>
                {vehicle.isFeatured && (
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Destacado
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(vehicle.price)}
                  {vehicle.isNegotiable && (
                    <span className="text-lg font-medium text-gray-500 dark:text-gray-400 ml-2">(Negociable)</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-6 text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{vehicle.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  <span>{formatMileage(vehicle.mileage)} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{vehicle.location}</span>
                </div>
                {vehicle.views !== undefined && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>{vehicle.views} vistas</span>
                  </div>
                )}
              </div>
            </div>
            <ImageGallery
              images={vehicle.images}
              vehicleName={`${vehicle.brand} ${vehicle.model}`}
              isDarkMode={isDarkMode}
            />
            <div
              className={`p-6 rounded-xl border ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white/50 border-gray-200"
              } backdrop-blur-sm`}
            >
              <h3
                className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Especificaciones Técnicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Marca
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {vehicle.brand}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Modelo
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {vehicle.model}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Año
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {vehicle.year}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Condición
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {translatedCondition}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Color
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {vehicle.color}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Tracción
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {vehicle.driveType?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Cilindraje
                    </span>
                    <span
                      className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {vehicle.displacement || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Kilometraje
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatMileage(vehicle.mileage)} km
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Transmisión
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {translatedTransmission}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Combustible
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {translatedFuelType}
                    </span>
                  </div>
                  {vehicle.engine && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span
                        className={`font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Motor
                      </span>
                      <span
                        className={`${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {vehicle.engine}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Garantía
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {translatedWarranty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {vehicle.documentation && vehicle.documentation.length > 0 && (
              <div
                className={`p-6 rounded-xl border ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/50 border-gray-200"
                } backdrop-blur-sm`}
              >
                <h3
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Documentación Incluida
                </h3>
                <div className="flex flex-wrap gap-3">
                  {vehicle.documentation.map((doc, index) => (
                    // ✅ CORRECCIÓN: Mapeo más seguro para la documentación
                    <Badge key={index} variant="outline" className="border-green-500 text-green-700 bg-green-500/10 text-base px-4 py-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {/* Se verifica si la clave existe en el mapa antes de usarla para mayor seguridad */}
                      {Object.values(Documentation).includes(doc as Documentation)
                        ? DOCUMENTATION_MAP[doc as Documentation]
                        : doc}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {vehicle.features.length > 0 && (
              <div className={`p-6 rounded-xl border ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/50 border-gray-200"
                } backdrop-blur-sm`}
              >
                <h3
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Características
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {vehicle.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {vehicle.description && (
              <div className={`p-6 rounded-xl border ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/50 border-gray-200"
                } backdrop-blur-sm`}
              >
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Descripción
                </h3>
                <p
                  className={`text-lg leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {vehicle.description}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <ContactInfo
              sellerContact={vehicle.sellerContact}
              vehicleName={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              price={vehicle.price}
              isDarkMode={isDarkMode}
            />
            <div
              className={`p-6 rounded-xl border ${                isDarkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white/50 border-gray-200"
              } backdrop-blur-sm`}
            >
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Información Adicional
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Categoría
                  </span>
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {vehicle.category}
                  </span>
                </div>
                {vehicle.subcategory && (
                  <div className="flex justify-between items-center">
                    <span
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Subcategoría
                    </span>
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {vehicle.subcategory}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Estado
                  </span>
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {translatedStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Publicado
                  </span>
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {formatDate(vehicle.createdAt)}
                  </span>
                </div>
                {vehicle.views !== undefined && (
                  <div className="flex justify-between items-center">
                    <span
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Visitas
                    </span>
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {vehicle.views}
                    </span>
                  </div>
                )}
                {vehicle.loadCapacity && (
                  <div className="flex justify-between items-center">
                    <span
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Capacidad de carga
                    </span>
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {vehicle.loadCapacity} kg
                    </span>
                  </div>
                )}
              </div>
            </div>
            {vehicle.warranty !== WarrantyType.NO_WARRANTY && (
              <div
                className={`p-6 rounded-xl border ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/50 border-gray-200"
                } backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-green-500" />
                  <h3
                    className={`text-xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Garantía Incluida
                  </h3>
                </div>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Este vehículo incluye {translatedWarranty.toLowerCase()}.
                </p>
              </div>
            )}
          </div>
        </div>

        <SimilarVehicles vehicles={similarVehicles} isLoading={isLoadingSimilar} />

      </div>
    </div>
  );
};

export default VehicleDetail;
