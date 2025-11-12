// src/components/features/admin/VehiclesPanel.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { CheckSquare, XSquare, Trash2 } from "lucide-react";

import type { VehicleDataFrontend, ApprovalStatus as ApprovalStatusType } from "@/types/types";
import type { AdminPanelFilters, PaginationState } from "@/hooks/use-admin-panel-enhanced";

import { AdminPanelHeader } from "./AdminPanelHeader";
import { AdminFilters } from "./AdminFilters";
import { VehicleGridView } from "./VehicleGridView";
import { VehicleListView } from "./VehicleListView";
import { AdminPagination } from "./AdminPagination";

interface VehiclesPanelProps {
  // Data & State
  vehicles: VehicleDataFrontend[];
  isLoading: boolean;
  isMobileView: boolean;
  viewMode: "grid" | "list";
  selectedVehicles: Set<string>;
  filters: AdminPanelFilters;
  pagination: PaginationState;

  // Handlers from useAdminPanelEnhanced
  onFiltersChange: (newFilters: Partial<AdminPanelFilters>) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onStatusChange: (vehicleId: string, newStatus: ApprovalStatusType, reason?: string) => Promise<any>;
  fetchVehicles: () => void;

  // Handlers from AdminPanel
  onVehicleSelect: (vehicle: VehicleDataFrontend | null) => void;
  onGoToEditPage: (vehicleId: string) => void;
  exportData: () => void;
  setVehicleFromNotification: (vehicle: VehicleDataFrontend | null) => void;

  // Selection
  onToggleSelection: (vehicleId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;

  // Dialog Triggers
  onShowRejectDialog: (vehicle: VehicleDataFrontend) => void;
  onShowCommentDialog: (vehicle: VehicleDataFrontend) => void;
  onShowHistoryDialog: (vehicle: VehicleDataFrontend) => void;
  onShowDeleteDialog: (vehicle: VehicleDataFrontend) => void;
  onMassApprove: () => void;
  onMassReject: () => void;
  onMassDelete: () => void;

  // Pagination
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const VehiclesPanel = ({
  vehicles,
  isLoading,
  isMobileView,
  viewMode,
  selectedVehicles,
  filters,
  pagination,
  onFiltersChange,
  onViewModeChange,
  onStatusChange,
  onVehicleSelect,
  onGoToEditPage,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onShowRejectDialog,
  onShowCommentDialog,
  onShowHistoryDialog,
  onShowDeleteDialog,
  onMassApprove,
  onMassReject,
  onMassDelete,
  onPageChange,
  onItemsPerPageChange,
  onNextPage,
  onPrevPage,
  exportData,
  fetchVehicles,
  setVehicleFromNotification,
}: VehiclesPanelProps) => {
  return (
    <TabsContent value="vehicles" className="space-y-6 mt-6">
      <AdminPanelHeader
        isLoading={isLoading}
        exportData={exportData}
        fetchVehicles={fetchVehicles}
        setVehicleFromNotification={setVehicleFromNotification}
      />

      <AdminFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        totalResults={pagination.totalItems}
        onSelectAll={onSelectAll}
        onClearSelection={onClearSelection}
        selectedCount={selectedVehicles.size}
        isMobileView={isMobileView}
      />

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
                onClick={onMassApprove}
              >
                <CheckSquare className="w-4 h-4 mr-1" />
                Aprobar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all"
                onClick={onMassReject}
              >
                <XSquare className="w-4 h-4 mr-1" />
                Rechazar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="hover:scale-105 transition-transform"
                onClick={onMassDelete}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg border-border">
        <CardContent className="p-3 md:p-6">
          {isMobileView ? (
            <VehicleGridView
              vehicles={vehicles}
              onStatusChange={onStatusChange}
              onVehicleSelect={onVehicleSelect}
              selectedVehicles={selectedVehicles}
              onToggleSelection={onToggleSelection}
              onShowRejectDialog={onShowRejectDialog}
              onShowCommentDialog={onShowCommentDialog}
              onShowHistoryDialog={onShowHistoryDialog}
              onShowDeleteDialog={onShowDeleteDialog}
              onGoToEditPage={onGoToEditPage}
            />
          ) : viewMode === "grid" ? (
            <VehicleGridView
              vehicles={vehicles}
              onStatusChange={onStatusChange}
              onVehicleSelect={onVehicleSelect}
              selectedVehicles={selectedVehicles}
              onToggleSelection={onToggleSelection}
              onShowRejectDialog={onShowRejectDialog}
              onShowCommentDialog={onShowCommentDialog}
              onShowHistoryDialog={onShowHistoryDialog}
              onShowDeleteDialog={onShowDeleteDialog}
              onGoToEditPage={onGoToEditPage}
            />
          ) : (
            <VehicleListView
              vehicles={vehicles}
              selectedVehicles={selectedVehicles}
              onToggleSelection={onToggleSelection}
              onSelectAll={onSelectAll}
              onClearSelection={onClearSelection}
              onStatusChange={onStatusChange}
              onVehicleSelect={onVehicleSelect}
              onShowRejectDialog={onShowRejectDialog}
              onShowCommentDialog={onShowCommentDialog}
              onShowHistoryDialog={onShowHistoryDialog}
              onShowDeleteDialog={onShowDeleteDialog}
              onGoToEditPage={onGoToEditPage}
            />
          )}

          <div className="mt-6">
            <AdminPagination
              pagination={pagination}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
              onNextPage={onNextPage}
              onPrevPage={onPrevPage}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};