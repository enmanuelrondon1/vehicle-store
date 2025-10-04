"use client";

import { useDarkMode } from "@/context/DarkModeContext";
import React from "react";
import { CheckCircle } from "lucide-react";

interface VehicleFeaturesProps {
  features: string[];
}

const VehicleFeaturesComponent: React.FC<VehicleFeaturesProps> = ({ features }) => {
  const { isDarkMode } = useDarkMode();
  if (!features || features.length === 0) {
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
        Características
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const VehicleFeatures = React.memo(VehicleFeaturesComponent);