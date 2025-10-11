// src/components/features/admin/AdminPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDarkMode } from "@/context/DarkModeContext";
import { useAdminPanelEnhanced } from "@/hooks/use-admin-panel-enhanced";
import type {
  VehicleDataFrontend,
  ApprovalStatus as ApprovalStatusType,
} from "@/types/types";
import { AdminFilters } from "./AdminFilters";
import { VehicleGridView } from "./VehicleGridView";
import { VehicleListView } from "./VehicleListView";
import { AdminPagination } from "./AdminPagination";
import { AdminPanelLoading } from "./AdminPanelLoading";
import { AdminPanelAccessDenied } from "./AdminPanelAccessDenied";
import { AdminPanelError } from "./AdminPanelError";
import { AdminPanelHeader } from "./AdminPanelHeader";
import { VehicleDetailsDialog } from "./VehicleDetailsDialog";
import { RejectDialog } from "./RejectDialog";
import { CommentDialog } from "./CommentDialog";
import { HistoryDialog } from "./HistoryDialog";
import { DeleteDialog } from "./DeleteDialog";
import { UsersPanel } from "./UsersPanel";
import {
  getVehicleComments,
  addVehicleComment,
  getVehicleHistory,
} from "@/lib/api/admin";
import type { VehicleComment, VehicleHistoryEntry } from "@/types/types"; // AÑADIDO: Importar tipos

// Interfaces para las nuevas funcionalidades - ELIMINADAS
/*
interface VehicleComment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  type: "admin" | "system";
}

interface VehicleHistoryEntry {
  id: string;
  action: string;
  details: string;
  author: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
}
*/

// Mapeo explícito
const ApprovalStatus = {
  PENDING: "pending" as ApprovalStatusType,
  APPROVED: "approved" as ApprovalStatusType,
  REJECTED: "rejected" as ApprovalStatusType,
};

type AdminTab = "vehicles" | "users";

