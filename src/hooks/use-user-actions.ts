
// src/hooks/use-user-actions.ts
"use client";

import { useState } from "react";
import { toast } from "sonner";

const SUPER_ADMIN_EMAIL = "designdevproenmanuel@gmail.com";

interface UserForEdit {
  id: string;
  role: string;
  fullName: string;
  email: string;
}

interface UserForDelete {
  id: string;
  fullName: string;
}

interface ActionToConfirm {
  userId: string;
  newRole: string;
  userName: string;
}

interface UseUserActionsProps {
  users: { id: string; role: string; email: string }[];
  updateUserRoleInState: (userId: string, newRole: string) => void;
  removeUserFromState: (userId: string) => void;
}

export const useUserActions = ({
  users,
  updateUserRoleInState,
  removeUserFromState,
}: UseUserActionsProps) => {
  // --- Dialog state ---
  const [userToEdit, setUserToEdit] = useState<UserForEdit | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserForDelete | null>(null);
  const [userVehiclesDialog, setUserVehiclesDialog] = useState<{
    open: boolean;
    userId: string | null;
    userName: string;
  }>({ open: false, userId: null, userName: "" });

  // --- Verification state ---
  const [isVerificationRequired, setIsVerificationRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [actionToConfirm, setActionToConfirm] = useState<ActionToConfirm | null>(null);

  // --- Loading state ---
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // -------------------------------------------------------------------------
  // Clipboard
  // -------------------------------------------------------------------------
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success(`✨ ${fieldName} copiado al portapapeles.`),
      () => toast.error("❌ No se pudo copiar el texto.")
    );
  };

  // -------------------------------------------------------------------------
  // Role change
  // -------------------------------------------------------------------------
  const handleRoleChange = async (userId: string, newRole: string, userName: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Failed to update role");
      updateUserRoleInState(userId, newRole);
      toast.success(`🎉 El rol de ${userName} se ha actualizado a ${newRole}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast.error(`❌ Error al actualizar el rol: ${msg}`);
    } finally {
      setIsUpdating(false);
      setUserToEdit(null);
      setActionToConfirm(null);
      setIsVerificationRequired(false);
      setPasswordInput("");
      setVerificationError(null);
    }
  };

  const initiateRoleChange = () => {
    if (!userToEdit) return;
    const { id, role: newRole, fullName, email } = userToEdit;
    const original = users.find((u) => u.id === id);
    if (!original) return;

    const needsVerification =
      (original.role !== "admin" && newRole === "admin") ||
      email === SUPER_ADMIN_EMAIL;

    if (needsVerification) {
      setActionToConfirm({ userId: id, newRole, userName: fullName });
      setIsVerificationRequired(true);
      setUserToEdit(null);
    } else {
      handleRoleChange(id, newRole, fullName);
    }
  };

  const handleVerificationAndSubmit = async () => {
    if (!actionToConfirm) return;
    setVerificationError(null);
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/verify-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Contraseña incorrecta.");
      toast.success("✅ Verificación exitosa. Actualizando rol...");
      await handleRoleChange(actionToConfirm.userId, actionToConfirm.newRole, actionToConfirm.userName);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setVerificationError(msg);
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  // -------------------------------------------------------------------------
  // Delete
  // -------------------------------------------------------------------------
  const handleDelete = async (userId: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Failed to delete user");
      removeUserFromState(userId);
      toast.success(`🗑️ El usuario ${userToDelete?.fullName} ha sido eliminado.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast.error(`❌ Error al eliminar el usuario: ${msg}`);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  // -------------------------------------------------------------------------
  // Vehicles dialog helpers
  // -------------------------------------------------------------------------
  const openVehiclesDialog = (userId: string, userName: string) => {
    setUserVehiclesDialog({ open: true, userId, userName });
  };

  const closeVehiclesDialog = () => {
    setUserVehiclesDialog({ open: false, userId: null, userName: "" });
  };

  return {
    // state
    userToEdit,
    setUserToEdit,
    userToDelete,
    setUserToDelete,
    isUpdating,
    isDeleting,
    isVerificationRequired,
    setIsVerificationRequired,
    passwordInput,
    setPasswordInput,
    verificationError,
    setVerificationError,
    userVehiclesDialog,
    // actions
    handleCopy,
    initiateRoleChange,
    handleVerificationAndSubmit,
    handleDelete,
    openVehiclesDialog,
    closeVehiclesDialog,
  };
};