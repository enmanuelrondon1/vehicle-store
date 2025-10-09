//src/components/features/admin/AdminFilters.tsx
"use client"

import type React from "react"
import { useState, Fragment } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Grid, List, CheckSquare, Square, Check, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { AdminPanelFilters, SortByType } from "@/hooks/use-admin-panel-enhanced"

interface AdminFiltersProps {
  filters: AdminPanelFilters
  onFiltersChange: (filters: Partial<AdminPanelFilters>) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  totalResults: number
  isDarkMode: boolean
  onSelectAll: () => void
  onClearSelection: () => void
  selectedCount: number
}

export const AdminFilters = ({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  totalResults,
  isDarkMode,
  onSelectAll,
  onClearSelection,
  selectedCount,
}: AdminFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange({ search: searchInput })
  }

  const clearFilters = () => {
    setSearchInput("")
    onFiltersChange({
      search: "",
      category: "all",
      priceRange: [0, 1000000],
      sortBy: "newest",
    })
  }

  const activeFiltersCount = [
    filters.search,
    filters.category !== "all" ? filters.category : null,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000 ? "price" : null,
  ].filter(Boolean).length

  return (
    <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros y Búsqueda
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalResults} resultado{totalResults !== 1 ? "s" : ""}
            </span>

            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Búsqueda */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por marca, modelo, vendedor, referencia..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>

        {/* Acciones de selección masiva */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            Seleccionar todos
          </Button>
          {selectedCount > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className="flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Limpiar selección
              </Button>
              <Badge variant="secondary">
                {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
              </Badge>
            </>
          )}
        </div>

        {/* Filtros rápidos por estado */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Todos" },
            { value: "pending", label: "Pendientes" },
            { value: "approved", label: "Aprobados" },
            { value: "rejected", label: "Rechazados" },
          ].map((status) => (
            <Button
              key={status.value}
              variant={filters.status === status.value ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ status: status.value as AdminPanelFilters['status'] })}
            >
              {status.label}
            </Button>
          ))}
        </div>

        {/* Filtros avanzados */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avanzados
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Categoría */}
              <div>
                <label className="text-sm font-medium mb-2 block">Categoría</label>
                <Listbox value={filters.category} onChange={(value) => onFiltersChange({ category: value })}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <span className="block truncate">
                        {filters.category === "all"
                          ? "Todas las categorías"
                          : filters.category === "car"
                          ? "Automóviles"
                          : filters.category === "motorcycle"
                          ? "Motocicletas"
                          : filters.category === "truck"
                          ? "Camiones"
                          : "Camionetas"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dropdown-no-zoom">
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" : "text-gray-900 dark:text-gray-200"
                            }`
                          }
                          value="all"
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                Todas las categorías
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" : "text-gray-900 dark:text-gray-200"
                            }`
                          }
                          value="car"
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                Automóviles
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" : "text-gray-900 dark:text-gray-200"
                            }`
                          }
                          value="motorcycle"
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                Motocicletas
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" : "text-gray-900 dark:text-gray-200"
                            }`
                          }
                          value="truck"
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                Camiones
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" : "text-gray-900 dark:text-gray-200"
                            }`
                          }
                          value="van"
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                Camionetas
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Ordenamiento */}
              <div>
                <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                <Listbox value={filters.sortBy} onChange={(value: SortByType) => onFiltersChange({ sortBy: value })}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <span className="block truncate">
                        {filters.sortBy === "newest"
                          ? "Más recientes"
                          : filters.sortBy === "oldest"
                          ? "Más antiguos"
                          : filters.sortBy === "price-low"
                          ? "Precio: menor a mayor"
                          : filters.sortBy === "price-high"
                          ? "Precio: mayor a menor"
                          : "Más vistos"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dropdown-no-zoom">
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" : "text-gray-900 dark:text-gray-200"
                            }`
                          }
                          value="newest"
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                Más recientes
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" : "text-gray-900 dark:text-gray-200"
                            }`
                          }
                          value="oldest"
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                Más antiguos
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" : "text-gray-900 dark:text-gray-200"
                            }`
                          }
                          value="price-low"
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                Precio: menor a mayor
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" : "text-gray-900 dark:text-gray-200"
                            }`
                          }
                          value="price-high"
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                Precio: mayor a menor
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" : "text-gray-900 dark:text-gray-200"
                            }`
                          }
                          value="views"
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                Más vistos
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Rango de precio */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Rango de precio: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => onFiltersChange({ priceRange: value as [number, number] })}
                  max={1000000}
                  min={0}
                  step={5000}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Limpiar filtros */}
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                <X className="w-4 h-4 mr-2" />
                Limpiar filtros
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}