export const AdminPanel = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<AdminTab>("vehicles");
  const {
    // ✅ vehicles es la lista ya filtrada, ordenada y paginada.
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
  } = useAdminPanelEnhanced();

  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleDataFrontend | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(
    new Set()
  );
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [vehicleToReject, setVehicleToReject] = useState<string | null>(null);

  // Estados para las nuevas funcionalidades
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [vehicleToComment, setVehicleToComment] = useState<string | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [vehicleComments, setVehicleComments] = useState<VehicleComment[]>([]);
  const [vehicleHistory, setVehicleHistory] = useState<VehicleHistoryEntry[]>(
    []
  );
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [vehicleFromNotification, setVehicleFromNotification] =
    useState<VehicleDataFrontend | null>(null);

  // Efecto para asegurar que se cargan TODOS los vehículos al inicio
  useEffect(() => {
    const fetchAllVehiclesInitially = async () => {
      if (allVehicles.length === 0) {
        try {
          const response = await fetch("/api/admin/vehicles?status=all");
          const result = await response.json();
          if (result.success) {
            setAllVehicles(result.data);
          } else {
            console.error("Error al cargar todos los vehículos:", result.error);
          }
        } catch (error) {
          console.error("Error de red al cargar todos los vehículos:", error);
        }
      }
    };
    fetchAllVehiclesInitially();
  }, [setAllVehicles, allVehicles.length]);

  // Efecto para abrir el diálogo de detalles desde una notificación
  useEffect(() => {
    const fetchAndDisplayVehicle = async (vehicleId: string) => {
      try {
        const response = await fetch(`/api/admin/vehicles/${vehicleId}`);
        const result = await response.json();

        if (result.success) {
          const fullVehicleData: VehicleDataFrontend = result.data;
          setSelectedVehicle(fullVehicleData);

          setAllVehicles((prevVehicles) => {
            const vehicleIndex = prevVehicles.findIndex(
              (v) => v._id === fullVehicleData._id
            );
            if (vehicleIndex > -1) {
              const updatedVehicles = [...prevVehicles];
              updatedVehicles[vehicleIndex] = fullVehicleData;
              return updatedVehicles;
            }
            return [fullVehicleData, ...prevVehicles];
          });
        } else {
          console.error(
            "Error al obtener datos del vehículo desde la notificación:",
            result.error
          );
        }
      } catch (e) {
        console.error("Error en fetchAndDisplayVehicle:", e);
      } finally {
        setVehicleFromNotification(null);
      }
    };

    if (vehicleFromNotification?._id) {
      fetchAndDisplayVehicle(vehicleFromNotification._id);
    }
  }, [vehicleFromNotification, setAllVehicles]);

  // ❌ ELIMINADO: Toda esta lógica de filtrado, ordenamiento y paginación
  // ahora vive exclusivamente en el hook `useAdminPanelEnhanced` para
  // evitar problemas de sincronización.
  /*
  const displayedVehicles = useMemo(() => {
const filtered = filterVehicles(allVehicles, filters);

    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
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

    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;

    return sorted.slice(startIndex, endIndex);
  }, [allVehicles, filters, pagination]);
  */

  // ❌ ELIMINADO: El hook `useAdminPanelEnhanced` ya se encarga de
  // recalcular la paginación cuando los filtros o los datos cambian.
  /*
  useEffect(() => {
    const filteredCount = filterVehicles(allVehicles, filters).length;

    if (pagination.totalItems !== filteredCount) {
      updatePagination({ totalItems: filteredCount, currentPage: 1 });
    }
  }, [allVehicles, filters, pagination.totalItems, updatePagination]);
  */

  if (status === "loading" || isLoading) {
    return <AdminPanelLoading />;
  }

  if (!isAdmin) {
    return <AdminPanelAccessDenied />;
  }

  if (error) {
    return <AdminPanelError error={error} onRetry={fetchVehicles} />;
  }

  // Funciones para manejar comentarios
  const handleAddComment = async (vehicleId: string, comment: string) => {
    setIsLoadingComments(true);
    try {
      const result = await addVehicleComment(vehicleId, comment);
      if (result.success && result.newComment && result.newHistoryEntry) {
        setVehicleComments((prev) => [result.newComment!, ...prev]);
        setVehicleHistory((prev) => [result.newHistoryEntry!, ...prev]);
        setCommentText("");
        setShowCommentDialog(false);
      } else {
        console.error("Error al agregar comentario desde la API");
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Función para cargar comentarios
  const loadVehicleComments = async (vehicleId: string) => {
    setIsLoadingComments(true);
    try {
      const comments = await getVehicleComments(vehicleId);
      setVehicleComments(comments);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Función para cargar historial
  const loadVehicleHistory = async (vehicleId: string) => {
    setIsLoadingHistory(true);
    try {
      const history = await getVehicleHistory(vehicleId);
      setVehicleHistory(history);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Función para eliminar vehículo
  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const result = await deleteVehicle(vehicleId);

      if (result.success) {
        setShowDeleteDialog(false);
        setVehicleToDelete(null);
        console.log("Vehículo eliminado exitosamente");
      } else {
        console.error("Error al eliminar:", result.error);
      }
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
    }
  };

  const handleRejectWithReason = async (vehicleId: string, reason: string) => {
    try {
      await handleStatusChange(vehicleId, ApprovalStatus.REJECTED, reason);
      setShowRejectDialog(false);
      setVehicleToReject(null);
    } catch (error) {
      console.error("Error al rechazar:", error);
    }
  };

  const handleBulkAction = async (action: ApprovalStatusType) => {
    if (selectedVehicles.size === 0) return;

    try {
      const promises = Array.from(selectedVehicles).map((vehicleId) =>
        handleStatusChange(vehicleId, action)
      );
      await Promise.all(promises);
      setSelectedVehicles(new Set());
    } catch (error) {
      console.error("Error en acción masiva:", error);
    }
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
    // ✅ CORREGIDO: Usar `vehicles` (la lista visible) en lugar de `displayedVehicles`.
    const allIds = new Set(vehicles.map((v) => v._id!));
    setSelectedVehicles(allIds);
  };

  const clearSelection = () => {
    setSelectedVehicles(new Set());
  };

  const exportData = () => {
    const csvContent = [
      [
        "ID",
        "Marca",
        "Modelo",
        "Año",
        "Precio",
        "Estado",
        "Ubicación",
        "Vendedor",
        "Email Vendedor",
        "Teléfono Vendedor",
        "Fecha Creación",
      ],
      ...allVehicles.map((v) =>
        [
          v._id,
          `"${v.brand}"`,
          `"${v.model}"`,
          v.year,
          v.price,
          v.status,
          `"${v.location.replace(/"/g, '""')}"`,
          `"${v.sellerContact.name.replace(/"/g, '""')}"`,
          v.sellerContact.email,
          v.sellerContact.phone,
          v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vehiculos_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`min-h-screen p-2 sm:p-4 lg:p-6 ${
        isDarkMode
          ? "bg-slate-900 text-slate-200"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header mejorado */}
        <AdminPanelHeader
          isDarkMode={isDarkMode}
          isLoading={isLoading}
          exportData={exportData}
          fetchVehicles={fetchVehicles}
          setVehicleFromNotification={setVehicleFromNotification}
        />

        {/* Pestañas de navegación */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "vehicles"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("vehicles")}
          >
            Vehículos
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "users"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Usuarios
          </button>
        </div>

        {activeTab === "vehicles" && (
          <>
            {/* Filtros */}
            <AdminFilters
              filters={filters}
              onFiltersChange={updateFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              // ✅ CORREGIDO: Usar el total de la paginación, que refleja los items filtrados.
              totalResults={pagination.totalItems}
              isDarkMode={isDarkMode}
              onSelectAll={selectAllVisible}
              onClearSelection={clearSelection}
              selectedCount={selectedVehicles.size}
            />

            {/* Contenido principal */}
            <Card
              className={
                isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white"
              }
            >
              <CardContent className="p-3 md:p-6">
                {viewMode === "grid" ? (
                  <VehicleGridView
                    // ✅ CORREGIDO: Usar `vehicles` del hook.
                    vehicles={vehicles}
                    onStatusChange={handleStatusChange}
                    onVehicleSelect={setSelectedVehicle}
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <VehicleListView
                    // ✅ CORREGIDO: Usar `vehicles` del hook.
                    vehicles={vehicles}
                    selectedVehicles={selectedVehicles}
                    isDarkMode={isDarkMode}
                    onToggleSelection={toggleVehicleSelection}
                    onClearSelection={clearSelection}
                    onStatusChange={handleStatusChange}
                    onVehicleSelect={setSelectedVehicle}
                    onShowRejectDialog={(id) => {
                      setVehicleToReject(id);
                      setShowRejectDialog(true);
                    }}
                    onShowCommentDialog={(id) => {
                      setVehicleToComment(id);
                      loadVehicleComments(id);
                      setShowCommentDialog(true);
                    }}
                    onShowHistoryDialog={(id) => {
                      loadVehicleHistory(id);
                      setShowHistoryDialog(true);
                    }}
                    onShowDeleteDialog={(id) => {
                      setVehicleToDelete(id);
                      setShowDeleteDialog(true);
                    }}
                    onBulkAction={handleBulkAction}
                  />
                )}

                {/* Paginación */}
                <div className="mt-6">
                  <AdminPagination
                    pagination={pagination}
                    onPageChange={goToPage}
                    onItemsPerPageChange={(itemsPerPage) =>
                      updatePagination({ itemsPerPage })
                    }
                    onNextPage={nextPage}
                    onPrevPage={prevPage}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "users" && <UsersPanel />}
      </div>

      {/* Dialog para ver detalles del vehículo */}
      <VehicleDetailsDialog
        vehicle={selectedVehicle}
        isOpen={!!selectedVehicle}
        onOpenChange={(open) => !open && setSelectedVehicle(null)}
        isDarkMode={isDarkMode}
      />

      {/* Dialog para rechazar con razón - MEJORADO */}
      <RejectDialog
        isOpen={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onConfirm={(reason) =>
          vehicleToReject && handleRejectWithReason(vehicleToReject, reason)
        }
        isDarkMode={isDarkMode}
      />

      {/* Dialog para agregar comentarios - MEJORADO */}
      <CommentDialog
        isOpen={showCommentDialog}
        onOpenChange={setShowCommentDialog}
        comments={vehicleComments}
        isLoading={isLoadingComments}
        commentText={commentText}
        setCommentText={setCommentText}
        onAddComment={() =>
          vehicleToComment && handleAddComment(vehicleToComment, commentText)
        }
        isDarkMode={isDarkMode}
      />

      {/* Dialog para ver historial - MEJORADO */}
      <HistoryDialog
        isOpen={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        history={vehicleHistory}
        isLoading={isLoadingHistory}
        isDarkMode={isDarkMode}
      />

      {/* Dialog para confirmar eliminación - MEJORADO */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() =>
          vehicleToDelete && handleDeleteVehicle(vehicleToDelete)
        }
        isDarkMode={isDarkMode}
      />
    </div>
  );
};