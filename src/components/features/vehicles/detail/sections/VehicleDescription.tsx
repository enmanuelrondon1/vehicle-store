"use client";

import { useDarkMode } from "@/context/DarkModeContext";
import React from "react";

interface VehicleDescriptionProps {
  description: string;
}

const VehicleDescriptionComponent: React.FC<VehicleDescriptionProps> = ({ description }) => {
  const { isDarkMode } = useDarkMode();
  if (!description) {
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
      <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        Descripción
      </h3>
      <p className={`text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        {description}
      </p>
    </div>
  );
};

export const VehicleDescription = React.memo(VehicleDescriptionComponent);