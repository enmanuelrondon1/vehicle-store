"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminPanelEnhanced } from "@/hooks/use-admin-panel-enhanced";
import { Shield, Users, Car } from "lucide-react";

// Local components
import { AdminPanelLoading } from "./AdminPanelLoading";
import { AdminPanelAccessDenied } from "./AdminPanelAccessDenied";
import { AdminPanelError } from "./AdminPanelError";
import { AdminStats } from "./AdminStats";
import { UsersPanel } from "./UsersPanel";
import { AdminDialogs } from "./AdminDialogs";
import { VehiclesPanel } from "./VehiclesPanel";

type AdminTab = "vehicles" | "users";

export const AdminPanel = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("vehicles");
  const [isMobileView, setIsMobileView] = useState(false);

  const hook = useAdminPanelEnhanced();

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  if (hook.status === "loading" || hook.isLoading) {
    return <AdminPanelLoading />;
  }
  if (!hook.isAdmin) {
    return <AdminPanelAccessDenied />;
  }
  if (hook.error) {
    return <AdminPanelError error={hook.error} onRetry={hook.fetchVehicles} />;
  }

  const handleGoToEditPage = (vehicleId: string) => {
    router.push(`/admin/vehicles/${vehicleId}/edit`);
  };

  const handlePageChange = (page: number) => {
    hook.goToPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    hook.nextPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    hook.prevPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
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

        <AdminStats stats={hook.stats} />

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
            <VehiclesPanel
              vehicles={hook.vehicles}
              pagination={hook.pagination}
              filters={hook.filters}
              viewMode={hook.viewMode}
              selectedVehicles={hook.selectedVehicles}
              isLoading={hook.isLoading}
              onFiltersChange={hook.updateFilters}
              onPageChange={handlePageChange}
              onItemsPerPageChange={(items) =>
                hook.updatePagination({ itemsPerPage: items })
              }
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              onViewModeChange={hook.setViewMode}
              onToggleSelection={hook.toggleVehicleSelection}
              onSelectAll={hook.selectAllVisible}
              onClearSelection={hook.clearSelection}
              onStatusChange={hook.handleStatusChange}
              onVehicleSelect={hook.setSelectedVehicle}
              onShowRejectDialog={hook.handleShowRejectDialog}
              onShowCommentDialog={hook.handleShowCommentDialog}
              onShowHistoryDialog={hook.handleShowHistoryDialog}
              onShowDeleteDialog={hook.handleShowDeleteDialog}
              onGoToEditPage={handleGoToEditPage}
              onMassApprove={() => hook.setShowMassApproveDialog(true)}
              onMassReject={() => hook.setShowMassRejectDialog(true)}
              onMassDelete={() => hook.setShowMassDeleteDialog(true)}
              exportData={hook.exportData}
              fetchVehicles={hook.fetchVehicles}
              isMobileView={isMobileView}
              setVehicleFromNotification={hook.setVehicleFromNotification}
            />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UsersPanel />
          </TabsContent>
        </Tabs>

        <AdminDialogs
          dialogState={hook.dialogState}
          handleCloseDialog={hook.handleCloseDialog}
          selectedVehicle={hook.selectedVehicle}
          setSelectedVehicle={hook.setSelectedVehicle}
          vehicleComments={hook.vehicleComments}
          isLoadingComments={hook.isLoadingDialogContent}
          handleAddComment={hook.handleAddComment}
          vehicleHistory={hook.vehicleHistory}
          isLoadingHistory={hook.isLoadingDialogContent}
          handleDeleteVehicle={hook.handleDeleteVehicle}
          handleRejectWithReason={hook.handleRejectWithReason}
          showMassApproveDialog={hook.showMassApproveDialog}
          setShowMassApproveDialog={hook.setShowMassApproveDialog}
          handleMassApprove={hook.handleMassApproveAndClose}
          showMassRejectDialog={hook.showMassRejectDialog}
          setShowMassRejectDialog={hook.setShowMassRejectDialog}
          handleMassReject={hook.handleMassRejectAndClose}
          showMassDeleteDialog={hook.showMassDeleteDialog}
          setShowMassDeleteDialog={hook.setShowMassDeleteDialog}
          handleMassDelete={hook.handleMassDeleteAndClose}
          selectedVehicles={hook.selectedVehicles}
          isSubmitting={hook.isSubmitting}
        />
      </div>
    </div>
  );
};