// src/components/features/vehicles/detail/VehicleDetail.tsx 
"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDarkMode } from "@/context/DarkModeContext";
import { formatDate, formatMileage, DOCUMENTATION_MAP } from "@/lib/utils";
import { Documentation } from "@/types/types";
import { useVehicleData } from "@/hooks/useVehicleData";
import { SimilarVehicles } from "./sections/SimilarVehicles";
import { ImageGallery } from "./sections/ImageGallery";
import { ContactInfo } from "./sections/ContactInfo";
import { VehicleActions } from "./sections/VehicleActions";
import { VehicleSummary } from "./sections/VehicleSummary";
import { TechnicalSpecifications } from "./sections/TechnicalSpecifications";
import { VehicleDocumentation } from "./sections/VehicleDocumentation";
import { VehicleFeatures } from "./sections/VehicleFeatures";
import { VehicleDescription } from "./sections/VehicleDescription";
import { VehicleAdditionalInfo } from "./sections/VehicleAdditionalInfo";
import { VehicleWarranty } from "./sections/VehicleWarranty";

// Extiende el tipo Session para incluir accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

// Componente principal
const VehicleDetail: React.FC<{ vehicleId: string }> = ({ vehicleId }) => {
  const { isDarkMode } = useDarkMode();
  const router = useRouter();

  const {
    vehicle,
    isLoading,
    error,
    isFavorited,
    similarVehicles,
    isLoadingSimilar,
    fetchVehicle,
    handleShare,
    handleFavorite,
    handleReport,
    translatedCondition,
    translatedFuelType,
    translatedTransmission,
    translatedWarranty,
    translatedStatus,
  } = useVehicleData(vehicleId);

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

  return (
    <div className="min-h-screen py-8 px-4" style={backgroundStyle}>
      <div className="max-w-7xl mx-auto">
        <VehicleActions
          isFavorited={isFavorited}
          onFavorite={handleFavorite}
          onShare={handleShare}
          onReport={handleReport}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <VehicleSummary vehicle={vehicle} />
            <ImageGallery
              images={vehicle.images}
              vehicleName={`${vehicle.brand} ${vehicle.model}`}
            />
            <TechnicalSpecifications
              specs={[
                { label: "Marca", value: vehicle.brand },
                { label: "Kilometraje", value: `${formatMileage(vehicle.mileage)} km` },
                { label: "Modelo", value: vehicle.model },
                { label: "Transmisión", value: translatedTransmission || '' },
                { label: "Año", value: vehicle.year },
                { label: "Combustible", value: translatedFuelType || '' },
                { label: "Condición", value: translatedCondition || '' },
                { label: "Motor", value: vehicle.engine || 'N/A' },
                { label: "Color", value: vehicle.color },
                { label: "Garantía", value: translatedWarranty || '' },
                { label: "Tracción", value: vehicle.driveType?.toUpperCase() || 'N/A' },
                { label: "Cilindraje", value: vehicle.displacement || 'N/A' },
              ]}
            />
            <VehicleDocumentation
              documentation={(vehicle.documentation || []).map(doc => Object.values(Documentation).includes(doc as Documentation) ? DOCUMENTATION_MAP[doc as Documentation] : doc)}
            />
            <VehicleFeatures features={vehicle.features} />
            <VehicleDescription description={vehicle.description} />
          </div>
          <div className="space-y-6">
            <ContactInfo
              sellerContact={vehicle.sellerContact}
              vehicleName={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              price={vehicle.price}
            />
            <VehicleAdditionalInfo
              items={[
                { label: "Categoría", value: vehicle.category },
                { label: "Subcategoría", value: vehicle.subcategory },
                { label: "Estado", value: translatedStatus || '' },
                { label: "Publicado", value: formatDate(vehicle.createdAt) },
                { label: "Visitas", value: vehicle.views },
                { label: "Capacidad de carga", value: vehicle.loadCapacity ? `${vehicle.loadCapacity} kg` : undefined },
              ]}
            />
            <VehicleWarranty
              warranty={vehicle.warranty}
              translatedWarranty={translatedWarranty || ''}
            />
          </div>
        </div>

        <SimilarVehicles vehicles={similarVehicles} isLoading={isLoadingSimilar} />

      </div>
    </div>
  );
};

export default VehicleDetail;