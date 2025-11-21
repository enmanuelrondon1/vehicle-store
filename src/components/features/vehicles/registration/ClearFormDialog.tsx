// src/components/features/vehicles/registration/ClearFormDialog.tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface ClearFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ClearFormDialog({ open, onOpenChange, onConfirm }: ClearFormDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md card-premium border-0">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10 sm:mx-0 sm:h-10 sm:w-10 border border-destructive/20">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-lg font-heading font-semibold">
              ¿Estás realmente seguro?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-2 text-sm text-muted-foreground">
            Esta acción eliminará permanentemente todos los datos que has ingresado en el formulario. No podrás recuperarlos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-xl px-4 py-2 border-border hover:border-primary/50 transition-all">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 rounded-xl px-4 py-2 shadow-sm transition-all"
          >
            Sí, limpiar todo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}