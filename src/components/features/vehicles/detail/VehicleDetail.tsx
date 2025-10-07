// src/components/features/vehicles/detail/VehicleDetail.tsx
"use client";

import React, { useEffect, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDarkMode } from "@/context/DarkModeContext";
import { formatDate, formatMileage, DOCUMENTATION_MAP } from "@/lib/utils";
import { Documentation } from "@/types/types";
import { useVehicleData } from "@/hooks/useVehicleData";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { VehicleDocumentation } from "./sections/VehicleDocumentation";
import { VehicleFeatures } from "./sections/VehicleFeatures";
import { VehicleDescription } from "./sections/VehicleDescription";
import { ContactInfo } from "./sections/ContactInfo";
import { VehicleAdditionalInfo } from "./sections/VehicleAdditionalInfo";
import { VehicleWarranty } from "./sections/VehicleWarranty";
import { VehicleActions } from "./sections/VehicleActions";
import { VehicleSummary } from "./sections/VehicleSummary";
import { ImageGallery } from "./sections/ImageGallery";
import { TechnicalSpecifications } from "./sections/TechnicalSpecifications";
import { FinancingModal } from "./sections/FinancingModal";

// Carga diferida para SimilarVehicles
const SimilarVehicles = lazy(() =>
  import("./sections/SimilarVehicles").then((module) => ({
    default: module.SimilarVehicles,
  }))
);

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
  const { data: session } = useSession();

  const {
    vehicle,
    isLoading,
    error,
    isFavorited,
    setIsFavorited,
    similarVehicles,
    isLoadingSimilar,
    fetchVehicle,
    handleShare,
    translatedCondition,
    translatedFuelType,
    translatedTransmission,
    translatedWarranty,
    translatedStatus,
  } = useVehicleData(vehicleId);

  useEffect(() => {
    console.log("Vehicle data in VehicleDetail:", vehicle);
  }, [vehicle]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (session && vehicle?._id) {
        try {
          const response = await fetch("/api/user/favorites");
          if (response.ok) {
            const data = await response.json();
            const favoritesSet = new Set<string>(data.favorites);
            setIsFavorited(favoritesSet.has(vehicle._id));
          }
        } catch (error) {
          console.error("Error fetching favorite status:", error);
        }
      }
    };
    checkFavoriteStatus();
  }, [session, vehicle?._id, setIsFavorited]);

  const backgroundStyle = {
    background: isDarkMode
      ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4" style={backgroundStyle}>
        <div className="max-w-7xl mx-auto">
          <Skeleton
            className={`h-8 w-32 ${
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
              <Skeleton
                className={`h-64 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                } animate-pulse rounded-xl`}
              />
            </div>
            <div className="space-y-6">
              <Skeleton
                className={`h-48 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                } animate-pulse rounded-xl`}
              />
              <Skeleton
                className={`h-32 ${
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
        {vehicle?._id && (
          <VehicleActions
            vehicleId={vehicle._id}
            isFavorited={isFavorited}
            onFavorite={() => setIsFavorited((prev) => !prev)}
            onShare={handleShare}
          />
        )}

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="lg:col-span-2 space-y-8"
            variants={itemVariants}
          >
            <VehicleSummary vehicle={vehicle} />
            <ImageGallery
              images={vehicle.images}
              vehicleName={`${vehicle.brand} ${vehicle.model}`}
            />
            <TechnicalSpecifications
              specs={[
                { label: "Marca", value: vehicle.brand },
                {
                  label: "Kilometraje",
                  value: `${formatMileage(vehicle.mileage)} km`,
                },
                { label: "Modelo", value: vehicle.model },
                { label: "Transmisión", value: translatedTransmission || "" },
                { label: "Año", value: vehicle.year },
                { label: "Combustible", value: translatedFuelType || "" },
                { label: "Condición", value: translatedCondition || "" },
                { label: "Motor", value: vehicle.engine || "N/A" },
                { label: "Color", value: vehicle.color },
                { label: "Garantía", value: translatedWarranty || "" },
                {
                  label: "Tracción",
                  value: vehicle.driveType?.toUpperCase() || "N/A",
                },
                { label: "Cilindraje", value: vehicle.displacement || "N/A" },
              ]}
            />
            <VehicleDocumentation
              documentation={(vehicle.documentation || []).map((doc) =>
                Object.values(Documentation).includes(doc as Documentation)
                  ? DOCUMENTATION_MAP[doc as Documentation]
                  : doc
              )}
            />
            <VehicleFeatures features={vehicle.features} />
            <VehicleDescription description={vehicle.description} />
          </motion.div>
          <motion.div
            className="lg:col-span-1 space-y-6 sticky top-24 self-start"
            variants={itemVariants}
          >
            <ContactInfo
              sellerContact={vehicle.sellerContact}
              vehicleName={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              price={vehicle.price}
            />
            {vehicle.offersFinancing && vehicle.financingDetails && (
              <FinancingModal
                vehiclePrice={vehicle.price}
                financingDetails={vehicle.financingDetails}
                isDarkMode={isDarkMode}
              />
            )}
            <VehicleAdditionalInfo
              items={[
                { label: "Categoría", value: vehicle.category },
                { label: "Subcategoría", value: vehicle.subcategory },
                { label: "Estado", value: translatedStatus || "" },
                { label: "Publicado", value: formatDate(vehicle.createdAt) },
                { label: "Visitas", value: vehicle.views },
                {
                  label: "Capacidad de carga",
                  value: vehicle.loadCapacity
                    ? `${vehicle.loadCapacity} kg`
                    : undefined,
                },
              ]}
            />

            <VehicleWarranty
              warranty={vehicle.warranty}
              translatedWarranty={translatedWarranty || ""}
            />
          </motion.div>
        </motion.div>

        <Suspense
          fallback={<Skeleton className="h-64 w-full mt-8 rounded-xl" />}
        >
          <SimilarVehicles
            vehicles={similarVehicles}
            isLoading={isLoadingSimilar}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default VehicleDetail;