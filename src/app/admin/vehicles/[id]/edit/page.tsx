// src/app/admin/vehicles/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, RefreshCw, Bug, ChevronDown } from "lucide-react"; // Añadimos ChevronDown
import { Vehicle } from "@/types/types";
import VehicleEditForm from "@/components/features/admin/VehicleEditForm/VehicleEditForm";

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null); // 🐛 Para debug

  const fetchVehicle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/vehicles/${id}`);
      const result = await response.json();
      
      if (response.ok && result.data) {
        setApiResponse(result);
        setVehicle(result.data);
      } else {
        setError(result.error || "No se pudo cargar el vehículo.");
        setVehicle(null);
      }
    } catch (err) {
      console.error("💥 Error en el catch:", err);
      setError("Error de conexión. Inténtalo de nuevo.");
      setVehicle(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      {/* CABECERA CON PANEL DE DEBUG INTEGRADO */}
      <header className="border-b bg-card">
        <div className="container-max section-padding">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Título y Controles Principales */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-heading tracking-tight">Editar Vehículo</h1>
                <p className="text-sm text-muted-foreground">Modifica los detalles del vehículo seleccionado.</p>
              </div>
            </div>

            {/* Sección de Herramientas (Debug y Reintentar) */}
            <div className="flex items-center gap-4">
              {/* PANEL DE DEBUG COLAPSABLE */}
              {apiResponse && (
                <details className="group relative">
                  <summary className="flex items-center gap-2 cursor-pointer text-sm font-mono bg-muted/50 hover:bg-muted border border-border rounded-md px-3 py-2 transition-colors list-none">
                    <Bug className="w-4 h-4" />
                    <span>Debug API</span>
                    <ChevronDown className="w-3 h-3 ml-1 transition-transform group-open:rotate-180" />
                  </summary>
                  {/* Contenido del Popover */}
                  <div className="absolute z-20 mt-2 p-4 bg-popover border border-border rounded-md shadow-lg w-[90vw] sm:w-96 left-0 sm:left-auto sm:right-0">
                    <div className="space-y-1 text-xs font-mono">
                      <div><span className="text-muted-foreground">ID:</span> <span className="text-foreground">{apiResponse.data?._id}</span></div>
                      <div><span className="text-muted-foreground">Vehículo:</span> <span className="text-foreground">{apiResponse.data?.brand} {apiResponse.data?.model} ({apiResponse.data?.year})</span></div>
                      <div><span className="text-muted-foreground">Location:</span> <span className="text-foreground">"{apiResponse.data?.location}"</span></div>
                      <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{apiResponse.data?.sellerContact?.email}</span></div>
                      <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{apiResponse.data?.sellerContact?.phone}</span></div>
                      <div><span className="text-muted-foreground">Imágenes:</span> <span className="text-foreground">{apiResponse.data?.images?.length || 0}</span></div>
                      <div><span className="text-muted-foreground">Features:</span> <span className="text-foreground">{apiResponse.data?.features?.length || 0}</span></div>
                    </div>
                    <details className="mt-3">
                      <summary className="cursor-pointer text-primary hover:underline text-xs">Ver objeto completo</summary>
                      <pre className="mt-2 text-xs bg-card border border-border rounded-md p-3 overflow-auto max-h-60">
                        <code>{JSON.stringify(apiResponse.data, null, 2)}</code>
                      </pre>
                    </details>
                  </div>
                </details>
              )}

              {/* Botón de reintentar */}
              {error && (
                <Button onClick={fetchVehicle} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container-max section-padding">
        <div className="space-y-6">
          {/* ESTADOS DE CARGA Y ERROR */}
          {isLoading && (
            <Card className="shadow-lg border-border">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                  </div>
                  <p className="text-lg font-medium text-foreground">Cargando información del vehículo...</p>
                  <p className="text-sm text-muted-foreground">Esto solo tomará un momento.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="shadow-lg border-destructive/50 bg-destructive/5">
              <CardContent className="flex flex-col items-center justify-center h-96 text-center">
                <p className="text-lg font-medium text-destructive mb-2">Oops, algo salió mal.</p>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={fetchVehicle} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar Carga
                </Button>
              </CardContent>
            </Card>
          )}

          {/* FORMULARIO */}
          {vehicle && !isLoading && !error && <VehicleEditForm vehicle={vehicle} />}
        </div>
      </main>
    </div>
  );
}