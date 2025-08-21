// src/components/features/admin/VehicleListView.tsx
"use client";

import Image from "next/image";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle,
  XCircle,
  Clock,
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
  MoreVertical,
  Trash2,
  MessageSquare,
  History,
  Download,
  FileText,
} from "lucide-react";
import type { VehicleDataFrontend, ApprovalStatus } from "@/types/types";
import { generateVehiclePdf } from "@/lib/pdfGenerator";
import { PdfViewer } from "../payment/pdf-viewer";

interface VehicleListViewProps {
  vehicles: VehicleDataFrontend[];
  selectedVehicles: Set<string>;
  isDarkMode: boolean;
  onToggleSelection: (id: string) => void;
  onClearSelection: () => void;
  onStatusChange: (id: string, status: ApprovalStatus, reason?: string) => void;
  onVehicleSelect: (vehicle: VehicleDataFrontend) => void;
  onShowRejectDialog: (id: string) => void;
  onShowCommentDialog: (id: string) => void;
  onShowHistoryDialog: (id: string) => void;
  onShowDeleteDialog: (id: string) => void;
  onBulkAction: (action: ApprovalStatus) => void;
}

const ApprovalStatusMap = {
  PENDING: "pending" as ApprovalStatus,
  APPROVED: "approved" as ApprovalStatus,
  REJECTED: "rejected" as ApprovalStatus,
};

