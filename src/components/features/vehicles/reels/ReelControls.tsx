// src/components/features/vehicles/reels/ReelControls.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReelControlsProps {
  currentIndex: number;
  totalItems: number;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const ReelControls: React.FC<ReelControlsProps> = ({
  currentIndex,
  totalItems,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}) => {
  return (
    <>
      {/* Desktop Controls - Center Right */}
      <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-30">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="secondary"
            size="icon"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={cn(
              "w-12 h-12 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-opacity",
              !canGoPrevious && "opacity-30 cursor-not-allowed"
            )}
            title="Anterior (↑)"
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </Button>
        </motion.div>

        <div className="flex flex-col items-center gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur-sm">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1}
          </span>
          <div className="w-px h-6 bg-white/30" />
          <span className="text-white/60 text-xs">
            {totalItems}
          </span>
        </div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="secondary"
            size="icon"
            onClick={onNext}
            disabled={!canGoNext}
            className={cn(
              "w-12 h-12 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-opacity",
              !canGoNext && "opacity-30 cursor-not-allowed"
            )}
            title="Siguiente (↓)"
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </Button>
        </motion.div>
      </div>

      {/* Mobile Controls - Bottom Center */}
      <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="secondary"
            size="icon"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={cn(
              "w-12 h-12 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-opacity",
              !canGoPrevious && "opacity-30 cursor-not-allowed"
            )}
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </Button>
        </motion.div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} / {totalItems}
          </span>
        </div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="secondary"
            size="icon"
            onClick={onNext}
            disabled={!canGoNext}
            className={cn(
              "w-12 h-12 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-opacity",
              !canGoNext && "opacity-30 cursor-not-allowed"
            )}
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </Button>
        </motion.div>
      </div>

      {/* Keyboard Shortcuts Hint (Desktop only, bottom left) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="hidden md:block absolute bottom-8 left-8 z-30"
      >
        <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs space-y-1">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">↑</kbd>
            <span className="text-white/70">Anterior</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">↓</kbd>
            <span className="text-white/70">Siguiente</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">ESC</kbd>
            <span className="text-white/70">Salir</span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ReelControls;