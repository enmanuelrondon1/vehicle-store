// src/components/features/admin/VehicleEditForm/FormHeader.tsx

import { CheckCircle2 } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import { Vehicle } from "@/types/types";
import { VehicleEditFormHeader } from "./VehicleEditFormHeader";

interface FormHeaderProps {
  vehicle: Vehicle;
  isFormValid: boolean;
  errors: Record<string, string[]>;
  hasUnsavedChanges: boolean;
  criticalErrorsCount: number;
  showDebug: boolean;
  onToggleDebug: () => void;
  touchedFieldsCount: number;
  isSubmitting: boolean;
  lastSaved: Date | null;
}

export function FormHeader({ 
  vehicle, 
  isFormValid, 
  errors, 
  hasUnsavedChanges, 
  criticalErrorsCount, 
  showDebug, 
  onToggleDebug, 
  touchedFieldsCount, 
  isSubmitting,
  lastSaved 
}: FormHeaderProps) {
  return (
    <CardHeader className="border-b border-border/50 backdrop-blur-sm relative bg-card/80 p-6">
      <VehicleEditFormHeader
        vehicle={vehicle}
        isFormValid={isFormValid}
        errorsCount={Object.keys(errors).length}
        hasUnsavedChanges={hasUnsavedChanges}
        criticalErrorsCount={criticalErrorsCount}
        showDebug={showDebug}
        onToggleDebug={onToggleDebug}
        touchedFieldsCount={touchedFieldsCount}
        isSubmitting={isSubmitting}
        errors={errors}
      />

      {/* Auto-Save Status Indicator */}
      {lastSaved && (
        <div className="flex items-center gap-2 mt-4 p-3 bg-success/10 border border-success/20 rounded-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-sm text-success font-medium">
            Guardado automáticamente hace {Math.floor((Date.now() - lastSaved.getTime()) / 1000)}s
          </span>
        </div>
      )}
    </CardHeader>
  );
}