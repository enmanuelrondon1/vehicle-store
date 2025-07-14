//src/components/sections/VehicleList/PaginationControls.tsx
"use client";

import type React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  filteredVehicles: number;
  goToPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  isDarkMode: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  filteredVehicles,
  goToPage,
  setItemsPerPage,
  isDarkMode,
}) => {
  const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24, 48];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
      <div className="flex items-center gap-4">
        <select
          value={itemsPerPage.toString()}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            goToPage(1);
          }}
          className="p-2 border rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} por página
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 border rounded-lg transition-colors ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-gray-100 text-gray-700"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) pageNumber = i + 1;
            else if (currentPage <= 3) pageNumber = i + 1;
            else if (currentPage >= totalPages - 2)
              pageNumber = totalPages - 4 + i;
            else pageNumber = currentPage - 2 + i;

            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`w-10 h-10 border rounded-lg transition-colors ${
                  currentPage === pageNumber
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 border rounded-lg transition-colors ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-gray-100 text-gray-700"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div
        className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
        {Math.min(currentPage * itemsPerPage, filteredVehicles)}{" "}
        de {filteredVehicles} resultados
      </div>
    </div>
  );
};

export default PaginationControls;