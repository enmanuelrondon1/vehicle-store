// src/hooks/useCompareVehicles.ts
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Vehicle } from "@/types/types";

export function useCompareVehicles() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      const vehicleIds = searchParams.getAll("vehicles");

      if (vehicleIds.length === 0) {
        setError("No se han seleccionado vehículos para comparar.");
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams();
        vehicleIds.forEach((id) => params.append("vehicles", id));

        const response = await fetch(
          `/api/vehicles/batch?${params.toString()}`
        );
        const result = await response.json();

        if (result.success) {
          setVehicles(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch vehicles");
        }
      } catch (e: unknown) {
        const errorMessage =
          e instanceof Error
            ? e.message
            : "Error al cargar los datos de los vehículos.";
        setError(errorMessage);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams]);

  return { vehicles, loading, error };
}