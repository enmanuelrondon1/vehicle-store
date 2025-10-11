// src/hooks/use-admin-panel-enhanced.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
// ✅ CORRECCIÓN: Importar ApprovalStatus como valor, no solo como tipo
import type { VehicleDataFrontend } from "@/types/types";
import { ApprovalStatus } from "@/types/types";
import { toast } from "sonner"

export interface AdminPanelFilters {
  status: ApprovalStatus | "all";
  search: string;
  category: string[];
  priceRange: [number, number];
  sortBy: SortByType;
  dateRange: [Date | null, Date | null];
  featured: boolean | "all";
}
export type SortByType =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "views";

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export const useAdminPanelEnhanced = () => {
  const { data: session, status } = useSession();
  const [vehicles, setVehicles] = useState<VehicleDataFrontend[]>([]);
  const [allVehicles, setAllVehicles] = useState<VehicleDataFrontend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  // ELIMINADO: El estado `recentlyUpdatedVehicleId` y su lógica asociada,
  // ya que volvemos al enfoque anterior que funcionaba correctamente.

  const [filters, setFilters] = useState<AdminPanelFilters>({
    status: "all",
    search: "",
    category: [],
    priceRange: [0, 1000000],
    sortBy: "newest",
    dateRange: [null, null],
    featured: "all",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const isAdmin = session?.user?.role === "admin";

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // console.log("🚗 Fetching vehicles...")

      const response = await fetch("/api/admin/vehicles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // console.log("📡 Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("📊 Raw API response:", data);

      let vehiclesData: VehicleDataFrontend[] = [];

      if (data.success && data.data) {
        vehiclesData = data.data;
      } else if (data.vehicles) {
        vehiclesData = data.vehicles;
      } else if (data.data) {
        vehiclesData = data.data;
      } else if (Array.isArray(data)) {
        vehiclesData = data;
      }

      // console.log("🔧 Processed vehicles data:", vehiclesData)
      // console.log("📈 Total vehicles found:", vehiclesData.length)

      const validVehicles = Array.isArray(vehiclesData) ? vehiclesData : [];
      setAllVehicles(validVehicles);

      // console.log("📊 Vehicles by status:", statusStats)
    } catch (err) {
      // console.error("❌ Fetch error:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar vehículos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getValidDate = (
    dateValue: string | undefined,
    fallback: string
  ): Date => {
    if (!dateValue) return new Date(fallback);
    try {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? new Date(fallback) : date;
    } catch {
      return new Date(fallback);
    }
  };

  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = [...allVehicles];

    if (filters.status !== "all") {
      filtered = filtered.filter((vehicle) => {
        return vehicle.status === filters.status;
      });
    }

    if (filters.search) {
      filtered = filtered.filter((vehicle: VehicleDataFrontend) => {
        const searchLower = filters.search.toLowerCase();
        return (
          (vehicle.brand?.toLowerCase() ?? "").includes(searchLower) ||
          (vehicle.model?.toLowerCase() ?? "").includes(searchLower) ||
          (vehicle.location?.toLowerCase() ?? "").includes(searchLower) ||
          (vehicle.sellerContact?.name?.toLowerCase() ?? "").includes(
            searchLower
          ) ||
          (vehicle.description?.toLowerCase() ?? "").includes(searchLower)
        );
      });
    }

    if (filters.category.length > 0) {
      filtered = filtered.filter(
        (vehicle) => vehicle.category && filters.category.includes(vehicle.category)
      );
    }

    filtered = filtered.filter(
      (vehicle) =>
        vehicle.price >= filters.priceRange[0] &&
        vehicle.price <= filters.priceRange[1]
    );

    if (filters.dateRange[0] && filters.dateRange[1]) {
      const [startDate, endDate] = filters.dateRange;
      const start = new Date(startDate.setHours(0, 0, 0, 0));
      const end = new Date(endDate.setHours(23, 59, 59, 999));

      filtered = filtered.filter((vehicle: VehicleDataFrontend) => {
        const vehicleDate = getValidDate(vehicle.createdAt, vehicle.postedDate);
        return vehicleDate >= start && vehicleDate <= end;
      });
    }

    // Filtrado por destacado
    if (filters.featured !== "all") {
      filtered = filtered.filter(
        (vehicle: VehicleDataFrontend) => vehicle.isFeatured === filters.featured
      );
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest": {
          const dateA = getValidDate(a.createdAt, a.postedDate);
          const dateB = getValidDate(b.createdAt, b.postedDate);
          return dateB.getTime() - dateA.getTime();
        }
        case "oldest": {
          const dateA = getValidDate(a.createdAt, a.postedDate);
          const dateB = getValidDate(b.createdAt, b.postedDate);
          return dateA.getTime() - dateB.getTime();
        }
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "views":
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    // console.log("✅ Final filtered vehicles:", filtered.length)
    return filtered;
  }, [allVehicles, filters]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const paginated = filteredAndSortedVehicles.slice(startIndex, endIndex);

    // console.log("📄 Pagination:")
    // console.log("  Current page:", pagination.currentPage)
    // console.log("  Items per page:", pagination.itemsPerPage)
    // console.log("  Start index:", startIndex)
    // console.log("  End index:", endIndex)
    // console.log("  Total filtered:", filteredAndSortedVehicles.length)
    // console.log("  Paginated count:", paginated.length)

    return paginated;
  }, [
    filteredAndSortedVehicles,
    pagination.currentPage,
    pagination.itemsPerPage,
  ]);

  useEffect(() => {
    const totalItems = filteredAndSortedVehicles.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    const newCurrentPage = Math.min(
      pagination.currentPage,
      Math.max(1, totalPages)
    );

    setPagination((prev) => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: newCurrentPage,
    }));
  }, [
    filteredAndSortedVehicles.length,
    pagination.itemsPerPage,
    pagination.currentPage,
  ]);

  useEffect(() => {
    // console.log("🔄 Setting vehicles from pagination:", paginatedVehicles.length)
    setVehicles(paginatedVehicles);
  }, [paginatedVehicles]);

  useEffect(() => {
    // console.log("🔄 Session effect:", { status, role: session?.user?.role })
    if (status === "authenticated" && session?.user?.role === "admin") {
      // console.log("✅ User is authenticated admin, fetching vehicles...")
      fetchVehicles();
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      // console.log("❌ User is authenticated but not admin")
    }
  }, [status, session]);

  // ✅ SOLUCIÓN: Se reincorpora la lógica del código funcional anterior,
  // adaptada a la estructura de `toast.promise`.
  const handleStatusChange = async (
    vehicleId: string,
    newStatus: ApprovalStatus,
    reason?: string
  ) => {
    // Obtenemos los datos del vehículo antes de la actualización para usarlos en el toast.
    const vehicleData = allVehicles.find((v) => v._id === vehicleId);

    const promise = () =>
      new Promise<VehicleDataFrontend | undefined>(async (resolve, reject) => {
        try {
          const body: { status: ApprovalStatus; rejectionReason?: string } = {
            status: newStatus,
          };
          if (reason && newStatus === ApprovalStatus.REJECTED) {
            body.rejectionReason = reason;
          }

          const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
          }

          // LÓGICA CLAVE DEL CÓDIGO ANTIGUO:
          // Se actualiza solo el estado en el cliente de forma optimista.
          setAllVehicles((prev) =>
            prev.map((vehicle) =>
              vehicle._id === vehicleId
                ? { ...vehicle, status: newStatus }
                : vehicle
            )
          );

          // Resolvemos la promesa con los datos del vehículo para el mensaje de éxito.
          resolve(vehicleData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error al actualizar");
          reject(err);
        }
      });

    toast.promise(promise, {
      loading: "Actualizando estado...",
      success: (data: VehicleDataFrontend | undefined) => {
        let vehicleName = "El vehículo";
        if (data && data.brand && data.model) {
          vehicleName = `${data.brand} ${data.model}`;
        }

        let statusText = "";
        switch (newStatus) {
          case ApprovalStatus.APPROVED:
            statusText = "aprobado";
            break;
          case ApprovalStatus.REJECTED:
            statusText = "rechazado";
            break;
          case ApprovalStatus.PENDING:
            statusText = "marcado como pendiente";
            break;
        }

        return `${vehicleName} ha sido ${statusText} correctamente.`;
      },
      error: "Error al actualizar el estado.",
    });
  };

  const updateFilters = (newFilters: Partial<AdminPanelFilters>) => {
    // console.log("🔄 Updating filters:", newFilters)
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    // ELIMINADO: Ya no es necesario resetear `recentlyUpdatedVehicleId`.
  };

  const updatePagination = (updates: Partial<PaginationState>) => {
    // console.log("🔄 Updating pagination:", updates)
    setPagination((prev) => ({ ...prev, ...updates }));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      updatePagination({ currentPage: page });
    }
  };

  const nextPage = () => goToPage(pagination.currentPage + 1);
  const prevPage = () => goToPage(pagination.currentPage - 1);

  const deleteVehicle = async (vehicleId: string) => {
    try {
      const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el vehículo");
      }
      // Actualizar la lista local
      setAllVehicles((prev) => prev.filter((v) => v._id !== vehicleId));

      return { success: true };
    } catch (error) {
      // console.error("Error al eliminar vehículo:", error);
      setError(
        error instanceof Error ? error.message : "Error al eliminar vehículo"
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  };

  return {
    vehicles,
    allVehicles,
    isLoading,
    error,
    isAdmin,
    status,
    viewMode,
    setViewMode,
    filters,
    updateFilters,
    pagination,
    updatePagination,
    goToPage,
    nextPage,
    prevPage,
    handleStatusChange,
    fetchVehicles,
    deleteVehicle,
    setAllVehicles,
  };
};