// src/components/features/admin/RejectDialog.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Archive, XCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { InputField } from "@/components/shared/forms/InputField";

interface RejectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (reason: string) => void;
  initialReason?: string;
  isSubmitting: boolean;
}

export const RejectDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  initialReason = "",
  isSubmitting,
}: RejectDialogProps) => {
  const [reason, setReason] = useState(initialReason);

  // ========== Clase Mejorada de Inputs ==========
  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
    "placeholder:text-muted-foreground/60 " +
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
    "transition-all duration-200 ease-out hover:border-border/80";

  useEffect(() => {
    if (isOpen) {
      setReason(initialReason);
    }
  }, [isOpen, initialReason]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md mx-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Archive className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-heading">
              Archivar Anuncio
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
            ¿Estás seguro de que quieres archivar este anuncio? Puedes agregar una razón para informar al vendedor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <InputField
            label="Razón para archivar (opcional)"
            icon={<AlertTriangle className="w-4 h-4 text-primary" />}
            tooltip="Proporcionar una razón ayuda al vendedor a entender por qué su anuncio fue archivado"
            counter={{ current: reason.length, max: 500 }}
          >
            <Textarea
              id="reject-reason"
              placeholder="Ej: Documentación incompleta, imágenes no coinciden con el vehículo..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`${inputClass} min-h-[120px] resize-y`}
              maxLength={500}
            />
          </InputField>
        </div>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-3">
          <AlertDialogCancel
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(reason)}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Archivando..."
            ) : (
              <>
                <Archive className="w-4 h-4 mr-2" />
                Archivar Anuncio
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};