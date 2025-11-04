import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bug, AlertCircle, CheckCircle2, Code } from "lucide-react"; // Cambiamos Bug por Code para el botón
import { Vehicle } from "@/types/types";
// Ya no necesitamos importar DebugPanel

interface VehicleEditFormHeaderProps {
  vehicle: Vehicle;
  isFormValid: boolean;
  errorsCount: number;
  hasUnsavedChanges: boolean;
  criticalErrorsCount: number;
  showDebug: boolean;
  onToggleDebug: () => void;
  touchedFieldsCount: number;
  isSubmitting: boolean;
  errors: Record<string, string[]>;
}

export function VehicleEditFormHeader({
  vehicle,
  isFormValid,
  errorsCount,
  hasUnsavedChanges,
  criticalErrorsCount,
  showDebug,
  onToggleDebug,
  touchedFieldsCount,
  errors,
}: VehicleEditFormHeaderProps) {
  return (
    <CardHeader className="pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-2xl font-heading break-words pr-2">
          Editando: {vehicle.brand} {vehicle.model} ({vehicle.year})
        </CardTitle>
        
        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2">
          {/* 1. BOTÓN DE DEBUG MÁS SUTIL: Icono y variante "ghost" para que sea menos llamativo. */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleDebug}
            className={showDebug ? "bg-muted" : ""}
          >
            <Code className="w-4 h-4 mr-2" />
            {showDebug ? 'Ocultar' : 'Mostrar'} Debug
          </Button>
          
          {/* 2. BARRA DE DEBUG COMPACTA: Se muestra solo si showDebug es true. */}
          {showDebug && (
            <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-md border">
              <Badge variant="outline" className="text-xs font-mono">
                Touched: {touchedFieldsCount}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                Errors: {errorsCount}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                Critical: {criticalErrorsCount}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                Valid: {isFormValid ? '✅' : '❌'}
              </Badge>
            </div>
          )}

          {/* 3. BADGES DE ESTADO DEL FORMULARIO (sin cambios, ya estaban bien) */}
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="text-amber-600 dark:text-amber-400 border-amber-600/50 dark:border-amber-400/50">
              Cambios sin guardar
            </Badge>
          )}
          {criticalErrorsCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {criticalErrorsCount} error{criticalErrorsCount !== 1 ? 'es' : ''}
            </Badge>
          )}
          {isFormValid && !hasUnsavedChanges && criticalErrorsCount === 0 && (
            <Badge className="flex items-center gap-1 bg-green-600 dark:bg-green-400 text-primary-foreground hover:bg-green-700 dark:hover:bg-green-500">
              <CheckCircle2 className="w-3 h-3" />
              Válido
            </Badge>
          )}
        </div>
      </div>
      
      {/* 4. ALERTA DE ERRORES CRÍTICOS (sin cambios, es esencial) */}
      {criticalErrorsCount > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Hay {criticalErrorsCount} campo{criticalErrorsCount !== 1 ? 's requeridos' : ' requerido'} con errores. 
            Por favor corrígelos antes de guardar.
          </AlertDescription>
        </Alert>
      )}
    </CardHeader>
  );
}