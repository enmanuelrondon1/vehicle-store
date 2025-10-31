// src/components/features/admin/MassApproveDialog.tsx
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
import { CheckCircle, CheckSquare, Car } from 'lucide-react';

interface MassApproveDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  count: number;
}

export const MassApproveDialog: React.FC<MassApproveDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  count,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md mx-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <AlertDialogTitle className="text-xl font-heading">
              Aprobar Vehículos
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
            Estás a punto de aprobar <Badge variant="secondary" className="mx-1 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">{count} vehículo{count !== 1 ? 's' : ''}</Badge>. 
            Esta acción les cambiará el estado a "Aprobado" y serán visibles públicamente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="p-4 rounded-xl border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
            <div className="flex items-start gap-3">
              <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3">
                  ¿Qué sucederá después de aprobar?
                </h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5 font-bold">•</span>
                    <span>
                      Los vehículos cambiarán su estado a "Aprobado"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5 font-bold">•</span>
                    <span>
                      Serán visibles públicamente en la plataforma
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5 font-bold">•</span>
                    <span>
                      Los vendedores recibirán una notificación
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
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Aprobar vehículos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};