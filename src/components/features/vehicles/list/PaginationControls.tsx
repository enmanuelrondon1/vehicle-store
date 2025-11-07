// src/components/sections/VehicleList/PaginationControls.tsx
"use client";

import type React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"; // MEJORA: Añadimos MoreHorizontal para los puntos suspensivos
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card"; // MEJORA: Para consistencia visual
import { Badge } from "@/components/ui/badge"; // MEJORA: Para el contador de resultados
import { cn } from "@/lib/utils"; // MEJORA: Para unir clases

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

  // MEJORA: Lógica de renderizado de botones más clara y robusta
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // Si hay pocas páginas, muéstralas todas
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "ghost"}
            size="sm"
            onClick={() => goToPage(i)}
            className={cn("transition-all duration-200", i === currentPage && "ring-2 ring-ring ring-offset-2")}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Lógica para páginas con "..." (puntos suspensivos)
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      // Siempre mostrar la primera página
      if (startPage > 1) {
        buttons.push(
          <Button key={1} variant="ghost" size="sm" onClick={() => goToPage(1)}>
            1
          </Button>
        );
        if (startPage > 2) {
          buttons.push(<MoreHorizontal key="start-ellipsis" className="w-8 h-8 p-0 text-muted-foreground" />);
        }
      }

      // Mostrar páginas alrededor de la actual
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "ghost"}
            size="sm"
            onClick={() => goToPage(i)}
            className={cn("transition-all duration-200", i === currentPage && "ring-2 ring-ring ring-offset-2")}
          >
            {i}
          </Button>
        );
      }

      // Siempre mostrar la última página
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push(<MoreHorizontal key="end-ellipsis" className="w-8 h-8 p-0 text-muted-foreground" />);
        }
        buttons.push(
          <Button key={totalPages} variant="ghost" size="sm" onClick={() => goToPage(totalPages)}>
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
    // MEJORA: Usamos Card para consistencia visual y un mejor contenedor
    <Card>
      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        {/* MEJORA: Selector de items por página */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Mostrar</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              goToPage(1); // Resetear a la primera página al cambiar el tamaño
            }}
          >
            <SelectTrigger className="w-[100px]">
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
          <span>por página</span>
        </div>

        {/* MEJORA: Controles de navegación */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
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
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* MEJORA: Contador de resultados como Badge para mayor visibilidad */}
        <Badge variant="secondary" className="text-sm">
          {startItem}-{endItem} de {totalVehicles}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default PaginationControls;