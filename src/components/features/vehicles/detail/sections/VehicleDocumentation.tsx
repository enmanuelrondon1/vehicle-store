"use client";

import { useDarkMode } from "@/context/DarkModeContext";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface VehicleDocumentationProps {
  documentation: string[];
}

export const VehicleDocumentation: React.FC<VehicleDocumentationProps> = ({ documentation }) => {
  const { isDarkMode } = useDarkMode();
  if (!documentation || documentation.length === 0) {
    return null;
  }

  return (
    <div
      className={`p-6 rounded-xl border ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/50 border-gray-200"
      } backdrop-blur-sm`}
    >
      <h3
        className={`text-2xl font-bold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Documentación Incluida
      </h3>
      <div className="flex flex-wrap gap-3">
        {documentation.map((doc, index) => (
          <Badge key={index} variant="outline" className="border-green-500 text-green-700 bg-green-500/10 text-base px-4 py-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            {doc}
          </Badge>
        ))}
      </div>
    </div>
  );
};