// src/components/features/admin/states/AdminPanelLoading.tsx
// VERSIÓN CON DISEÑO UNIFICADO

import React from "react";
import { Loader2, Shield } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const AdminPanelLoading = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
        {/* ========== ENCABEZADO MEJORADO ========== */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
                Panel de Administración
              </h2>
              <p className="text-base text-muted-foreground mt-0.5">
                Cargando datos del sistema...
              </p>
            </div>
          </div>
        </div>

        {/* ========== TARJETA DE CARGA ========== */}
        <Card className="shadow-sm border-border">
          <CardHeader className="text-center pb-4">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Inicializando panel
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Por favor, espera un momento mientras cargamos la información
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Barra de progreso indeterminada */}
              <Progress value={undefined} className="h-2" />
              
              {/* Estados de carga simulados */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Verificando permisos</span>
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cargando vehículos</span>
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Preparando interfaz</span>
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========== TARJETAS DE ESQUELETO ========== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-sm border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                    <div className="h-6 bg-muted rounded w-12 animate-pulse"></div>
                  </div>
                  <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ========== TARJETA DE CONTENIDO PRINCIPAL ========== */}
        <Card className="shadow-sm border-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Esqueleto de filtros */}
              <div className="h-10 bg-muted rounded-lg animate-pulse"></div>
              
              {/* Esqueleto de tabla */}
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 border-b border-border">
                    <div className="w-4 h-4 bg-muted rounded animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};