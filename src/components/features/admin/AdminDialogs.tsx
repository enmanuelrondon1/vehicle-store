// src/components/features/admin/AdminDialogs.tsx
// ✅ FIX RENDIMIENTO: renderizado condicional en cada dialog.
//
// ANTES: los 8 dialogs se montaban en el DOM siempre, aunque ninguno estuviera abierto.
//        Cada dialog importa su propio bundle (formularios, lógica, estilos).
//        Al montar AdminPanel = montar 8 dialogs innecesariamente.
//
// AHORA: cada dialog solo se monta cuando isOpen es true.
//        Cuando se cierra, se desmonta y libera memoria.
//        El bundle de cada dialog se carga la primera vez que se abre (lazy de facto).

import type {
  VehicleDataFrontend,
  VehicleComment,
  VehicleHistoryEntry,
} from "@/types/types";
import { VehicleDetailsDialog } from "./VehicleDetailsDialog";
import { RejectDialog } from "./RejectDialog";
import { CommentDialog } from "./CommentDialog";
import { HistoryDialog } from "./HistoryDialog";
import { DeleteDialog } from "./DeleteDialog";
import { MassApproveDialog } from "./MassApproveDialog";
import { MassRejectDialog } from "./MassRejectDialog";
import { MassDeleteDialog } from "./MassDeleteDialog";

interface DialogState {
  type: "reject" | "comment" | "history" | "delete" | null;
  vehicle: VehicleDataFrontend | null;
}

interface AdminDialogsProps {
  dialogState: DialogState;
  handleCloseDialog: () => void;
  selectedVehicle: VehicleDataFrontend | null;
  setSelectedVehicle: (vehicle: VehicleDataFrontend | null) => void;
  vehicleComments: VehicleComment[];
  isLoadingComments: boolean;
  handleAddComment: (vehicleId: string, comment: string) => Promise<void>;
  vehicleHistory: VehicleHistoryEntry[];
  isLoadingHistory: boolean;
  handleDeleteVehicle: (vehicleId: string) => Promise<void>;
  handleRejectWithReason: (vehicleId: string, reason: string) => Promise<void>;
  showMassApproveDialog: boolean;
  setShowMassApproveDialog: (show: boolean) => void;
  handleMassApprove: () => Promise<void>;
  showMassRejectDialog: boolean;
  setShowMassRejectDialog: (show: boolean) => void;
  handleMassReject: (reason: string) => Promise<void>;
  showMassDeleteDialog: boolean;
  setShowMassDeleteDialog: (show: boolean) => void;
  handleMassDelete: () => Promise<void>;
  selectedVehicles: Set<string>;
  isSubmitting: boolean;
}

export const AdminDialogs = ({
  dialogState,
  handleCloseDialog,
  selectedVehicle,
  setSelectedVehicle,
  vehicleComments,
  isLoadingComments,
  handleAddComment,
  vehicleHistory,
  isLoadingHistory,
  handleDeleteVehicle,
  handleRejectWithReason,
  showMassApproveDialog,
  setShowMassApproveDialog,
  handleMassApprove,
  showMassRejectDialog,
  setShowMassRejectDialog,
  handleMassReject,
  showMassDeleteDialog,
  setShowMassDeleteDialog,
  handleMassDelete,
  selectedVehicles,
  isSubmitting,
}: AdminDialogsProps) => {
  return (
    <>
      {/* ✅ Solo se monta si hay un vehículo seleccionado para ver */}
      {!!selectedVehicle && (
        <VehicleDetailsDialog
          vehicle={selectedVehicle}
          isOpen={!!selectedVehicle}
          onOpenChange={(open) => !open && setSelectedVehicle(null)}
        />
      )}

      {/* ✅ Solo se monta cuando se abre el dialog de rechazo */}
      {dialogState.type === "reject" && (
        <RejectDialog
          isOpen={true}
          onOpenChange={handleCloseDialog}
          onConfirm={(reason) =>
            dialogState.vehicle &&
            handleRejectWithReason(dialogState.vehicle._id!, reason)
          }
          isSubmitting={isSubmitting}
        />
      )}

      {/* ✅ Solo se monta cuando se abre el dialog de comentarios */}
      {dialogState.type === "comment" && (
        <CommentDialog
          isOpen={true}
          onOpenChange={handleCloseDialog}
          comments={vehicleComments}
          isLoading={isLoadingComments}
          onAddComment={(comment) => {
            if (dialogState.vehicle) {
              handleAddComment(dialogState.vehicle._id!, comment);
            }
          }}
          isSubmitting={isSubmitting}
          vehicleId={dialogState.vehicle?._id}
        />
      )}

      {/* ✅ Solo se monta cuando se abre el dialog de historial */}
      {dialogState.type === "history" && (
        <HistoryDialog
          isOpen={true}
          onOpenChange={handleCloseDialog}
          history={vehicleHistory}
          isLoading={isLoadingHistory}
          vehicleId={dialogState.vehicle?._id}
        />
      )}

      {/* ✅ Solo se monta cuando se abre el dialog de eliminación */}
      {dialogState.type === "delete" && (
        <DeleteDialog
          isOpen={true}
          onOpenChange={handleCloseDialog}
          onConfirm={() =>
            dialogState.vehicle &&
            handleDeleteVehicle(dialogState.vehicle._id!)
          }
          isSubmitting={isSubmitting}
        />
      )}

      {/* ✅ Dialogs de acciones masivas — solo cuando están abiertos */}
      {showMassApproveDialog && (
        <MassApproveDialog
          isOpen={true}
          onOpenChange={setShowMassApproveDialog}
          onConfirm={handleMassApprove}
          count={selectedVehicles.size}
          isSubmitting={isSubmitting}
        />
      )}

      {showMassRejectDialog && (
        <MassRejectDialog
          isOpen={true}
          onOpenChange={setShowMassRejectDialog}
          onConfirm={handleMassReject}
          count={selectedVehicles.size}
          isSubmitting={isSubmitting}
        />
      )}

      {showMassDeleteDialog && (
        <MassDeleteDialog
          isOpen={true}
          onOpenChange={setShowMassDeleteDialog}
          onConfirm={handleMassDelete}
          count={selectedVehicles.size}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};