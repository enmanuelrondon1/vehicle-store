// src/components/features/admin/DeleteDialog.tsx
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
}

export const DeleteDialog = ({ isOpen, onOpenChange, onConfirm }: DeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="mx-4 max-w-md sm:max-w-lg bg-card border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive text-base md:text-lg">
            <AlertTriangle className="w-5 h-5" />
            Eliminar vehículo
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm md:text-base text-muted-foreground">
            ¿Estás seguro de que quieres eliminar este vehículo? Esta acción no se puede deshacer. Se eliminará permanentemente toda la información, imágenes y comprobantes asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="p-4 rounded-lg border bg-destructive/10 border-destructive">
          <div className="flex items-center gap-2 mb-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold text-sm">Advertencia</span>
          </div>
          <p className="text-sm text-destructive/90">
            Esta acción es irreversible. Todos los datos del vehículo se perderán permanentemente.
          </p>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto">
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar permanentemente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};