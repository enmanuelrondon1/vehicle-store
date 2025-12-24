// src/hooks/useReelsConfig.ts
"use client";

import { useState, useEffect } from "react";

export type ViewMode = "minimal" | "balanced" | "detailed";
export type PriceGradient = "blue-purple" | "gold" | "sunset" | "ocean" | "forest";

export interface ReelsConfig {
  viewMode: ViewMode;
  priceGradient: PriceGradient;
  autoplaySpeed: number; // milliseconds
  transitionSpeed: number; // milliseconds
  showParticles: boolean;
  glassEffect: boolean;
}

const DEFAULT_CONFIG: ReelsConfig = {
  viewMode: "balanced",
  priceGradient: "blue-purple",
  autoplaySpeed: 3000,
  transitionSpeed: 300,
  showParticles: false,
  glassEffect: true,
};

export const useReelsConfig = () => {
  const [config, setConfig] = useState<ReelsConfig>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("reelsConfig");
      if (stored) {
        try {
          return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
        } catch {
          return DEFAULT_CONFIG;
        }
      }
    }
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("reelsConfig", JSON.stringify(config));
    }
  }, [config]);

  const updateConfig = (updates: Partial<ReelsConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return {
    config,
    updateConfig,
    resetConfig,
  };
};

export const PRICE_GRADIENTS: Record<PriceGradient, string> = {
  "blue-purple": "from-blue-400 to-purple-400",
  "gold": "from-yellow-400 via-yellow-500 to-orange-500",
  "sunset": "from-orange-400 via-pink-500 to-purple-600",
  "ocean": "from-cyan-400 via-blue-500 to-indigo-600",
  "forest": "from-green-400 via-emerald-500 to-teal-600",
};

export const VIEW_MODE_CONFIG = {
  minimal: {
    label: "Minimalista",
    description: "Solo imagen y precio",
    icon: "✨",
  },
  balanced: {
    label: "Balanceado",
    description: "Info esencial visible",
    icon: "⚖️",
  },
  detailed: {
    label: "Detallado",
    description: "Toda la información",
    icon: "📋",
  },
};

export default useReelsConfig;