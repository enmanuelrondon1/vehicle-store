//src/app/compare/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Vehicle } from "@/types/types";
import { useDarkMode } from "@/context/DarkModeContext";
import LoadingSkeleton from "@/components/shared/feedback/LoadingSkeleton";
import ErrorMessage from "@/components/shared/feedback/ErrorMessage";
import CompareTable from "@/components/features/vehicles/compare/CompareTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function ComparePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isDarkMode } = useDarkMode();
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

  if (loading) {
    return <LoadingSkeleton isDarkMode={isDarkMode} />;
  }

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <ErrorMessage
          error={error}
          handleRetry={() => {
            /* Implement retry logic if needed */
          }}
          isLoading={false}
          retryCount={0}
          isDarkMode={isDarkMode}
        />
        <Button
          onClick={() => router.back()}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center">
            {`Comparando ${vehicles.length} Vehículo${
              vehicles.length !== 1 ? "s" : ""
            }`}
          </h1>
          <Button
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la lista
          </Button>
        </div>
        {vehicles.length > 0 ? (
          <CompareTable vehicles={vehicles} isDarkMode={isDarkMode} />
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">
              No se encontraron los vehículos seleccionados.
            </p>
            <p className="text-gray-500">
              Intenta volver y seleccionar los vehículos de nuevo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<LoadingSkeleton isDarkMode={true} />}>
      <ComparePageContent />
    </Suspense>
  );
}
