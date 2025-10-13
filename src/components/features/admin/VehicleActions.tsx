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
  isDarkMode: boolean;
  onVehicleSelect: (vehicle: VehicleDataFrontend) => void;
  onStatusChange: (vehicleId: string, status: ApprovalStatus) => void;
  onShowRejectDialog: (vehicle: VehicleDataFrontend) => void;
  onShowCommentDialog: (vehicle: VehicleDataFrontend) => void;
  onShowHistoryDialog: (vehicle: VehicleDataFrontend) => void;
  onShowDeleteDialog: (vehicle: VehicleDataFrontend) => void;
}

export const VehicleActions = ({
  vehicle,
  isDarkMode,
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
          className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${
            isDarkMode
              ? "hover:bg-gray-700 text-gray-300 hover:text-gray-100"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
          aria-label="Abrir menú de acciones"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="left"
        className={`w-56 p-0 border-2 rounded-lg shadow-lg ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="space-y-1 py-2">
          {/* Ver detalles */}
          <button
            onClick={() => handleAction(() => onVehicleSelect(vehicle))}
            className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left ${
              isDarkMode
                ? "hover:bg-blue-500/20 text-gray-100"
                : "hover:bg-blue-50 text-gray-900"
            }`}
          >
            <Eye className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="font-medium">Ver detalles</span>
          </button>

          <div
            className={isDarkMode ? "bg-gray-700" : "bg-gray-200"}
            style={{ height: "1px" }}
          />

          {/* Sección de aprobación */}
          <div
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Acciones
          </div>

          <button
            onClick={() =>
              handleAction(() =>
                onStatusChange(vehicle._id!, ApprovalStatus.APPROVED)
              )
            }
            disabled={vehicle.status === ApprovalStatus.APPROVED}
            className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed ${
              vehicle.status === ApprovalStatus.APPROVED
                ? isDarkMode
                  ? "text-gray-500"
                  : "text-gray-400"
                : isDarkMode
                  ? "hover:bg-green-500/20 text-gray-100 hover:text-green-300"
                  : "hover:bg-green-50 text-gray-900 hover:text-green-700"
            }`}
          >
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="font-medium flex-1">Aprobar</span>
            {vehicle.status === ApprovalStatus.APPROVED && (
              <span className="text-xs text-green-500">✓</span>
            )}
          </button>

          <button
            onClick={() => handleAction(() => onShowRejectDialog(vehicle))}
            className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left ${
              isDarkMode
                ? "hover:bg-red-500/20 text-gray-100 hover:text-red-300"
                : "hover:bg-red-50 text-gray-900 hover:text-red-700"
            }`}
          >
            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="font-medium">Rechazar</span>
          </button>

          <div
            className={isDarkMode ? "bg-gray-700" : "bg-gray-200"}
            style={{ height: "1px" }}
          />

          {/* Sección de información */}
          <div
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Información
          </div>

          <button
            onClick={() =>
              handleAction(() => onShowCommentDialog(vehicle))
            }
            className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left ${
              isDarkMode
                ? "hover:bg-purple-500/20 text-gray-100 hover:text-purple-300"
                : "hover:bg-purple-50 text-gray-900 hover:text-purple-700"
            }`}
          >
            <MessageSquare className="h-4 w-4 text-purple-500 flex-shrink-0" />
            <span className="font-medium">Comentarios</span>
          </button>

          <button
            onClick={() =>
              handleAction(() => onShowHistoryDialog(vehicle))
            }
            className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left ${
              isDarkMode
                ? "hover:bg-amber-500/20 text-gray-100 hover:text-amber-300"
                : "hover:bg-amber-50 text-gray-900 hover:text-amber-700"
            }`}
          >
            <History className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span className="font-medium">Historial</span>
          </button>

          <div
            className={isDarkMode ? "bg-gray-700" : "bg-gray-200"}
            style={{ height: "1px" }}
          />

          {/* Eliminar */}
          <button
            onClick={() => handleAction(() => onShowDeleteDialog(vehicle))}
            className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left ${
              isDarkMode
                ? "hover:bg-red-600/30 text-red-400 hover:text-red-300"
                : "hover:bg-red-50 text-red-600 hover:text-red-700"
            }`}
          >
            <Trash2 className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Eliminar</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};