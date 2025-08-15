import VehicleList from "@/components/features/vehicles/list/VehicleList";
import { getApprovedVehicles } from "@/lib/vehicles";

export const metadata = {
  title: "Listado de Vehículos - 1auto.market",
  description: "Explora todos los vehículos disponibles para la venta.",
};

export default async function VehicleListPage() {
  // El servidor espera a que esta función termine antes de renderizar la página.
  const initialVehicles = await getApprovedVehicles();

  // Pasamos los datos directamente como prop al componente de cliente.
  return <VehicleList initialVehicles={initialVehicles} />;
}