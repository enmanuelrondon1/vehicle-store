//src/components/sections/VehicleList/ErrorMessage.tsx
"use client";

import type React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button"; // ✨ ADDED: Import Button component

// ❌ REMOVED: isDarkMode prop from interface
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
}) => { // ❌ REMOVED: isDarkMode from props
  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="p-8 rounded-2xl bg-card border border-border shadow-2xl"
        >
          <div className="text-6xl mb-6 animate-bounce">😔</div>
          <h2
            className="text-3xl font-bold mb-4 text-foreground"
          >
            ¡Oops! Algo salió mal
          </h2>
          <p
            className="mb-8 text-lg text-muted-foreground"
          >
            {error}
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleRetry}
              disabled={isLoading}
              size="lg"
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 inline ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              {isLoading ? "Reintentando..." : "Reintentar"}
            </Button>
            <Button
              onClick={() => {
                console.log("🔍 Debug Info:");
                console.log("Error:", error);
                console.log("Retry count:", retryCount);
              }}
              variant="secondary"
              size="lg"
            >
              🔍 Debug
            </Button>
          </div>
          {retryCount > 0 && (
            <p
              className="mt-4 text-sm text-muted-foreground"
            >
              Intentos: {retryCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;