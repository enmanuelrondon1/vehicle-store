"use client";

import { useDarkMode } from "@/context/DarkModeContext";
import type React from "react";

interface InfoItem {
  label: string;
  value?: string | number;
}

interface VehicleAdditionalInfoProps {
  items: InfoItem[];
}

const InfoRow: React.FC<{ label: string; value: string | number; }> = ({
  label,
  value,
}) => {
  const { isDarkMode } = useDarkMode();
  return (<div className="flex justify-between items-center">
    <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{label}</span>
    <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{value}</span>
  </div>);
}

export const VehicleAdditionalInfo: React.FC<VehicleAdditionalInfoProps> = ({
  items,
}) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div
      className={`p-6 rounded-xl border ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/50 border-gray-200"
      } backdrop-blur-sm`}
    >
      <h3
        className={`text-xl font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Información Adicional
      </h3>
      <div className="space-y-3">
        {items.map((item) =>
          item.value ? <InfoRow key={item.label} label={item.label} value={item.value} /> : null
        )}
      </div>
    </div>
  );
};