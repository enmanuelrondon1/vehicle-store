// src/components/features/admin/VehicleListView.tsx
// ✅ OPTIMIZADO v2:
//    1. Eliminada la 2ª barra animate-pulse por card.
//    2. Eliminados hover:scale en los 6 chips internos × N cards.
//    3. PdfViewer cargado con dynamic() — solo se descarga si el vehículo tiene comprobante.
//    4. VehicleRow con memo() para evitar re-renders al cambiar selección de otra fila.

"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
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
import { StatusBadge } from "./shared/StatusBadge";
import { VehicleActions } from "./VehicleActions";
import { MobileActionSheet } from "./MobileActionSheet";

// ✅ PdfViewer lazy — su bundle no se descarga si no hay comprobante de pago
const PdfViewer = dynamic(
  () => import("../payment/pdf-viewer").then((m) => m.PdfViewer),
  { ssr: false, loading: () => <p className="text-xs text-muted-foreground">Cargando PDF...</p> }
);

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

// ── Chip helper ───────────────────────────────────────────────────────────────
const InfoChip = ({ icon, text, className = "" }: {
  icon: React.ReactNode;
  text: string;
  className?: string;
}) => (
  <div className={`flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/50 ${className}`}>
    {icon}
    <span className="text-sm text-foreground line-clamp-1">{text}</span>
  </div>
);

// ── Single row ────────────────────────────────────────────────────────────────
const VehicleRow = memo(({
  vehicle,
  index,
  isSelected,
  onStatusChange,
  onVehicleSelect,
  onToggleSelection,
  onShowRejectDialog,
  onShowCommentDialog,
  onShowHistoryDialog,
  onShowDeleteDialog,
  onGoToEditPage,
}: {
  vehicle: VehicleDataFrontend;
  index: number;
  isSelected: boolean;
} & Omit<VehicleListViewProps, "vehicles" | "selectedVehicles" | "onSelectAll" | "onClearSelection">) => (
  <div
    className="animate-fade-in"
    style={{ animationDelay: `${Math.min(index * 60, 400)}ms`, animationFillMode: "both" }}
  >
    <Card
      id={vehicle._id}
      className={`shadow-lg border-0 overflow-hidden card-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      {/* ✅ Una sola barra */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      <CardContent className="p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg flex-shrink-0">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelection(vehicle._id!)}
                aria-label="Seleccionar vehículo"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-bold font-heading line-clamp-1 text-foreground">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-sm text-muted-foreground">{vehicle.year}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <StatusBadge status={vehicle.status} size="md" />
            <div className="hidden md:flex">
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
          {/* Image */}
          <div className="relative w-full lg:w-64 h-48 lg:h-40 overflow-hidden rounded-xl bg-muted/10 group flex-shrink-0">
            <Image
              src={vehicle.images?.[0] || "/placeholder.svg?height=200&width=300"}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 256px"
            />
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
          <div className="flex-1 space-y-4 min-w-0">
            {/* Precio y vistas */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-success/5 border border-success/20">
                <DollarSign className="w-4 h-4 text-success flex-shrink-0" />
                <span className="font-semibold text-lg text-success">
                  ${vehicle.price.toLocaleString()}
                </span>
              </div>
              {vehicle.views && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                  <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">
                    {vehicle.views > 1000
                      ? `${Math.floor(vehicle.views / 1000)}k`
                      : vehicle.views}{" "}
                    vistas
                  </span>
                </div>
              )}
            </div>

            {/* ✅ Chips sin hover:scale */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <InfoChip icon={<Gauge className="w-4 h-4 text-primary flex-shrink-0" />} text={`${vehicle.mileage?.toLocaleString() ?? "N/A"} km`} />
              <InfoChip icon={<MapPin className="w-4 h-4 text-destructive flex-shrink-0" />} text={vehicle.location || "No especificada"} />
              <InfoChip icon={<Palette className="w-4 h-4 text-primary flex-shrink-0" />} text={vehicle.color || "No especificado"} />
              <InfoChip icon={<Settings className="w-4 h-4 text-primary flex-shrink-0" />} text={vehicle.transmission || "No especificado"} />
              <InfoChip icon={<Fuel className="w-4 h-4 text-orange-600 flex-shrink-0" />} text={vehicle.fuelType || "No especificado"} />
              <InfoChip icon={<CalendarDays className="w-4 h-4 text-accent flex-shrink-0" />} text={vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString("es-ES") : "N/A"} />
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
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground truncate">
                    {vehicle.sellerContact?.email || "No especificado"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {vehicle.sellerContact?.phone || "No especificado"}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ PdfViewer lazy — solo se renderiza si existe comprobante */}
            {(vehicle.paymentProof || vehicle.referenceNumber) && (
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 space-y-3">
                {vehicle.referenceNumber && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
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
            )}

            {/* Motivo de rechazo */}
            {vehicle.status === "rejected" && vehicle.rejectionReason && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <h4 className="font-semibold text-sm text-destructive mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Motivo del Rechazo:
                </h4>
                <p className="text-sm text-destructive/90">{vehicle.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Ver detalles */}
        <div className="pt-4 border-t border-border/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVehicleSelect(vehicle)}
            className="w-full gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors duration-200"
          >
            <Eye className="w-4 h-4" />
            Ver detalles
            <ArrowUpRight className="w-3 h-3 ml-auto" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
));
VehicleRow.displayName = "VehicleRow";

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyList = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
    <div className="p-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
      <Car className="w-16 h-16 text-primary" />
    </div>
    <h3 className="text-2xl font-bold mb-3 font-heading text-gradient-primary">
      No hay vehículos
    </h3>
    <p className="text-muted-foreground mb-8 max-w-md text-center">
      No se encontraron vehículos con los filtros seleccionados.
    </p>
  </div>
);

// ── Main export ───────────────────────────────────────────────────────────────
export const VehicleListView: React.FC<VehicleListViewProps> = ({
  vehicles,
  selectedVehicles,
  onSelectAll,
  onClearSelection,
  ...handlers
}) => {
  if (vehicles.length === 0) return <EmptyList />;

  return (
    <div className="space-y-4 md:space-y-6">
      {vehicles.map((vehicle, index) => (
        <VehicleRow
          key={vehicle._id}
          vehicle={vehicle}
          index={index}
          isSelected={selectedVehicles.has(vehicle._id!)}
          {...handlers}
        />
      ))}
    </div>
  );
};