const getStatusBadge = (status: string) => {
  const variants = {
    pending: {
      variant: "secondary" as const,
      icon: Clock,
      text: "Pendiente",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    approved: {
      variant: "default" as const,
      icon: CheckCircle,
      text: "Aprobado",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    rejected: {
      variant: "destructive" as const,
      icon: XCircle,
      text: "Rechazado",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
  };
  const config = variants[status as keyof typeof variants] || variants.pending;
  const Icon = config.icon;
  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1 text-xs ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      <span className="hidden xs:inline">{config.text}</span>
    </Badge>
  );
};

const VehicleActions = ({
  vehicle,
  onVehicleSelect,
  onStatusChange,
  onShowRejectDialog,
  onShowCommentDialog,
  onShowHistoryDialog,
  onShowDeleteDialog,
  isDarkMode,
}: { vehicle: VehicleDataFrontend; isDarkMode: boolean } & Pick<
  VehicleListViewProps,
  | "onVehicleSelect"
  | "onStatusChange"
  | "onShowRejectDialog"
  | "onShowCommentDialog"
  | "onShowHistoryDialog"
  | "onShowDeleteDialog"
>) => (
  <Menu as="div" className="relative">
    <Menu.Button as={Button} variant="ghost" size="sm" className="h-8 w-8 p-0">
      <MoreVertical className="w-4 h-4" />
    </Menu.Button>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        className={`absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => onVehicleSelect(vehicle)}
                className={`flex items-center w-full px-4 py-2 text-sm ${active ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" : "text-gray-700 dark:text-gray-300"}`}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver detalles
              </button>
            )}
          </Menu.Item>
          <hr className="border-gray-200 dark:border-gray-700" />
          {vehicle.status !== "approved" && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() =>
                    onStatusChange(vehicle._id!, ApprovalStatusMap.APPROVED)
                  }
                  className={`flex items-center w-full px-4 py-2 text-sm text-green-600 ${active ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprobar
                </button>
              )}
            </Menu.Item>
          )}
          {vehicle.status !== "pending" && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() =>
                    onStatusChange(vehicle._id!, ApprovalStatusMap.PENDING)
                  }
                  className={`flex items-center w-full px-4 py-2 text-sm text-yellow-600 ${active ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Marcar como pendiente
                </button>
              )}
            </Menu.Item>
          )}
          {vehicle.status !== "rejected" && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onShowRejectDialog(vehicle._id!)}
                  className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${active ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rechazar
                </button>
              )}
            </Menu.Item>
          )}
          <hr className="border-gray-200 dark:border-gray-700" />
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => onShowCommentDialog(vehicle._id!)}
                className={`flex items-center w-full px-4 py-2 text-sm ${active ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" : "text-gray-700 dark:text-gray-300"}`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Agregar comentario
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => onShowHistoryDialog(vehicle._id!)}
                className={`flex items-center w-full px-4 py-2 text-sm ${active ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" : "text-gray-700 dark:text-gray-300"}`}
              >
                <History className="w-4 h-4 mr-2" />
                Ver historial
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => generateVehiclePdf(vehicle)}
                className={`flex items-center w-full px-4 py-2 text-sm ${active ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" : "text-gray-700 dark:text-gray-300"}`}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </button>
            )}
          </Menu.Item>
          <hr className="border-gray-200 dark:border-gray-700" />
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => onShowDeleteDialog(vehicle._id!)}
                className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${active ? "bg-gray-100 dark:bg-gray-700" : ""}`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
);

const MobileActionSheet = ({
  vehicle,
  onStatusChange,
  onVehicleSelect,
  onShowRejectDialog,
  onShowCommentDialog,
  onShowHistoryDialog,
}: { vehicle: VehicleDataFrontend } & Pick<
  VehicleListViewProps,
  | "onStatusChange"
  | "onVehicleSelect"
  | "onShowRejectDialog"
  | "onShowCommentDialog"
  | "onShowHistoryDialog"
>) => (
  <div className="flex flex-col sm:hidden gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div className="grid grid-cols-2 gap-2">
      {vehicle.status !== "approved" && (
        <Button
          onClick={() =>
            onStatusChange(vehicle._id!, ApprovalStatusMap.APPROVED)
          }
          className="bg-green-600 hover:bg-green-700 text-xs h-8"
          size="sm"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Aprobar
        </Button>
      )}
      {vehicle.status !== "rejected" && (
        <Button
          onClick={() => onShowRejectDialog(vehicle._id!)}
          variant="destructive"
          size="sm"
          className="text-xs h-8"
        >
          <XCircle className="w-3 h-3 mr-1" />
          Rechazar
        </Button>
      )}
    </div>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onVehicleSelect(vehicle)}
      className="text-xs h-8"
    >
      <Eye className="w-3 h-3 mr-1" />
      Ver detalles
    </Button>
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onShowCommentDialog(vehicle._id!)}
        className="text-xs h-8"
      >
        <MessageSquare className="w-3 h-3 mr-1" />
        Comentar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onShowHistoryDialog(vehicle._id!)}
        className="text-xs h-8"
      >
        <History className="w-3 h-3 mr-1" />
        Historial
      </Button>
    </div>
    <div className="grid grid-cols-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => generateVehiclePdf(vehicle)}
        className="text-xs h-8"
      >
        <Download className="w-3 h-3 mr-1" />
        Descargar PDF
      </Button>
    </div>
  </div>
);

export const VehicleListView = ({
  vehicles,
  selectedVehicles,
  isDarkMode,
  onToggleSelection,
  onClearSelection,
  onStatusChange,
  onVehicleSelect,
  onShowRejectDialog,
  onShowCommentDialog,
  onShowHistoryDialog,
  onShowDeleteDialog,
  onBulkAction,
}: VehicleListViewProps) => {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <Car className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-base md:text-lg font-semibold mb-2">
          No hay vehículos
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base px-4">
          No se encontraron vehículos con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Acciones masivas */}
      {selectedVehicles.size > 0 && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-sm font-medium">
                  {selectedVehicles.size} vehículo
                  {selectedVehicles.size !== 1 ? "s" : ""} seleccionado
                  {selectedVehicles.size !== 1 ? "s" : ""}
                </span>
                <Button variant="outline" size="sm" onClick={onClearSelection}>
                  Limpiar selección
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  onClick={() => onBulkAction(ApprovalStatusMap.APPROVED)}
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprobar seleccionados
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onBulkAction(ApprovalStatusMap.REJECTED)}
                  className="text-xs sm:text-sm"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rechazar seleccionados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {vehicles.map((vehicle) => (
        <Card
          key={vehicle._id}
          id={vehicle._id} // Añadimos el ID para el anclaje
          className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} hover:shadow-lg transition-all duration-200 ${selectedVehicles.has(vehicle._id!) ? "ring-2 ring-blue-500" : ""}`}
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
                  {getStatusBadge(vehicle.status)}
                  <div className="hidden sm:block">
                    <VehicleActions
                      vehicle={vehicle}
                      isDarkMode={isDarkMode}
                      onVehicleSelect={onVehicleSelect}
                      onStatusChange={onStatusChange}
                      onShowRejectDialog={onShowRejectDialog}
                      onShowCommentDialog={onShowCommentDialog}
                      onShowHistoryDialog={onShowHistoryDialog}
                      onShowDeleteDialog={onShowDeleteDialog}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Imagen del vehículo */}
                <div className="relative w-full lg:w-64 h-48 lg:h-40 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0">
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
                <div className="flex-1 space-y-3 md:space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                      <span className="font-semibold">
                        ${vehicle.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      <span>{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                      <span className="truncate">{vehicle.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                      <span>{vehicle.color}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                      <span className="truncate">{vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
                      <span>{vehicle.fuelType}</span>
                    </div>
                  </div>

                  {vehicle.description && (
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm md:text-base">
                      {vehicle.description}
                    </p>
                  )}

                  {/* Información del vendedor */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
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
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm font-medium">
                            Referencia:
                          </span>
                          <span className="text-sm font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {vehicle.referenceNumber}
                          </span>
                        </div>
                      )}
                      {vehicle.paymentProof && (
                        <div>
                          <PdfViewer
                            url={vehicle.paymentProof}
                            vehicleId={vehicle._id!}
                            isDarkMode={isDarkMode}
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
                    {vehicle.status !== "approved" && (
                      <Button
                        onClick={() =>
                          onStatusChange(
                            vehicle._id!,
                            ApprovalStatusMap.APPROVED
                          )
                        }
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprobar
                      </Button>
                    )}
                    {vehicle.status !== "pending" && (
                      <Button
                        onClick={() =>
                          onStatusChange(
                            vehicle._id!,
                            ApprovalStatusMap.PENDING
                          )
                        }
                        variant="outline"
                        size="sm"
                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Pendiente
                      </Button>
                    )}
                    {vehicle.status !== "rejected" && (
                      <Button
                        onClick={() => onShowRejectDialog(vehicle._id!)}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rechazar
                      </Button>
                    )}
                  </div>

                  {/* Acciones móviles */}
                  <MobileActionSheet
                    vehicle={vehicle}
                    onStatusChange={onStatusChange}
                    onVehicleSelect={onVehicleSelect}
                    onShowRejectDialog={onShowRejectDialog}
                    onShowCommentDialog={onShowCommentDialog}
                    onShowHistoryDialog={onShowHistoryDialog}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
