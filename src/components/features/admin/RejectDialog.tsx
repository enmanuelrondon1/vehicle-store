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
import { XCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface RejectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (reason: string) => void;
  initialReason?: string;
  isDarkMode: boolean;
}

export const RejectDialog = ({ isOpen, onOpenChange, onConfirm, initialReason = "", isDarkMode }: RejectDialogProps) => {
  const [reason, setReason] = useState(initialReason);

  useEffect(() => {
    if (isOpen) {
      setReason(initialReason);
    }
  }, [isOpen, initialReason]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`mx-4 max-w-md sm:max-w-lg ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>\
        <AlertDialogHeader>
          <AlertDialogTitle className={`text-base md:text-lg flex items-center gap-2 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
            <XCircle className="w-5 h-5 text-red-500" />
            Rechazar anuncio
          </AlertDialogTitle>
          <AlertDialogDescription className={`text-sm md:text-base ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            ¿Estás seguro de que quieres rechazar este anuncio? Puedes agregar una razón opcional para informar al usuario.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label
            htmlFor="reject-reason"
            className={`text-sm font-medium mb-2 block ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
            Razón del rechazo (opcional)
          </Label>
          <Textarea
            id="reject-reason"
            placeholder="Ej: Documentación incompleta, imágenes no coinciden con el vehículo..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={`min-h-[100px] md:min-h-[120px] text-sm ${
              isDarkMode
                ? "bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          />
        </div>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            className={`w-full sm:w-auto ${
              isDarkMode
                ? "bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600"
                : "bg-white hover:bg-slate-100"
            }`}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(reason)}
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Rechazar anuncio
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};