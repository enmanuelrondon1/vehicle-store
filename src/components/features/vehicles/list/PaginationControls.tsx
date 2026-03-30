// src/components/features/vehicles/list/PaginationControls.tsx
// ✅ OPTIMIZADO: eliminado framer-motion completamente.
//    Tenía motion.div con whileHover/whileTap en CADA botón de paginación
//    (hasta ~7 botones visibles × listeners de framer-motion).
//    También tenía motion.div animate rotate repeat:Infinity en Sparkles.
//    Reemplazado por CSS hover:scale active:scale — mismo efecto, 0 JS.

"use client";

import type React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Sparkles } from "lucide-react";
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

  const pageButtonClass = (isActive: boolean) =>
    cn(
      "transition-all duration-200 hover:scale-[1.05] active:scale-[0.95]",
      isActive && "ring-2 ring-ring ring-offset-2"
    );

  const pageButtonStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? "var(--accent)" : "transparent",
    color: isActive ? "var(--accent-foreground)" : "var(--foreground)",
    border: isActive ? "1px solid var(--accent)" : "1px solid var(--border)",
  });

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "ghost"}
            size="sm"
            onClick={() => goToPage(i)}
            className={pageButtonClass(i === currentPage)}
            style={pageButtonStyle(i === currentPage)}
          >
            {i}
          </Button>
        );
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        buttons.push(
          <Button key={1} variant="ghost" size="sm" onClick={() => goToPage(1)} className="hover:scale-[1.05] active:scale-[0.95] transition-transform duration-200" style={pageButtonStyle(false)}>
            1
          </Button>
        );
        if (startPage > 2) {
          buttons.push(<MoreHorizontal key="start-ellipsis" className="w-8 h-8 p-0 text-muted-foreground" />);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "ghost"}
            size="sm"
            onClick={() => goToPage(i)}
            className={pageButtonClass(i === currentPage)}
            style={pageButtonStyle(i === currentPage)}
          >
            {i}
          </Button>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push(<MoreHorizontal key="end-ellipsis" className="w-8 h-8 p-0 text-muted-foreground" />);
        }
        buttons.push(
          <Button key={totalPages} variant="ghost" size="sm" onClick={() => goToPage(totalPages)} className="hover:scale-[1.05] active:scale-[0.95] transition-transform duration-200" style={pageButtonStyle(false)}>
            {totalPages}
          </Button>
        );
      }
    }

    return buttons;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalVehicles);

  return (
    // ✅ animate-fade-in CSS en lugar de motion.div initial/animate
    <div className="w-full animate-fade-in">
      <div className="card-glass rounded-xl shadow-hard border border-border/50 overflow-hidden">
        <div className="h-1 w-full" style={{ background: "var(--gradient-accent)" }} />

        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Selector items por página */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Mostrar</span>
              <div className="hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    goToPage(1);
                  }}
                >
                  <SelectTrigger className="w-[100px]" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={String(option)}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span>por página</span>
            </div>

            {/* Navegación */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="hover:scale-[1.05] active:scale-[0.95] transition-transform duration-200"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: currentPage === 1 ? "var(--muted-foreground)" : "var(--foreground)" }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1">{renderPageButtons()}</div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
                className="hover:scale-[1.05] active:scale-[0.95] transition-transform duration-200"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: currentPage === totalPages ? "var(--muted-foreground)" : "var(--foreground)" }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Badge contador */}
            <Badge
              className="text-xs font-bold px-3 py-1 hover:scale-[1.05] transition-transform duration-200"
              style={{ background: "var(--gradient-accent)", color: "var(--accent-foreground)" }}
            >
              {startItem}-{endItem} de {totalVehicles}
            </Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
            {/* ✅ Sparkles → CSS hover en lugar de motion rotate repeat:Infinity */}
            <Sparkles className="w-3 h-3 mr-1 transition-transform duration-300 hover:rotate-12" style={{ color: "var(--accent)" }} />
            <span>Página {currentPage} de {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;