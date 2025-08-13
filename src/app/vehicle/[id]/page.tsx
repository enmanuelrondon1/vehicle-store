// src/app/vehicle/[id]/page.tsx
import type { Metadata } from 'next';
import clientPromise from "@/lib/mongodb";
import { ApprovalStatus } from '@/types/types';
import { VehicleService } from "@/services/vehicleService";
import VehicleDetail from '@/components/features/vehicles/detail/VehicleDetail';

type Props = {
  params: Promise<{ id: string }>;
};

// Esta función se ejecuta en el servidor para generar los metadatos
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { id } = await params;

  try {
    const client = await clientPromise;
    const db = client.db("vehicle_store"); // Corregido: Usar el nombre de DB consistente
    const vehicleService = new VehicleService(db);
    const response = await vehicleService.getVehicleById(id, ApprovalStatus.APPROVED); // Solo generar metadata para vehículos aprobados

    if (response.success && response.data) {
      const vehicle = response.data;
      const title = `${vehicle.brand} ${vehicle.model} ${vehicle.year} en Venta`;
      const description = `Encuentra este ${vehicle.brand} ${vehicle.model} en ${vehicle.location}. Precio: $${vehicle.price.toLocaleString()}. Kilometraje: ${vehicle.mileage.toLocaleString()} km. ${vehicle.description.substring(0, 120)}...`;

      return {
        title: `${title} | AutoMarket`,
        description: description,
        openGraph: {
          title: title,
          description: description,
          images: [vehicle.images[0] || '/default-og-image.png'], // Añade una imagen por defecto en tu carpeta /public
        },
      };
    }
  } catch (error) {
    console.error("Error generando metadata:", error);
  }

  // Metadata por defecto si falla la carga o no se encuentra el vehículo
  return {
    title: 'Vehículo no encontrado | AutoMarket',
    description: 'El vehículo que buscas no está disponible o la URL es incorrecta.',
  };
}

const VehicleDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  return <VehicleDetail vehicleId={id} />;
}

export default VehicleDetailPage;