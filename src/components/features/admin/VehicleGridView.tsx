// src/components/features/admin/VehicleGridView.tsx
// ✅ OPTIMIZADO v2:
//    1. Eliminada la 2ª barra animate-pulse por card (antes 10 animaciones simultáneas).
//    2. Eliminados hover:scale en chips internos (antes 60 transform listeners con 10 cards).
//    3. VehicleCard con memo() — no re-renderiza cuando cambia la selección de OTRO card.
//    4. Añadido sizes en <Image> para que el navegador descargue el tamaño correcto.

"use client";

import { memo } from "react";
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

// ── Single card ───────────────────────────────────────────────────────────────
const VehicleCard = memo(({
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
} & Omit<VehicleGridViewProps, "vehicles" | "selectedVehicles">) => (
  <div
    className="animate-fade-in"
    style={{ animationDelay: `${Math.min(index * 60, 400)}ms`, animationFillMode: "both" }}
  >
    <Card
      className={`shadow-lg border-0 overflow-hidden card-glass h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      {/* ✅ Una sola barra — eliminada la 2ª con animate-pulse */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden bg-muted/10">
        <Image
          src={vehicle.images?.[0] || "/placeholder.svg?height=200&width=300"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="absolute top-3 right-3 z-10">
          <div className="p-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(vehicle._id!)}
              aria-label="Seleccionar vehículo"
            />
          </div>
        </div>

        {vehicle.images && vehicle.images.length > 1 && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="gap-1 border border-primary-foreground/20 badge-premium">
              <ImageIcon className="w-3 h-3" />
              {vehicle.images.length}
            </Badge>
          </div>
        )}

        <div className="absolute bottom-3 left-3 z-20">
          <StatusBadge status={vehicle.status} size="md" />
        </div>

        <div className="absolute bottom-3 right-3 flex flex-col gap-2 items-end z-10">
          {vehicle.views && vehicle.views > 100 && (
            <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg">
              <TrendingUp className="w-3 h-3" />
              {vehicle.views > 1000 ? `${Math.floor(vehicle.views / 1000)}k` : vehicle.views}
            </Badge>
          )}
          {vehicle.features?.includes("featured") && (
            <Badge className="gap-1 border border-primary-foreground/20 badge-premium">
              <Star className="w-3 h-3 fill-current" />
              Destacado
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg font-heading line-clamp-1 text-foreground">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
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

        {/* ✅ Chips sin hover:scale individual */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-success/5 border border-success/20">
            <DollarSign className="w-4 h-4 text-success flex-shrink-0" />
            <span className="font-semibold text-sm text-success truncate">
              ${vehicle.price.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
            <Gauge className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground truncate">
              {vehicle.mileage?.toLocaleString() ?? "N/A"} km
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/5 border border-destructive/20 col-span-2">
            <MapPin className="w-4 h-4 text-destructive flex-shrink-0" />
            <span className="text-sm text-foreground line-clamp-1">
              {vehicle.location || "No especificada"}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/5 border border-accent/20 col-span-2">
            <CalendarDays className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-sm text-foreground">
              {vehicle.createdAt
                ? new Date(vehicle.createdAt).toLocaleDateString("es-ES")
                : "N/A"}
            </span>
          </div>
        </div>

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
VehicleCard.displayName = "VehicleCard";

const EmptyGrid = () => (
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

export const VehicleGridView: React.FC<VehicleGridViewProps> = ({
  vehicles,
  selectedVehicles,
  ...handlers
}) => {
  if (vehicles.length === 0) return <EmptyGrid />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle, index) => (
        <VehicleCard
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