// src/components/features/admin/VehicleEditForm/FormFooter.tsx

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Loader2, Save, X, CheckCircle2, AlertCircle, Clock } from "lucide-react";

// Definimos las props que este componente necesita recibir
interface FormFooterProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  hasUnsavedChanges: boolean;
  errors: Record<string, string[]>; // 👈 TIPO CORREGIDO
  onEnhancedSubmit: (e: React.FormEvent) => Promise<void>;
}

export function FormFooter({ 
  isSubmitting, 
  isFormValid, 
  hasUnsavedChanges, 
  errors, 
  onEnhancedSubmit 
}: FormFooterProps) {
  const router = useRouter();

  return (
    <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-border/50 bg-gradient-to-b from-card/80 to-card/95 backdrop-blur-sm p-6 lg:p-8 sticky bottom-0 z-30">
      {/* Status Indicator */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {isSubmitting ? (
          <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl w-full sm:w-auto animate-fade-in shadow-lg">
            <div className="relative">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <div className="absolute inset-0 animate-ping">
                <Loader2 className="w-5 h-5 text-primary opacity-30" />
              </div>
            </div>
            <div className="text-sm">
              <span className="font-bold text-primary">Guardando cambios...</span>
              <p className="text-xs text-muted-foreground">Por favor espera</p>
            </div>
          </div>
        ) : !isFormValid ? (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border-2 border-destructive/30 rounded-xl w-full sm:w-auto animate-fade-in shadow-lg">
            <div className="relative">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div className="absolute -inset-1 bg-destructive/20 rounded-full blur-md animate-pulse"></div>
            </div>
            <div className="text-sm">
              <span className="font-bold text-destructive">
                {Object.keys(errors).length} error{Object.keys(errors).length !== 1 ? 'es' : ''} detectado{Object.keys(errors).length !== 1 ? 's' : ''}
              </span>
              <p className="text-xs text-destructive/80">Revisa los campos marcados</p>
            </div>
          </div>
        ) : hasUnsavedChanges ? (
          <div className="flex items-center gap-3 p-4 bg-accent/10 border-2 border-accent/30 rounded-xl w-full sm:w-auto animate-fade-in shadow-lg">
            <div className="relative">
              <Clock className="w-5 h-5 text-accent flex-shrink-0 animate-pulse" />
              <div className="absolute -inset-1 bg-accent/20 rounded-full blur-md"></div>
            </div>
            <div className="text-sm">
              <span className="font-bold text-accent">Cambios pendientes</span>
              <p className="text-xs text-muted-foreground">No olvides guardar</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-success/10 border-2 border-success/30 rounded-xl w-full sm:w-auto animate-fade-in shadow-lg">
            <div className="relative">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <div className="absolute -inset-1 bg-success/20 rounded-full blur-md"></div>
            </div>
            <div className="text-sm">
              <span className="font-bold text-success">Todo listo</span>
              <p className="text-xs text-muted-foreground">Sin cambios pendientes</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="w-full sm:w-auto card-hover group relative overflow-hidden border-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-muted/0 via-muted/50 to-muted/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
          <X className="mr-2 h-4 w-4 relative z-10" />
          <span className="relative z-10">Cancelar</span>
        </Button>
        
        <Button
          type="submit"
          onClick={onEnhancedSubmit}
          disabled={isSubmitting || !isFormValid}
          className="w-full sm:w-auto btn-accent min-w-[200px] shimmer-effect group relative overflow-hidden border-2 border-accent/30 shadow-lg hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin relative z-10" />
              <span className="relative z-10">Guardando...</span>
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4 relative z-10 group-hover:scale-110 transition-transform" />
              <span className="relative z-10 font-bold">Guardar Cambios</span>
            </>
          )}
        </Button>
      </div>
    </CardFooter>
  );
}