// src/app/vehicleList/page.tsx
// ✅ ISR: regenera cada 60s en background
// ✅ Carga solo 48 vehículos iniciales + conteo total separado

import VehicleList from "@/components/features/vehicles/list/VehicleList";
import { getApprovedVehicles, getApprovedVehiclesCount } from "@/lib/vehicles";
import { logger } from "@/lib/logger";
import type { Vehicle } from "@/types/types";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/feedback/LoadingSkeleton";

export const revalidate = 60;

export default async function VehicleListPage() {
  let initialVehicles: Vehicle[] = [];
  let totalVehiclesCount = 0;

  try {
    // ✅ Ambas queries en paralelo — no esperan una a la otra
    const [vehiclesFromDB, count] = await Promise.all([
      getApprovedVehicles(48),      // solo 48 vehículos con proyección
      getApprovedVehiclesCount(),   // conteo total sin traer documentos
    ]);

    initialVehicles = JSON.parse(JSON.stringify(vehiclesFromDB));
    totalVehiclesCount = count;
  } catch (error) {
    logger.error("Failed to fetch initial vehicles:", error);
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <VehicleList
        initialVehicles={initialVehicles}
        totalVehiclesCount={totalVehiclesCount}
      />
    </Suspense>
  );
}