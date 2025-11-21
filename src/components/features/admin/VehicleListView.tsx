// src/components/features/admin/VehicleListView.tsx
// VERSIÓN CON DISEÑO PREMIUM

"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Gauge,
  Palette,
  Settings,
  Fuel,
  Car,
  FileText,
  CalendarDays,
  Power,
  PowerOff,
  Archive,
  Zap,
  TrendingUp,
  Star,
  ArrowUpRight,
  MoreHorizontal,
  Clock,
  User,
  Shield,
} from "lucide-react";
import type { VehicleDataFrontend, ApprovalStatus } from "@/types/types";
import { PdfViewer } from "../payment/pdf-viewer";
import { StatusBadge } from "./shared/StatusBadge";
import { VehicleActions } from "./VehicleActions";
import { MobileActionSheet } from "./MobileActionSheet";

interface VehicleListViewProps {
  vehicles: VehicleDataFrontend[];
  selectedVehicles: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onStatusChange: (id: string, status: ApprovalStatus, reason?: string) => void;
  onVehicleSelect: (vehicle: VehicleDataFrontend) => void;
  onShowRejectDialog: (vehicle: VehicleDataFrontend) => void;
  onShowCommentDialog: (vehicle: VehicleDataFrontend) => void;
  onShowHistoryDialog: (vehicle: VehicleDataFrontend) => void;
  onShowDeleteDialog: (vehicle: VehicleDataFrontend) => void;
  onGoToEditPage: (vehicleId: string) => void;
}

export const VehicleListView: React.FC<VehicleListViewProps> = ({
  vehicles,
  selectedVehicles,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onStatusChange,
  onVehicleSelect,
  onShowRejectDialog,
  onShowCommentDialog,
  onShowHistoryDialog,
  onShowDeleteDialog,
  onGoToEditPage,
}: VehicleListViewProps) => {
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
          ></motion.div>
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
    <div className="space-y-4 md:space-y-6">
      {vehicles.map((vehicle, index) => (
        <motion.div
          key={vehicle._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card
            id={vehicle._id}
            className={`shadow-lg border-0 overflow-hidden card-glass transition-all duration-300 ${
              selectedVehicles.has(vehicle._id!) ? "ring-2 ring-primary" : ""
            }`}
          >
            {/* Efectos de brillo superior */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
            
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col space-y-4">
                {/* Header con checkbox y estado */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                      className="p-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg"
                    >
                      <Checkbox
                        checked={selectedVehicles.has(vehicle._id!)}
                        onCheckedChange={() => onToggleSelection(vehicle._id!)}
                        aria-label="Seleccionar vehículo"
                      />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold font-heading line-clamp-1 text-foreground">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={vehicle.status} size="md" />
                    <div className="hidden md:flex items-center justify-end">
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
                    {/* Acciones para móvil */}
                    <div className="md:hidden">
                      <MobileActionSheet
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
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  {/* Imagen del vehículo */}
                  <div className="relative w-full lg:w-64 h-48 lg:h-40 overflow-hidden rounded-xl bg-gradient-to-br from-muted/20 to-muted/10">
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
                    
                    {/* Efecto de brillo en hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Indicador de imágenes adicionales */}
                    {vehicle.images && vehicle.images.length > 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="absolute top-3 right-3 z-10"
                      >
                        <Badge className="gap-1 border border-primary-foreground/20 badge-premium">
                          <FileText className="w-3 h-3" />
                          {vehicle.images.length}
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Información del vehículo */}
                  <div className="flex-1 space-y-4">
                    {/* Precio y estado */}
                    <div className="flex flex-wrap items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-success/5 border border-success/20"
                      >
                        <DollarSign className="w-4 h-4 text-success" />
                        <span className="font-semibold text-lg text-success">
                          ${vehicle.price.toLocaleString()}
                        </span>
                      </motion.div>
                      
                      {vehicle.views && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20"
                        >
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground">
                            {vehicle.views > 1000 ? `${Math.floor(vehicle.views / 1000)}k` : vehicle.views} vistas
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Características principales */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <Gauge className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">
                          {vehicle.mileage ? vehicle.mileage.toLocaleString() : "N/A"} km
                        </span>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <MapPin className="w-4 h-4 text-destructive" />
                        <span className="text-sm text-foreground line-clamp-1">
                          {vehicle.location || "No especificada"}
                        </span>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <Palette className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">
                          {vehicle.color || "No especificado"}
                        </span>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <Settings className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground line-clamp-1">
                          {vehicle.transmission || "No especificado"}
                        </span>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <Fuel className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-foreground">
                          {vehicle.fuelType || "No especificado"}
                        </span>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <CalendarDays className="w-4 h-4 text-accent" />
                        <span className="text-sm text-foreground">
                          {vehicle.createdAt
                            ? new Date(vehicle.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </motion.div>
                    </div>

                    {/* Descripción */}
                    {vehicle.description && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="p-3 rounded-lg bg-muted/10 border border-border/30"
                      >
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {vehicle.description}
                        </p>
                      </motion.div>
                    )}

                    {/* Información del vendedor */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="p-4 rounded-lg bg-gradient-to-br from-accent/10 via-transparent to-primary/10 border border-border/50"
                    >
                      <h4 className="font-semibold mb-3 text-sm font-heading flex items-center gap-2 text-foreground">
                        <User className="w-4 h-4 text-accent" />
                        Información del vendedor
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {vehicle.sellerContact?.name || "No especificado"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground truncate">
                            {vehicle.sellerContact?.email || "No especificado"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {vehicle.sellerContact?.phone || "No especificado"}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Comprobante de pago y Referencia */}
                    {(vehicle.paymentProof || vehicle.referenceNumber) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      >
                        <div className="space-y-3">
                          {vehicle.referenceNumber && (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-medium text-blue-900 dark:text-blue-100 whitespace-nowrap">
                                Referencia:
                              </span>
                              <span className="text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded truncate">
                                {vehicle.referenceNumber}
                              </span>
                            </div>
                          )}
                          {vehicle.paymentProof && (
                            <div>
                              <PdfViewer
                                url={vehicle.paymentProof}
                                vehicleId={vehicle._id!}
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Motivo de rechazo */}
                    {vehicle.status === "rejected" && vehicle.rejectionReason && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                      >
                        <h4 className="font-semibold text-sm text-destructive mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Motivo del Rechazo:
                        </h4>
                        <p className="text-sm text-destructive/90">
                          {vehicle.rejectionReason}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Botón de ver detalles */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4 border-t border-border/30"
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
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// Componente de ayuda para la información
const InfoPill = ({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
}) => (
  <div
    className={
      "flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/50 " +
      className
    }
  >
    {icon}
    <span className="text-foreground line-clamp-1">{label}</span>
  </div>
);