// src/components/sections/AdminPanel/components/AdminPagination/AdminPagination.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import type { PaginationState } from "@/hooks/use-admin-panel-enhanced"

interface AdminPaginationProps {
  pagination: PaginationState
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  onNextPage: () => void
  onPrevPage: () => void
}

export const AdminPagination = ({
  pagination,
  onPageChange,
  onItemsPerPageChange,
  onNextPage,
  onPrevPage,
}: AdminPaginationProps) => {
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination

  if (totalItems === 0) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
      {/* Información de elementos */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {startItem} a {endItem} de {totalItems} resultados
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm">Mostrar:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
            <SelectTrigger className="w-20">
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
      <div className="flex items-center gap-2">
        {/* Primera página */}
        <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={currentPage === 1}>
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Página anterior */}
        <Button variant="outline" size="sm" onClick={onPrevPage} disabled={currentPage === 1}>
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
              className="min-w-[40px]"
            >
              {page}
            </Button>
          ))}
        </div>

        {/* Página siguiente */}
        <Button variant="outline" size="sm" onClick={onNextPage} disabled={currentPage === totalPages}>
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Última página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
