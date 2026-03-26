// src/components/shared/feedback/ErrorMessage.tsx
"use client";

import type React from "react";
import { RefreshCw, AlertTriangle, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  error: string;
  handleRetry: () => void;
  isLoading: boolean;
  retryCount: number;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  handleRetry,
  isLoading,
  retryCount,
}) => {
  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-2xl mx-auto">
        <div className="p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-2xl hover:scale-[1.02] transition-transform duration-200">
          <div className="flex justify-center mb-6 animate-in zoom-in duration-300 delay-100">
            <AlertTriangle className="w-24 h-24 text-destructive" />
          </div>

          <h2 className="text-3xl font-heading font-bold mb-4 text-foreground animate-in fade-in slide-in-from-top-2 duration-300 delay-200">
            ¡Oops! Algo salió mal
          </h2>

          <p className="mb-8 text-lg text-muted-foreground animate-in fade-in duration-300 delay-300">
            {error}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in duration-300 delay-400">
            <Button onClick={handleRetry} disabled={isLoading} size="lg" className="gap-2">
              <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Reintentando..." : "Reintentar"}
            </Button>

            {process.env.NODE_ENV === "development" && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  console.log("🔍 Debug Info:");
                  console.log("Error:", error);
                  console.log("Retry count:", retryCount);
                }}
                className="gap-2"
              >
                <Bug className="w-5 h-5" />
                Debug
              </Button>
            )}
          </div>

          {retryCount > 0 && (
            <p className="mt-6 text-sm text-muted-foreground animate-in fade-in duration-300 delay-500">
              Número de intentos: {retryCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;