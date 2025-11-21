// src/components/features/admin/AdminPanelHeader.tsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10"
    >
      <Card className={`shadow-xl border-0 card-glass ${className}`}>
        {/* Efectos de brillo superior */}
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
        
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* ========== FILA 1: TÍTULO Y NOTIFICACIONES ========== */}
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              {/* Título y descripción */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 ring-4 ring-primary/10 shimmer-effect flex-shrink-0">
                    <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-primary/20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-gradient-primary">
                    Gestión Central
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed hidden sm:block">
                    Controla vehículos, usuarios y analíticas en tiempo real
                  </p>
                </div>
              </motion.div>

              {/* Campana de notificaciones - SIEMPRE VISIBLE */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-shrink-0"
              >
                <NotificationBell
                  onNotificationClick={setVehicleFromNotification}
                />
              </motion.div>
            </div>

            {/* ========== FILA 2: BOTONES DE ACCIÓN ========== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3"
            >
              {/* Botón de Actualizar */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none"
              >
                <Button
                  onClick={fetchVehicles}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="w-full sm:w-auto gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <motion.div
                    animate={{ rotate: isLoading ? 360 : 0 }}
                    transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                  <span>Actualizar</span>
                </Button>
              </motion.div>

              {/* Botón de Exportar */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none"
              >
                <Button
                  onClick={exportData}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto gap-2 border-accent/30 hover:border-accent hover:bg-accent/10 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </Button>
              </motion.div>

              {/* Botón de Dashboard */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none"
              >
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto gap-2 border-success/30 hover:border-success hover:bg-success/10 transition-all"
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
              </motion.div>

              {/* Botón de Configuración (nuevo) */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto gap-2 border-muted-foreground/30 hover:border-muted-foreground hover:bg-muted-foreground/10 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Configuración</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* ========== BARRA DE ESTADO MEJORADA ========== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-4 sm:pt-6 border-t border-border/30"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Badges de estado mejorados */}
              <div className="flex flex-wrap items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="gap-2 text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors whitespace-nowrap px-3 py-1.5"
                  >
                    <Car className="w-3 h-3" />
                    <span className="hidden xs:inline">Vehículos Activos</span>
                    <span className="xs:hidden">Vehículos</span>
                  </Badge>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="gap-2 text-xs bg-muted/50 text-muted-foreground border-border hover:bg-muted/70 transition-colors whitespace-nowrap px-3 py-1.5"
                  >
                    <Users className="w-3 h-3" />
                    <span className="hidden xs:inline">Gestión de Usuarios</span>
                    <span className="xs:hidden">Usuarios</span>
                  </Badge>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="gap-2 text-xs bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors whitespace-nowrap px-3 py-1.5"
                  >
                    <BarChart2 className="w-3 h-3" />
                    <span className="hidden xs:inline">Analíticas en Tiempo Real</span>
                    <span className="xs:hidden">Analíticas</span>
                  </Badge>
                </motion.div>

                {/* Nuevo badge de Base de Datos */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="gap-2 text-xs bg-success/10 text-success border-success/20 hover:bg-success/20 transition-colors whitespace-nowrap px-3 py-1.5"
                  >
                    <Database className="w-3 h-3" />
                    <span className="hidden xs:inline">Base de Datos</span>
                    <span className="xs:hidden">BD</span>
                  </Badge>
                </motion.div>
              </div>
              
              {/* Estado del sistema mejorado */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                    <span className="whitespace-nowrap">Actualizando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <motion.div
                        className="absolute inset-0 w-3 h-3 bg-primary rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
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
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};