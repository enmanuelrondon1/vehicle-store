
// TODO: COMPONENTE DIVIDIDO
//src/components/sections/VehicleList/VehicleList.tsx
//src/components/sections/VehicleList/VehicleList.tsx
"use client";

import type React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import VehicleListHeader from "./VehicleListHeader";
import VehicleStats from "./VehicleStats";
import SearchBar from "./SearchBar";
import VehicleGrid from "./VehicleGrid";
import PaginationControls from "./PaginationControls";
import NoResults from "./NoResults";
import ErrorMessage from "./ErrorMessage";
import LoadingSkeleton from "./LoadingSkeleton";
import CompareBar from "./CompareBar";
import {
  Vehicle, // Importar Vehicle desde types.ts
  VehicleCondition,
  TransmissionType,
  FuelType,
  WarrantyType,
  ApprovalStatus,
} from "@/types/types";
import { useDarkMode } from "@/context/DarkModeContext";
import AdvancedFiltersPanel from "./AdvancedFiltersPanel";

// Mapeos de traducción usando enums
const CONDITION_MAP = {
  [VehicleCondition.NEW]: "Nuevo",
  [VehicleCondition.USED]: "Usado",
  [VehicleCondition.CERTIFIED]: "Certificado",
} as const;

const FUEL_TYPE_MAP = {
  [FuelType.GASOLINE]: "Gasolina",
  [FuelType.DIESEL]: "Diésel",
  [FuelType.HYBRID]: "Híbrido",
  [FuelType.ELECTRIC]: "Eléctrico",
  [FuelType.PLUG_IN_HYBRID]: "Híbrido enchufable",
  [FuelType.GAS]: "Gas",
  [FuelType.HYDROGEN]: "Hidrógeno",
} as const;

const TRANSMISSION_MAP = {
  [TransmissionType.MANUAL]: "Manual",
  [TransmissionType.AUTOMATIC]: "Automática",
  [TransmissionType.CVT]: "CVT",
  [TransmissionType.DUAL_CLUTCH]: "Doble embrague",
} as const;

const STATUS_MAP = {
  [ApprovalStatus.PENDING]: "Pendiente",
  [ApprovalStatus.APPROVED]: "Aprobado",
  [ApprovalStatus.REJECTED]: "Rechazado",
} as const;



// Remover la definición duplicada de Vehicle interface
// La interfaz Vehicle ahora se importa desde @/types/types

export interface AdvancedFilters {
  search: string;
  category: string;
  subcategory: string;
  brands: string[];
  priceRange: [number, number];
  yearRange: [number, number];
  mileageRange: [number, number];
  condition: string[];
  fuelType: string[];
  transmission: string[];
  location: string[];
  features: string[];
  status: ApprovalStatus | "all";
  hasWarranty: boolean;
  isFeatured: boolean;
  postedWithin: string;
}

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
  status: "all",
  hasWarranty: false,
  isFeatured: false,
  postedWithin: "all",
};

const translateValue = (value: string, map: Record<string, string>): string => {
  return map[value] || value;
};

