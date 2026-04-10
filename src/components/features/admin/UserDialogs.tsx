// src/components/features/admin/UserDialogs.tsx
"use client";

import { memo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertCircle, Edit2, KeyRound, ShieldCheck, Trash2, UserCog } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
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

interface UserDialogsProps {
  // Edit role
  userToEdit: UserForEdit | null;
  setUserToEdit: (user: UserForEdit | null) => void;
  initiateRoleChange: () => void;
  isUpdating: boolean;

  // Verification
  isVerificationRequired: boolean;
  setIsVerificationRequired: (v: boolean) => void;
  passwordInput: string;
  setPasswordInput: (v: string) => void;
  verificationError: string | null;
  setVerificationError: (v: string | null) => void;
  handleVerificationAndSubmit: () => void;

  // Delete
  userToDelete: UserForDelete | null;
  setUserToDelete: (user: UserForDelete | null) => void;
  handleDelete: (userId: string) => void;
  isDeleting: boolean;
}

// ── Edit Role Dialog ──────────────────────────────────────────────────────────
const EditRoleDialog = memo(
  ({
    userToEdit,
    setUserToEdit,
    initiateRoleChange,
    isUpdating,
  }: Pick<UserDialogsProps, "userToEdit" | "setUserToEdit" | "initiateRoleChange" | "isUpdating">) => (
    <AlertDialog open={!!userToEdit} onOpenChange={() => setUserToEdit(null)}>
      <AlertDialogContent className="card-glass max-w-md border-border/50">
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />

        <AlertDialogHeader className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Edit2 className="w-6 h-6 text-accent" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold">Editar Rol</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground leading-relaxed">
            Selecciona el nuevo rol para{" "}
            <strong className="text-accent font-semibold">{userToEdit?.fullName}</strong>.
          </AlertDialogDescription>
          <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200/90">
                <strong className="font-semibold">Precaución:</strong> Asignar el rol
                &apos;Admin&apos; otorga privilegios elevados en el sistema.
              </p>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="label-premium flex items-center gap-2">
              <UserCog className="w-4 h-4 text-primary" />
              Seleccionar nuevo rol
            </label>
            <Select
              value={userToEdit?.role || ""}
              onValueChange={(value) =>
                setUserToEdit(userToEdit ? { ...userToEdit, role: value } : null)
              }
            >
              <SelectTrigger className="input-premium h-12">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent className="card-glass">
                <SelectItem value="user" className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center gap-3 py-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <div className="font-semibold">Usuario</div>
                      <div className="text-xs text-muted-foreground">Acceso estándar</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="admin" className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center gap-3 py-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <span className="text-xl">👑</span>
                    </div>
                    <div>
                      <div className="font-semibold">Admin</div>
                      <div className="text-xs text-muted-foreground">Privilegios completos</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-border/50 hover:bg-muted/50">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={initiateRoleChange}
            disabled={isUpdating}
            className="btn-accent"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin mr-2">⏳</div>Procesando...
              </>
            ) : (
              "✨ Guardar Cambios"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
);
EditRoleDialog.displayName = "EditRoleDialog";

// ── Verification Dialog ───────────────────────────────────────────────────────
const VerificationDialog = memo(
  ({
    isVerificationRequired,
    setIsVerificationRequired,
    passwordInput,
    setPasswordInput,
    verificationError,
    setVerificationError,
    handleVerificationAndSubmit,
    isUpdating,
  }: Pick<
    UserDialogsProps,
    | "isVerificationRequired"
    | "setIsVerificationRequired"
    | "passwordInput"
    | "setPasswordInput"
    | "verificationError"
    | "setVerificationError"
    | "handleVerificationAndSubmit"
    | "isUpdating"
  >) => (
    <AlertDialog open={isVerificationRequired} onOpenChange={setIsVerificationRequired}>
      <AlertDialogContent className="card-glass max-w-md border-amber-500/20">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

        <AlertDialogHeader className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-500/10 rounded-lg animate-pulse-glow">
              <KeyRound className="w-7 h-7 text-amber-400" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-amber-400">
              Verificación Requerida
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground leading-relaxed">
            Esta es una <strong className="text-amber-400">acción crítica</strong>. Introduce la
            contraseña de autorización del superadministrador para continuar.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="security-password" className="label-premium flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              Contraseña de Autorización
            </label>
            <Input
              id="security-password"
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setVerificationError(null);
              }}
              placeholder="••••••••"
              className={`input-premium h-12 ${verificationError ? "input-error" : ""}`}
              autoFocus
            />
            {verificationError && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-shake">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{verificationError}</p>
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setIsVerificationRequired(false);
              setVerificationError(null);
              setPasswordInput("");
            }}
            className="border-border/50 hover:bg-muted/50"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleVerificationAndSubmit}
            disabled={isUpdating || !passwordInput}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold shadow-lg shadow-amber-500/30 disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin mr-2">⏳</div>Verificando...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" />
                Confirmar y Guardar
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
);
VerificationDialog.displayName = "VerificationDialog";

