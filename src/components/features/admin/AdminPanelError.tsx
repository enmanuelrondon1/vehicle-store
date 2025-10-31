// src/components/features/admin/states/AdminPanelError.tsx
// VERSIÓN CON DISEÑO UNIFICADO

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, XCircle, RefreshCw, Home, WifiOff } from "lucide-react";

interface AdminPanelErrorProps {
  error: string;
  onRetry: () => void;
}

export const AdminPanelError = ({ error, onRetry }: AdminPanelErrorProps) => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
        {/* ========== ENCABEZADO MEJORADO ========== */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-destructive to-destructive/80 ring-4 ring-destructive/10">
              <AlertTriangle className="w-7 h-7 text-destructive-foreground" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
                Error del Sistema
              </h2>
              <p className="text-base text-muted-foreground mt-0.5">
                Ha ocurrido un problema inesperado
              </p>
            </div>
          </div>
        </div>

        {/* ========== TARJETA PRINCIPAL ========== */}
        <Card className="shadow-sm border-border">
          <CardHeader className="text-center pb-4">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl font-heading">
              No se pudo cargar el panel
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-center space-y-6">
            <p className="text-muted-foreground">
              Lamentamos las molestias. Ha ocurrido un error al intentar cargar los datos del panel de administración. Por favor, intenta nuevamente.
            </p>

            {/* ========== DETALLES DEL ERROR ========== */}
            <div className="p-4 rounded-xl border-2 border-destructive/20 bg-destructive/5 text-left">
              <div className="flex items-start gap-3">
                <WifiOff className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground mb-2">
                    Detalles del error:
                  </h3>
                  <div className="p-3 rounded-lg bg-background border border-border font-mono text-xs text-destructive break-all">
                    {error}
                  </div>
                </div>
              </div>
            </div>

            {/* ========== SECCIÓN DE CONSEJOS ========== */}
            <div className="p-5 rounded-xl border-2 border-border bg-muted/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-3">
                    ¿Qué puedes hacer?
                  </h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 font-bold">•</span>
                      <span>
                        Verifica tu conexión a internet e intenta recargar la página.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 font-bold">•</span>
                      <span>
                        Si el problema persiste, espera unos minutos y vuelve a intentarlo.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 font-bold">•</span>
                      <span>
                        Contacta al equipo de soporte si el error continúa apareciendo.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ========== BOTONES DE ACCIÓN ========== */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={onRetry} className="w-full sm:w-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
              <Button variant="outline" onClick={handleGoHome} className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Ir a la Página Principal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};