//src/components/features/vehicles/compare/CompareView.tsx
"use client";

import { useRouter } from "next/navigation";
import { useCompareVehicles } from "@/hooks/useCompareVehicles";
import LoadingSkeleton from "@/components/shared/feedback/LoadingSkeleton";
import ErrorMessage from "@/components/shared/feedback/ErrorMessage";
import CompareTable from "@/components/features/vehicles/compare/CompareTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Vortex } from "@/components/ui/vortex";
import { motion } from "framer-motion";

export default function CompareView() {
  const router = useRouter();
  const { vehicles, loading, error } = useCompareVehicles();

  if (loading) {
    // Asumimos que LoadingSkeleton está adaptado para usar los colores del tema
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <ErrorMessage
          error={error}
          handleRetry={() => router.refresh()} // Lógica de reintento simple
          isLoading={false}
          retryCount={0}
        />
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-12 px-4">
        <div className="rounded-xl overflow-hidden mb-8 bg-slate-100 dark:bg-slate-900">
          <Vortex
            particleCount={200}
            rangeY={80}
            baseHue={220}
            className="flex items-center flex-col justify-center px-4 py-10 w-full h-full"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:text-white dark:bg-none"
            >
              {`Comparando ${vehicles.length} Vehículo${
                vehicles.length !== 1 ? "s" : ""
              }`}
            </motion.h1>
          </Vortex>
        </div>

        <div className="flex justify-end mb-8">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la lista
          </Button>
        </div>

        {vehicles.length > 0 ? (
          <CompareTable vehicles={vehicles} />
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">
              No se encontraron los vehículos seleccionados.
            </p>
            <p className="text-muted-foreground">
              Intenta volver y seleccionar los vehículos de nuevo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}