// src/components/features/admin/MassRejectDialog.tsx
// VERSIÓN CON DISEÑO UNIFICADO

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
import { Badge } from '@/components/ui/badge';
import { Archive, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { InputField } from "@/components/shared/forms/InputField";

interface MassRejectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (reason: string) => void;
  count: number;
}

export const MassRejectDialog: React.FC<MassRejectDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  count,
}) => {
  const [reason, setReason] = useState('');

  // ========== Clase Mejorada de Inputs ==========
  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
    "placeholder:text-muted-foreground/60 " +
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
    "transition-all duration-200 ease-out hover:border-border/80";

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
      <AlertDialogContent className="max-w-lg mx-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Archive className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <AlertDialogTitle className="text-xl font-heading">
              Archivar Vehículos
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
            Estás a punto de archivar <Badge variant="secondary" className="mx-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">{count} vehículo{count !== 1 ? 's' : ''}</Badge>. 
            Por favor, introduce una razón clara para archivarlos.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <InputField
            label="Razón para archivar"
            required
            icon={<FileText className="w-4 h-4 text-primary" />}
            tooltip="Proporcionar una razón clara ayuda a los vendedores a entender por qué sus anuncios fueron archivados"
            counter={{ current: reason.length, max: 500 }}
          >
            <Textarea
              id="rejection-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Faltan imágenes de buena calidad, la descripción no es clara, etc."
              className={`${inputClass} min-h-[100px] resize-y`}
              maxLength={500}
            />
          </InputField>
        </div>

        <div className="py-4">
          <div className="p-4 rounded-xl border-2 border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-950/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3">
                  ¿Qué sucederá después de archivar?
                </h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 mt-0.5 font-bold">•</span>
                    <span>
                      Los vehículos cambiarán su estado a "Archivado"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 mt-0.5 font-bold">•</span>
                    <span>
                      No serán visibles públicamente en la plataforma
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 mt-0.5 font-bold">•</span>
                    <span>
                      Los vendedores recibirán una notificación con tu razón
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-3">
          <AlertDialogCancel onClick={handleCancel} className="w-full sm:w-auto">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Archive className="w-4 h-4 mr-2" />
            Archivar vehículos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};