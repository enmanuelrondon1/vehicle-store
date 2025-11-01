// src/components/features/admin/VehicleGridView.tsx
// VERSIÓN CON DISEÑO UNIFICADO

"use client";

import Image from "next/image";
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
  CheckCircle2,
  AlertCircle,
  XCircle,
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

export const VehicleGridView = ({
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
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="p-4 rounded-full bg-muted/50 mb-4">
          <Car className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          No hay vehículos
        </h3>
        <p className="text-muted-foreground text-center max-w-md">
          No se encontraron vehículos con los filtros seleccionados. Intenta ajustar los filtros o recargar la página.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle._id}
          className={`shadow-sm border-border overflow-hidden transition-all duration-200 hover:shadow-md ${
            selectedVehicles.has(vehicle._id!) ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="relative">
            {/* Imagen */}
            <div className="relative w-full h-48 overflow-hidden bg-muted">
              <Image
                src={
                  vehicle.images[0] || "/placeholder.svg?height=200&width=300"
                }
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              
              {/* Checkbox de selección */}
              <div className="absolute top-3 left-3 z-10">
                <div className="p-1 rounded-md bg-background/90 backdrop-blur-sm border border-border">
                  <Checkbox
                    checked={selectedVehicles.has(vehicle._id!)}
                    onCheckedChange={() => onToggleSelection(vehicle._id!)}
                    aria-label="Seleccionar vehículo"
                  />
                </div>
              </div>
              
              {/* Indicador de imágenes adicionales */}
              {vehicle.images.length > 1 && (
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur-sm">
                    <ImageIcon className="w-3 h-3" />
                    {vehicle.images.length}
                  </Badge>
                </div>
              )}
              
              {/* Badge de estado */}
              <div className="absolute bottom-3 left-3">
                <StatusBadge status={vehicle.status} />
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Información básica */}
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg line-clamp-1 text-foreground">
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

              <div className="space-y-2">
                {/* Precio */}
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-lg text-green-600">
                    ${vehicle.price.toLocaleString()}
                  </span>
                </div>

                {/* Kilometraje */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Gauge className="w-4 h-4 text-primary" />
                  <span className="text-sm">{vehicle.mileage.toLocaleString()} km</span>
                </div>

                {/* Ubicación */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-destructive" />
                  <span className="text-sm line-clamp-1">{vehicle.location}</span>
                </div>

                {/* Fecha de creación */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">
                    {vehicle.createdAt
                      ? new Date(vehicle.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Botón de ver detalles */}
              <div className="pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onVehicleSelect(vehicle)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver detalles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};