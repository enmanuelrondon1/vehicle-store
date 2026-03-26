// src/components/features/vehicles/reels/ReelsSettings.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Check, Zap, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { 
  useReelsConfig, 
  ViewMode, 
  PriceGradient,
  PRICE_GRADIENTS,
  VIEW_MODE_CONFIG 
} from "@/hooks/useReelsConfig";

interface ReelsSettingsProps {
  onClose?: () => void;
}

export const ReelsSettings: React.FC<ReelsSettingsProps> = ({ onClose }) => {
  const { config, updateConfig, resetConfig } = useReelsConfig();

  const formatSpeed = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-full md:w-96 bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Configuración</h2>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Personaliza la experiencia de reels
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* View Mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Modo de Visualización
            </h3>
          </div>
          <div className="space-y-2">
            {(Object.keys(VIEW_MODE_CONFIG) as ViewMode[]).map((mode) => {
              const modeConfig = VIEW_MODE_CONFIG[mode];
              const isSelected = config.viewMode === mode;
              
              return (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateConfig({ viewMode: mode })}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 transition-all text-left",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{modeConfig.icon}</span>
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          {modeConfig.label}
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {modeConfig.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

     

        {/* Effects */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Efectos Visuales
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Efecto Cristal</p>
                <p className="text-sm text-muted-foreground">
                  Glassmorphism en los elementos
                </p>
              </div>
              <Switch
                checked={config.glassEffect}
                onCheckedChange={(checked) => updateConfig({ glassEffect: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Partículas</p>
                <p className="text-sm text-muted-foreground">
                  Efectos de partículas flotantes
                </p>
              </div>
              <Switch
                checked={config.showParticles}
                onCheckedChange={(checked) => updateConfig({ showParticles: checked })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={resetConfig}
        >
          Restaurar Valores por Defecto
        </Button>
      </div>
    </motion.div>
  );
};

export default ReelsSettings;