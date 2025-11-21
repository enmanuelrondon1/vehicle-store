// src/components/features/vehicles/common/CompareBar.tsx
"use client";

import type React from "react";
import { X, GitCompare, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CompareBarProps {
  compareList: string[];
  setCompareList: (list: string[]) => void;
}

const CompareBar: React.FC<CompareBarProps> = ({ compareList, setCompareList }) => {
  const router = useRouter();
  const canCompare = compareList.length >= 2;

  const handleCompare = () => {
    if (!canCompare) return;
    const params = new URLSearchParams();
    compareList.forEach((id) => params.append("vehicles", id));
    router.push(`/compare?${params.toString()}`);
  };

  const handleClear = () => {
    setCompareList([]);
  };

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          // MANTENEMOS LA POSICIÓN ORIGINAL PERO CON Z-INDEX MÁS ALTO
          className="sticky bottom-4 z-[9999] px-4"
        >
          <div className="card-glass rounded-xl shadow-hard border border-border/50 overflow-hidden">
            {/* Efecto de brillo superior */}
            <div
              className="h-1 w-full"
              style={{ background: "var(--gradient-accent)" }}
            />
            
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "var(--primary-10)" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <GitCompare className="w-5 h-5 text-primary dark:text-accent" />
                  </motion.div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {compareList.length} vehículo{compareList.length !== 1 ? "s" : ""} seleccionado{compareList.length !== 1 ? "s" : ""}
                    </span>
                    
                    {/* Contador con efecto de brillo */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Badge 
                        className="text-xs font-bold px-2 py-1" 
                        style={{ 
                          background: "var(--gradient-accent)",
                          color: "var(--accent-foreground)"
                        }}
                      >
                        {compareList.length}/3
                      </Badge>
                      
                      {/* Efecto de pulso en el contador */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: "var(--accent-20)" }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleCompare}
                      disabled={!canCompare}
                      className={`gap-2 ${
                        canCompare
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      <GitCompare className="w-4 h-4" />
                      <span className="hidden sm:inline">Comparar</span>
                      <span className="sm:hidden">Comparar</span>
                      
                      {canCompare && (
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleClear}
                      title="Limpiar selección"
                      aria-label="Limpiar selección"
                      className="rounded-full border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              {/* Indicador de mejora con efecto de brillo */}
              <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-3 h-3 mr-1" style={{ color: "var(--accent)" }} />
                </motion.div>
                <span>Selecciona hasta 3 vehículos para comparar</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareBar;