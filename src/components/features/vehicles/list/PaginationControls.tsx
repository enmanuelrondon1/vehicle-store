//src/components/sections/VehicleList/PaginationControls.tsx
"use client";

import type React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalVehicles: number;
  goToPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  // isDarkMode: boolean; // ❌ REMOVED
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalVehicles,
  goToPage,
  setItemsPerPage,
  // isDarkMode, // ❌ REMOVED
}) => {
  const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24, 48];

  const renderPageButtons = () => {
    const pageButtons = [];
    const totalPagesToShow = Math.min(5, totalPages);
    let startPage;

    if (totalPages <= 5) {
      startPage = 1;
    } else if (currentPage <= 3) {
      startPage = 1;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
    } else {
      startPage = currentPage - 2;
    }

    for (let i = 0; i < totalPagesToShow; i++) {
      const pageNumber = startPage + i;
      pageButtons.push(
        <Button
          key={pageNumber}
          variant={currentPage === pageNumber ? "default" : "outline"}
          size="icon"
          onClick={() => goToPage(pageNumber)}
        >
          {pageNumber}
        </Button>
      );
    }
    return pageButtons;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
      <div className="flex items-center gap-4">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number(value));
            goToPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items por página" />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option} por página
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-1">{renderPageButtons()}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
        {Math.min(currentPage * itemsPerPage, totalVehicles)} de{" "}
        {totalVehicles} resultados
      </div>
    </div>
  );
};

export default PaginationControls;