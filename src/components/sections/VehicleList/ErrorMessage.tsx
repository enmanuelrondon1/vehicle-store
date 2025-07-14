//src/components/sections/VehicleList/ErrorMessage.tsx
"use client";

import type React from "react";
import { RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  error: string;
  handleRetry: () => void;
  isLoading: boolean;
  retryCount: number;
  isDarkMode: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  handleRetry,
  isLoading,
  retryCount,
  isDarkMode,
}) => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className={`p-8 rounded-2xl backdrop-blur-sm ${
            isDarkMode
              ? "bg-gray-800/30 border-gray-700"
              : "bg-white/30 border-gray-200"
          } border shadow-2xl`}
        >
          <div className="text-6xl mb-6 animate-bounce">😔</div>
          <h2
            className={`text-3xl font-bold mb-4 ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            ¡Oops! Algo salió mal
          </h2>
          <p
            className={`mb-8 text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {error}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRetry}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-lg transition-all duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 inline ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              {isLoading ? "Reintentando..." : "Reintentar"}
            </button>
            <button
              onClick={() => {
                console.log("🔍 Debug Info:");
                console.log("Error:", error);
                console.log("Retry count:", retryCount);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 text-lg rounded-lg transition-all duration-300"
            >
              🔍 Debug
            </button>
          </div>
          {retryCount > 0 && (
            <p
              className={`mt-4 text-sm ${
                isDarkMode ? "text-gray-500" : "text-gray-500"
              }`}
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