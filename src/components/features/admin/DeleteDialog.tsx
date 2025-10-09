// src/components/features/admin/dialogs/DeleteDialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  isDarkMode: boolean;
}

export const DeleteDialog = ({ isOpen, onOpenChange, onConfirm, isDarkMode }: DeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`mx-4 max-w-md sm:max-w-lg ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center gap-2 text-red-600 dark:text-red-400 text-base md:text-lg`}>
            <AlertTriangle className="w-5 h-5" />
            Eliminar vehículo
          </AlertDialogTitle>
          <AlertDialogDescription className={`text-sm md:text-base ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            ¿Estás seguro de que quieres eliminar este vehículo? Esta acción no se puede deshacer. Se eliminará permanentemente toda la información, imágenes y comprobantes asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-red-950/30 border-red-900" : "bg-red-50 border-red-200"}`}>
          <div className={`flex items-center gap-2 mb-2 ${isDarkMode ? "text-red-400" : "text-red-800"}`}>
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold text-sm">Advertencia</span>
          </div>
          <p className={`text-sm ${isDarkMode ? "text-red-300" : "text-red-700"}`}>
            Esta acción es irreversible. Todos los datos del vehículo se perderán permanentemente.
          </p>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className={`w-full sm:w-auto ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600" : "bg-white hover:bg-slate-100"}`}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar permanentemente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

