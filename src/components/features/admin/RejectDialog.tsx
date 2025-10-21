// src/components/features/admin/RejectDialog.tsx
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Archive, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface RejectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (reason: string) => void;
  initialReason?: string;
}

export const RejectDialog = ({ isOpen, onOpenChange, onConfirm, initialReason = "" }: RejectDialogProps) => {
  const [reason, setReason] = useState(initialReason);

  useEffect(() => {
    if (isOpen) {
      setReason(initialReason);
    }
  }, [isOpen, initialReason]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="mx-4 max-w-md sm:max-w-lg bg-card border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base md:text-lg flex items-center gap-2 text-card-foreground">
            <Archive className="w-5 h-5 text-destructive" />
            Archivar anuncio
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm md:text-base text-muted-foreground">
            ¿Estás seguro de que quieres archivar este anuncio? Puedes agregar
            una razón opcional para informar al usuario.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label
            htmlFor="reject-reason"
            className="text-sm font-medium mb-2 block text-card-foreground"
          >
            Razón para archivar (opcional)
          </Label>
          <Textarea
            id="reject-reason"
            placeholder="Ej: Documentación incompleta, imágenes no coinciden con el vehículo..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px] md:min-h-[120px] text-sm bg-background border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(reason)}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto"
          >
            <Archive className="w-4 h-4 mr-2" />
            Archivar anuncio
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};