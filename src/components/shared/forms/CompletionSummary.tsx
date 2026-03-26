// src/components/shared/forms/CompletionSummary.tsx
// Componente compartido — usado en Step1, Step2, Step3, Step4, Step5
import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompletionSummaryProps {
  progress: number;
  completeLabel?: string;
  incompleteLabel?: string;
}

const CompletionSummary: React.FC<CompletionSummaryProps> = React.memo(({
  progress,
  completeLabel = "¡Sección completa!",
  incompleteLabel = "Faltan algunos campos",
}) => {
  const isComplete  = progress >= 100;
  const borderColor = isComplete ? "border-success/40"             : "border-amber-500/40";
  const bgColor     = isComplete ? "bg-success/5 dark:bg-success/5" : "bg-amber-500/5 dark:bg-amber-950/20";
  const iconBgColor = isComplete ? "bg-success/20"                 : "bg-amber-500/20";
  const textColor   = isComplete ? "text-success"                  : "text-amber-600 dark:text-amber-400";

  return (
    <div className={`p-5 rounded-xl border-2 shadow-sm transition-all duration-300 ${borderColor} ${bgColor} card-hover`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            {isComplete
              ? <CheckCircle2 className={`w-5 h-5 ${textColor}`} />
              : <AlertCircle  className={`w-5 h-5 ${textColor}`} />
            }
          </div>
          <div>
            <p className="font-semibold text-foreground text-base">
              {isComplete ? completeLabel : incompleteLabel}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isComplete ? "Puedes continuar al siguiente paso" : `${Math.round(progress)}% completado`}
            </p>
          </div>
        </div>
        <Badge variant={isComplete ? "default" : "secondary"} className="text-sm font-bold px-3 py-1">
          {Math.round(progress)}%
        </Badge>
      </div>

      {!isComplete && (
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
});
CompletionSummary.displayName = "CompletionSummary";

export default CompletionSummary;