// src/components/features/admin/EditVehiclePage/PremiumErrorState.tsx

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PremiumErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

export function PremiumErrorState({ error, onRetry }: PremiumErrorStateProps) {
  return (
    <div className="relative p-1 animate-fade-in">
      {/* Efecto de brillo de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 via-destructive/10 to-destructive/20 rounded-3xl blur-2xl animate-pulse"></div>
      
      <Card className="card-glass border-destructive/30 relative overflow-hidden">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#ff000008_25%,transparent_25%,transparent_75%,#ff000008_75%,#ff000008),linear-gradient(45deg,#ff000008_25%,transparent_25%,transparent_75%,#ff000008_75%,#ff000008)] bg-[size:24px_24px] bg-[position:0_0,12px_12px]"></div>
        </div>
        
        <CardContent className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-8 relative z-10">
          {/* Icono de error animado */}
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative p-8 bg-destructive/10 rounded-3xl border-2 border-destructive/30 shadow-xl">
              <AlertCircle className="w-20 h-20 text-destructive animate-pulse" />
            </div>
          </div>
          
          {/* Mensajes de error */}
          <div className="space-y-4 max-w-lg">
            <p className="text-3xl font-black text-destructive">Oops, algo salió mal</p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {error}
            </p>
            <p className="text-sm text-muted-foreground/70">
              Por favor, intenta recargar la página o verifica tu conexión a internet.
            </p>
          </div>
          
          {/* Botón de reintentar */}
          <Button 
            onClick={onRetry} 
            className="btn-accent min-w-[200px] shadow-xl hover:shadow-2xl"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reintentar Carga
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}