// src/components/features/admin/MobileActionSheet.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  CheckCircle,
  XCircle,
  MessageSquare,
  Trash2,
  History,
  Eye,
} from "lucide-react";
import { VehicleDataFrontend, ApprovalStatus } from "@/types/types";

interface MobileActionSheetProps {
  vehicle: VehicleDataFrontend;
  onVehicleSelect: (vehicle: VehicleDataFrontend) => void;
  onStatusChange: (vehicleId: string, status: ApprovalStatus) => void;
  onShowRejectDialog: (vehicle: VehicleDataFrontend) => void;
  onShowCommentDialog: (vehicle: VehicleDataFrontend) => void;
  onShowHistoryDialog: (vehicleId: string) => void;
  onShowDeleteDialog: (vehicle: VehicleDataFrontend) => void;
}

export const MobileActionSheet = ({
  vehicle,
  onVehicleSelect,
  onStatusChange,
  onShowRejectDialog,
  onShowCommentDialog,
  onShowHistoryDialog,
  onShowDeleteDialog,
}: MobileActionSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Abrir menú">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>
            Acciones para: {vehicle.brand} {vehicle.model}
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-3 py-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => onVehicleSelect(vehicle)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => onStatusChange(vehicle._id!, ApprovalStatus.APPROVED)}
            disabled={vehicle.status === ApprovalStatus.APPROVED}
          >
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Aprobar
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => onShowRejectDialog(vehicle)}
          >
            <XCircle className="mr-2 h-4 w-4 text-destructive" />
            Archivar
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => onShowCommentDialog(vehicle)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Ver/Añadir comentario
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => onShowHistoryDialog(vehicle._id!)}
          >
            <History className="mr-2 h-4 w-4" />
            Ver historial
          </Button>
          <Button
            variant="destructive"
            className="justify-start"
            onClick={() => onShowDeleteDialog(vehicle)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};