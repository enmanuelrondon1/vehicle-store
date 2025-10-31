// src/components/features/admin/AdminPanelHeader.tsx
// VERSIÓN CON DISEÑO MEJORADO - Notificaciones 100% responsive y visibles

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
  Bell,
  Filter,
  Search,
  Users
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
    <Card className={`shadow-md border-border/50 hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* ========== FILA 1: TÍTULO Y NOTIFICACIONES ========== */}
          <div className="flex items-start justify-between gap-3">
            {/* Título y descripción */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 animate-in fade-in duration-500 flex-1 min-w-0">
              <div className="p-2 sm:p-2.5 md:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 ring-1 ring-primary/20 transition-all hover:scale-105 flex-shrink-0">
                <Shield className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-primary drop-shadow-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-heading font-bold text-foreground tracking-tight leading-tight">
                  Gestión Central
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed hidden sm:block">
                  Controla vehículos, usuarios y analíticas en tiempo real
                </p>
              </div>
            </div>

            {/* Campana de notificaciones - SIEMPRE VISIBLE */}
            <div className="flex-shrink-0">
              <NotificationBell
                onNotificationClick={setVehicleFromNotification}
              />
            </div>
          </div>

          {/* ========== FILA 2: BOTONES DE ACCIÓN ========== */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Botón de Actualizar */}
            <Button
              onClick={fetchVehicles}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="gap-1.5 sm:gap-2 flex-1 sm:flex-none transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="text-xs sm:text-sm">Actualizar</span>
            </Button>

            {/* Botón de Exportar */}
            <Button
              onClick={exportData}
              variant="outline"
              size="sm"
              className="gap-1.5 sm:gap-2 flex-1 sm:flex-none transition-all hover:scale-105"
            >
              <Download className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
              <span className="text-xs sm:text-sm">Exportar</span>
            </Button>

            {/* Botón de Dashboard */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1.5 sm:gap-2 flex-1 sm:flex-none transition-all hover:scale-105"
            >
              <Link 
                href="/adminPanel/dashboard"
                className="flex items-center justify-center"
              >
                <BarChart2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
                <span className="text-xs sm:text-sm">Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* ========== BARRA DE ESTADO ========== */}
        <div className="pt-3 sm:pt-4 md:pt-6 border-t border-border/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Badges de estado */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Badge 
                variant="secondary" 
                className="gap-1 text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors whitespace-nowrap"
              >
                <Car className="w-3 h-3 shrink-0" />
                <span className="hidden xs:inline">Vehículos Activos</span>
                <span className="xs:hidden">Vehículos</span>
              </Badge>
              <Badge 
                variant="secondary" 
                className="gap-1 text-xs bg-muted/50 text-muted-foreground border-border hover:bg-muted/70 transition-colors whitespace-nowrap"
              >
                <Users className="w-3 h-3 shrink-0" />
                <span className="hidden xs:inline">Gestión de Usuarios</span>
                <span className="xs:hidden">Usuarios</span>
              </Badge>
              <Badge 
                variant="secondary" 
                className="gap-1 text-xs bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors whitespace-nowrap"
              >
                <BarChart2 className="w-3 h-3 shrink-0" />
                <span className="hidden xs:inline">Analíticas en Tiempo Real</span>
                <span className="xs:hidden">Analíticas</span>
              </Badge>
            </div>
            
            {/* Estado del sistema */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
              {isLoading ? (
                <div className="flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span className="whitespace-nowrap">Actualizando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="whitespace-nowrap">Sistema en línea</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}