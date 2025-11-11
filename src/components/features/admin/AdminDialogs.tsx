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
}: AdminDialogsProps) => {
  return (
    <>
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
    </>
  );
};