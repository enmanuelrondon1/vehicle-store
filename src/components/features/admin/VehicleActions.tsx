// src/components/features/admin/VehicleActions.tsx
"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  MessageSquare,
  Trash2,
  History,
  Eye,
} from "lucide-react";
import { VehicleDataFrontend, ApprovalStatus } from "@/types/types";

interface VehicleActionsProps {
  vehicle: VehicleDataFrontend;
  onVehicleSelect: (vehicle: VehicleDataFrontend) => void;
  onStatusChange: (vehicleId: string, status: ApprovalStatus) => void;
  onShowRejectDialog: (vehicle: VehicleDataFrontend) => void;
  onShowCommentDialog: (vehicle: VehicleDataFrontend) => void;
  onShowHistoryDialog: (vehicle: VehicleDataFrontend) => void;
  onShowDeleteDialog: (vehicle: VehicleDataFrontend) => void;
}

export const VehicleActions = ({
  vehicle,
  onVehicleSelect,
  onStatusChange,
  onShowRejectDialog,
  onShowCommentDialog,
  onShowHistoryDialog,
  onShowDeleteDialog,
}: VehicleActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 rounded-lg transition-all duration-200 hover:bg-accent text-muted-foreground"
          aria-label="Abrir menú de acciones"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="left"
        className="w-56 p-0 border rounded-lg shadow-lg bg-popover text-popover-foreground"
      >
        <div className="space-y-1 py-2">
          {/* Ver detalles */}
          <button
            onClick={() => handleAction(() => onVehicleSelect(vehicle))}
            className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left hover:bg-accent"
          >
            <Eye className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="font-medium">Ver detalles</span>
          </button>

          <div className="border-t" />

          {/* Sección de aprobación */}
          <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Acciones
          </div>

          <button
            onClick={() =>
              handleAction(() =>
                onStatusChange(vehicle._id!, ApprovalStatus.APPROVED)
              )
            }
            disabled={vehicle.status === ApprovalStatus.APPROVED}
            className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
          >
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="font-medium flex-1">Aprobar</span>
            {vehicle.status === ApprovalStatus.APPROVED && (
              <span className="text-xs text-green-500">✓</span>
            )}
          </button>

          <button
            onClick={() => handleAction(() => onShowRejectDialog(vehicle))}
            className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left hover:bg-accent"
          >
            <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            <span className="font-medium">Rechazar</span>
          </button>

          <div className="border-t" />

          {/* Sección de información */}
          <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Información
          </div>

          <button
            onClick={() =>
              handleAction(() => onShowCommentDialog(vehicle))
            }
            className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left hover:bg-accent"
          >
            <MessageSquare className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="font-medium">Comentarios</span>
          </button>

          <button
            onClick={() =>
              handleAction(() => onShowHistoryDialog(vehicle))
            }
            className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left hover:bg-accent"
          >
            <History className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="font-medium">Historial</span>
          </button>

          <div className="border-t" />

          {/* Eliminar */}
          <button
            onClick={() => handleAction(() => onShowDeleteDialog(vehicle))}
            className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Eliminar</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};