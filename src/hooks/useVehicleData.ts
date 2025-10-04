//src/hooks/useVehicleData.ts
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  VehicleDataFrontend,
} from "@/types/types";
import {
  formatPrice,
  translateValue,
  STATUS_MAP,
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
  WARRANTY_LABELS,
} from "@/lib/utils";
import { toast } from "sonner";

export function useVehicleData(vehicleId: string) {
  // const { data: session } = useSession();
  const [vehicle, setVehicle] = useState<VehicleDataFrontend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [similarVehicles, setSimilarVehicles] = useState<VehicleDataFrontend[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);

  const fetchVehicle = useCallback(async () => {
    // Reset states for refetch
    setError(null);
    setIsLoading(true);
    setVehicle(null);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Error ${response.status}` }));
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.error || "No se pudieron obtener los datos del vehículo.");
      }

      const vehicleData = result.data;
      setVehicle(vehicleData);
      setIsFavorited(vehicleData.isFavorited || false);

      try {
        const viewApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/views`;
        const viewResponse = await fetch(viewApiUrl, { method: 'POST' });
        if (viewResponse.ok) {
          const updatedData = await viewResponse.json();
          if (updatedData.success && typeof updatedData.data?.views === 'number') {
            setVehicle(prev => prev ? { ...prev, views: updatedData.data.views } : null);
          }
        }
      } catch (viewError) {
        console.warn("No se pudo incrementar la vista, pero la página se muestra:", viewError);
      }
    } catch (error) {
      console.error("❌ Error obteniendo vehículo:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
          const result = await response.json();
          if (result.success) {
            setSimilarVehicles(result.data);
          }
        } catch (err) {
          console.error("Error fetching similar vehicles:", err);
          setSimilarVehicles([]);
        } finally {
          setIsLoadingSimilar(false);
        }
      };
      fetchSimilar();
    }
  }, [vehicle]);

  const handleShare = async () => {
    if (!vehicle) return;
    const shareData = {
      title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      text: `Mira este ${vehicle.brand} ${vehicle.model} por ${formatPrice(vehicle.price)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado", {
        description: "La URL del vehículo se ha copiado al portapapeles.",
      })
    }
  };

  const handleReport = () => {
    toast.info("Función en desarrollo", {
      description: "La opción para reportar publicaciones estará disponible pronto.",
    })
  };

  const translatedData = useMemo(() => {
    if (!vehicle) return {};
    return {
      translatedCondition: translateValue(vehicle.condition, VEHICLE_CONDITIONS_LABELS),
      translatedFuelType: translateValue(vehicle.fuelType, FUEL_TYPES_LABELS),
      translatedTransmission: translateValue(vehicle.transmission, TRANSMISSION_TYPES_LABELS),
      translatedWarranty: translateValue(vehicle.warranty, WARRANTY_LABELS),
      translatedStatus: translateValue(vehicle.status, STATUS_MAP),
    };
  }, [vehicle]);

  return {
    vehicle,
    isLoading,
    error,
    isFavorited,
    setIsFavorited,
    similarVehicles,
    isLoadingSimilar,
    fetchVehicle,
    handleShare,
    handleReport,
    ...translatedData,
  };
}