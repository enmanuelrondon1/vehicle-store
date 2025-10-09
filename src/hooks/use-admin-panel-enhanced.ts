// src/hooks/use-admin-panel-enhanced.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
// ✅ CORRECCIÓN: Importar ApprovalStatus como valor, no solo como tipo
import type { VehicleDataFrontend } from "@/types/types";
import { ApprovalStatus } from "@/types/types";

export interface AdminPanelFilters {
  status: ApprovalStatus | "all";
  search: string;
  category: string;
  priceRange: [number, number];
  sortBy: SortByType;
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

  const [filters, setFilters] = useState<AdminPanelFilters>({
    status: "all",
    search: "",
    category: "all",
    priceRange: [0, 1000000],
    sortBy: "newest",
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
    // console.log("🔍 Starting filter process...")
    // console.log("📋 Current filters:", filters)
    // console.log("🏗️ All vehicles count:", allVehicles.length)

    let filtered = [...allVehicles];

    if (filters.status !== "all") {
      // console.log("🎯 Filtering by status:", filters.status)
      // const beforeCount = filtered.length
      filtered = filtered.filter((vehicle) => {
        const matches = vehicle.status === filters.status;
        // console.log(`Vehicle ${vehicle._id?.slice(-6)}: status='${vehicle.status}' matches='${matches}'`)
        return matches;
      });
      // console.log(`📊 Status filter: ${beforeCount} → ${filtered.length}`)
    } else {
      // console.log("🌐 Showing all statuses")
    }

    if (filters.search) {
      // const searchLower = filters.search.toLowerCase();
      // const beforeCount = filtered.length
      filtered = filtered.filter((vehicle) => {
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

    if (filters.category !== "all") {
      // const beforeCount = filtered.length
      filtered = filtered.filter(
        (vehicle) => vehicle.category === filters.category
      );
      // console.log(`🏷️ Category filter: ${beforeCount} → ${filtered.length}`)
    }

    // const beforePriceCount = filtered.length
    filtered = filtered.filter(
      (vehicle) =>
        vehicle.price >= filters.priceRange[0] &&
        vehicle.price <= filters.priceRange[1]
    );
    // console.log(`💰 Price filter: ${beforePriceCount} → ${filtered.length}`)

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

  // ✅ CORRECCIÓN: Ahora ApprovalStatus.REJECTED funcionará correctamente
  const handleStatusChange = async (
    vehicleId: string,
    newStatus: ApprovalStatus,
    reason?: string
  ) => {
    try {
      // console.log("🔄 Changing status:", { vehicleId, newStatus, reason })

      const body: { status: ApprovalStatus; rejectionReason?: string } = {
        status: newStatus,
      };
      // ✅ Ahora esto funcionará correctamente
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

      const result = await response.json();

      if (result.success && result.data) {
        // ✅ CORRECCIÓN: Reemplazar todo el objeto del vehículo con los datos actualizados de la API
        // Esto asegura que el rejectionReason y cualquier otro campo se actualicen en la UI.
        setAllVehicles((prev) =>
          prev.map((vehicle) =>
            vehicle._id === vehicleId ? result.data : vehicle
          )
        );
      } else {
        // Fallback por si la API no devuelve los datos completos
        setAllVehicles((prev) =>
          prev.map((vehicle) =>
            vehicle._id === vehicleId
              ? { ...vehicle, status: newStatus }
              : vehicle
          )
        );
      }

      // console.log("✅ Status updated successfully")
    } catch (err) {
      // console.error("❌ Status change error:", err)
      setError(err instanceof Error ? err.message : "Error al actualizar");
    }
  };

  const updateFilters = (newFilters: Partial<AdminPanelFilters>) => {
    // console.log("🔄 Updating filters:", newFilters)
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
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
