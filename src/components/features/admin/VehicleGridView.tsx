// src/components/features/admin/VehicleGridView.tsx
"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, DollarSign, Gauge, MapPin, Car, CalendarDays } from "lucide-react"
import { VehicleDataFrontend, ApprovalStatus } from "@/types/types"
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
}: VehicleGridViewProps) => {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay vehículos</h3>
        <p className="text-muted-foreground">
          No se encontraron vehículos con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle._id}
          className={`
            bg-card border
            hover:shadow-lg transition-all duration-200 hover:scale-105
            ${selectedVehicles.has(vehicle._id!) ? "ring-2 ring-primary" : ""}
          `}
        >
          <CardContent className="p-4">
            {/* Imagen */}
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg bg-muted">
              <Image
                src={
                  vehicle.images[0] || "/placeholder.svg?height=200&width=300"
                }
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedVehicles.has(vehicle._id!)}
                  onCheckedChange={() => onToggleSelection(vehicle._id!)}
                  aria-label="Seleccionar vehículo"
                />
              </div>
              {vehicle.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  +{vehicle.images.length - 1}
                </div>
              )}
              <div className="absolute bottom-2 left-2">
                <StatusBadge status={vehicle.status} />
              </div>
            </div>

            {/* Información básica */}
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
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
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    ${vehicle.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gauge className="w-4 h-4 text-primary" />
                  <span>{vehicle.mileage.toLocaleString()} km</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-destructive" />
                  <span className="line-clamp-1">{vehicle.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  <span>
                    {vehicle.createdAt
                      ? new Date(vehicle.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-2 pt-2 border-t">
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