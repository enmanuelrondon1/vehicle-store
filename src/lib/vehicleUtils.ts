// src/lib/vehicleUtils.ts
import { AdminPanelFilters } from "@/hooks/use-admin-panel-enhanced";
import type { VehicleDataFrontend } from "@/types/types"; // Asegúrate de importar los tipos correctos

export const filterVehicles = (
  vehicles: VehicleDataFrontend[],
  filters: AdminPanelFilters
): VehicleDataFrontend[] => {
  return vehicles.filter((vehicle) => {
    const statusMatch =
      filters.status === "all" || vehicle.status === filters.status;
    const categoryMatch =
      filters.category.length === 0 || filters.category.includes(vehicle.category);
    const searchMatch =
      !filters.search ||
      `${vehicle.brand} ${vehicle.model} ${vehicle.year} ${vehicle.sellerContact?.name || ''} ${vehicle.sellerContact?.email || ''} ${vehicle.referenceNumber || ""}`
        .toLowerCase()
        .includes(filters.search.toLowerCase());
    const priceMatch =
      vehicle.price >= filters.priceRange[0] &&
      vehicle.price <= filters.priceRange[1];

    return statusMatch && categoryMatch && searchMatch && priceMatch;
  });
};