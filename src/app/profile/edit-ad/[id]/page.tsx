//src/app/profile/edit-ad/[id]/page.tsx
import { getVehicleById } from "@/lib/actions/vehicle.actions";
import { notFound } from "next/navigation";
import { EditFinancingForm } from "./_components/EditFinancingForm";

interface EditAdPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAdPage({ params }: EditAdPageProps) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2 dark:text-white">Editar Anuncio</h1>
      <p className="text-muted-foreground mb-8 dark:text-gray-400">
        Modifica los detalles de financiación de tu vehículo: {vehicle.brand} {vehicle.model}.
      </p>
      
      {/* Aquí irá el formulario para editar la financiación */}
      <EditFinancingForm vehicle={vehicle} />

    </div>
  );
}