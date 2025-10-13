//src/components/features/admin/MassRejectDialog.tsx
import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { XCircle } from 'lucide-react';

interface MassRejectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (reason: string) => void;
  count: number;
  isDarkMode?: boolean;
}

export const MassRejectDialog: React.FC<MassRejectDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  count,
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason(''); // Limpiar después de confirmar
    }
  };

  const handleCancel = () => {
    setReason(''); // Limpiar al cancelar
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 max-w-lg">
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-yellow-100 dark:bg-yellow-500/20">
              <XCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                ¿Estás seguro de rechazar estos vehículos?
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="mt-3 text-gray-600 dark:text-slate-300">
            Estás a punto de rechazar <span className="font-semibold text-yellow-600 dark:text-yellow-400">{count} vehículo{count !== 1 ? 's' : ''}</span>. 
            <span className="block mt-1">
              Por favor, introduce una razón clara para el rechazo.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-2">
          <Label 
            htmlFor="rejection-reason" 
            className="text-sm font-medium text-gray-700 dark:text-slate-200"
          >
            Razón del rechazo <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="rejection-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: Faltan imágenes de buena calidad, la descripción no es clara, etc."
            className="min-h-[100px] bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-yellow-500 dark:focus:border-yellow-500 focus:ring-yellow-500/20"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {reason.length}/500 caracteres
          </p>
        </div>
        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel 
            onClick={handleCancel}
            className="bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Rechazar vehículos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};