const VehicleList: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const { data: session } = useSession();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState<AdvancedFilters>(INITIAL_FILTERS);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

 const filterOptions = useMemo(() => {
  // Función para propiedades que sabemos que existen
  const uniqueStringValues = (key: keyof Vehicle) => [
    ...new Set(
      vehicles
        .map((v) => v[key])
        .filter((val): val is string => typeof val === "string" && !!val)
    ),
  ];

  // Función genérica para cualquier propiedad (incluidas las opcionales)
  const getUniqueValues = <T extends keyof Vehicle>(key: T) => [
    ...new Set(
      vehicles
        .map((v) => v[key])
        .filter(
          (val): val is NonNullable<Vehicle[T]> => val != null && val !== ""
        )
    ),
  ];

  return {
    categories: uniqueStringValues("category"),
    subcategories: getUniqueValues("subcategory").filter(Boolean) as string[], // ← Corrección
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
    statuses: [
      ...new Set(
        vehicles
          .map((v) => translateValue(v.status, STATUS_MAP))
          .filter((val): val is string => typeof val === "string" && !!val)
      ),
    ],
  };
}, [vehicles]);

  const applyFilters = useCallback(() => {
    let filtered = vehicles;

    if (filters.search) {
      const searchTerm = (filters.search || "").toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          (vehicle.brand && vehicle.brand.toLowerCase().includes(searchTerm)) ||
          (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm)) ||
          (vehicle.description &&
            vehicle.description.toLowerCase().includes(searchTerm)) ||
          (vehicle.features &&
            vehicle.features.some(
              (feature) => feature && feature.toLowerCase().includes(searchTerm)
            )) ||
          (vehicle.location &&
            vehicle.location.toLowerCase().includes(searchTerm)) ||
          (vehicle.category &&
            vehicle.category.toLowerCase().includes(searchTerm))
      );
    }

     if (filters.category !== "all") {
    filtered = filtered.filter((v) => v.category === filters.category);
  }
  if (filters.subcategory !== "all") {
    filtered = filtered.filter((v) => v.subcategory === filters.subcategory); // ← Funciona ahora
  }
  if (filters.brands.length > 0) {
    filtered = filtered.filter((v) => filters.brands.includes(v.brand));
  }
    if (filters.condition.length > 0) {
      filtered = filtered.filter((v) =>
        filters.condition.includes(translateValue(v.condition, CONDITION_MAP))
      );
    }
    if (filters.fuelType.length > 0) {
      filtered = filtered.filter((v) =>
        filters.fuelType.includes(translateValue(v.fuelType, FUEL_TYPE_MAP))
      );
    }
    if (filters.transmission.length > 0) {
      filtered = filtered.filter((v) =>
        filters.transmission.includes(
          translateValue(v.transmission, TRANSMISSION_MAP)
        )
      );
    }
    if (filters.location.length > 0) {
      filtered = filtered.filter((v) => filters.location.includes(v.location));
    }
    if (filters.status !== "all") {
      filtered = filtered.filter((v) => v.status === filters.status);
    }
    filtered = filtered.filter(
      (v) =>
        v.price >= filters.priceRange[0] &&
        v.price <= filters.priceRange[1] &&
        v.year >= filters.yearRange[0] &&
        v.year <= filters.yearRange[1] &&
        v.mileage >= filters.mileageRange[0] &&
        v.mileage <= filters.mileageRange[1]
    );
    if (filters.hasWarranty) {
      filtered = filtered.filter(
        (v) => v.warranty && v.warranty !== WarrantyType.NO_WARRANTY
      );
    }
    if (filters.isFeatured) {
      filtered = filtered.filter((v) => v.isFeatured);
    }
   if (filters.postedWithin !== "all") {
  const now = new Date();
  const timeLimit = {
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  }[filters.postedWithin];

  if (timeLimit) {
    filtered = filtered.filter((v) => {
      // Usar createdAt si está disponible, sino usar postedDate
      const dateToCheck = v.createdAt || v.postedDate;
      
      // Verificar que la fecha no sea undefined
      if (!dateToCheck) {
        return false; // Excluir vehículos sin fecha
      }

      try {
        const vehicleDate = new Date(dateToCheck);
        
        // Verificar que la fecha sea válida
        if (isNaN(vehicleDate.getTime())) {
          return false;
        }

        return now.getTime() - vehicleDate.getTime() <= timeLimit;
      } catch (error) {
        console.warn('Error parsing date:', dateToCheck, error);
        return false;
      }
    });
  }
}
    const sortOption = [
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
    ].find((option) => option.value === sortBy);
   if (sortOption && sortOption.key !== "relevance") {
  filtered.sort((a, b) => {
    const getSortableValue = (val: unknown): string | number | Date => {
      if (val === undefined || val === null) {
        return sortOption.key === "createdAt" ? 0 : "";
      }
      
      if (typeof val === "string" || typeof val === "number") {
        if (sortOption.key === "createdAt" && typeof val === "string") {
          try {
            const date = new Date(val);
            return isNaN(date.getTime()) ? 0 : date;
          } catch {
            return 0;
          }
        }
        return val;
      }
      
      if (val instanceof Date) return val;
      return sortOption.key === "createdAt" ? 0 : "";
    };

    let aValue = getSortableValue(a[sortOption.key as keyof Vehicle]);
    let bValue = getSortableValue(b[sortOption.key as keyof Vehicle]);

    if (sortOption.key === "createdAt") {
      // Manejar fechas de forma más robusta
      const getDateValue = (vehicle: Vehicle): number => {
        const dateToCheck = vehicle.createdAt || vehicle.postedDate;
        if (!dateToCheck) return 0;
        
        try {
          const date = new Date(dateToCheck);
          return isNaN(date.getTime()) ? 0 : date.getTime();
        } catch {
          return 0;
        }
      };

      aValue = getDateValue(a);
      bValue = getDateValue(b);
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
    applyFilters();
  }, [applyFilters]);

  // const fetchVehicles = useCallback(async () => {
  //   try {
  //     setError(null);
  //     setIsLoading(true);
  //     console.log("🚀 Iniciando fetch de vehículos...");
  //     console.log("📋 Session:", session);

  //     const headers: HeadersInit = {
  //       "Content-Type": "application/json",
  //     };

  //     const accessToken = session?.accessToken;
  //     if (accessToken) {
  //       headers.Authorization = `Bearer ${accessToken}`;
  //       console.log("🔑 Token agregado a headers");
  //     }

  //     console.log("📡 Haciendo request a /api/vehicles");
  //     const response = await fetch("/api/vehicles", {
  //       method: "GET",
  //       headers,
  //     });

  //     console.log("📊 Response status:", response.status);
  //     console.log("📊 Response ok:", response.ok);

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error("❌ Error response:", errorText);
  //       throw new Error(`Error ${response.status}: ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     console.log("📦 Data recibida:", data);
  //     console.log("📦 Tipo de data:", typeof data);
  //     console.log("📦 Es array:", Array.isArray(data));

  //     let vehicleData: Vehicle[] = [];
  //     if (Array.isArray(data)) {
  //       vehicleData = data;
  //     } else if (data && Array.isArray(data.data)) {
  //       vehicleData = data.data;
  //     } else if (data && Array.isArray(data.vehicles)) {
  //       vehicleData = data.vehicles;
  //     } else if (data && typeof data === "object") {
  //       const possibleArrays = Object.values(data).filter(Array.isArray);
  //       if (possibleArrays.length > 0) {
  //         vehicleData = possibleArrays[0] as Vehicle[];
  //       }
  //     }

  //     console.log("🚗 Vehicle data extraída:", vehicleData);
  //     console.log("🚗 Cantidad de vehículos:", vehicleData.length);

  //     const validVehicles = vehicleData.filter((vehicle: Vehicle) => {
  //       const isValid =
  //         vehicle &&
  //         typeof vehicle === "object" &&
  //         vehicle._id &&
  //         vehicle.brand &&
  //         vehicle.model &&
  //         vehicle.price !== undefined &&
  //         vehicle.year !== undefined;
  //       return isValid;
  //     });

  //     console.log("✅ Vehículos válidos procesados:", validVehicles.length);
  //     console.log("🚗 Primer vehículo:", validVehicles[0]);

  //     setVehicles(validVehicles);
  //     setRetryCount(0);
  //   } catch (error) {
  //     console.error("❌ Error en fetchVehicles:", error);
  //     const errorMessage =
  //       error instanceof Error
  //         ? error.message
  //         : "Error desconocido al cargar los vehículos";
  //     setError(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [session]);


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

      console.log("📡 Haciendo request a /api/vehicles")
      const response = await fetch("/api/vehicles", {
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

      let vehicleData: Vehicle[] = []
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

      const validVehicles = vehicleData.filter((vehicle: Vehicle) => {
        const isValid =
          vehicle &&
          typeof vehicle === "object" &&
          vehicle._id &&
          vehicle.brand &&
          vehicle.model &&
          vehicle.price !== undefined &&
          vehicle.year !== undefined &&
          vehicle.status === ApprovalStatus.APPROVED

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
    setIsLoading(true);
    setRetryCount((prev) => prev + 1);
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    if (session !== undefined) fetchVehicles();
  }, [session, fetchVehicles]);

  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const toggleCompare = useCallback((vehicleId: string) => {
    setCompareList((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : prev.length < 3
        ? [...prev, vehicleId]
        : prev
    );
  }, []);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backgroundStyle = useMemo(
    () => ({
      background: isDarkMode
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
        : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
    }),
    [isDarkMode]
  );

  if (isLoading) {
    return <LoadingSkeleton isDarkMode={isDarkMode} />;
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        handleRetry={handleRetry}
        isLoading={isLoading}
        retryCount={retryCount}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={backgroundStyle}>
      <div className="max-w-7xl mx-auto">
        <VehicleListHeader isDarkMode={isDarkMode} />
        <VehicleStats
          filteredVehicles={filteredVehicles}
          isDarkMode={isDarkMode}
        />
        <SearchBar
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showAdvancedFilters={showAdvancedFilters}
          setShowAdvancedFilters={setShowAdvancedFilters}
          isDarkMode={isDarkMode}
          clearAllFilters={clearAllFilters}
          filterOptions={filterOptions}
        />
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
        {compareList.length > 0 && (
          <CompareBar
            compareList={compareList}
            setCompareList={setCompareList}
            isDarkMode={isDarkMode}
          />
        )}
        {filteredVehicles.length === 0 ? (
          <NoResults
            vehicles={vehicles.length}
            clearAllFilters={clearAllFilters}
            handleRetry={handleRetry}
            isDarkMode={isDarkMode}
          />
        ) : (
          <>
            <VehicleGrid
              vehicles={paginatedVehicles}
              viewMode={viewMode}
              isDarkMode={isDarkMode}
              compareList={compareList}
              toggleCompare={toggleCompare}
            />
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                filteredVehicles={filteredVehicles.length}
                goToPage={goToPage}
                setItemsPerPage={setItemsPerPage}
                isDarkMode={isDarkMode}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleList;






