// src/components/features/admin/states/AdminPanelAccessDenied.tsx
// VERSIÓN CON DISEÑO UNIFICADO

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, ShieldOff, AlertTriangle } from "lucide-react";

export const AdminPanelAccessDenied = () => {
  const handleGoHome = () => {
    // Aquí puedes agregar la lógica de navegación, por ejemplo:
    // window.location.href = '/';
    // o usar el hook de router de Next.js:
    // router.push('/');
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
        {/* ========== ENCABEZADO MEJORADO ========== */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-destructive to-destructive/80 ring-4 ring-destructive/10">
              <ShieldOff className="w-7 h-7 text-destructive-foreground" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
                Acceso Denegado
              </h2>
              <p className="text-base text-muted-foreground mt-0.5">
                No tienes los permisos necesarios para esta sección
              </p>
            </div>
          </div>
        </div>

        {/* ========== TARJETA PRINCIPAL ========== */}
        <Card className="shadow-sm border-border">
          <CardHeader className="text-center pb-4">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl font-heading">
              Permisos Insuficientes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-center space-y-6">
            <p className="text-muted-foreground">
              Tu cuenta actual no tiene privilegios de administrador para acceder al Panel de Administración. Esta área está restringida para garantizar la seguridad y la integridad de la plataforma.
            </p>

            {/* ========== SECCIÓN DE CONSEJOS ========== */}
            <div className="p-5 rounded-xl border-2 border-destructive/20 bg-destructive/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-3">
                    ¿Qué puedes hacer?
                  </h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5 font-bold">•</span>
                      <span>
                        Contacta al administrador principal si crees que esto es un error.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5 font-bold">•</span>
                      <span>
                        Verifica si has iniciado sesión con la cuenta correcta.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5 font-bold">•</span>
                      <span>
                        Regresa a la página principal para continuar navegando.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ========== BOTÓN DE ACCIÓN ========== */}
            <Button onClick={handleGoHome} className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Ir a la Página Principal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};