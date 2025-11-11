// src/components/features/admin/AdminPanel.tsx
// VERSIÓN CON DISEÑO MEJORADO - Vista grid por defecto y scroll mejorado

"use client";
import { useState, useEffect, useMemo, useRef } from "react";
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
import { exportToCSV } from "@/lib/utils/export";
import {
  Shield,
  Users,
  Car,
  Download,
  Filter,
  Grid,
  List,
  CheckSquare,
  XSquare,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
// Local components in order of first appearance in JSX
import { AdminPanelLoading } from "./AdminPanelLoading";
import { AdminPanelAccessDenied } from "./AdminPanelAccessDenied";
import { AdminPanelError } from "./AdminPanelError";
import { AdminPanelHeader } from "./AdminPanelHeader";
import { AdminStats } from "./AdminStats";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminDialogs } from "./AdminDialogs";

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("vehicles");
  const [isMobileView, setIsMobileView] = useState(false);

  // Ref para mantener la posición del scroll
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleResize = (e: MediaQueryListEvent) => setIsMobileView(e.matches);

    setIsMobileView(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const {
    vehicles,
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
  } = useAdminPanelEnhanced();

  // Establecer vista grid como predeterminada
  useEffect(() => {
    if (viewMode !== "grid" && viewMode !== "list") {
      setViewMode("grid");
    }
  }, []);

 
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========== Guardar posición del scroll ==========
  useEffect(() => {
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ========== Restaurar scroll después de actualizaciones ==========
  useEffect(() => {
    if (!isLoading && scrollPositionRef.current > 0) {
      // Pequeño delay para asegurar que el DOM se haya actualizado
      const timer = setTimeout(() => {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: "smooth",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [vehicles, isLoading]);



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

  // ELIMINADO: Este useEffect cargaba todos los vehículos y ya no es necesario.
  // useEffect(() => { ... }, [setAllVehicles, allVehicles.length]);

  useEffect(() => {
    const fetchAndDisplayVehicle = async (vehicleId: string) => {
      try {
        const response = await fetch(`/api/admin/vehicles/${vehicleId}`);
        const result = await response.json();

        if (result.success) {
          const fullVehicleData: VehicleDataFrontend = result.data;
          setSelectedVehicle(fullVehicleData);
          // Simplemente refrescamos los datos para asegurar que todo esté actualizado
          fetchVehicles();
          window.scrollTo({ top: 0, behavior: "smooth" });
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
  }, [vehicleFromNotification, fetchVehicles]);

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
        toast.success("Comentario agregado exitosamente.");
      } else {
        // CORRECCIÓN: Se elimina la referencia a result.error
        toast.error("Error al agregar comentario", {
          description:
            "La operación no tuvo éxito. Por favor, inténtelo de nuevo.",
        });
      }
    } catch (error) {
      toast.error("Error al agregar comentario", {
        description:
          "Ocurrió un error de red. Por favor, verifique su conexión.",
      });
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
      toast.error("Error al cargar comentarios", {
        description: "No se pudieron obtener los comentarios del vehículo.",
      });
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
      toast.error("Error al cargar el historial", {
        description: "No se pudo obtener el historial del vehículo.",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await deleteVehicle(vehicleId);
      handleCloseDialog();
    } catch (error) {
      console.error("Fallo el proceso de eliminación:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectWithReason = async (vehicleId: string, reason: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await handleStatusChange(vehicleId, ApprovalStatus.REJECTED, reason);
      handleCloseDialog();
    } catch (error) {
      toast.error("Error al rechazar el vehículo", {
        description:
          "Ocurrió un error inesperado. Por favor, inténtelo de nuevo.",
      });
      console.error("Error al rechazar:", error);
    } finally {
      setIsSubmitting(false);
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
      toast.success(
        `${selectedVehicles.size} vehículo(s) han sido rechazados.`
      );
      setSelectedVehicles(new Set());
    } catch (error) {
      toast.error("Error en el rechazo masivo", {
        description: "Algunos vehículos no pudieron ser rechazados.",
      });
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
      const results = await Promise.allSettled(promises);

      const successCount = results.filter(
        (r) =>
          r.status === "fulfilled" && (r.value as { success: boolean }).success
      ).length;
      const errorCount = results.length - successCount;
if (successCount > 0) {
        toast.success(
          `${successCount} vehículo(s) han sido eliminados exitosamente.`
        );
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} vehículo(s) no pudieron ser eliminados.`);
      }

      setSelectedVehicles(new Set());
    } catch (error) {
      toast.error("Error en la eliminación masiva", {
        description: "Ocurrió un error inesperado.",
      });
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
      if (action === "approved") {
        toast.success(
          `${selectedVehicles.size} vehículo(s) han sido aprobados.`
        );
      }
      setSelectedVehicles(new Set());
    } catch (error) {
      toast.error(`Error en la acción masiva de ${action}`, {
        description: "Algunas operaciones pueden haber fallado.",
      });
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
    if (vehicles.length === 0) {
      toast.warning("No hay datos para exportar", {
        description: "Los filtros actuales no devuelven resultados.",
      });
      return;
    }

    toast.success("Exportando datos...", {
      description: `Se exportarán ${vehicles.length} vehículos.`,
    });

    // Mapea los datos para un formato más legible en el CSV
    const dataToExport = vehicles.map(v => ({
      ID: v._id,
      Marca: v.brand,
      Modelo: v.model,
      Año: v.year,
      Precio: v.price,
      Estado: v.status,
      // FIX: Usar la propiedad correcta `sellerContact` del tipo VehicleDataFrontend
      Vendedor: v.sellerContact?.name || "N/A",
      EmailVendedor: v.sellerContact?.email || "N/A",
      // FIX: Comprobar que createdAt no sea undefined
      FechaCreacion: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "N/A",
      Vistas: v.views,
      // FIX: Usar la propiedad correcta `isFeatured`
      Destacado: v.isFeatured ? "Sí" : "No",
    }));

    exportToCSV(dataToExport, `vehiculos-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleGoToEditPage = (vehicleId: string) => {
    router.push(`/admin/vehicles/${vehicleId}/edit`);
  };

  // Función mejorada para cambio de página que va al inicio
  const handlePageChange = (page: number) => {
    goToPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
nextPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    prevPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={contentRef}
      className="min-h-screen bg-background text-foreground py-8 px-4 animate-in fade-in duration-500"
    >
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
                <p className="text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <Car className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border hover:shadow-md transition-shadow bg-muted/20">
            <CardContent className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Pendientes
                </p>
                <p className="text-2xl font-bold text-accent">
                  {stats.pending}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-accent/20">
                <AlertCircle className="w-5 h-5 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border hover:shadow-md transition-shadow bg-primary/5">
            <CardContent className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Aprobados
                </p>
                <p className="text-2xl font-bold text-primary">
                  {stats.approved}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border hover:shadow-md transition-shadow bg-destructive/5">
            <CardContent className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Rechazados
                </p>
                <p className="text-2xl font-bold text-destructive">
                  {stats.rejected}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10">
                <XSquare className="w-5 h-5 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== PESTAÑAS DE NAVEGACIÓN ========== */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as AdminTab)}
          className="w-full"
        >
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
              // categoryCounts={categoryCounts} // <-- ELIMINADO TEMPORALMENTE
              isMobileView ={isMobileView} 
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
                    onGoToEditPage={handleGoToEditPage}
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
                    onGoToEditPage={handleGoToEditPage}
                  />
                ) : ( 
                  <VehicleListView 
                    vehicles ={vehicles} 
                    selectedVehicles ={selectedVehicles} 
                    onToggleSelection ={toggleVehicleSelection} 
                    onSelectAll={selectAllVisible}
                    onClearSelection ={clearSelection} 
                    onStatusChange ={handleStatusChange} 
                    onVehicleSelect ={setSelectedVehicle} 
                    onShowRejectDialog ={handleShowRejectDialog} 
                    onShowCommentDialog ={handleShowCommentDialog} 
                    onShowHistoryDialog ={handleShowHistoryDialog} 
                    onShowDeleteDialog ={handleShowDeleteDialog} 
                    onGoToEditPage ={handleGoToEditPage} 
                  /> 
                )} 
 
                {/* Paginación */}
                <div className="mt-6">
                  <AdminPagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={(itemsPerPage) =>
                      updatePagination({ itemsPerPage })
                    }
                    onNextPage={handleNextPage}
                    onPrevPage={handlePrevPage}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UsersPanel />
          </TabsContent>
        </Tabs>

         <AdminDialogs
          dialogState={dialogState}
          handleCloseDialog={handleCloseDialog}
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
          vehicleComments={vehicleComments}
          isLoadingComments={isLoadingComments}
          handleAddComment={handleAddComment}
          vehicleHistory={vehicleHistory}
          isLoadingHistory={isLoadingHistory}
          handleDeleteVehicle={handleDeleteVehicle}
          handleRejectWithReason={handleRejectWithReason}
          showMassApproveDialog={showMassApproveDialog}
          setShowMassApproveDialog={setShowMassApproveDialog}
          handleMassApprove={handleMassApprove}
          showMassRejectDialog={showMassRejectDialog}
          setShowMassRejectDialog={setShowMassRejectDialog}
          handleMassReject={handleMassReject}
          showMassDeleteDialog={showMassDeleteDialog}
          setShowMassDeleteDialog={setShowMassDeleteDialog}
          handleMassDelete={handleMassDelete}
          selectedVehicles={selectedVehicles}
        />
       </div>
     </div>
   );
 };