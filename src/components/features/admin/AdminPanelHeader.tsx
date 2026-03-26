// src/components/features/admin/AdminPanelHeader.tsx
// ✅ OPTIMIZADO: eliminado framer-motion completamente.
//    Tenía motion.div con animate={{ scale:[1,1.2,1] }} repeat:Infinity en 2 lugares
//    y whileHover en 6 botones/badges — todos registrando JS listeners.
//    Reemplazado por CSS transitions + animate-fade-in + group-hover.

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  RefreshCw,
  Download,
  BarChart2,
  Shield,
  Users,
  Zap,
  ArrowUpRight,
  Settings,
  Database,
} from "lucide-react";
import { NotificationBell } from "../../shared/notifications/NotificationBell";
import type { VehicleDataFrontend } from "@/types/types";

interface AdminPanelHeaderProps {
  isLoading: boolean;
  exportData: () => void;
  fetchVehicles: () => void;
  setVehicleFromNotification: (vehicle: VehicleDataFrontend | null) => void;
  className?: string;
}

export const AdminPanelHeader = ({
  isLoading,
  exportData,
  fetchVehicles,
  setVehicleFromNotification,
  className = "",
}: AdminPanelHeaderProps) => {
  return (
    <div className="relative z-10 animate-fade-in">
      <Card className={`shadow-xl border-0 card-glass ${className}`}>
        {/* Efectos de brillo superior */}
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50" />

        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4 sm:gap-6">

            {/* FILA 1: TÍTULO Y NOTIFICACIONES */}
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {/* ✅ whileHover + animate repeat:Infinity → group-hover CSS */}
                <div className="relative group">
                  <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 ring-4 ring-primary/10 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                    <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                  </div>
                  {/* ✅ animate-ping CSS en lugar de motion.div animate scale repeat:Infinity */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary/30 rounded-full animate-ping" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-gradient-primary">
                    Gestión Central
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed hidden sm:block">
                    Controla vehículos, usuarios y analíticas en tiempo real
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <NotificationBell
                  onNotificationClick={setVehicleFromNotification}
                />
              </div>
            </div>

            {/* FILA 2: BOTONES DE ACCIÓN */}
            {/* ✅ motion.div whileHover/whileTap → hover:scale-[1.02] active:scale-[0.98] CSS */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={fetchVehicles}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="flex-1 sm:flex-none gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Actualizar</span>
              </Button>

              <Button
                onClick={exportData}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none gap-2 border-accent/30 hover:border-accent hover:bg-accent/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none gap-2 border-success/30 hover:border-success hover:bg-success/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Link
                  href="/adminPanel/dashboard"
                  className="flex items-center justify-center"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Dashboard</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none gap-2 border-muted-foreground/30 hover:border-muted-foreground hover:bg-muted-foreground/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Configuración</span>
              </Button>
            </div>
          </div>

          {/* BARRA DE ESTADO */}
          <div className="pt-4 sm:pt-6 border-t border-border/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* ✅ motion.div whileHover → hover:scale-[1.05] CSS */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="gap-2 text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:scale-[1.05] transition-all duration-200 whitespace-nowrap px-3 py-1.5"
                >
                  <Car className="w-3 h-3" />
                  <span className="hidden xs:inline">Vehículos Activos</span>
                  <span className="xs:hidden">Vehículos</span>
                </Badge>

                <Badge
                  variant="secondary"
                  className="gap-2 text-xs bg-muted/50 text-muted-foreground border-border hover:bg-muted/70 hover:scale-[1.05] transition-all duration-200 whitespace-nowrap px-3 py-1.5"
                >
                  <Users className="w-3 h-3" />
                  <span className="hidden xs:inline">Gestión de Usuarios</span>
                  <span className="xs:hidden">Usuarios</span>
                </Badge>

                <Badge
                  variant="secondary"
                  className="gap-2 text-xs bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 hover:scale-[1.05] transition-all duration-200 whitespace-nowrap px-3 py-1.5"
                >
                  <BarChart2 className="w-3 h-3" />
                  <span className="hidden xs:inline">Analíticas en Tiempo Real</span>
                  <span className="xs:hidden">Analíticas</span>
                </Badge>

                <Badge
                  variant="secondary"
                  className="gap-2 text-xs bg-success/10 text-success border-success/20 hover:bg-success/20 hover:scale-[1.05] transition-all duration-200 whitespace-nowrap px-3 py-1.5"
                >
                  <Database className="w-3 h-3" />
                  <span className="hidden xs:inline">Base de Datos</span>
                  <span className="xs:hidden">BD</span>
                </Badge>
              </div>

              {/* Estado del sistema */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="whitespace-nowrap">Actualizando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      {/* ✅ animate-ping CSS en lugar de motion.div animate scale repeat:Infinity */}
                      <span className="absolute inset-0 w-3 h-3 bg-primary rounded-full animate-ping opacity-75" />
                    </div>
                    <span className="whitespace-nowrap">Sistema en línea</span>
                    <Badge variant="outline" className="ml-1 badge-premium text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};