// ── Delete Dialog ─────────────────────────────────────────────────────────────
const DeleteDialog = memo(
  ({
    userToDelete,
    setUserToDelete,
    handleDelete,
    isDeleting,
  }: Pick<UserDialogsProps, "userToDelete" | "setUserToDelete" | "handleDelete" | "isDeleting">) => (
    <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
      <AlertDialogContent className="card-glass max-w-md border-destructive/20">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-destructive/10 to-transparent pointer-events-none" />

        <AlertDialogHeader className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-destructive/10 rounded-lg animate-pulse">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-destructive">
              ¿Estás absolutamente seguro?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground leading-relaxed space-y-3">
            <p>
              Esta acción es{" "}
              <strong className="text-destructive font-bold">permanente e irreversible</strong>.
            </p>
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm">
                Se eliminará completamente al usuario{" "}
                <strong className="text-destructive font-semibold text-base">
                  {userToDelete?.fullName}
                </strong>{" "}
                de la base de datos junto con todos sus datos asociados.
              </p>
            </div>
            <p className="text-xs text-muted-foreground/70 italic">
              Esta operación no se puede deshacer. Todos los datos del usuario se perderán
              permanentemente.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="border-border/50 hover:bg-muted/50">
            <span className="mr-2">✖</span>No, mantener usuario
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => userToDelete && handleDelete(userToDelete.id)}
            disabled={isDeleting}
            className="bg-gradient-to-r from-destructive to-red-600 hover:from-red-600 hover:to-red-700 text-destructive-foreground font-bold shadow-lg shadow-destructive/30 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin mr-2">⏳</div>Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Sí, eliminar permanentemente
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
);
DeleteDialog.displayName = "DeleteDialog";

// ── Composed export ───────────────────────────────────────────────────────────
export const UserDialogs = memo((props: UserDialogsProps) => (
  <>
    <EditRoleDialog
      userToEdit={props.userToEdit}
      setUserToEdit={props.setUserToEdit}
      initiateRoleChange={props.initiateRoleChange}
      isUpdating={props.isUpdating}
    />
    <VerificationDialog
      isVerificationRequired={props.isVerificationRequired}
      setIsVerificationRequired={props.setIsVerificationRequired}
      passwordInput={props.passwordInput}
      setPasswordInput={props.setPasswordInput}
      verificationError={props.verificationError}
      setVerificationError={props.setVerificationError}
      handleVerificationAndSubmit={props.handleVerificationAndSubmit}
      isUpdating={props.isUpdating}
    />
    <DeleteDialog
      userToDelete={props.userToDelete}
      setUserToDelete={props.setUserToDelete}
      handleDelete={props.handleDelete}
      isDeleting={props.isDeleting}
    />
  </>
));
UserDialogs.displayName = "UserDialogs";