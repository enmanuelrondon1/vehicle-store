"use client";

import { useDarkMode } from "@/context/DarkModeContext";
import type React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Share2, Flag } from "lucide-react";

interface VehicleActionsProps {
  isFavorited: boolean;
  onFavorite: () => void;
  onShare: () => void;
  onReport: () => void;
}

export const VehicleActions: React.FC<VehicleActionsProps> = ({
  isFavorited,
  onFavorite,
  onShare,
  onReport,
}) => {
  const router = useRouter();
  const { isDarkMode } = useDarkMode();

  return (
    <div className="flex items-center justify-between mb-8">
      <button
        onClick={() => router.back()}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
            : "bg-white hover:bg-gray-50 text-gray-700"
        } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>
      <div className="flex items-center gap-2">
        <button
          onClick={onFavorite}
          className={`p-2 rounded-lg transition-colors ${
            isFavorited
              ? "bg-red-100 text-red-600"
              : isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
              : "bg-white hover:bg-gray-50 text-gray-700"
          } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={onShare}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
              : "bg-white hover:bg-gray-50 text-gray-700"
          } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={onReport}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
              : "bg-white hover:bg-gray-50 text-gray-700"
          } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <Flag className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};