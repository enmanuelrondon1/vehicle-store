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
import { CheckCircle } from 'lucide-react';

interface MassApproveDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  count: number;
  isDarkMode?: boolean;
}

export const MassApproveDialog: React.FC<MassApproveDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  count,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-500/20">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                ¿Estás seguro de aprobar estos vehículos?
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="mt-3 text-gray-600 dark:text-slate-300">
            Estás a punto de aprobar <span className="font-semibold text-green-600 dark:text-green-400">{count} vehículo{count !== 1 ? 's' : ''}</span>. 
            <span className="block mt-2 font-medium text-gray-800 dark:text-slate-200">
              Esta acción les cambiará el estado a &quot;Aprobado&quot; y serán visibles públicamente.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-2">
          <AlertDialogCancel className="bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium"
          >
            Aprobar vehículos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};