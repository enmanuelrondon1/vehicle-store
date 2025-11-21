// src/components/sections/VehicleList/PaginationControls.tsx
"use client";

import type React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalVehicles: number;
  goToPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalVehicles,
  goToPage,
  setItemsPerPage,
}) => {
  const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24, 48];

  // Lógica de renderizado de botones más clara y robusta
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // Si hay pocas páginas, muéstralas todas
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={i === currentPage ? "default" : "ghost"}
              size="sm"
              onClick={() => goToPage(i)}
              className={cn(
                "transition-all duration-200",
                i === currentPage && "ring-2 ring-ring ring-offset-2"
              )}
              style={{
                backgroundColor: i === currentPage ? "var(--accent)" : "transparent",
                color: i === currentPage ? "var(--accent-foreground)" : "var(--foreground)",
                border: i === currentPage ? "1px solid var(--accent)" : "1px solid var(--border)"
              }}
            >
              {i}
            </Button>
          </motion.div>
        );
      }
    } else {
      // Lógica para páginas con "..." (puntos suspensivos)
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      // Siempre mostrar la primera página
      if (startPage > 1) {
        buttons.push(
          <motion.div
            key={1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(1)}
              style={{
                backgroundColor: "transparent",
                color: "var(--foreground)",
                border: "1px solid var(--border)"
              }}
            >
              1
            </Button>
          </motion.div>
        );
        if (startPage > 2) {
          buttons.push(
            <motion.div
              key="start-ellipsis"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <MoreHorizontal className="w-8 h-8 p-0 text-muted-foreground" />
            </motion.div>
          );
        }
      }

      // Mostrar páginas alrededor de la actual
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={i === currentPage ? "default" : "ghost"}
              size="sm"
              onClick={() => goToPage(i)}
              className={cn(
                "transition-all duration-200",
                i === currentPage && "ring-2 ring-ring ring-offset-2"
              )}
              style={{
                backgroundColor: i === currentPage ? "var(--accent)" : "transparent",
                color: i === currentPage ? "var(--accent-foreground)" : "var(--foreground)",
                border: i === currentPage ? "1px solid var(--accent)" : "1px solid var(--border)"
              }}
            >
              {i}
            </Button>
          </motion.div>
        );
      }

      // Siempre mostrar la última página
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push(
            <motion.div
              key="end-ellipsis"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <MoreHorizontal className="w-8 h-8 p-0 text-muted-foreground" />
            </motion.div>
          );
        }
        buttons.push(
          <motion.div
            key={totalPages}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(totalPages)}
              style={{
                backgroundColor: "transparent",
                color: "var(--foreground)",
                border: "1px solid var(--border)"
              }}
            >
              {totalPages}
            </Button>
          </motion.div>
        );
      }
    }

    return buttons;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalVehicles);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <div className="card-glass rounded-xl shadow-hard border border-border/50 overflow-hidden">
        {/* Efecto de brillo superior */}
        <div
          className="h-1 w-full"
          style={{ background: "var(--gradient-accent)" }}
        />
        
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Selector de items por página */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Mostrar</span>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    goToPage(1); // Resetear a la primera página al cambiar el tamaño
                  }}
                >
                  <SelectTrigger 
                    className="w-[100px]"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)"
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              <span>por página</span>
            </div>

            {/* Controles de navegación */}
            <div className="flex items-center gap-1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    color: currentPage === 1 ? "var(--muted-foreground)" : "var(--foreground)"
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </motion.div>
              
              <div className="flex items-center gap-1">
                {renderPageButtons()}
              </div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Página siguiente"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    color: currentPage === totalPages ? "var(--muted-foreground)" : "var(--foreground)"
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            {/* Contador de resultados como Badge para mayor visibilidad */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge 
                className="text-xs font-bold px-3 py-1" 
                style={{ 
                  background: "var(--gradient-accent)",
                  color: "var(--accent-foreground)"
                }}
              >
                {startItem}-{endItem} de {totalVehicles}
              </Badge>
            </motion.div>
          </div>
          
          {/* Indicador de mejora con efecto de brillo */}
          <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-3 h-3 mr-1" style={{ color: "var(--accent)" }} />
            </motion.div>
            <span>Página {currentPage} de {totalPages}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaginationControls;