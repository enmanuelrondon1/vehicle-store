// src/hooks/use-admin-panel-enhanced.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import type {
  VehicleDataFrontend,
  ApprovalStatus as ApprovalStatusType,
  VehicleComment,
  VehicleHistoryEntry,
} from "@/types/types";
import { ApprovalStatus } from "@/types/types";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/utils/export";
import {
  getVehicleComments,
  addVehicleComment,
  getVehicleHistory,
} from "@/lib/api/admin";

// Types
interface VehicleStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  sold: number;
  featured: number;
}

export interface AdminPanelFilters {
  status: ApprovalStatusType | "all";
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

export type DialogType = "reject" | "comment" | "history" | "delete";

export interface DialogState {
  type: DialogType | null;
  vehicle: VehicleDataFrontend | null;
}

// The Hook
export const useAdminPanelEnhanced = () => {
  const { data: session, status } = useSession();

  // Core Data State
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

  // UI State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters & Pagination State
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

  // Selection State
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(
    new Set()
  );

  // Dialogs State
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleDataFrontend | null>(null); // For details dialog
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    vehicle: null,
  });
  const [showMassApproveDialog, setShowMassApproveDialog] = useState(false);
  const [showMassRejectDialog, setShowMassRejectDialog] = useState(false);
  const [showMassDeleteDialog, setShowMassDeleteDialog] = useState(false);
  const [vehicleComments, setVehicleComments] = useState<VehicleComment[]>([]);
  const [vehicleHistory, setVehicleHistory] = useState<VehicleHistoryEntry[]>(
    []
  );
  const [isLoadingDialogContent, setIsLoadingDialogContent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  // Data Fetching
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/vehicles/stats");
      if (!response.ok) throw new Error("Error fetching stats");
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/vehicles");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      const vehiclesData = data.success ? data.data : data.vehicles || data;
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unknown error fetching vehicles"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && isAdmin) {
      fetchVehicles();
      fetchStats();
    }
  }, [status, isAdmin]);

  // Memos for derived data
  const getValidDate = (dateStr: string | undefined, fallback: string) =>
    new Date(dateStr || fallback);

  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = [...vehicles];
    // Filtering logic...
    if (filters.status !== "all") {
      filtered = filtered.filter((v) => v.status === filters.status);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.brand?.toLowerCase().includes(searchLower) ||
          v.model?.toLowerCase().includes(searchLower) ||
          v.location?.toLowerCase().includes(searchLower) ||
          v.sellerContact?.name?.toLowerCase().includes(searchLower)
      );
    }
    // ... other filters
    // Sorting logic...
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            getValidDate(b.createdAt, b.postedDate).getTime() -
            getValidDate(a.createdAt, a.postedDate).getTime()
          );
        case "oldest":
          return (
            getValidDate(a.createdAt, a.postedDate).getTime() -
            getValidDate(b.createdAt, b.postedDate).getTime()
          );
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
    return filteredAndSortedVehicles.slice(
      startIndex,
      startIndex + pagination.itemsPerPage
    );
  }, [
    filteredAndSortedVehicles,
    pagination.currentPage,
    pagination.itemsPerPage,
  ]);

  useEffect(() => {
    const totalItems = filteredAndSortedVehicles.length;
    setPagination((prev) => ({
      ...prev,
      totalItems,
      totalPages: Math.ceil(totalItems / prev.itemsPerPage),
      currentPage: 1, // Reset to first page on filter change
    }));
  }, [filteredAndSortedVehicles.length, pagination.itemsPerPage]);

  // Core Actions
  const handleStatusChange = async (
    vehicleId: string,
    newStatus: ApprovalStatusType,
    reason?: string,
    options = { showToast: true }
  ) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const body: { status: ApprovalStatusType; rejectionReason?: string } = {
          status: newStatus,
        };
        if (reason) body.rejectionReason = reason;

        const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(await response.text());

        setVehicles((prev) =>
          prev.map((v) => (v._id === vehicleId ? { ...v, status: newStatus } : v))
        );
        fetchStats();
        resolve(vehicles.find((v) => v._id === vehicleId));
      } catch (err) {
        reject(err);
      }
    });

    if (options.showToast) {
      toast.promise(promise, {
        loading: "Actualizando estado...",
        success: `Vehículo actualizado a ${newStatus}.`,
        error: "Error al actualizar estado.",
      });
    }
    return promise;
  };

  const deleteVehicle = async (
    vehicleId: string,
    options = { showToast: true }
  ) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error(await response.text());
        setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
        fetchStats();
        resolve({ success: true });
      } catch (err) {
        reject(err);
      }
    });

    if (options.showToast) {
      toast.promise(promise, {
        loading: "Eliminando vehículo...",
        success: "Vehículo eliminado.",
        error: "Error al eliminar.",
      });
    }
    return promise;
  };

  // Filters and Pagination Handlers
  const updateFilters = (newFilters: Partial<AdminPanelFilters>) =>
    setFilters((prev) => ({ ...prev, ...newFilters }));
  const updatePagination = (updates: Partial<PaginationState>) =>
    setPagination((prev) => ({ ...prev, ...updates }));
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages)
      updatePagination({ currentPage: page });
  };
  const nextPage = () => goToPage(pagination.currentPage + 1);
  const prevPage = () => goToPage(pagination.currentPage - 1);

  // Selection Handlers
  const toggleVehicleSelection = (vehicleId: string) => {
    const newSelected = new Set(selectedVehicles);
    newSelected.has(vehicleId)
      ? newSelected.delete(vehicleId)
      : newSelected.add(vehicleId);
    setSelectedVehicles(newSelected);
  };
  const selectAllVisible = () =>
    setSelectedVehicles(new Set(filteredAndSortedVehicles.map((v) => v._id!)));
  const clearSelection = () => setSelectedVehicles(new Set());

  // Mass Actions
  const handleMassApprove = async () => {
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
    return promise;
  };

  const handleMassReject = async (reason: string) => {
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
    return promise;
  };

  const handleMassDelete = async () => {
    const promise = Promise.all(
      Array.from(selectedVehicles).map((id) =>
        deleteVehicle(id, { showToast: false })
      )
    );
    toast.promise(promise, {
      loading: `Eliminando ${selectedVehicles.size} vehículo(s)...`,
      success: () => {
        clearSelection();
        return `${selectedVehicles.size} vehículo(s) eliminados.`;
      },
      error: "Error en la eliminación masiva.",
    });
    return promise;
  };

  // Export
  const exportData = () => {
    if (filteredAndSortedVehicles.length === 0) {
      toast.warning("No hay datos para exportar.");
      return;
    }
    const formattedData = filteredAndSortedVehicles.map((v) => ({
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

  // Dialog Logic
  const handleCloseDialog = () => {
    setDialogState({ type: null, vehicle: null });
    setSelectedVehicle(null);
  };

  const handleShowRejectDialog = (vehicle: VehicleDataFrontend) =>
    setDialogState({ type: "reject", vehicle });
  const handleShowDeleteDialog = (vehicle: VehicleDataFrontend) =>
    setDialogState({ type: "delete", vehicle });

  const handleShowCommentDialog = async (vehicle: VehicleDataFrontend) => {
    setDialogState({ type: "comment", vehicle });
    setIsLoadingDialogContent(true);
    try {
      setVehicleComments(await getVehicleComments(vehicle._id!));
    } catch (error) {
      toast.error("Error al cargar comentarios.");
    } finally {
      setIsLoadingDialogContent(false);
    }
  };

  const handleShowHistoryDialog = async (vehicle: VehicleDataFrontend) => {
    setDialogState({ type: "history", vehicle });
    setIsLoadingDialogContent(true);
    try {
      setVehicleHistory(await getVehicleHistory(vehicle._id!));
    } catch (error) {
      toast.error("Error al cargar el historial.");
    } finally {
      setIsLoadingDialogContent(false);
    }
  };

  const handleAddComment = async (vehicleId: string, comment: string) => {
    setIsSubmitting(true);
    try {
      await addVehicleComment(vehicleId, comment);
      setVehicleComments(await getVehicleComments(vehicleId));
      toast.success("Comentario agregado.");
    } catch (error) {
      toast.error("Error al agregar comentario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectWithReason = async (vehicleId: string, reason: string) => {
    setIsSubmitting(true);
    try {
      await handleStatusChange(vehicleId, ApprovalStatus.REJECTED, reason);
      handleCloseDialog();
    } catch (error) {
      toast.error("Error al rechazar el vehículo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    setIsSubmitting(true);
    try {
      await deleteVehicle(vehicleId);
      handleCloseDialog();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMassApproveAndClose = async () => {
    await handleMassApprove();
    setShowMassApproveDialog(false);
  };
  const handleMassRejectAndClose = async (reason: string) => {
    await handleMassReject(reason);
    setShowMassRejectDialog(false);
  };
  const handleMassDeleteAndClose = async () => {
    await handleMassDelete();
    setShowMassDeleteDialog(false);
  };

  const setVehicleFromNotification = (vehicle: VehicleDataFrontend | null) => {
    if (vehicle) {
      setSelectedVehicle(vehicle);
    }
  };

  return {
    // Core Data & Status
    vehicles: paginatedVehicles,
    allFilteredVehicles: filteredAndSortedVehicles,
    stats,
    isLoading,
    error,
    isAdmin,
    status,
    fetchVehicles,
    // UI
    viewMode,
    setViewMode,
    // Filters
    filters,
    updateFilters,
    // Pagination
    pagination,
    updatePagination,
    goToPage,
    nextPage,
    prevPage,
    // Selection
    selectedVehicles,
    toggleVehicleSelection,
    selectAllVisible,
    clearSelection,
    // Actions
    handleStatusChange,
    exportData,
    // Mass Actions
    handleMassApprove,
    handleMassReject,
    handleMassDelete,
    // Dialogs State & Handlers
    selectedVehicle,
    setSelectedVehicle,
    dialogState,
    handleCloseDialog,
    handleShowRejectDialog,
    handleShowDeleteDialog,
    handleShowCommentDialog,
    handleShowHistoryDialog,
    vehicleComments,
    vehicleHistory,
    isLoadingDialogContent,
    isSubmitting,
    handleAddComment,
    handleRejectWithReason,
    handleDeleteVehicle,
    // Mass Action Dialogs
    showMassApproveDialog,
    setShowMassApproveDialog,
    showMassRejectDialog,
    setShowMassRejectDialog,
    showMassDeleteDialog,
    setShowMassDeleteDialog,
    handleMassApproveAndClose,
    handleMassRejectAndClose,
    handleMassDeleteAndClose,
    setVehicleFromNotification,
  };
};