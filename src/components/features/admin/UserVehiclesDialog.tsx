// src/components/features/admin/UserVehiclesDialog.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Car,
  MapPin,
  Eye,
  Calendar,
  Gauge,
  ExternalLink,
  Loader2,
  AlertCircle,
  PackageOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserVehicle {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  status: "pending" | "approved" | "rejected" | "archived";
  image: string | null;
  location: string;
  mileage: number;
  condition: string;
  views: number;
  createdAt: string | null;
}

interface UserVehiclesDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  userName: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  UserVehicle["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pendiente",
    className:
      "bg-yellow-500/15 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20",
  },
  approved: {
    label: "Aprobado",
    className:
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
  },
  rejected: {
    label: "Rechazado",
    className:
      "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/20",
  },
  archived: {
    label: "Archivado",
    className:
      "bg-zinc-500/15 text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/20",
  },
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "VES",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Vehicle Card
// ---------------------------------------------------------------------------

function VehicleCard({
  vehicle,
  onView,
}: {
  vehicle: UserVehicle;
  onView: (id: string) => void;
}) {
  const statusCfg = STATUS_CONFIG[vehicle.status] ?? STATUS_CONFIG.pending;

  return (
    <div className="group flex gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-200">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-muted border border-border/30">
        {vehicle.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-8 h-8 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-foreground leading-tight truncate">
              {vehicle.brand} {vehicle.model}
            </p>
            <p className="text-xs text-muted-foreground">{vehicle.year}</p>
          </div>
          <Badge
            variant="outline"
            className={`text-xs font-semibold flex-shrink-0 ${statusCfg.className}`}
          >
            {statusCfg.label}
          </Badge>
        </div>

        <p className="text-base font-bold text-primary">
          {formatPrice(vehicle.price, vehicle.currency)}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {vehicle.location}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="w-3 h-3" />
            {vehicle.mileage.toLocaleString("es-ES")} km
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {vehicle.views} vistas
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(vehicle.createdAt)}
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="flex-shrink-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          onClick={() => onView(vehicle._id)}
          title="Ver anuncio"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary badges
// ---------------------------------------------------------------------------

function SummaryBadges({ vehicles }: { vehicles: UserVehicle[] }) {
  const counts = vehicles.reduce(
    (acc, v) => {
      acc[v.status] = (acc[v.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(STATUS_CONFIG).map(([status, cfg]) =>
        counts[status] ? (
          <span
            key={status}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}
          >
            {cfg.label}: {counts[status]}
          </span>
        ) : null
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Dialog
// ---------------------------------------------------------------------------

export function UserVehiclesDialog({
  open,
  onClose,
  userId,
  userName,
}: UserVehiclesDialogProps) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/vehicles`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Error desconocido");
      setVehicles(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los anuncios");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (open && userId) {
      fetchVehicles();
    } else {
      setVehicles([]);
      setError(null);
    }
  }, [open, userId, fetchVehicles]);

  const handleViewVehicle = (vehicleId: string) => {
    router.push(`/vehicle/${vehicleId}`);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="card-glass max-w-2xl border-border/50 p-0 overflow-hidden">
        {/* Gradient top accent */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />

        <DialogHeader className="relative px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Anuncios de{" "}
                <span className="text-primary">{userName}</span>
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                {isLoading
                  ? "Cargando anuncios..."
                  : `${vehicles.length} anuncio${vehicles.length !== 1 ? "s" : ""} encontrado${vehicles.length !== 1 ? "s" : ""}`}
              </DialogDescription>
            </div>
          </div>

          {/* Status summary */}
          {!isLoading && vehicles.length > 0 && (
            <div className="mt-3">
              <SummaryBadges vehicles={vehicles} />
            </div>
          )}
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-4">
          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">
                Cargando anuncios...
              </p>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-destructive">
                  Error al cargar
                </p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchVehicles}
                className="border-border/50 hover:border-primary hover:text-primary"
              >
                Reintentar
              </Button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && vehicles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="p-4 bg-muted/50 rounded-full">
                <PackageOpen className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-foreground">
                  Sin anuncios publicados
                </p>
                <p className="text-sm text-muted-foreground">
                  Este usuario aún no ha publicado ningún vehículo.
                </p>
              </div>
            </div>
          )}

          {/* List */}
          {!isLoading && !error && vehicles.length > 0 && (
            <ScrollArea className="h-[420px] pr-3">
              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                    onView={handleViewVehicle}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/50 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border/50 hover:bg-muted/50"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}