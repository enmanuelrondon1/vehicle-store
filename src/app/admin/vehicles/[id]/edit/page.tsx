// src/app/admin/vehicles/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Vehicle } from "@/types/types";
import VehicleEditForm from "@/components/features/admin/VehicleEditForm";

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchVehicle = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/vehicles/${id}`);
          const result = await response.json();
          if (response.ok && result.data) {
            setVehicle(result.data);
          } else {
            console.error("Error fetching vehicle:", result.error || "Error desconocido");
            setVehicle(null);
          }
        } catch (error) {
          console.error("Error fetching vehicle:", error);
          setVehicle(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchVehicle();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
            Editar Vehículo
          </h2>
          <p className="text-base text-muted-foreground mt-0.5">
            Modifica los detalles del vehículo seleccionado.
          </p>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        {isLoading ? (
          <Card className="shadow-sm border-border">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                </div>
                <p className="text-muted-foreground">Cargando vehículo...</p>
              </div>
            </CardContent>
          </Card>
        ) : vehicle ? (
          <VehicleEditForm vehicle={vehicle} />
        ) : (
          <Card className="shadow-sm border-border">
            <CardContent className="flex items-center justify-center h-64">
                <p className="text-destructive">No se pudo cargar la información del vehículo.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}