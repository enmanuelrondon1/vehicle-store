// src/components/features/admin/DeleteDialog.tsx
// VERSIÓN CON DISEÑO UNIFICADO

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
import { AlertTriangle, Trash2, XCircle } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
}

export const DeleteDialog = ({ isOpen, onOpenChange, onConfirm }: DeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md mx-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-heading">
              Eliminar Vehículo
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
            ¿Estás seguro de que quieres eliminar este vehículo? Esta acción es permanente y no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="p-4 rounded-xl border-2 border-destructive/20 bg-destructive/5">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3">
                  Esta acción es irreversible
                </h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-0.5 font-bold">•</span>
                    <span>
                      Se eliminará permanentemente toda la información del vehículo
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-0.5 font-bold">•</span>
                    <span>
                      Todas las imágenes y comprobantes asociados serán eliminados
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-0.5 font-bold">•</span>
                    <span>
                      Esta acción no puede ser revertida
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-3">
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar Permanentemente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};