"use client";

import { useDarkMode } from "@/context/DarkModeContext";
import type React from "react";

interface Spec {
  label: string;
  value: string | number;
}

interface TechnicalSpecificationsProps {
  specs: Spec[];
}

const SpecRow: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => {
  const { isDarkMode } = useDarkMode();
  return (<div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
    <span
      className={`font-medium ${
        isDarkMode ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label}
    </span>
    <span className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      {value}
    </span>
  </div>);
}

export const TechnicalSpecifications: React.FC<TechnicalSpecificationsProps> = ({
  specs,
}) => {
  const { isDarkMode } = useDarkMode();
  const midPoint = Math.ceil(specs.length / 2);
  const firstHalf = specs.slice(0, midPoint);
  const secondHalf = specs.slice(midPoint);

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
        Especificaciones Técnicas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <div className="space-y-4">
          {firstHalf.map((spec) => (
            <SpecRow key={spec.label} label={spec.label} value={spec.value} />
          ))}
        </div>
        <div className="space-y-4">
          {secondHalf.map((spec) => (
            <SpecRow key={spec.label} label={spec.label} value={spec.value} />
          ))}
        </div>
      </div>
    </div>
  );
};