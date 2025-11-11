// src/hooks/use-admin-panel-enhanced.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import type { VehicleDataFrontend } from "@/types/types";
import { ApprovalStatus } from "@/types/types";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/utils/export";

// Define the expected structure for the stats object
interface VehicleStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  sold: number;
  featured: number;
}

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
  const [stats, setStats] = useState<VehicleStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    sold: 0,
    featured: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(
    new Set()
  );

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

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/vehicles/stats", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Error fetching stats`);
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/admin/vehicles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      let vehiclesData: VehicleDataFrontend[] = [];

      if (data.success && data.data) {
        vehiclesData = data.data;
      } else if (data.vehicles) {
        vehiclesData = data.vehicles;
      } else if (Array.isArray(data)) {
        vehiclesData = data;
      }

      const validVehicles = Array.isArray(vehiclesData) ? vehiclesData : [];
      setVehicles(validVehicles);
    } catch (err) {
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
    let filtered = [...vehicles];

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
        (vehicle) =>
          vehicle.category && filters.category.includes(vehicle.category)
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

    if (filters.featured !== "all") {
      filtered = filtered.filter(
        (vehicle: VehicleDataFrontend) =>
          vehicle.isFeatured === filters.featured
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

    return filtered;
  }, [vehicles, filters]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredAndSortedVehicles.slice(startIndex, endIndex);
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
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchVehicles();
      fetchStats();
    }
  }, [status, session]);

  const handleStatusChange = (
    vehicleId: string,
    newStatus: ApprovalStatus,
    reason?: string,
    options: { showToast?: boolean } = { showToast: true }
  ): Promise<VehicleDataFrontend | undefined> => {
    const vehicleData = vehicles.find((v) => v._id === vehicleId);

    const promise = new Promise<VehicleDataFrontend | undefined>(
      async (resolve, reject) => {
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

          setVehicles((prev) =>
            prev.map((vehicle) =>
              vehicle._id === vehicleId
                ? { ...vehicle, status: newStatus }
                : vehicle
            )
          );

          fetchStats();
          resolve(vehicleData);
        } catch (err) {
          reject(err);
        }
      }
    );

    if (options.showToast) {
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
    }

    return promise;
  };

  const updateFilters = (newFilters: Partial<AdminPanelFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const updatePagination = (updates: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...updates }));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      updatePagination({ currentPage: page });
    }
  };

  const nextPage = () => goToPage(pagination.currentPage + 1);
  const prevPage = () => goToPage(pagination.currentPage - 1);

  const deleteVehicle = (
    vehicleId: string,
    options: { showToast?: boolean } = { showToast: true }
  ): Promise<{ success: boolean }> => {
    const vehicleData = vehicles.find((v) => v._id === vehicleId);
    const vehicleName =
      vehicleData && vehicleData.brand && vehicleData.model
        ? `${vehicleData.brand} ${vehicleData.model}`
        : "El vehículo";

    const promise = new Promise<{ success: boolean }>(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || "Error al eliminar el vehículo");
        }

        setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
        fetchStats();
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });

    if (options.showToast) {
      toast.promise(promise, {
        loading: `Eliminando ${vehicleName}...`,
        success: `${vehicleName} ha sido eliminado exitosamente.`,
        error: (err: Error) => `Error al eliminar: ${err.message}`,
      });
    }

    return promise;
  };

  const toggleVehicleSelection = (vehicleId: string) => {
    const newSelected = new Set(selectedVehicles);
    if (newSelected.has(vehicleId)) {
      newSelected.delete(vehicleId);
    } else {
      newSelected.add(vehicleId);
    }
    setSelectedVehicles(newSelected);
  };

  const selectAllVisible = () => {
    const allIds = new Set(filteredAndSortedVehicles.map((v) => v._id!));
    setSelectedVehicles(allIds);
  };

  const clearSelection = () => {
    setSelectedVehicles(new Set());
  };

  const handleMassApprove = async () => {
    if (selectedVehicles.size === 0) return;
    const promise = Promise.all(
      Array.from(selectedVehicles).map((id) =>
        handleStatusChange(id, ApprovalStatus.APPROVED, undefined, {
          showToast: false,
        })
      )
    );

    toast.promise(promise, {
      loading: `Aprobando ${selectedVehicles.size} vehículo(s)...`,
      success: () => {
        clearSelection();
        return `${selectedVehicles.size} vehículo(s) aprobados.`;
      },
      error: "Error en la aprobación masiva.",
    });
  };

  const handleMassReject = async (reason: string) => {
    if (selectedVehicles.size === 0) return;
    const promise = Promise.all(
      Array.from(selectedVehicles).map((id) =>
        handleStatusChange(id, ApprovalStatus.REJECTED, reason, {
          showToast: false,
        })
      )
    );

    toast.promise(promise, {
      loading: `Rechazando ${selectedVehicles.size} vehículo(s)...`,
      success: () => {
        clearSelection();
        return `${selectedVehicles.size} vehículo(s) rechazados.`;
      },
      error: "Error en el rechazo masivo.",
    });
  };

  const handleMassDelete = async () => {
    if (selectedVehicles.size === 0) return;
    const promise = Promise.all(
      Array.from(selectedVehicles).map((id) =>
        deleteVehicle(id, { showToast: false })
      )
    );

    toast.promise(promise, {
      loading: `Eliminando ${selectedVehicles.size} vehículo(s)...`,
      success: (results) => {
        const successCount = results.filter(
          (r) => r.success
        ).length;
        clearSelection();
        return `${successCount} de ${selectedVehicles.size} vehículo(s) eliminados.`;
      },
      error: "Error en la eliminación masiva.",
    });
  };

  const exportData = () => {
    const dataToExport = filteredAndSortedVehicles;
    if (dataToExport.length === 0) {
      toast.warning("No hay datos para exportar.");
      return;
    }

    const formattedData = dataToExport.map((v) => ({
      ID: v._id,
      Marca: v.brand,
      Modelo: v.model,
      Año: v.year,
      Precio: v.price,
      Estado: v.status,
      Vendedor: v.sellerContact?.name || "N/A",
      EmailVendedor: v.sellerContact?.email || "N/A",
      FechaCreacion: v.createdAt
        ? new Date(v.createdAt).toLocaleDateString()
        : "N/A",
      Vistas: v.views,
      Destacado: v.isFeatured ? "Sí" : "No",
    }));

    exportToCSV(
      formattedData,
      `vehiculos-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  return {
    vehicles: paginatedVehicles,
    stats,
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
    setVehicles,
    filteredAndSortedVehicles,
    selectedVehicles,
    toggleVehicleSelection,
    selectAllVisible,
    clearSelection,
    handleMassApprove,
    handleMassReject,
    handleMassDelete,
    exportData,
  };
};