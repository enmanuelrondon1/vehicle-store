// src/components/shared/feedback/ErrorMessage.tsx
"use client";

import type React from "react";
import { RefreshCw, AlertTriangle, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen py-8 px-4 flex items-center justify-center"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex justify-center mb-6"
          >
            <AlertTriangle className="w-24 h-24 text-destructive" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-3xl font-heading font-bold mb-4 text-foreground"
          >
            ¡Oops! Algo salió mal
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mb-8 text-lg text-muted-foreground"
          >
            {error}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button
              onClick={handleRetry}
              disabled={isLoading}
              size="lg"
              className="gap-2"
            >
              <RefreshCw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
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
          </motion.div>

          {retryCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              Número de intentos: {retryCount}
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;