// src/components/features/vehicles/detail/VehicleDetail.tsx
// ✅ FIX: eliminados atributos data-aos — AOS fue removido del layout,
//         estos atributos eran dead code que ensuciaban el DOM sin efecto.
"use client";

import React, { useEffect, Suspense, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

import { useVehicleData } from "@/hooks/useVehicleData";
import { useMatchHeight } from "@/hooks/useMatchHeight";
import { formatDate, formatMileage, DOCUMENTATION_MAP } from "@/lib/utils";
import { Documentation } from "@/types/types";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ── CARGA INMEDIATA — visible en el fold ─────────────────────────────
import { VehicleActions } from "./sections/VehicleActions";
import { VehicleSummary } from "./sections/VehicleSummary";
import { ContactInfo } from "./sections/ContactInfo";

// ── CARGA LAZY — debajo del fold ─────────────────────────────────────
const SectionSkeleton = () => (
  <Skeleton className="h-48 w-full rounded-xl animate-pulse" />
);

// ✅ Agrégalo como lazy junto a los otros:
const ImageGallery = dynamic(
  () =>
    import("./sections/ImageGallery").then((m) => ({
      default: m.ImageGallery,
    })),
  { loading: () => <SectionSkeleton /> },
);
const TechnicalSpecifications = dynamic(
  () =>
    import("./sections/TechnicalSpecifications").then((m) => ({
      default: m.TechnicalSpecifications,
    })),
  { loading: () => <SectionSkeleton /> },
);
const VehicleDocumentation = dynamic(
  () =>
    import("./sections/VehicleDocumentation").then((m) => ({
      default: m.VehicleDocumentation,
    })),
  { loading: () => <SectionSkeleton /> },
);
const VehicleFeatures = dynamic(
  () =>
    import("./sections/VehicleFeatures").then((m) => ({
      default: m.VehicleFeatures,
    })),
  { loading: () => <SectionSkeleton /> },
);
const VehicleDescription = dynamic(
  () =>
    import("./sections/VehicleDescription").then((m) => ({
      default: m.VehicleDescription,
    })),
  { loading: () => <SectionSkeleton /> },
);
const FinancingModal = dynamic(
  () =>
    import("./sections/FinancingModal").then((m) => ({
      default: m.FinancingModal,
    })),
  { loading: () => <SectionSkeleton /> },
);
const VehicleAdditionalInfo = dynamic(
  () =>
    import("./sections/VehicleAdditionalInfo").then((m) => ({
      default: m.VehicleAdditionalInfo,
    })),
  { loading: () => <SectionSkeleton /> },
);
const VehicleWarranty = dynamic(
  () =>
    import("./sections/VehicleWarranty").then((m) => ({
      default: m.VehicleWarranty,
    })),
  { loading: () => <SectionSkeleton /> },
);
const SimilarVehicles = dynamic(
  () =>
    import("./sections/SimilarVehicles").then((m) => ({
      default: m.SimilarVehicles,
    })),
  { loading: () => <Skeleton className="h-64 w-full mt-8 rounded-xl" /> },
);

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const VehicleDetail: React.FC<{ vehicleId: string }> = ({ vehicleId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const {
    vehicle, isLoading, error, isFavorited, setIsFavorited,
    similarVehicles, isLoadingSimilar, fetchVehicle, handleShare,
    translatedCondition, translatedFuelType, translatedTransmission,
    translatedWarranty, translatedStatus,
  } = useVehicleData(vehicleId);

  useMatchHeight("main-content-column", sidebarRef);

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
              {error === "Vehículo no encontrado" ? "Vehículo no encontrado" : "Error al cargar"}
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
          <VehicleActions
            vehicleId={vehicle._id}
            isFavorited={isFavorited}
            onFavorite={() => setIsFavorited((prev) => !prev)}
            onShare={handleShare}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:items-start">

          {/* Columna principal */}
          <div id="main-content-column" className="lg:col-span-2 space-y-8">
            <VehicleSummary vehicle={vehicle} />

            <ImageGallery
              images={vehicle.images}
              vehicleName={`${vehicle.brand} ${vehicle.model}`}
            />

            {/* Contacto — solo móvil */}
            <div className="lg:hidden">
              <ContactInfo
                sellerContact={vehicle.sellerContact}
                vehicleName={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
                price={vehicle.price}
                location={vehicle.location}
              />
            </div>

            <TechnicalSpecifications
              specs={[
                { label: "Marca",         value: vehicle.brand },
                { label: "Modelo",        value: vehicle.model },
                { label: "Año",           value: vehicle.year },
                { label: "Kilometraje",   value: `${formatMileage(vehicle.mileage)} km` },
                { label: "Condición",     value: translatedCondition || "" },
                { label: "Transmisión",   value: translatedTransmission || "" },
                { label: "Combustible",   value: translatedFuelType || "" },
                { label: "Motor",         value: vehicle.engine || "N/A" },
                { label: "Cilindraje",    value: vehicle.displacement || "N/A" },
                { label: "Color",         value: vehicle.color },
                { label: "Puertas",       value: vehicle.doors || "N/A" },
                { label: "Asientos",      value: vehicle.seats || "N/A" },
                { label: "Tracción",      value: vehicle.driveType?.toUpperCase() || "N/A" },
                { label: "Garantía",      value: translatedWarranty || "" },
                { label: "VIN",           value: vehicle.vin || "N/A" },
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
          </div>

          {/* Sidebar — solo desktop */}
          <div ref={sidebarRef} className="hidden lg:block lg:col-span-1 space-y-6">
            <ContactInfo
              sellerContact={vehicle.sellerContact}
              vehicleName={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              price={vehicle.price}
              location={vehicle.location}
            />

            {vehicle.offersFinancing && vehicle.financingDetails && (
              <FinancingModal
                vehiclePrice={vehicle.price}
                financingDetails={vehicle.financingDetails}
              />
            )}

            <VehicleAdditionalInfo
              items={[
                { label: "Categoría",         value: vehicle.category },
                { label: "Subcategoría",       value: vehicle.subcategory },
                { label: "Estado",             value: translatedStatus || "" },
                { label: "Publicado",          value: formatDate(vehicle.createdAt) },
                { label: "Visitas",            value: vehicle.views },
                { label: "Capacidad de carga", value: vehicle.loadCapacity ? `${vehicle.loadCapacity} kg` : undefined },
              ]}
            />

            <VehicleWarranty
              warranty={vehicle.warranty}
              translatedWarranty={translatedWarranty || ""}
            />
          </div>
        </div>

        <Suspense fallback={<Skeleton className="h-64 w-full mt-8 rounded-xl" />}>
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