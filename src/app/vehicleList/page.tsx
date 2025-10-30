//src/app/vehicleList/page.tsx

import VehicleList from "@/components/features/vehicles/list/VehicleList";
import { getApprovedVehicles } from "@/lib/vehicles";
import { logger } from "@/lib/logger";
import type { Vehicle } from "@/types/types";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/feedback/LoadingSkeleton";

export const dynamic = "force-dynamic";

export default async function VehicleListPage() {
  let initialVehicles: Vehicle[] = [];
  try {
    const vehiclesFromDB = await getApprovedVehicles();
    // ✅ CORRECCIÓN: Serializar los datos para convertirlos en objetos planos
    initialVehicles = JSON.parse(JSON.stringify(vehiclesFromDB));
  } catch (error) {
    logger.error("Failed to fetch initial vehicles:", error);
  }
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <VehicleList initialVehicles={initialVehicles} />
    </Suspense>
  );
}