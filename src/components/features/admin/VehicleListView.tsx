// src/components/features/admin/VehicleListView.tsx
// ✅ OPTIMIZADO: eliminado framer-motion + AnimatePresence completamente.
//    Tenía motion.div en cada fila × N vehículos + repeat:Infinity en estado vacío.
//    Reemplazado por CSS transitions + animate-fade-in con delay escalonado.

"use client";

import Image from "next/image";
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
  TrendingUp,
  ArrowUpRight,
  Clock,
  User,
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
}) => {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
        <div className="p-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6 group hover:scale-105 transition-transform duration-300">
          <Car className="w-16 h-16 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-3 font-heading text-gradient-primary">
          No hay vehículos
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md text-center">
          No se encontraron vehículos con los filtros seleccionados. Intenta
          ajustar los filtros o recargar la página.
        </p>
        <Button className="btn-primary">
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Ajustar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {vehicles.map((vehicle, index) => (
        <div
          key={vehicle._id}
          className="animate-fade-in"
          style={{
            animationDelay: `${Math.min(index * 60, 400)}ms`,
            animationFillMode: "both",
          }}
        >
          <Card
            id={vehicle._id}
            className={`shadow-lg border-0 overflow-hidden card-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              selectedVehicles.has(vehicle._id!) ? "ring-2 ring-primary" : ""
            }`}
          >
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50" />

            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col space-y-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg hover:scale-110 transition-transform duration-200">
                      <Checkbox
                        checked={selectedVehicles.has(vehicle._id!)}
                        onCheckedChange={() => onToggleSelection(vehicle._id!)}
                        aria-label="Seleccionar vehículo"
                      />
                    </div>
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
                  {/* Imagen */}
                  <div className="relative w-full lg:w-64 h-48 lg:h-40 overflow-hidden rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 group">
                    <Image
                      src={
                        vehicle.images && vehicle.images.length > 0
                          ? vehicle.images[0]
                          : "/placeholder.svg?height=200&width=300"
                      }
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {vehicle.images && vehicle.images.length > 1 && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="gap-1 border border-primary-foreground/20 badge-premium">
                          <FileText className="w-3 h-3" />
                          {vehicle.images.length}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4">
                    {/* Precio y vistas */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-success/5 border border-success/20 hover:scale-[1.05] transition-transform duration-200">
                        <DollarSign className="w-4 h-4 text-success" />
                        <span className="font-semibold text-lg text-success">
                          ${vehicle.price.toLocaleString()}
                        </span>
                      </div>
                      {vehicle.views && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20 hover:scale-[1.05] transition-transform duration-200">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground">
                            {vehicle.views > 1000
                              ? `${Math.floor(vehicle.views / 1000)}k`
                              : vehicle.views}{" "}
                            vistas
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Características */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { icon: <Gauge className="w-4 h-4 text-primary" />, text: `${vehicle.mileage ? vehicle.mileage.toLocaleString() : "N/A"} km` },
                        { icon: <MapPin className="w-4 h-4 text-destructive" />, text: vehicle.location || "No especificada" },
                        { icon: <Palette className="w-4 h-4 text-primary" />, text: vehicle.color || "No especificado" },
                        { icon: <Settings className="w-4 h-4 text-primary" />, text: vehicle.transmission || "No especificado" },
                        { icon: <Fuel className="w-4 h-4 text-orange-600" />, text: vehicle.fuelType || "No especificado" },
                        { icon: <CalendarDays className="w-4 h-4 text-accent" />, text: vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : "N/A" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/50 hover:scale-[1.02] transition-transform duration-200"
                        >
                          {item.icon}
                          <span className="text-sm text-foreground line-clamp-1">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Descripción */}
                    {vehicle.description && (
                      <div className="p-3 rounded-lg bg-muted/10 border border-border/30">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {vehicle.description}
                        </p>
                      </div>
                    )}

                    {/* Vendedor */}
                    <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 via-transparent to-primary/10 border border-border/50">
                      <h4 className="font-semibold mb-3 text-sm font-heading flex items-center gap-2 text-foreground">
                        <User className="w-4 h-4 text-accent" />
                        Información del vendedor
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          {vehicle.sellerContact?.name || "No especificado"}
                        </p>
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
                    </div>

                    {/* Comprobante de pago */}
                    {(vehicle.paymentProof || vehicle.referenceNumber) && (
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
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
                            <PdfViewer url={vehicle.paymentProof} vehicleId={vehicle._id!} />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Motivo de rechazo */}
                    {vehicle.status === "rejected" && vehicle.rejectionReason && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <h4 className="font-semibold text-sm text-destructive mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Motivo del Rechazo:
                        </h4>
                        <p className="text-sm text-destructive/90">
                          {vehicle.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón ver detalles */}
                <div className="pt-4 border-t border-border/30">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVehicleSelect(vehicle)}
                    className="w-full gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalles
                    <ArrowUpRight className="w-3 h-3 ml-auto" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};