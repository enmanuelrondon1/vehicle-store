// src/components/features/admin/EditVehiclePage/PremiumLoadingState.tsx

import { Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PremiumLoadingState() {
  return (
    <div className="relative p-1 animate-fade-in">
      {/* Efecto de brillo de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl animate-pulse-glow"></div>
      
      <Card className="card-glass relative overflow-hidden">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        
        <CardContent className="flex items-center justify-center min-h-[600px] relative z-10">
          <div className="text-center space-y-8">
            {/* Icono animado */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative animate-float">
                <div className="p-8 bg-gradient-to-br from-primary via-accent to-primary rounded-3xl shadow-2xl">
                  <Car className="w-20 h-20 text-primary-foreground animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Texto de carga */}
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-3xl font-black text-gradient">Cargando vehículo...</p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Estamos recuperando toda la información del vehículo. Esto solo tomará un momento.
              </p>
            </div>
            
            {/* Indicadores de progreso animados */}
            <div className="flex justify-center items-center gap-3 pt-4">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-accent rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-success rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}