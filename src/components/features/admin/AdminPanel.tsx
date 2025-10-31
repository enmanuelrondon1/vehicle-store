// src/components/features/admin/AdminPanel.tsx
// VERSIÓN CON DISEÑO MEJORADO - Completo y sin abreviaciones

"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getVehicleComments,
  addVehicleComment,
  getVehicleHistory,
} from "@/lib/api/admin";
import type {
  VehicleDataFrontend,
  ApprovalStatus as ApprovalStatusType,
  VehicleComment,
  VehicleHistoryEntry,
} from "@/types/types";
import { useAdminPanelEnhanced } from "@/hooks/use-admin-panel-enhanced";
import { 
  Shield, 
  Users, 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  Filter,
  Grid,
  List,
  CheckSquare,
  XSquare,
  Trash2
} from "lucide-react";

// Local components in order of first appearance in JSX
import { AdminPanelLoading } from "./AdminPanelLoading";
import { AdminPanelAccessDenied } from "./AdminPanelAccessDenied";
import { AdminPanelError } from "./AdminPanelError";
import { AdminPanelHeader } from "./AdminPanelHeader";
import { AdminFilters } from "./AdminFilters";
import { VehicleGridView } from "./VehicleGridView";
import { VehicleListView } from "./VehicleListView";
import { AdminPagination } from "./AdminPagination";
import { UsersPanel } from "./UsersPanel";
import { VehicleDetailsDialog } from "./VehicleDetailsDialog";
import { RejectDialog } from "./RejectDialog";
import { CommentDialog } from "./CommentDialog";
import { HistoryDialog } from "./HistoryDialog";
import { DeleteDialog } from "./DeleteDialog";
import { MassApproveDialog } from "./MassApproveDialog";
import { MassRejectDialog } from "./MassRejectDialog";
import { MassDeleteDialog } from "./MassDeleteDialog";

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
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleResize = (e: MediaQueryListEvent) => setIsMobileView(e.matches);

    setIsMobileView(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const {
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

  const [showMassApproveDialog, setShowMassApproveDialog] = useState(false);
  const [showMassRejectDialog, setShowMassRejectDialog] = useState(false);
  const [showMassDeleteDialog, setShowMassDeleteDialog] = useState(false);

  const [vehicleComments, setVehicleComments] = useState<VehicleComment[]>([]);
  const [vehicleHistory, setVehicleHistory] = useState<VehicleHistoryEntry[]>(
    []
  );
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [vehicleFromNotification, setVehicleFromNotification] =
    useState<VehicleDataFrontend | null>(null);

  // ========== Cálculo de Estadísticas ==========
  const { pendingCount, approvedCount, rejectedCount, totalCount } = useMemo(() => {
    const pending = allVehicles.filter(v => v.status === ApprovalStatus.PENDING).length;
    const approved = allVehicles.filter(v => v.status === ApprovalStatus.APPROVED).length;
    const rejected = allVehicles.filter(v => v.status === ApprovalStatus.REJECTED).length;
    const total = allVehicles.length;
    
    return { pendingCount: pending, approvedCount: approved, rejectedCount: rejected, totalCount: total };
  }, [allVehicles]);

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

  const handleAddComment = async (vehicleId: string, comment: string) => {
    setIsLoadingComments(true);
    try {
      const result = await addVehicleComment(vehicleId, comment);
      if (result.success) {
        await loadVehicleComments(vehicleId);
      } else {
        console.error(
          "Error al agregar comentario desde la API. La operación no tuvo éxito."
        );
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

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
    <div className="min-h-screen bg-background text-foreground py-8 px-4 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ========== ENCABEZADO MEJORADO ========== */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10 transition-all hover:scale-[1.02]">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
                Panel de Administración
              </h2>
              <p className="text-base text-muted-foreground mt-0.5">
                Gestiona vehículos y usuarios de la plataforma
              </p>
            </div>
          </div>
        </div>

        {/* ========== ESTADÍSTICAS ========== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{totalCount}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <Car className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-border hover:shadow-md transition-shadow bg-muted/20">
            <CardContent className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-accent">{pendingCount}</p> {/* Usando accent para pending */}
              </div>
              <div className="p-2 rounded-lg bg-accent/20">
                <AlertCircle className="w-5 h-5 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-border hover:shadow-md transition-shadow bg-primary/5">
            <CardContent className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Aprobados</p>
                <p className="text-2xl font-bold text-primary">{approvedCount}</p> {/* Primary para approved */}
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-border hover:shadow-md transition-shadow bg-destructive/5">
            <CardContent className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Rechazados</p>
                <p className="text-2xl font-bold text-destructive">{rejectedCount}</p>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10">
                <XSquare className="w-5 h-5 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== PESTAÑAS DE NAVEGACIÓN ========== */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AdminTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted rounded-lg shadow-sm border border-border/20 p-1">
            <TabsTrigger 
              value="vehicles" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:scale-105 rounded-md"
            >
              <Car className="w-4 h-4" />
              Vehículos
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:scale-105 rounded-md"
            >
              <Users className="w-4 h-4" />
              Usuarios
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="vehicles" className="space-y-6 mt-6">
            {/* Header mejorado */}
            <AdminPanelHeader
              isLoading={isLoading}
              exportData={exportData}
              fetchVehicles={fetchVehicles}
              setVehicleFromNotification={setVehicleFromNotification}
            />

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
              isMobileView={isMobileView}
            />

            {/* Acciones masivas */}
            {selectedVehicles.size > 0 && (
              <Card className="shadow-sm border-border bg-muted/20">
                <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm shadow-sm">
                      {selectedVehicles.size} vehículo(s) seleccionado(s)
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                      onClick={() => setShowMassApproveDialog(true)}
                    >
                      <CheckSquare className="w-4 h-4 mr-1" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all"
                      onClick={() => setShowMassRejectDialog(true)}
                    >
                      <XSquare className="w-4 h-4 mr-1" />
                      Rechazar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="hover:scale-105 transition-transform"
                      onClick={() => setShowMassDeleteDialog(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contenido principal */}
            <Card className="shadow-lg border-border">
              <CardContent className="p-3 md:p-6">
                {isMobileView ? (
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
                ) : viewMode === "grid" ? (
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
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UsersPanel />
          </TabsContent>
        </Tabs>

        {/* Dialog para ver detalles del vehículo */}
        <VehicleDetailsDialog
          vehicle={selectedVehicle}
          isOpen={!!selectedVehicle}
          onOpenChange={(open) => !open && setSelectedVehicle(null)}
        />

        {/* Dialog para rechazar con razón */}
        <RejectDialog
          isOpen={dialogState.type === "reject"}
          onOpenChange={handleCloseDialog}
          onConfirm={(reason) =>
            dialogState.vehicle &&
            handleRejectWithReason(dialogState.vehicle._id!, reason)
          }
        />

        {/* Dialog para agregar comentarios */}
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

        {/* Dialog para ver historial */}
        <HistoryDialog
          isOpen={dialogState.type === "history"}
          onOpenChange={handleCloseDialog}
          history={vehicleHistory}
          isLoading={isLoadingHistory}
        />

        {/* Dialog para confirmar eliminación */}
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
    </div>
  );
};