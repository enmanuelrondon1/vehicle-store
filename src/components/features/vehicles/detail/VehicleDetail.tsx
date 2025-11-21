// src/components/features/vehicles/detail/VehicleDetail.tsx
"use client";

// ========================================
// React y Core
// ========================================
import React, { useEffect, Suspense, lazy, useRef } from "react";
import { useRouter } from "next/navigation";

// ========================================
// Third-party Libraries
// ========================================
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

// ========================================
// Hooks y Tipos Internos
// ========================================
import { useVehicleData } from "@/hooks/useVehicleData";
import { useMatchHeight } from "@/hooks/useMatchHeight";
import { formatDate, formatMileage, DOCUMENTATION_MAP } from "@/lib/utils";
import { Documentation } from "@/types/types";

// ========================================
// Componentes de UI
// ========================================
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ========================================
// Componentes de la Página (ordenados por renderizado)
// ========================================
import { VehicleActions } from "./sections/VehicleActions";
import { VehicleSummary } from "./sections/VehicleSummary";
import { ImageGallery } from "./sections/ImageGallery";
import { TechnicalSpecifications } from "./sections/TechnicalSpecifications";
import { VehicleDocumentation } from "./sections/VehicleDocumentation";
import { VehicleFeatures } from "./sections/VehicleFeatures";
import { VehicleDescription } from "./sections/VehicleDescription";
import { ContactInfo } from "./sections/ContactInfo";
import { FinancingModal } from "./sections/FinancingModal";
import { VehicleAdditionalInfo } from "./sections/VehicleAdditionalInfo";
import { VehicleWarranty } from "./sections/VehicleWarranty";

// Carga diferida para SimilarVehicles
const SimilarVehicles = lazy(() =>
  import("./sections/SimilarVehicles").then((module) => ({
    default: module.SimilarVehicles,
  }))
);

// ========================================
// Configuración y Tipos
// ========================================
// Extiende el tipo Session para incluir accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

// Componente principal
const VehicleDetail: React.FC<{ vehicleId: string }> = ({ vehicleId }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const sidebarRef = useRef<HTMLDivElement>(null);

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

  useMatchHeight("main-content-column", sidebarRef);

  useEffect(() => {
    // console.log("Vehicle data in VehicleDetail:", vehicle);
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

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-32 bg-muted animate-pulse rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-muted animate-pulse rounded-xl mb-6" />
              <Skeleton className="h-64 bg-muted animate-pulse rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 bg-muted animate-pulse rounded-xl" />
              <Skeleton className="h-32 bg-muted animate-pulse rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen py-8 px-4 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-8 rounded-2xl backdrop-blur-sm bg-card/30 border border-border shadow-2xl">
            <div className="text-6xl mb-6">😔</div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              {error === "Vehículo no encontrado"
                ? "Vehículo no encontrado"
                : "Error al cargar"}
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              {error || "No se pudo cargar la información del vehículo"}
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.back()} className="gap-2">
                <ArrowLeft className="w-5 h-5" />
                Volver
              </Button>
              <Button variant="secondary" onClick={fetchVehicle}>
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {vehicle?._id && (
          <div
            data-aos="fade-down"
            data-aos-duration="600"
            data-aos-delay="100"
          >
            <VehicleActions
              vehicleId={vehicle._id}
              isFavorited={isFavorited}
              onFavorite={() => setIsFavorited((prev) => !prev)}
              onShare={handleShare}
            />
          </div>
        )}

        {/* Grid principal con items-start para alinear ambas columnas arriba */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:items-start">
          {/* Columna principal de contenido */}
          <div id="main-content-column" className="lg:col-span-2 space-y-8">
            <div
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              <VehicleSummary vehicle={vehicle} />
            </div>
            
            <div
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay="300"
            >
              <ImageGallery
                images={vehicle.images}
                vehicleName={`${vehicle.brand} ${vehicle.model}`}
              />
            </div>

            {/* ✅ CONTACTO - Solo visible en MÓVIL, justo después de las fotos */}
            <div
              className="lg:hidden"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="350"
            >
              <ContactInfo
                sellerContact={vehicle.sellerContact}
                vehicleName={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
                price={vehicle.price}
                location={vehicle.location}
              />
            </div>

            <div
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="400"
            >
              <TechnicalSpecifications
                specs={[
                  { label: "Marca", value: vehicle.brand },
                  { label: "Modelo", value: vehicle.model },
                  { label: "Año", value: vehicle.year },
                  {
                    label: "Kilometraje",
                    value: `${formatMileage(vehicle.mileage)} km`,
                  },
                  { label: "Condición", value: translatedCondition || "" },
                  { label: "Transmisión", value: translatedTransmission || "" },
                  { label: "Combustible", value: translatedFuelType || "" },
                  { label: "Motor", value: vehicle.engine || "N/A" },
                  { label: "Cilindraje", value: vehicle.displacement || "N/A" },
                  { label: "Color", value: vehicle.color },
                  { label: "Puertas", value: vehicle.doors || "N/A" },
                  { label: "Asientos", value: vehicle.seats || "N/A" },
                  {
                    label: "Tracción",
                    value: vehicle.driveType?.toUpperCase() || "N/A",
                  },
                  { label: "Garantía", value: translatedWarranty || "" },
                  { label: "VIN", value: vehicle.vin || "N/A" },
                ]}
              />
            </div>

            <div
              data-aos="fade-left"
              data-aos-duration="800"
              data-aos-delay="500"
            >
              <VehicleDocumentation
                documentation={(vehicle.documentation || []).map((doc) =>
                  Object.values(Documentation).includes(doc as Documentation)
                    ? DOCUMENTATION_MAP[doc as Documentation]
                    : doc
                )}
              />
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="800"
              data-aos-delay="600"
            >
              <VehicleFeatures features={vehicle.features} />
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="700"
            >
              <VehicleDescription description={vehicle.description} />
            </div>
          </div>

          {/* ✅ Sidebar - Visible en desktop, incluye ContactInfo */}
          <div ref={sidebarRef} className="hidden lg:block lg:col-span-1 space-y-6">
            {/* ✅ CONTACTO - Solo visible en DESKTOP */}
            <div
              data-aos="fade-left"
              data-aos-duration="800"
              data-aos-delay="800"
            >
              <ContactInfo
                sellerContact={vehicle.sellerContact}
                vehicleName={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
                price={vehicle.price}
                location={vehicle.location}
              />
            </div>
            
            {vehicle.offersFinancing && vehicle.financingDetails && (
              <div
                data-aos="fade-left"
                data-aos-duration="800"
                data-aos-delay="900"
              >
                <FinancingModal
                  vehiclePrice={vehicle.price}
                  financingDetails={vehicle.financingDetails}
                />
              </div>
            )}
            <div
              data-aos="fade-left"
              data-aos-duration="800"
              data-aos-delay="1000"
            >
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
            </div>
            <div
              data-aos="fade-left"
              data-aos-duration="800"
              data-aos-delay="1100"
            >
              <VehicleWarranty
                warranty={vehicle.warranty}
                translatedWarranty={translatedWarranty || ""}
              />
            </div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="1200">
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
    </div>
  );
};

export default VehicleDetail;