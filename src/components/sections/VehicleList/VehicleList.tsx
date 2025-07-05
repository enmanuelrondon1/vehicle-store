"use client"

import type React from "react"
import { useEffect, useState, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Heart,
  Share2,
  Car,
  Fuel,
  Calendar,
  MapPin,
  Settings2,
  X,
  RefreshCw,
  Eye,
  ContrastIcon as Compare,
  Star,
  SlidersHorizontal,
} from "lucide-react"

// Importa tu contexto de dark mode
import { useDarkMode } from "@/context/DarkModeContext"

// Mapeos de traducción
const CONDITION_MAP = {
  new: "Nuevo",
  used: "Usado",
  certified: "Certificado",
  excellent: "Excelente",
  good: "Bueno",
  fair: "Regular",
} as const

const FUEL_TYPE_MAP = {
  gasoline: "Gasolina",
  diesel: "Diésel",
  hybrid: "Híbrido",
  electric: "Eléctrico",
  gas: "Gas",
} as const

const TRANSMISSION_MAP = {
  manual: "Manual",
  automatic: "Automática",
  cvt: "CVT",
} as const

const AVAILABILITY_MAP = {
  AVAILABLE: "Disponible",
  PENDING: "Pendiente",
  SOLD: "Vendido",
  RESERVED: "Reservado",
} as const

// Solución 1: WARRANTY_MAP ahora se usa correctamente
const WARRANTY_MAP = {
  "dealer-warranty": "Garantía del concesionario",
  "manufacturer-warranty": "Garantía del fabricante",
  "extended-warranty": "Garantía extendida",
  "no-warranty": "Sin garantía",
} as const

// Tipos basados en tu estructura real de MongoDB
interface Vehicle {
  _id: string
  category: string
  subcategory?: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  color: string
  engine?: string
  transmission: keyof typeof TRANSMISSION_MAP
  condition: keyof typeof CONDITION_MAP
  location: string
  features: string[]
  fuelType: keyof typeof FUEL_TYPE_MAP
  loadCapacity?: number
  sellerContact: {
    name: string
    email: string
    phone: string
  }
  availability: keyof typeof AVAILABILITY_MAP
  warranty: keyof typeof WARRANTY_MAP
  description: string
  images: string[]
  selectedBank: string
  referenceNumber: string
  postedDate: string
  createdAt: string
  updatedAt: string
  paymentProof: string
  views?: number
  isFeatured?: boolean
}

interface AdvancedFilters {
  search: string
  category: string
  subcategory: string
  brands: string[]
  priceRange: [number, number]
  yearRange: [number, number]
  mileageRange: [number, number]
  condition: string[]
  fuelType: string[]
  transmission: string[]
  location: string[]
  features: string[]
  availability: string
  hasWarranty: boolean
  isFeatured: boolean
  postedWithin: string
}

// Solución 2: Tipo específico para filterOptions en lugar de 'any'
interface FilterOptions {
  categories: string[]
  subcategories: string[]
  brands: string[]
  conditions: string[]
  fuelTypes: string[]
  transmissions: string[]
  locations: string[]
  features: string[]
}

const POSTED_WITHIN_OPTIONS = [
  { value: "all", label: "Cualquier momento" },
  { value: "24h", label: "Últimas 24 horas" },
  { value: "7d", label: "Última semana" },
  { value: "30d", label: "Último mes" },
]

