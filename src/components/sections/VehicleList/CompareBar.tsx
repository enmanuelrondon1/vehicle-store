// src/components/sections/VehicleList/CompareBar.tsx
"use client";

import type React from "react";
import {  X } from "lucide-react";
import { IoMdGitCompare } from "react-icons/io";

interface CompareBarProps {
  compareList: string[];
  setCompareList: (list: string[]) => void;
  isDarkMode: boolean;
}

const CompareBar: React.FC<CompareBarProps> = ({
  compareList,
  setCompareList,
  isDarkMode,
}) => {
  return (
    <div className="mb-6 flex items-center justify-center gap-3">
      <span
        className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {compareList.length} vehículos para comparar
      </span>
      <button
        onClick={() => console.log("Comparar:", compareList)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <IoMdGitCompare  className="w-4 h-4" />
        Comparar ({compareList.length})
      </button>
      <button
        onClick={() => setCompareList([])}
        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        title="Limpiar comparación"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CompareBar;