// src/components/features/admin/AdminPagination.tsx
// VERSIÓN CON DISEÑO UNIFICADO

"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  List,
} from "lucide-react";
import type { PaginationState } from "@/hooks/use-admin-panel-enhanced";

interface AdminPaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const AdminPagination = ({
  pagination,
  onPageChange,
  onItemsPerPageChange,
  onNextPage,
  onPrevPage,
}: AdminPaginationProps) => {
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <Card className="shadow-sm border-border">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Información de elementos */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">
                {startItem}-{endItem}
              </span>
              <span className="mx-1">de</span>
              <span className="font-medium">{totalItems}</span>
              <span>resultados</span>
            </div>

            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Mostrar:</span>
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={(value) => onItemsPerPageChange(Number(value))}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center gap-1">
            {/* Primera página */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange(1)} 
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            {/* Página anterior */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPrevPage} 
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Números de página */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <Button
                  key={index}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => typeof page === "number" && onPageChange(page)}
                  disabled={page === "..."}
                  className={`h-8 min-w-[32px] ${
                    page === "..." ? "cursor-default" : ""
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            {/* Página siguiente */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNextPage} 
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Última página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Información adicional en móvil */}
        <div className="sm:hidden flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Página <span className="font-medium">{currentPage}</span> de{" "}
            <span className="font-medium">{totalPages}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {itemsPerPage} por página
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};