// Componente de filtros avanzados
const AdvancedFiltersPanel = ({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
  isDarkMode,
}: {
  filters: AdvancedFilters
  filterOptions: FilterOptions // Solución 2: Tipo específico
  onFiltersChange: (filters: AdvancedFilters) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
  isDarkMode: boolean
}) => {
  const updateFilter = <K extends keyof AdvancedFilters>(key: K, value: AdvancedFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = <K extends keyof AdvancedFilters>(key: K, value: string, currentArray: string[]) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray as AdvancedFilters[K])
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.brands.length > 0) count++
    if (filters.condition.length > 0) count++
    if (filters.fuelType.length > 0) count++
    if (filters.transmission.length > 0) count++
    if (filters.location.length > 0) count++
    if (filters.hasWarranty) count++
    if (filters.isFeatured) count++
    if (filters.postedWithin !== "all") count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) count++
    if (filters.yearRange[0] > 2000 || filters.yearRange[1] < 2025) count++
    return count
  }, [filters])

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors relative ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros Avanzados
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>
    )
  }

  return (
    <div
      className={`p-6 rounded-xl border ${
        isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
      } backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Filtros Avanzados {activeFiltersCount > 0 && `(${activeFiltersCount} activos)`}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-700 transition-colors px-3 py-1 rounded border border-red-200 hover:bg-red-50"
          >
            Limpiar Todo
          </button>
          <button
            onClick={onToggle}
            className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Categoría */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className={`w-full p-2 rounded border ${
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
            }`}
          >
            <option value="all">Todas las categorías</option>
            {filterOptions.categories.map((cat: string) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Rangos de Precio */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Precio: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={filters.priceRange[0]}
              onChange={(e) => updateFilter("priceRange", [Number(e.target.value), filters.priceRange[1]])}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={filters.priceRange[1]}
              onChange={(e) => updateFilter("priceRange", [filters.priceRange[0], Number(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        {/* Rango de Años */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Año: {filters.yearRange[0]} - {filters.yearRange[1]}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="2000"
              max="2025"
              value={filters.yearRange[0]}
              onChange={(e) => updateFilter("yearRange", [Number(e.target.value), filters.yearRange[1]])}
              className="w-full"
            />
            <input
              type="range"
              min="2000"
              max="2025"
              value={filters.yearRange[1]}
              onChange={(e) => updateFilter("yearRange", [filters.yearRange[0], Number(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        {/* Marcas */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Marcas ({filters.brands.length} seleccionadas)
          </label>
          <div className="max-h-32 overflow-y-auto space-y-1 border rounded p-2">
            {filterOptions.brands.slice(0, 10).map((brand: string) => (
              <label key={brand} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleArrayFilter("brands", brand, filters.brands)}
                  className="rounded"
                />
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Condición */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Condición
          </label>
          <div className="space-y-1">
            {filterOptions.conditions.map((condition: string) => (
              <label key={condition} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.condition.includes(condition)}
                  onChange={() => toggleArrayFilter("condition", condition, filters.condition)}
                  className="rounded"
                />
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tipo de Combustible */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Combustible
          </label>
          <div className="space-y-1">
            {filterOptions.fuelTypes.map((fuel: string) => (
              <label key={fuel} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.fuelType.includes(fuel)}
                  onChange={() => toggleArrayFilter("fuelType", fuel, filters.fuelType)}
                  className="rounded"
                />
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{fuel}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Transmisión */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Transmisión
          </label>
          <div className="space-y-1">
            {filterOptions.transmissions.map((transmission: string) => (
              <label key={transmission} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.transmission.includes(transmission)}
                  onChange={() => toggleArrayFilter("transmission", transmission, filters.transmission)}
                  className="rounded"
                />
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{transmission}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ubicaciones */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Ubicación
          </label>
          <div className="max-h-32 overflow-y-auto space-y-1 border rounded p-2">
            {filterOptions.locations.slice(0, 8).map((location: string) => (
              <label key={location} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.location.includes(location)}
                  onChange={() => toggleArrayFilter("location", location, filters.location)}
                  className="rounded"
                />
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{location}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filtros especiales */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Publicado en
            </label>
            <select
              value={filters.postedWithin}
              onChange={(e) => updateFilter("postedWithin", e.target.value)}
              className={`w-full p-2 rounded border ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
              }`}
            >
              {POSTED_WITHIN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.hasWarranty}
                onChange={(e) => updateFilter("hasWarranty", e.target.checked)}
                className="rounded"
              />
              <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Con garantía</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.isFeatured}
                onChange={(e) => updateFilter("isFeatured", e.target.checked)}
                className="rounded"
              />
              <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Solo destacados</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

const SORT_OPTIONS = [
  {
    value: "relevance",
    label: "Más Relevantes",
    key: "relevance" as const,
    order: "desc" as const,
  },
  {
    value: "price_asc",
    label: "Precio: Menor a Mayor",
    key: "price" as const,
    order: "asc" as const,
  },
  {
    value: "price_desc",
    label: "Precio: Mayor a Menor",
    key: "price" as const,
    order: "desc" as const,
  },
  {
    value: "year_desc",
    label: "Año: Más Nuevo",
    key: "year" as const,
    order: "desc" as const,
  },
  {
    value: "year_asc",
    label: "Año: Más Antiguo",
    key: "year" as const,
    order: "asc" as const,
  },
  {
    value: "mileage_asc",
    label: "Kilometraje: Menor",
    key: "mileage" as const,
    order: "asc" as const,
  },
  {
    value: "mileage_desc",
    label: "Kilometraje: Mayor",
    key: "mileage" as const,
    order: "desc" as const,
  },
  {
    value: "date_desc",
    label: "Más Recientes",
    key: "createdAt" as const,
    order: "desc" as const,
  },
]

const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24, 48]

const INITIAL_FILTERS: AdvancedFilters = {
  search: "",
  category: "all",
  subcategory: "all",
  brands: [],
  priceRange: [0, 1000000],
  yearRange: [2000, 2025],
  mileageRange: [0, 500000],
  condition: [],
  fuelType: [],
  transmission: [],
  location: [],
  features: [],
  availability: "all",
  hasWarranty: false,
  isFeatured: false,
  postedWithin: "all",
}

// Función helper para traducir valores
const translateValue = (value: string, map: Record<string, string>): string => {
  return map[value] || value
}

// Componente de estadísticas
const VehicleStats = ({
  filteredVehicles,
  isDarkMode,
}: {
  vehicles: Vehicle[]
  filteredVehicles: Vehicle[]
  isDarkMode: boolean
}) => {
  const stats = useMemo(() => {
    const avgPrice = filteredVehicles.reduce((sum, v) => sum + v.price, 0) / filteredVehicles.length || 0
    const avgYear = filteredVehicles.reduce((sum, v) => sum + v.year, 0) / filteredVehicles.length || 0
    const avgMileage = filteredVehicles.reduce((sum, v) => sum + v.mileage, 0) / filteredVehicles.length || 0
    const featuredCount = filteredVehicles.filter((v) => v.isFeatured).length

    return {
      total: filteredVehicles.length,
      avgPrice: Math.round(avgPrice),
      avgYear: Math.round(avgYear),
      avgMileage: Math.round(avgMileage),
      featured: featuredCount,
      newCount: filteredVehicles.filter((v) => v.condition === "new").length,
    }
  }, [filteredVehicles])

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-6 gap-4 p-4 rounded-xl mb-6 ${
        isDarkMode ? "bg-gray-800/30" : "bg-white/30"
      } backdrop-blur-sm border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      <div className="text-center">
        <div className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{stats.total}</div>
        <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Vehículos</div>
      </div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
          ${(stats.avgPrice / 1000).toFixed(0)}K
        </div>
        <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Precio Prom.</div>
      </div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
          {stats.avgYear}
        </div>
        <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Año Prom.</div>
      </div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
          {(stats.avgMileage / 1000).toFixed(0)}K
        </div>
        <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>KM Prom.</div>
      </div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
          {stats.featured}
        </div>
        <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Destacados</div>
      </div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
          {stats.newCount}
        </div>
        <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Nuevos</div>
      </div>
    </div>
  )
}

// Componente de tarjeta de vehículo
const VehicleCard = ({
  vehicle,
  isDarkMode,
  viewMode,
  onToggleCompare,
  isInCompareList,
}: {
  vehicle: Vehicle
  isDarkMode: boolean
  viewMode: "grid" | "list"
  onToggleCompare: (vehicleId: string) => void
  isInCompareList: boolean
}) => {
  const [imageError, setImageError] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)

  const formatMileage = (mileage: number) => new Intl.NumberFormat("es-ES").format(mileage)

  const handleImageError = () => {
    setImageError(true)
    setIsImageLoading(false)
  }

  const handleImageLoad = () => {
    setIsImageLoading(false)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.model}`,
        text: `Mira este ${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        url: `/vehicle/${vehicle._id}`,
      })
    }
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleCompare(vehicle._id)
  }

  // Traducir valores para mostrar
  const translatedCondition = translateValue(vehicle.condition, CONDITION_MAP)
  const translatedFuelType = translateValue(vehicle.fuelType, FUEL_TYPE_MAP)
  const translatedTransmission = translateValue(vehicle.transmission, TRANSMISSION_MAP)
  const translatedAvailability = translateValue(vehicle.availability, AVAILABILITY_MAP)

  if (viewMode === "list") {
    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800" : "bg-white/50 border-gray-200 hover:bg-white"
        } transition-all duration-300 hover:shadow-xl backdrop-blur-sm group cursor-pointer rounded-lg border relative`}
        onClick={() => window.open(`/vehicle/${vehicle._id}`, "_self")}
      >
        {vehicle.isFeatured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
            <Star className="w-3 h-3 inline mr-1" />
            Destacado
          </div>
        )}
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-80 h-48 md:h-40 overflow-hidden rounded-l-lg">
            {isImageLoading && (
              <div
                className={`absolute inset-0 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } animate-pulse flex items-center justify-center`}
              >
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {/* Solución 4: Usar Image en lugar de img */}
            <Image
              src={imageError || !vehicle.images[0] ? "/placeholder.svg?height=200&width=300" : vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              width={320}
              height={200}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              priority={false}
            />
            {vehicle.condition === "new" && (
              <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded">Nuevo</span>
            )}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                onClick={handleCompare}
                className={`w-8 h-8 p-0 rounded-full ${
                  isInCompareList
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                      ? "bg-gray-900/70 hover:bg-gray-800 text-gray-300"
                      : "bg-white/70 hover:bg-white text-gray-600"
                } backdrop-blur-sm transition-colors`}
                title="Comparar"
              >
                <Compare className="w-4 h-4" />
              </button>
              <button
                onClick={handleFavorite}
                className={`w-8 h-8 p-0 rounded-full ${
                  isDarkMode ? "bg-gray-900/70 hover:bg-gray-800" : "bg-white/70 hover:bg-white"
                } backdrop-blur-sm`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorited ? "fill-red-500 text-red-500" : isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className={`w-8 h-8 p-0 rounded-full ${
                  isDarkMode ? "bg-gray-900/70 hover:bg-gray-800" : "bg-white/70 hover:bg-white"
                } backdrop-blur-sm`}
              >
                <Share2 className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
              </button>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  } group-hover:text-blue-500 transition-colors`}
                >
                  {`${vehicle.brand} ${vehicle.model}`}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{vehicle.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    <span>{formatMileage(vehicle.mileage)} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{vehicle.location}</span>
                  </div>
                  {vehicle.views && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{vehicle.views} vistas</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(vehicle.price)}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col">
                <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>Condición</span>
                <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {translatedCondition}
                </span>
              </div>
              <div className="flex flex-col">
                <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>Transmisión</span>
                <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {translatedTransmission}
                </span>
              </div>
              <div className="flex flex-col">
                <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>Combustible</span>
                <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {translatedFuelType}
                </span>
              </div>
              <div className="flex flex-col">
                <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>Estado</span>
                <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {translatedAvailability}
                </span>
              </div>
            </div>
            {vehicle.features.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.slice(0, 4).map((feature) => (
                    <span key={feature} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {vehicle.features.length > 4 && (
                    <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                      +{vehicle.features.length - 4} más
                    </span>
                  )}
                </div>
              </div>
            )}
            {/* Solución 1: Usar WARRANTY_MAP correctamente */}
            {vehicle.warranty && WARRANTY_MAP[vehicle.warranty] && (
              <div className="mt-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {WARRANTY_MAP[vehicle.warranty]}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800" : "bg-white/50 border-gray-200 hover:bg-white"
      } transition-all duration-300 hover:shadow-xl hover:-translate-y-2 backdrop-blur-sm group cursor-pointer overflow-hidden rounded-lg border relative`}
      onClick={() => window.open(`/vehicle/${vehicle._id}`, "_self")}
    >
      {vehicle.isFeatured && (
        <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          <Star className="w-3 h-3 inline mr-1" />
          Destacado
        </div>
      )}
      <div className="relative w-full h-56 overflow-hidden">
        {isImageLoading && (
          <div
            className={`absolute inset-0 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            } animate-pulse flex items-center justify-center`}
          >
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {/* Solución 5: Usar Image en lugar de img */}
        <Image
          src={imageError || !vehicle.images[0] ? "/placeholder.svg?height=200&width=300" : vehicle.images[0]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          width={300}
          height={224}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {vehicle.condition === "new" && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">
            Nuevo
          </span>
        )}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleCompare}
            className={`w-9 h-9 p-0 rounded-full ${
              isInCompareList
                ? "bg-blue-600 text-white"
                : isDarkMode
                  ? "bg-gray-900/70 hover:bg-gray-800 text-gray-300"
                  : "bg-white/70 hover:bg-white text-gray-600"
            } backdrop-blur-sm shadow-lg transition-colors`}
            title="Comparar"
          >
            <Compare className="w-4 h-4" />
          </button>
          <button
            onClick={handleFavorite}
            className={`w-9 h-9 p-0 rounded-full ${
              isDarkMode ? "bg-gray-900/70 hover:bg-gray-800" : "bg-white/70 hover:bg-white"
            } backdrop-blur-sm shadow-lg`}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited ? "fill-red-500 text-red-500" : isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            />
          </button>
          <button
            onClick={handleShare}
            className={`w-9 h-9 p-0 rounded-full ${
              isDarkMode ? "bg-gray-900/70 hover:bg-gray-800" : "bg-white/70 hover:bg-white"
            } backdrop-blur-sm shadow-lg`}
          >
            <Share2 className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
          </button>
        </div>
      </div>
      <div className="p-6">
        <h3
          className={`text-xl font-bold mb-3 ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          } group-hover:text-blue-500 transition-colors line-clamp-1`}
        >
          {`${vehicle.brand} ${vehicle.model} (${vehicle.year})`}
        </h3>
        <p className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {formatPrice(vehicle.price)}
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
              <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Kilometraje:</span>
            </div>
            <span className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {formatMileage(vehicle.mileage)} km
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
              <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Transmisión:</span>
            </div>
            <span className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {translatedTransmission}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fuel className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
              <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Combustible:</span>
            </div>
            <span className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {translatedFuelType}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
              <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Ubicación:</span>
            </div>
            <span className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {vehicle.location}
            </span>
          </div>
        </div>
        {vehicle.features.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {vehicle.features.slice(0, 3).map((feature) => (
                <span key={feature} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
              {vehicle.features.length > 3 && (
                <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                  +{vehicle.features.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        {/* Solución 1: Usar WARRANTY_MAP correctamente */}
        {vehicle.warranty && WARRANTY_MAP[vehicle.warranty] && (
          <div className="mt-3">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {WARRANTY_MAP[vehicle.warranty]}
            </span>
          </div>
        )}
      </div>
      <div className="p-6 pt-0">
        <button
          className="w-full p-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded"
          onClick={(e) => {
            e.stopPropagation()
            window.open(`/vehicle/${vehicle._id}`, "_self")
          }}
        >
          Ver Detalles
        </button>
      </div>
    </div>
  )
}

// Componente principal
const VehicleListFixed: React.FC = () => {
  const { isDarkMode } = useDarkMode()
  const { data: session } = useSession()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("relevance")

  // Estados para funcionalidades avanzadas
  const [filters, setFilters] = useState<AdvancedFilters>(INITIAL_FILTERS)
  const [compareList, setCompareList] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Opciones de filtros dinámicas
  const filterOptions = useMemo(() => {
    const uniqueStringValues = (key: keyof Vehicle) =>
      [
        ...new Set(
          vehicles
            .map((v) => v[key])
            .filter((val): val is string => typeof val === "string" && !!val)
        ),
      ]

    return {
      categories: uniqueStringValues("category"),
      subcategories: uniqueStringValues("subcategory"),
      brands: uniqueStringValues("brand"),
      conditions: [
        ...new Set(
          vehicles
            .map((v) => translateValue(v.condition, CONDITION_MAP))
            .filter((val): val is string => typeof val === "string" && !!val)
        ),
      ],
      fuelTypes: [
        ...new Set(
          vehicles
            .map((v) => translateValue(v.fuelType, FUEL_TYPE_MAP))
            .filter((val): val is string => typeof val === "string" && !!val)
        ),
      ],
      transmissions: [
        ...new Set(
          vehicles
            .map((v) => translateValue(v.transmission, TRANSMISSION_MAP))
            .filter((val): val is string => typeof val === "string" && !!val)
        ),
      ],
      locations: uniqueStringValues("location"),
      features: [
        ...new Set(
          vehicles
            .flatMap((v) => v.features)
            .filter((val): val is string => typeof val === "string" && !!val)
        ),
      ],
    }
  }, [vehicles])

  const applyFilters = useCallback(() => {
    let filtered = vehicles

    // Filtro de búsqueda
    if (filters.search) {
      const searchTerm = (filters.search || "").toLowerCase()
      filtered = filtered.filter(
        (vehicle) =>
          (vehicle.brand && vehicle.brand.toLowerCase().includes(searchTerm)) ||
          (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm)) ||
          (vehicle.description && vehicle.description.toLowerCase().includes(searchTerm)) ||
          (vehicle.features &&
            vehicle.features.some((feature) => feature && feature.toLowerCase().includes(searchTerm))) ||
          (vehicle.location && vehicle.location.toLowerCase().includes(searchTerm)) ||
          (vehicle.category && vehicle.category.toLowerCase().includes(searchTerm)),
      )
    }

    // Filtros de categoría
    if (filters.category !== "all") {
      filtered = filtered.filter((v) => v.category === filters.category)
    }
    if (filters.subcategory !== "all") {
      filtered = filtered.filter((v) => v.subcategory === filters.subcategory)
    }

    // Filtros de arrays
    if (filters.brands.length > 0) {
      filtered = filtered.filter((v) => filters.brands.includes(v.brand))
    }
    if (filters.condition.length > 0) {
      filtered = filtered.filter((v) => filters.condition.includes(translateValue(v.condition, CONDITION_MAP)))
    }
    if (filters.fuelType.length > 0) {
      filtered = filtered.filter((v) => filters.fuelType.includes(translateValue(v.fuelType, FUEL_TYPE_MAP)))
    }
    if (filters.transmission.length > 0) {
      filtered = filtered.filter((v) => filters.transmission.includes(translateValue(v.transmission, TRANSMISSION_MAP)))
    }
    if (filters.location.length > 0) {
      filtered = filtered.filter((v) => filters.location.includes(v.location))
    }

    // Filtros de rango
    filtered = filtered.filter(
      (v) =>
        v.price >= filters.priceRange[0] &&
        v.price <= filters.priceRange[1] &&
        v.year >= filters.yearRange[0] &&
        v.year <= filters.yearRange[1] &&
        v.mileage >= filters.mileageRange[0] &&
        v.mileage <= filters.mileageRange[1],
    )

    // Filtros especiales
    if (filters.hasWarranty) {
      filtered = filtered.filter((v) => v.warranty && !["no-warranty", ""].includes(v.warranty))
    }
    if (filters.isFeatured) {
      filtered = filtered.filter((v) => v.isFeatured)
    }

    // Filtro de fecha
    if (filters.postedWithin !== "all") {
      const now = new Date()
      const timeLimit = {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
      }[filters.postedWithin]

      if (timeLimit) {
        filtered = filtered.filter((v) => now.getTime() - new Date(v.createdAt).getTime() <= timeLimit)
      }
    }

    // Aplicar ordenamiento
 const sortOption = SORT_OPTIONS.find((option) => option.value === sortBy);
  if (sortOption && sortOption.key !== "relevance") {
    filtered.sort((a, b) => {
      // Solución: Manejar undefined y tipos no válidos
      const getSortableValue = (val: unknown): string | number | Date => {
        if (val === undefined || val === null) return sortOption.key === "createdAt" ? 0 : "";
        if (typeof val === "string" || typeof val === "number") {
          if (sortOption.key === "createdAt" && typeof val === "string") {
            // Try to parse date string if key is createdAt
            const date = new Date(val);
            return isNaN(date.getTime()) ? 0 : date;
          }
          return val;
        }
        if (val instanceof Date) return val;
        return sortOption.key === "createdAt" ? 0 : "";
      };

      let aValue = getSortableValue(a[sortOption.key as keyof Vehicle]);
      let bValue = getSortableValue(b[sortOption.key as keyof Vehicle]);

      if (sortOption.key === "createdAt") {
        aValue = typeof aValue === "string" || aValue instanceof Date ? new Date(aValue).getTime() : 0;
        bValue = typeof bValue === "string" || bValue instanceof Date ? new Date(bValue).getTime() : 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOption.order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOption.order === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }

  setFilteredVehicles(filtered);
  setCurrentPage(1);
}, [vehicles, filters, sortBy]);

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Función para obtener vehículos (corregida para tu estructura de datos)
  const fetchVehicles = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)
      console.log("🚀 Iniciando fetch de vehículos...")
      console.log("📋 Session:", session)

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      const accessToken = session?.accessToken
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`
        console.log("🔑 Token agregado a headers")
      }

      console.log("📡 Haciendo request a /api/admin/vehicles")
      const response = await fetch("/api/admin/vehicles", {
        method: "GET",
        headers,
      })

      console.log("📊 Response status:", response.status)
      console.log("📊 Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Error response:", errorText)
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("📦 Data recibida:", data)
      console.log("📦 Tipo de data:", typeof data)
      console.log("📦 Es array:", Array.isArray(data))

      // Manejo flexible de la respuesta
      let vehicleData = []
      if (Array.isArray(data)) {
        vehicleData = data
      } else if (data && Array.isArray(data.data)) {
        vehicleData = data.data
      } else if (data && Array.isArray(data.vehicles)) {
        vehicleData = data.vehicles
      } else if (data && typeof data === "object") {
        const possibleArrays = Object.values(data).filter(Array.isArray)
        if (possibleArrays.length > 0) {
          vehicleData = possibleArrays[0] as Vehicle[]
        }
      }

      console.log("🚗 Vehicle data extraída:", vehicleData)
      console.log("🚗 Cantidad de vehículos:", vehicleData.length)

      if (vehicleData.length === 0) {
        console.warn("⚠️ No se encontraron vehículos en la respuesta")
        setVehicles([])
        setRetryCount(0)
        return
      }

      // Validación básica (sin filtrar por valores específicos)
      const validVehicles = vehicleData.filter((vehicle: Vehicle) => {
        const isValid =
          vehicle &&
          typeof vehicle === "object" &&
          vehicle._id &&
          vehicle.brand &&
          vehicle.model &&
          vehicle.price !== undefined &&
          vehicle.year !== undefined

        if (!isValid) {
          console.warn("⚠️ Vehículo inválido filtrado:", vehicle)
        }
        return isValid
      })

      console.log("✅ Vehículos válidos procesados:", validVehicles.length)
      console.log("🚗 Primer vehículo:", validVehicles[0])

      setVehicles(validVehicles)
      setRetryCount(0)
    } catch (error) {
      console.error("❌ Error en fetchVehicles:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al cargar los vehículos"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [session])

  const handleRetry = useCallback(() => {
    setIsLoading(true)
    setRetryCount((prev) => prev + 1)
    fetchVehicles()
  }, [fetchVehicles])

  useEffect(() => {
    if (session !== undefined) fetchVehicles()
  }, [session, fetchVehicles])

  // Funciones de utilidad
  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS)
  }, [])

  const toggleCompare = useCallback((vehicleId: string) => {
    setCompareList((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : prev.length < 3 ? [...prev, vehicleId] : prev,
    )
  }, [])

  // Paginación
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Background gradient
  const backgroundStyle = useMemo(
    () => ({
      background: isDarkMode
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
        : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
    }),
    [isDarkMode],
  )

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4" style={backgroundStyle}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div
              className={`h-12 w-96 mx-auto ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse rounded-lg mb-4`}
            />
            <div className={`h-6 w-64 mx-auto ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse rounded`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`${isDarkMode ? "bg-gray-800" : "bg-white"} animate-pulse rounded-lg h-96`} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4" style={backgroundStyle}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className={`p-8 rounded-2xl backdrop-blur-sm ${
              isDarkMode ? "bg-gray-800/30 border-gray-700" : "bg-white/30 border-gray-200"
            } border shadow-2xl`}
          >
            <div className="text-6xl mb-6 animate-bounce">😔</div>
            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              ¡Oops! Algo salió mal
            </h2>
            <p className={`mb-8 text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-lg transition-all duration-300 disabled:opacity-50"
                disabled={isLoading}
              >
                <RefreshCw className={`w-5 h-5 mr-2 inline ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Reintentando..." : "Reintentar"}
              </button>
              <button
                onClick={() => {
                  console.log("🔍 Debug Info:")
                  console.log("Session:", session)
                  console.log("Error:", error)
                  console.log("Retry count:", retryCount)
                  console.log("Vehicles:", vehicles.length)
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 text-lg rounded-lg transition-all duration-300"
              >
                🔍 Debug
              </button>
            </div>
            {retryCount > 0 && (
              <p className={`mt-4 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>Intentos: {retryCount}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4" style={backgroundStyle}>
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="text-center mb-8">
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Encuentra tu Vehículo Perfecto
            </span>
          </h1>
          <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>
            Búsqueda avanzada con filtros inteligentes y comparación de vehículos
          </p>
        </div>

        {/* Estadísticas */}
        <VehicleStats vehicles={vehicles} filteredVehicles={filteredVehicles} isDarkMode={isDarkMode} />

        {/* Barra de búsqueda principal */}
        <div
          className={`p-6 rounded-2xl mb-8 backdrop-blur-sm ${
            isDarkMode ? "bg-gray-800/30 border-gray-700" : "bg-white/30 border-gray-200"
          } border shadow-xl`}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por marca, modelo, características, ubicación..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value || "",
                    }))
                  }
                  className={`pl-10 h-12 text-lg w-full ${
                    isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-white/50 border-gray-300"
                  } backdrop-blur-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <AdvancedFiltersPanel
                filters={filters}
                filterOptions={filterOptions}
                onFiltersChange={setFilters}
                onClearFilters={clearAllFilters}
                isOpen={showAdvancedFilters}
                onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
                isDarkMode={isDarkMode}
              />
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  title="Vista en cuadrícula"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
                    viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  title="Vista en lista"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`p-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {showAdvancedFilters && (
          <div className="mb-6">
            <AdvancedFiltersPanel
              filters={filters}
              filterOptions={filterOptions}
              onFiltersChange={setFilters}
              onClearFilters={clearAllFilters}
              isOpen={true}
              onToggle={() => setShowAdvancedFilters(false)}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* Panel de comparación */}
        {compareList.length > 0 && (
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {compareList.length} vehículos para comparar
            </span>
            <button
              onClick={() => console.log("Comparar:", compareList)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Compare className="w-4 h-4" />
              Comparar ({compareList.length})
            </button>
            <button
              onClick={() => setCompareList([])}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Limpiar comparación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Lista de vehículos */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-bounce">🔍</div>
            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              No se encontraron vehículos
            </h2>
            <p className={`text-lg mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {vehicles.length === 0
                ? "No hay vehículos disponibles en la base de datos."
                : "Intenta ajustar tus filtros de búsqueda."}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpiar Filtros
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
              <button
                onClick={() => {
                  console.log("🔍 Debug Info:")
                  console.log("Total vehicles:", vehicles.length)
                  console.log("Filtered vehicles:", filteredVehicles.length)
                  console.log("Current filters:", filters)
                  console.log("First vehicle:", vehicles[0])
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔍 Debug
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Grid/List de vehículos */}
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-6"
              } mb-12`}
            >
              {/* Solución 6: Remover index no usado */}
              {paginatedVehicles.map((vehicle) => (
                <div key={vehicle._id}>
                  <VehicleCard
                    vehicle={vehicle}
                    isDarkMode={isDarkMode}
                    viewMode={viewMode}
                    onToggleCompare={toggleCompare}
                    isInCompareList={compareList.includes(vehicle._id)}
                  />
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
                <div className="flex items-center gap-4">
                  <select
                    value={itemsPerPage.toString()}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
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
                      let pageNumber
                      if (totalPages <= 5) pageNumber = i + 1
                      else if (currentPage <= 3) pageNumber = i + 1
                      else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + i
                      else pageNumber = currentPage - 2 + i

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
                      )
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
                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} de {filteredVehicles.length}{" "}
                  resultados
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default VehicleListFixed
