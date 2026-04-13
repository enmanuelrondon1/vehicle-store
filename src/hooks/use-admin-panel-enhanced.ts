// src/hooks/use-admin-panel-enhanced.ts
"use client";

import { useState, useEffect, useCallback } from "react";
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
import { getVehicleComments, addVehicleComment, getVehicleHistory } from "@/lib/api/admin";

// ── Types ─────────────────────────────────────────────────────────────────────
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

export type SortByType = "newest" | "oldest" | "price-low" | "price-high" | "views";

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

// ── Build query params — todos los filtros ────────────────────────────────────
const buildParams = (
  f: AdminPanelFilters,
  page: number,
  limit: number,
): URLSearchParams => {
  const params = new URLSearchParams({
    page:  String(page),
    limit: String(limit),
    status: f.status,
    sortBy: f.sortBy,
  });

  if (f.search)             params.set("search", f.search);
  if (f.category.length > 0) params.set("category", f.category.join(","));
  if (f.priceRange[0] > 0)   params.set("priceMin", String(f.priceRange[0]));
  if (f.priceRange[1] < 1000000) params.set("priceMax", String(f.priceRange[1]));
  if (f.featured !== "all")  params.set("featured", String(f.featured));
  if (f.dateRange[0])        params.set("dateFrom", f.dateRange[0].toISOString());
  if (f.dateRange[1])        params.set("dateTo",   f.dateRange[1].toISOString());

  return params;
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAdminPanelEnhanced = () => {
  const { data: session, status } = useSession();

  const [vehicles, setVehicles] = useState<VehicleDataFrontend[]>([]);
  const [stats, setStats] = useState<VehicleStats>({
    total: 0, pending: 0, approved: 0, rejected: 0, sold: 0, featured: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [viewMode, setViewMode]   = useState<"grid" | "list">("grid");

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

  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());
  const [selectedVehicle, setSelectedVehicle]   = useState<VehicleDataFrontend | null>(null);
  const [dialogState, setDialogState]           = useState<DialogState>({ type: null, vehicle: null });
  const [showMassApproveDialog, setShowMassApproveDialog] = useState(false);
  const [showMassRejectDialog,  setShowMassRejectDialog]  = useState(false);
  const [showMassDeleteDialog,  setShowMassDeleteDialog]  = useState(false);
  const [vehicleComments,  setVehicleComments]  = useState<VehicleComment[]>([]);
  const [vehicleHistory,   setVehicleHistory]   = useState<VehicleHistoryEntry[]>([]);
  const [isLoadingDialogContent, setIsLoadingDialogContent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  // ── Stats ─────────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/vehicles/stats");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch { /* non-critical */ }
  }, []);

  // ── Vehicles ──────────────────────────────────────────────────────────────
  const fetchVehicles = useCallback(async (
    overrideFilters?: Partial<AdminPanelFilters>,
    overridePage?: number,
    overrideLimit?: number,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const f     = overrideFilters ? { ...filters, ...overrideFilters } : filters;
      const page  = overridePage  ?? pagination.currentPage;
      const limit = overrideLimit ?? pagination.itemsPerPage;

      const params = buildParams(f, page, limit);
      const res = await fetch(`/api/admin/vehicles?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Error desconocido");

      setVehicles(data.data.vehicles ?? []);
      setPagination((prev) => ({
        ...prev,
        totalItems: data.data.pagination.total,
        totalPages: data.data.pagination.totalPages,
        currentPage: data.data.pagination.page,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar vehículos");
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.itemsPerPage]);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "authenticated" && isAdmin) {
      Promise.all([fetchVehicles(), fetchStats()]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isAdmin]);

  // ── Re-fetch on filter change (reset to page 1) ───────────────────────────
  // Search tiene debounce de 400ms, el resto es inmediato
  useEffect(() => {
    if (status !== "authenticated" || !isAdmin) return;
    const isSearchChange = true; // always debounce a little to batch rapid changes
    const delay = filters.search ? 400 : 0;
    const timer = setTimeout(() => {
      fetchVehicles(undefined, 1);
    }, delay);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.status,
    filters.search,
    filters.sortBy,
    filters.category,
    filters.priceRange,
    filters.featured,
    filters.dateRange,
    status,
    isAdmin,
  ]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchVehicles(undefined, page);
  }, [pagination.totalPages, fetchVehicles]);

  const nextPage = useCallback(() => goToPage(pagination.currentPage + 1), [goToPage, pagination.currentPage]);
  const prevPage = useCallback(() => goToPage(pagination.currentPage - 1), [goToPage, pagination.currentPage]);

  const updatePagination = useCallback((updates: Partial<PaginationState>) => {
    setPagination((prev) => {
      const next = { ...prev, ...updates };
      if (updates.itemsPerPage && updates.itemsPerPage !== prev.itemsPerPage) {
        fetchVehicles(undefined, 1, updates.itemsPerPage);
      }
      return next;
    });
  }, [fetchVehicles]);

  // ── Filters ───────────────────────────────────────────────────────────────
  const updateFilters = useCallback((newFilters: Partial<AdminPanelFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // ── Selection ─────────────────────────────────────────────────────────────
  const toggleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicles((prev) => {
      const next = new Set(prev);
      next.has(vehicleId) ? next.delete(vehicleId) : next.add(vehicleId);
      return next;
    });
  };
  const selectAllVisible = () => setSelectedVehicles(new Set(vehicles.map((v) => v._id!)));
  const clearSelection   = () => setSelectedVehicles(new Set());

  // ── Status change ─────────────────────────────────────────────────────────
  const handleStatusChange = async (
    vehicleId: string,
    newStatus: ApprovalStatusType,
    reason?: string,
    options = { showToast: true },
  ) => {
    const promise = (async () => {
      const body: { status: ApprovalStatusType; rejectionReason?: string } = { status: newStatus };
      if (reason) body.rejectionReason = reason;
      const res = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      setVehicles((prev) =>
        prev.map((v) => (v._id === vehicleId ? { ...v, status: newStatus } : v))
      );
      fetchStats();
    })();
    if (options.showToast) {
      toast.promise(promise, {
        loading: "Actualizando estado...",
        success: `Vehículo actualizado a ${newStatus}.`,
        error: "Error al actualizar estado.",
      });
    }
    return promise;
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteVehicle = async (vehicleId: string, options = { showToast: true }) => {
    const promise = (async () => {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
      fetchStats();
    })();
    if (options.showToast) {
      toast.promise(promise, {
        loading: "Eliminando vehículo...",
        success: "Vehículo eliminado.",
        error: "Error al eliminar.",
      });
    }
    return promise;
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const exportData = () => {
    if (vehicles.length === 0) { toast.warning("No hay datos para exportar."); return; }
    const rows = vehicles.map((v) => ({
      ID: v._id, Marca: v.brand, Modelo: v.model, Año: v.year,
      Precio: v.price, Estado: v.status,
      Vendedor: v.sellerContact?.name || "N/A",
      EmailVendedor: v.sellerContact?.email || "N/A",
      FechaCreacion: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "N/A",
      Vistas: v.views, Destacado: v.isFeatured ? "Sí" : "No",
    }));
    exportToCSV(rows, `vehiculos-${new Date().toISOString().split("T")[0]}.csv`);
  };

  // ── Mass actions ──────────────────────────────────────────────────────────
  const handleMassApprove = async () => {
    const promise = Promise.all(
      Array.from(selectedVehicles).map((id) =>
        handleStatusChange(id, ApprovalStatus.APPROVED, undefined, { showToast: false })
      )
    );
    toast.promise(promise, {
      loading: `Aprobando ${selectedVehicles.size} vehículo(s)...`,
      success: () => { clearSelection(); return `${selectedVehicles.size} aprobado(s).`; },
      error: "Error en la aprobación masiva.",
    });
    return promise;
  };

  const handleMassReject = async (reason: string) => {
    const promise = Promise.all(
      Array.from(selectedVehicles).map((id) =>
        handleStatusChange(id, ApprovalStatus.REJECTED, reason, { showToast: false })
      )
    );
    toast.promise(promise, {
      loading: `Rechazando ${selectedVehicles.size} vehículo(s)...`,
      success: () => { clearSelection(); return `${selectedVehicles.size} rechazado(s).`; },
      error: "Error en el rechazo masivo.",
    });
    return promise;
  };

  const handleMassDelete = async () => {
    const promise = Promise.all(
      Array.from(selectedVehicles).map((id) => deleteVehicle(id, { showToast: false }))
    );
    toast.promise(promise, {
      loading: `Eliminando ${selectedVehicles.size} vehículo(s)...`,
      success: () => { clearSelection(); return `${selectedVehicles.size} eliminado(s).`; },
      error: "Error en la eliminación masiva.",
    });
    return promise;
  };

  // ── Dialogs ───────────────────────────────────────────────────────────────
  const handleCloseDialog = () => {
    setDialogState({ type: null, vehicle: null });
    setSelectedVehicle(null);
  };

  const handleShowRejectDialog  = (v: VehicleDataFrontend) => setDialogState({ type: "reject",  vehicle: v });
  const handleShowDeleteDialog  = (v: VehicleDataFrontend) => setDialogState({ type: "delete",  vehicle: v });

  const handleShowCommentDialog = async (v: VehicleDataFrontend) => {
    setDialogState({ type: "comment", vehicle: v });
    setIsLoadingDialogContent(true);
    try { setVehicleComments(await getVehicleComments(v._id!)); }
    catch { toast.error("Error al cargar comentarios."); }
    finally { setIsLoadingDialogContent(false); }
  };

  const handleShowHistoryDialog = async (v: VehicleDataFrontend) => {
    setDialogState({ type: "history", vehicle: v });
    setIsLoadingDialogContent(true);
    try { setVehicleHistory(await getVehicleHistory(v._id!)); }
    catch { toast.error("Error al cargar el historial."); }
    finally { setIsLoadingDialogContent(false); }
  };

  const handleAddComment = async (vehicleId: string, comment: string) => {
    setIsSubmitting(true);
    try {
      await addVehicleComment(vehicleId, comment);
      setVehicleComments(await getVehicleComments(vehicleId));
      toast.success("Comentario agregado.");
    } catch { toast.error("Error al agregar comentario."); }
    finally { setIsSubmitting(false); }
  };

  const handleRejectWithReason = async (vehicleId: string, reason: string) => {
    setIsSubmitting(true);
    try { await handleStatusChange(vehicleId, ApprovalStatus.REJECTED, reason); handleCloseDialog(); }
    catch { toast.error("Error al rechazar el vehículo."); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    setIsSubmitting(true);
    try { await deleteVehicle(vehicleId); handleCloseDialog(); }
    finally { setIsSubmitting(false); }
  };

  const handleMassApproveAndClose = async () => { await handleMassApprove(); setShowMassApproveDialog(false); };
  const handleMassRejectAndClose  = async (r: string) => { await handleMassReject(r); setShowMassRejectDialog(false); };
  const handleMassDeleteAndClose  = async () => { await handleMassDelete(); setShowMassDeleteDialog(false); };

  const setVehicleFromNotification = (vehicle: VehicleDataFrontend | null) => {
    if (vehicle) setSelectedVehicle(vehicle);
  };

  // ── Return ────────────────────────────────────────────────────────────────
  return {
    vehicles,
    allFilteredVehicles: vehicles,
    stats, isLoading, error, isAdmin, status,
    fetchVehicles, viewMode, setViewMode,
    filters, updateFilters,
    pagination, updatePagination, goToPage, nextPage, prevPage,
    selectedVehicles, toggleVehicleSelection, selectAllVisible, clearSelection,
    handleStatusChange, exportData,
    handleMassApprove, handleMassReject, handleMassDelete,
    selectedVehicle, setSelectedVehicle,
    dialogState, handleCloseDialog,
    handleShowRejectDialog, handleShowDeleteDialog,
    handleShowCommentDialog, handleShowHistoryDialog,
    vehicleComments, vehicleHistory,
    isLoadingDialogContent, isSubmitting,
    handleAddComment, handleRejectWithReason, handleDeleteVehicle,
    showMassApproveDialog, setShowMassApproveDialog,
    showMassRejectDialog,  setShowMassRejectDialog,
    showMassDeleteDialog,  setShowMassDeleteDialog,
    handleMassApproveAndClose, handleMassRejectAndClose, handleMassDeleteAndClose,
    setVehicleFromNotification,
  };
};