//src/components/features/vehicles/compare/CompareView.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompareVehicles } from "@/hooks/useCompareVehicles";
import LoadingSkeleton from "@/components/shared/feedback/LoadingSkeleton";
import ErrorMessage from "@/components/shared/feedback/ErrorMessage";
import CompareTable from "@/components/features/vehicles/compare/CompareTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GitCompare } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function CompareView() {
  const router = useRouter();
  const { vehicles, loading, error } = useCompareVehicles();
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-4xl p-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-8 pb-16 px-4 mt-16 md:mt-16">
        <div className="max-w-7xl mx-auto">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <ErrorMessage
                error={error}
                handleRetry={() => router.refresh()}
                isLoading={false}
                retryCount={0}
              />
              <Button onClick={() => router.back()} className="mt-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-4 pb-8 px-4 mt-16 md:mt-16 antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header simplificado pero profesional */}
        <Card className="shadow-sm border-0 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2">
                  <GitCompare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-heading">
                    Comparación de Vehículos
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {vehicles.length} vehículo{vehicles.length !== 1 ? "s" : ""} seleccionado{vehicles.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="sm"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Control para resaltar diferencias */}
        {vehicles.length > 0 && (
            <div className="flex items-center justify-end space-x-2">
                <Label htmlFor="highlight-differences" className="text-sm font-medium">
                    Resaltar solo diferencias
                </Label>
                <Switch
                    id="highlight-differences"
                    checked={highlightDifferences}
                    onCheckedChange={setHighlightDifferences}
                />
            </div>
        )}

        {/* Tabla de comparación o mensaje de vacío */}
        {vehicles.length > 0 ? (
          <Card className="shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <CompareTable
                  vehicles={vehicles}
                  highlightDifferences={highlightDifferences}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 px-6"
          >
            <Card className="max-w-md mx-auto shadow-sm">
              <CardContent className="p-8 space-y-4">
                <div className="inline-flex items-center justify-center rounded-full bg-muted p-3">
                  <GitCompare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold">
                  No hay vehículos para comparar
                </h2>
                <p className="text-muted-foreground">
                  Parece que no has seleccionado ningún vehículo. Vuelve a la lista
                  y elige los que quieras comparar.
                </p>
                <Button onClick={() => router.push("/vehicleList")} className="mt-4">
                  Explorar vehículos
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}