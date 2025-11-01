// src/components/features/admin/VehicleListView.tsx

"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  onClearSelection: () => void;
  onStatusChange: (id: string, status: ApprovalStatus, reason?: string) => void;
  onVehicleSelect: (vehicle: VehicleDataFrontend) => void;
  onShowRejectDialog: (vehicle: VehicleDataFrontend) => void;
  onShowCommentDialog: (vehicle: VehicleDataFrontend) => void;
  onShowHistoryDialog: (vehicle: VehicleDataFrontend) => void;
  onShowDeleteDialog: (vehicle: VehicleDataFrontend) => void;
  onGoToEditPage: (vehicleId: string) => void;
}

export const VehicleListView = ({
  vehicles,
  selectedVehicles,
  onToggleSelection,
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
      <div className="text-center py-8 md:py-12">
        <Car className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-base md:text-lg font-semibold mb-2">
          No hay vehículos
        </h3>
        <p className="text-muted-foreground text-sm md:text-base px-4">
          No se encontraron vehículos con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle._id}
          id={vehicle._id} // Añadimos el ID para el anclaje
          className={`
            bg-card border
            hover:shadow-lg transition-all duration-200
            ${selectedVehicles.has(vehicle._id!) ? "ring-2 ring-primary" : ""}
          `}
        >
          <CardContent className="p-3 md:p-6">
            <div className="flex flex-col space-y-4">
              {/* Header móvil con checkbox y estado */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedVehicles.has(vehicle._id!)}
                    onCheckedChange={() => onToggleSelection(vehicle._id!)}
                  />
                  <h3 className="text-base md:text-xl font-bold line-clamp-1">
                    {vehicle.brand} {vehicle.model} ({vehicle.year})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={vehicle.status} />
                  <div className="hidden md:flex items-center justify-end space-x-2">
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
                <div className="relative w-full lg:w-64 h-48 lg:h-40 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                  <Image
                    src={
                      vehicle.images[0] ||
                      "/placeholder.svg?height=200&width=300"
                    }
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className="object-cover"
                  />
                  {vehicle.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      +{vehicle.images.length - 1} fotos
                    </div>
                  )}
                </div>

                {/* Información del vehículo */}
                <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                      <span className="font-semibold">
                        ${vehicle.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Gauge className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                      <span>{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-1 sm:col-span-2 lg:col-span-1 text-muted-foreground">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-destructive" />
                      <span className="truncate">{vehicle.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Palette className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                      <span>{vehicle.color}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Settings className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="truncate">{vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Fuel className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
                      <span>{vehicle.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      <span>
                        {vehicle.createdAt
                          ? new Date(vehicle.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {vehicle.status === "rejected" && vehicle.rejectionReason && (
                    <div className="mt-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                      <h4 className="font-semibold text-destructive text-sm mb-1">
                        Motivo del Rechazo:
                      </h4>
                      <p className="text-destructive/90 text-xs md:text-sm">
                        {vehicle.rejectionReason}
                      </p>
                    </div>
                  )}

                  {vehicle.description && (
                    <p className="text-muted-foreground line-clamp-2 text-sm md:text-base break-words">
                      {vehicle.description}
                    </p>
                  )}

                  {/* Información del vendedor */}
                  <div className="bg-accent p-3 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm md:text-base">
                      Información del vendedor:
                    </h4>
                    <div className="space-y-1 text-xs md:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {vehicle.sellerContact.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">
                          {vehicle.sellerContact.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span>{vehicle.sellerContact.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comprobante de pago y Referencia */}
                  {(vehicle.paymentProof || vehicle.referenceNumber) && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg space-y-4">
                      {vehicle.referenceNumber && (
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium whitespace-nowrap">
                            Referencia:
                          </span>
                          <span className="text-sm font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded truncate">
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
                  )}

                  {/* Acciones rápidas - Desktop */}
                  <div className="hidden sm:flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onVehicleSelect(vehicle)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver detalles
                    </Button>

                    {/* Estado PENDIENTE (Inactivo) */}
                    {vehicle.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onStatusChange(
                              vehicle._id!,
                              "approved" as ApprovalStatus
                            )
                          }
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                          <Power className="w-4 h-4 mr-2" />
                          Activar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onShowRejectDialog(vehicle)}
                          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Archivar
                        </Button>
                      </>
                    )}

                    {/* Estado APROBADO (Activo) */}
                    {vehicle.status === "approved" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onStatusChange(
                              vehicle._id!,
                              "pending" as ApprovalStatus
                            )
                          }
                          className="border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
                        >
                          <PowerOff className="w-4 h-4 mr-2" />
                          Desactivar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onShowRejectDialog(vehicle)}
                          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Archivar
                        </Button>
                      </>
                    )}

                    {/* Estado RECHAZADO (Archivado) */}
                    {vehicle.status === "rejected" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onStatusChange(
                              vehicle._id!,
                              "approved" as ApprovalStatus
                            )
                          }
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                          <Power className="w-4 h-4 mr-2" />
                          Activar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onStatusChange(
                              vehicle._id!,
                              "pending" as ApprovalStatus
                            )
                          }
                          className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          <PowerOff className="w-4 h-4 mr-2" />
                          Mover a Inactivo
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
