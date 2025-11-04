// src/components/features/admin/VehicleEditForm/DebugPanel.tsx 
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bug } from "lucide-react";

interface DebugPanelProps {
  touchedFieldsCount: number;
  errorsCount: number;
  criticalErrorsCount: number;
  hasUnsavedChanges: boolean;
  isFormValid: boolean;
  isSubmitting: boolean;
  errors: Record<string, string[]>;
}

export function DebugPanel({
  touchedFieldsCount,
  errorsCount,
  criticalErrorsCount,
  hasUnsavedChanges,
  isFormValid,
  isSubmitting,
  errors,
}: DebugPanelProps) {
  return (
    <Alert className="mt-4 bg-slate-900 border-slate-700">
      <Bug className="h-4 w-4" />
      <AlertDescription className="text-xs font-mono space-y-2">
        <div className="font-bold text-slate-300">🐛 Panel de Diagnóstico</div>
        <div className="space-y-1 text-slate-400">
          <div>📊 Campos tocados: {touchedFieldsCount}</div>
          <div>❌ Total errores: {errorsCount}</div>
          <div>🚨 Errores críticos: {criticalErrorsCount}</div>
          <div>💾 Cambios sin guardar: {hasUnsavedChanges ? 'Sí' : 'No'}</div>
          <div>🔘 Botón: {isFormValid && !isSubmitting ? '✅ HABILITADO' : '❌ DESHABILITADO'}</div>
        </div>
        {errorsCount > 0 && (
          <div className="mt-3 p-2 bg-red-950/50 rounded border border-red-900">
            <div className="font-bold text-red-400 mb-2">❌ Campos con errores:</div>
            {Object.entries(errors).map(([field, msgs]) => (
              <div key={field} className="text-xs text-red-300 ml-2">
                • <span className="text-red-400">{field}</span>: {msgs[0]}
              </div>
            ))}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}