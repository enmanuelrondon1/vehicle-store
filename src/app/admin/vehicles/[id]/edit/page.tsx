// src/app/admin/vehicles/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// 👆 Importamos los componentes de estado que acabamos de crear. Sus rutas deben ser correctas.
import { PremiumLoadingState } from "@/components/features/admin/EditVehiclePage/PremiumLoadingState";
import { PremiumErrorState } from "@/components/features/admin/EditVehiclePage/PremiumErrorState";
import { DebugPanel } from "@/components/features/admin/EditVehiclePage/DebugPanel";

// 👆 Importamos SOLO los iconos que se usan directamente en ESTE archivo.
// Los otros como Bug, AlertCircle, etc., ahora viven dentro de sus propios componentes.
import { ArrowLeft, Car, Sparkles, RefreshCw } from "lucide-react";

import { Vehicle } from "@/types/types";
import VehicleEditForm from "@/components/features/admin/VehicleEditForm/VehicleEditForm";

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 🌟 EFECTOS DE FONDO PREMIUM */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary-10),transparent_50%)]"></div>
      </div>

      {/* 🎯 CABECERA PREMIUM CON GLASSMORPHISM */}
      <header className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-xl bg-card/80 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-success/5 pointer-events-none"></div>
        
        <div className="container-wide py-6 relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* 🎨 Título y Navegación */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="hover:bg-primary/10 hover:text-primary transition-all relative group hover:scale-110"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all blur-md"></div>
                <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:-translate-x-1" />
              </Button>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-md opacity-60 group-hover:opacity-100 animate-pulse-glow"></div>
                    <div className="relative p-2.5 bg-gradient-to-br from-primary to-accent rounded-xl shadow-xl">
                      <Car className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gradient">
                      Editar Vehículo
                    </h1>
                    <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground ml-14 font-medium">
                  Modifica y optimiza los detalles de tu publicación
                </p>
              </div>
            </div>

            {/* 🛠️ Herramientas y Debug */}
            <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
              {/* 👆 CAMBIO CLAVE: El enorme bloque de JSX del panel de debug ahora es un componente simple y reutilizable. */}
              <DebugPanel apiResponse={apiResponse} />

              {/* 🔄 Botón de reintentar premium (solo se muestra si hay un error) */}
              {error && (
                <Button 
                  onClick={fetchVehicle} 
                  variant="outline" 
                  size="sm"
                  className="border-border/50 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all hover:shadow-lg hover:-translate-y-0.5 font-semibold"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container-wide section-spacing relative z-10">
        <div className="space-y-6">
          {/* 🔄 ESTADO DE CARGA PREMIUM */}
          {isLoading && <PremiumLoadingState />}

          {/* ❌ ESTADO DE ERROR PREMIUM */}
          {error && <PremiumErrorState error={error} onRetry={fetchVehicle} />}

          {/* ✅ FORMULARIO PREMIUM */}
          {vehicle && !isLoading && !error && (
            <div className="animate-slide-up">
              <VehicleEditForm vehicle={vehicle} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}