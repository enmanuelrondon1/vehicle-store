// src/hooks/useVehicleData.ts
// ✅ FIX RENDIMIENTO: vistas como fire-and-forget (no bloquean el render)
// ✅ FIX RENDIMIENTO: similares se cargan en paralelo con el vehículo principal
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { VehicleDataFrontend } from "@/types/types";
import {
  formatPrice, translateValue, STATUS_MAP,
  VEHICLE_CONDITIONS_LABELS, FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS, WARRANTY_LABELS,
} from "@/lib/utils";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export function useVehicleData(vehicleId: string) {
  const [vehicle, setVehicle] = useState<VehicleDataFrontend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [similarVehicles, setSimilarVehicles] = useState<VehicleDataFrontend[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);

  const fetchVehicle = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    setVehicle(null);

    try {
      const response = await fetch(`${BASE_URL}/api/vehicles/${vehicleId}`, {
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

      // ✅ FIX: vistas como fire-and-forget — no bloquea el render del vehículo
      // ANTES: await fetch(...views) bloqueaba hasta recibir respuesta
      // AHORA: se lanza sin await, el componente ya renderiza mientras esto ocurre
      fetch(`${BASE_URL}/api/vehicles/${vehicleId}/views`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && typeof data.data?.views === "number") {
            setVehicle((prev) => prev ? { ...prev, views: data.data.views } : null);
          }
        })
        .catch((err) => console.warn("No se pudo incrementar la vista:", err));

      // ✅ FIX: similares se cargan en paralelo — no esperan al await del vehículo
      // ANTES: fetchSimilar se disparaba en un useEffect separado que esperaba
      //        a que vehicle?._id existiera (dos renders después)
      // AHORA: se lanza inmediatamente con el id que ya tenemos
      setIsLoadingSimilar(true);
      fetch(`${BASE_URL}/api/vehicles/${vehicleData._id}/similar`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setSimilarVehicles(data.data);
        })
        .catch((err) => console.error("Error fetching similar vehicles:", err))
        .finally(() => setIsLoadingSimilar(false));

    } catch (error) {
      console.error("❌ Error obteniendo vehículo:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  const handleShare = async () => {
    if (!vehicle) return;
    const shareData = {
      title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      text: `Mira este ${vehicle.brand} ${vehicle.model} por ${formatPrice(vehicle.price)}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); }
      catch (error) { console.log("Error sharing:", error); }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado", {
        description: "La URL del vehículo se ha copiado al portapapeles.",
      });
    }
  };

  const handleReport = () => {
    toast.info("Función en desarrollo", {
      description: "La opción para reportar publicaciones estará disponible pronto.",
    });
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
    vehicle, isLoading, error, isFavorited, setIsFavorited,
    similarVehicles, isLoadingSimilar, fetchVehicle,
    handleShare, handleReport,
    ...translatedData,
  };
}