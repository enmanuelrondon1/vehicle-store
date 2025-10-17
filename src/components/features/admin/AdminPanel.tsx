// src/components/features/admin/AdminPanel.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { MassApproveDialog } from "./MassApproveDialog";
import { MassRejectDialog } from "./MassRejectDialog";
import { MassDeleteDialog } from "./MassDeleteDialog";
import {
  getVehicleComments,
  addVehicleComment,
  getVehicleHistory,
} from "@/lib/api/admin";
import type { VehicleComment, VehicleHistoryEntry } from "@/types/types"; // AÑADIDO: Importar tipos
import { Button } from "@/components/ui/button";

// Mapeo explícito
const ApprovalStatus = {
  PENDING: "pending" as ApprovalStatusType,
  APPROVED: "approved" as ApprovalStatusType,
  REJECTED: "rejected" as ApprovalStatusType,
};

type AdminTab = "vehicles" | "users";

type DialogType = "reject" | "comment" | "history" | "delete";

interface DialogState {
  type: DialogType | null;
  vehicle: VehicleDataFrontend | null;
}

export const AdminPanel = () => {
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

  const categoryCounts = useMemo(() => {
    return allVehicles.reduce(
      (acc, vehicle) => {
        if (vehicle.category) {
          acc[vehicle.category] = (acc[vehicle.category] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );
  }, [allVehicles]);

  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleDataFrontend | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(
    new Set()
  );
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    vehicle: null,
  });

  // Estados para diálogos de acciones masivas
  const [showMassApproveDialog, setShowMassApproveDialog] = useState(false);
  const [showMassRejectDialog, setShowMassRejectDialog] = useState(false);
  const [showMassDeleteDialog, setShowMassDeleteDialog] = useState(false);

  // Estados para las nuevas funcionalidades
  const [vehicleComments, setVehicleComments] = useState<VehicleComment[]>([]);
  const [vehicleHistory, setVehicleHistory] = useState<VehicleHistoryEntry[]>(
    []
  );
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [vehicleFromNotification, setVehicleFromNotification] =
    useState<VehicleDataFrontend | null>(null);

  const handleShowRejectDialog = (vehicle: VehicleDataFrontend) => {
    setDialogState({ type: "reject", vehicle });
  };

  const handleShowCommentDialog = (vehicle: VehicleDataFrontend) => {
    setDialogState({ type: "comment", vehicle });
    loadVehicleComments(vehicle._id!);
  };

  const handleShowHistoryDialog = (vehicle: VehicleDataFrontend) => {
    setDialogState({ type: "history", vehicle });
    loadVehicleHistory(vehicle._id!);
  };

  const handleShowDeleteDialog = (vehicle: VehicleDataFrontend) => {
    setDialogState({ type: "delete", vehicle });
  };

  const handleCloseDialog = () => {
    setDialogState({ type: null, vehicle: null });
  };

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
      if (result.success) {
        // El diálogo de comentarios limpia su propio campo de texto.
        // Solo necesitamos volver a cargar los comentarios para mostrar el nuevo.
        await loadVehicleComments(vehicleId);
      } else {
        console.error(
          "Error al agregar comentario desde la API. La operación no tuvo éxito."
        );
        // Aquí podrías mostrar una notificación de error al usuario.
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      // Aquí también podrías mostrar una notificación de error.
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
        handleCloseDialog();
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
      handleCloseDialog();
    } catch (error) {
      console.error("Error al rechazar:", error);
    }
  };

  const handleMassApprove = async () => {
    await handleBulkAction(ApprovalStatus.APPROVED);
    setShowMassApproveDialog(false);
  };

  const handleMassReject = async (reason: string) => {
    if (selectedVehicles.size === 0) return;
    try {
      const promises = Array.from(selectedVehicles).map((vehicleId) =>
        handleStatusChange(vehicleId, ApprovalStatus.REJECTED, reason)
      );
      await Promise.all(promises);
      setSelectedVehicles(new Set());
    } catch (error) {
      console.error("Error en rechazo masivo:", error);
    }
    setShowMassRejectDialog(false);
  };

  const handleMassDelete = async () => {
    if (selectedVehicles.size === 0) return;
    try {
      const promises = Array.from(selectedVehicles).map((vehicleId) =>
        deleteVehicle(vehicleId)
      );
      await Promise.all(promises);
      setSelectedVehicles(new Set());
} catch (error) {
      console.error("Error en eliminación masiva:", error);
    }
    setShowMassDeleteDialog(false);
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
    <div className="bg-background text-foreground min-h-screen p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header mejorado */}
        <AdminPanelHeader
          isLoading={isLoading}
          exportData={exportData}
          fetchVehicles={fetchVehicles}
          setVehicleFromNotification={setVehicleFromNotification}
        />

        {/* Pestañas de navegación */}
        <div className="flex border-b border-border">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "vehicles"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("vehicles")}
          >
            Vehículos
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "users"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
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
              totalResults={pagination.totalItems}
              onSelectAll={selectAllVisible}
              onClearSelection={clearSelection}
              selectedCount={selectedVehicles.size}
              categoryCounts={categoryCounts}
            />

            {/* Acciones masivas */}
            {selectedVehicles.size > 0 && (
              <Card>
                <CardContent className="p-4 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold">
                    {selectedVehicles.size} vehículo(s) seleccionado(s)
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    onClick={() => setShowMassApproveDialog(true)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                    onClick={() => setShowMassRejectDialog(true)}
                  >
                    Rechazar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setShowMassDeleteDialog(true)}
                  >
                    Eliminar
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Contenido principal */}
            <Card>
              <CardContent className="p-3 md:p-6">
                {viewMode === "grid" ? (
                  <VehicleGridView
                    vehicles={vehicles}
                    onStatusChange={handleStatusChange}
                    onVehicleSelect={setSelectedVehicle}
                    selectedVehicles={selectedVehicles}
                    onToggleSelection={toggleVehicleSelection}
                    onShowRejectDialog={handleShowRejectDialog}
                    onShowCommentDialog={handleShowCommentDialog}
                    onShowHistoryDialog={handleShowHistoryDialog}
                    onShowDeleteDialog={handleShowDeleteDialog}
                  />
                ) : (
                  <VehicleListView
                    vehicles={vehicles}
                    selectedVehicles={selectedVehicles}
                    onToggleSelection={toggleVehicleSelection}
                    onClearSelection={clearSelection}
                    onStatusChange={handleStatusChange}
                    onVehicleSelect={setSelectedVehicle}
                    onShowRejectDialog={handleShowRejectDialog}
                    onShowCommentDialog={handleShowCommentDialog}
                    onShowHistoryDialog={handleShowHistoryDialog}
                    onShowDeleteDialog={handleShowDeleteDialog}
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
      />

      {/* Dialog para rechazar con razón - MEJORADO */}
      <RejectDialog
        isOpen={dialogState.type === "reject"}
        onOpenChange={handleCloseDialog}
        onConfirm={(reason) =>
          dialogState.vehicle &&
          handleRejectWithReason(dialogState.vehicle._id!, reason)
        }
      />

      {/* Dialog para agregar comentarios - MEJORADO */}
      <CommentDialog
        isOpen={dialogState.type === "comment"}
        onOpenChange={handleCloseDialog}
        comments={vehicleComments}
        isLoading={isLoadingComments}
        onAddComment={(comment) => {
          if (dialogState.vehicle) {
            handleAddComment(dialogState.vehicle._id!, comment);
          }
        }}
      />

      {/* Dialog para ver historial - MEJORADO */}
      <HistoryDialog
        isOpen={dialogState.type === "history"}
        onOpenChange={handleCloseDialog}
        history={vehicleHistory}
        isLoading={isLoadingHistory}
      />

      {/* Dialog para confirmar eliminación - MEJORADO */}
      <DeleteDialog
        isOpen={dialogState.type === "delete"}
        onOpenChange={handleCloseDialog}
        onConfirm={() =>
          dialogState.vehicle && handleDeleteVehicle(dialogState.vehicle._id!)
        }
      />

      {/* Diálogos de acciones masivas */}
      <MassApproveDialog
        isOpen={showMassApproveDialog}
        onOpenChange={setShowMassApproveDialog}
        onConfirm={handleMassApprove}
        count={selectedVehicles.size}
      />
      <MassRejectDialog
        isOpen={showMassRejectDialog}
        onOpenChange={setShowMassRejectDialog}
        onConfirm={handleMassReject}
        count={selectedVehicles.size}
      />
      <MassDeleteDialog
        isOpen={showMassDeleteDialog}
        onOpenChange={setShowMassDeleteDialog}
        onConfirm={handleMassDelete}
        count={selectedVehicles.size}
      />
    </div>
  );
};