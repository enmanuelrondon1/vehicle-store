
// ============================================
// src/components/features/admin/VehicleEditForm/FieldWrapper.tsx
// ============================================
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FieldWrapperProps {
  label: string;
  field: string;
  required?: boolean;
  children: React.ReactNode;
  tooltip?: string;
  counter?: { current: number; max: number };
  error?: string;
  isValid?: boolean;
}

export function FieldWrapper({
  label,
  field,
  required = false,
  children,
  tooltip,
  counter,
  error,
  isValid,
}: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={field} className="flex items-center gap-2">
          {label}
          {required && <span className="text-destructive">*</span>}
          {tooltip && (
            <div className="group relative">
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              <div className="absolute left-0 top-6 w-64 p-2 bg-popover border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <p className="text-xs text-muted-foreground">{tooltip}</p>
              </div>
            </div>
          )}
        </Label>
        {counter && (
          <span className={`text-xs ${counter.current > counter.max ? 'text-destructive' : 'text-muted-foreground'}`}>
            {counter.current}/{counter.max}
          </span>
        )}
      </div>
      <div className="relative">
        {children}
        {isValid && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
