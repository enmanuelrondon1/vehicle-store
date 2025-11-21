// src/components/features/admin/VehicleGridView.tsx - BADGES VISIBLES Y PROFESIONALES

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  DollarSign,
  Gauge,
  MapPin,
  Car,
  CalendarDays,
  Image as ImageIcon,
  Star,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { VehicleDataFrontend, ApprovalStatus } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "./shared/StatusBadge";
import { VehicleActions } from "./VehicleActions";

interface VehicleGridViewProps {
  vehicles: VehicleDataFrontend[];
  onStatusChange: (vehicleId: string, status: ApprovalStatus) => void;
  onVehicleSelect: (vehicle: VehicleDataFrontend) => void;
  selectedVehicles: Set<string>;
  onToggleSelection: (id: string) => void;
  onShowRejectDialog: (vehicle: VehicleDataFrontend) => void;
  onShowCommentDialog: (vehicle: VehicleDataFrontend) => void;
  onShowHistoryDialog: (vehicle: VehicleDataFrontend) => void;
  onShowDeleteDialog: (vehicle: VehicleDataFrontend) => void;
  onGoToEditPage: (vehicleId: string) => void;
}

export const VehicleGridView: React.FC<VehicleGridViewProps> = ({
  vehicles,
  onStatusChange,
  onVehicleSelect,
  selectedVehicles,
  onToggleSelection,
  onShowRejectDialog,
  onShowCommentDialog,
  onShowHistoryDialog,
  onShowDeleteDialog,
  onGoToEditPage,
}: VehicleGridViewProps) => {
  if (vehicles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.3 }}
          className="p-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6 relative"
        >
          <Car className="w-16 h-16 text-primary" />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <h3 className="text-2xl font-bold mb-3 font-heading text-gradient-primary">
          No hay vehículos
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md text-center">
          No se encontraron vehículos con los filtros seleccionados. Intenta ajustar los filtros o recargar la página.
        </p>
        <Button className="btn-primary">
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Ajustar filtros
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle, index) => (
        <motion.div
          key={vehicle._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card
            className={`shadow-lg border-0 overflow-hidden card-glass h-full transition-all duration-300 ${
              selectedVehicles.has(vehicle._id!) ? "ring-2 ring-primary" : ""
            }`}
          >
            {/* Efectos de brillo superior */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50" />
            
            <div className="relative">
              {/* Imagen mejorada */}
              <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-muted/20 to-muted/10">
                <Image
                  src={
                    vehicle.images && vehicle.images.length > 0 
                      ? vehicle.images[0] 
                      : "/placeholder.svg?height=200&width=300"
                  }
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                
                {/* Overlay oscuro para mejor contraste de badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Checkbox de selección mejorado - MOVIDO A TOP-RIGHT */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="absolute top-3 right-3 z-10"
                >
                  <div className="p-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg">
                    <Checkbox
                      checked={selectedVehicles.has(vehicle._id!)}
                      onCheckedChange={() => onToggleSelection(vehicle._id!)}
                      aria-label="Seleccionar vehículo"
                    />
                  </div>
                </motion.div>
                
                {/* Indicador de imágenes adicionales - TOP-LEFT */}
                {vehicle.images && vehicle.images.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="absolute top-3 left-3 z-10"
                  >
                    <Badge className="gap-1 border border-primary-foreground/20 badge-premium">
                      <ImageIcon className="w-3 h-3" />
                      {vehicle.images.length}
                    </Badge>
                  </motion.div>
                )}
                
                {/* ✨ BADGE DE ESTADO - BOTTOM-LEFT - MÁS GRANDE Y VISIBLE */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="absolute bottom-3 left-3 z-20"
                >
                  <StatusBadge status={vehicle.status} size="md" />
                </motion.div>
                
                {/* Indicadores adicionales - BOTTOM-RIGHT */}
                <div className="absolute bottom-3 right-3 flex flex-col gap-2 items-end z-10">
                  {/* Indicador de vistas */}
                  {vehicle.views && vehicle.views > 100 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg">
                        <TrendingUp className="w-3 h-3" />
                        {vehicle.views > 1000 ? `${Math.floor(vehicle.views / 1000)}k` : vehicle.views}
                      </Badge>
                    </motion.div>
                  )}
                  
                  {/* Indicador de destacado */}
                  {vehicle.features && Array.isArray(vehicle.features) && vehicle.features.includes("featured") && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <Badge className="gap-1 border border-primary-foreground/20 badge-premium">
                        <Star className="w-3 h-3 fill-current" />
                        Destacado
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="p-5">
              {/* Información básica mejorada */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg font-heading line-clamp-1 text-foreground">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.year}
                    </p>
                  </div>
                  <VehicleActions
                    vehicle={vehicle}
                    onVehicleSelect={onVehicleSelect}
                    onStatusChange={onStatusChange}
                    onShowRejectDialog={onShowRejectDialog}
                    onShowCommentDialog={onShowCommentDialog}
                    onShowHistoryDialog={() => onShowHistoryDialog(vehicle)}
                    onShowDeleteDialog={onShowDeleteDialog}
                    onGoToEditPage={() => onGoToEditPage(vehicle._id!)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Precio mejorado */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-success/5 border border-success/20"
                  >
                    <DollarSign className="w-4 h-4 text-success" />
                    <span className="font-semibold text-sm text-success">
                      ${vehicle.price.toLocaleString()}
                    </span>
                  </motion.div>

                  {/* Kilometraje mejorado */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <Gauge className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">
                      {vehicle.mileage ? vehicle.mileage.toLocaleString() : "N/A"} km
                    </span>
                  </motion.div>

                  {/* Ubicación mejorada */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-destructive/5 border border-destructive/20 col-span-2"
                  >
                    <MapPin className="w-4 h-4 text-destructive" />
                    <span className="text-sm text-foreground line-clamp-1">
                      {vehicle.location || "No especificada"}
                    </span>
                  </motion.div>

                  {/* Fecha de creación mejorada */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-accent/5 border border-accent/20 col-span-2"
                  >
                    <CalendarDays className="w-4 h-4 text-accent" />
                    <span className="text-sm text-foreground">
                      {vehicle.createdAt
                        ? new Date(vehicle.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Botón de ver detalles mejorado */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4 border-t border-border/30 mt-4"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onVehicleSelect(vehicle)}
                  className="w-full gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalles
                  <ArrowUpRight className="w-3 h-3 ml-auto" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};