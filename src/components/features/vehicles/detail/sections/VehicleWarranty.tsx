"use client";

import { useDarkMode } from "@/context/DarkModeContext";
import type React from "react";
import { Shield } from "lucide-react";
import { WarrantyType } from "@/types/types";

interface VehicleWarrantyProps {
  warranty: WarrantyType;
  translatedWarranty: string;
}

export const VehicleWarranty: React.FC<VehicleWarrantyProps> = ({
  warranty,
  translatedWarranty,
}) => {
  const { isDarkMode } = useDarkMode();
  if (warranty === WarrantyType.NO_WARRANTY) {
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
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-green-500" />
        <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Garantía Incluida</h3>
      </div>
      <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        Este vehículo incluye {translatedWarranty.toLowerCase()}.
      </p>
    </div>
  );
};