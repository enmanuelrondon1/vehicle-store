// src/components/features/admin/MassDeleteDialog.tsx
// VERSIÓN CON DISEÑO UNIFICADO

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Trash2, XCircle } from 'lucide-react';

interface MassDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  count: number;
  isSubmitting: boolean;
}

export const MassDeleteDialog: React.FC<MassDeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  count,
  isSubmitting,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md mx-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl font-heading">
              Eliminar Vehículos
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
            Estás a punto de eliminar <Badge variant="secondary" className="mx-1 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">{count} vehículo{count !== 1 ? 's' : ''}</Badge> de forma permanente. 
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="p-4 rounded-xl border-2 border-red-500/20 bg-red-50/50 dark:bg-red-950/20">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3">
                  Esta acción es irreversible
                </h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5 font-bold">•</span>
                    <span>
                      Se eliminará permanentemente toda la información de los vehículos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5 font-bold">•</span>
                    <span>
                      Todas las imágenes y comprobantes asociados serán eliminados
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5 font-bold">•</span>
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
          <AlertDialogCancel
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Eliminando..."
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar permanentemente
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};