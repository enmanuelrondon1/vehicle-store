// src/components/features/admin/UsersPanel.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsersPanel } from "@/hooks/use-users-panel";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminPagination } from "./AdminPagination";
import { Button } from "@/components/ui/button";
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
import { Users, Search, Trash2, Edit2, AlertCircle, Copy, Mail, Github, Chrome, ShieldCheck, KeyRound, Sparkles, UserCog } from "lucide-react";
import { toast } from "sonner";
import { SortSelector } from "@/components/ui/seraui-selector";
import { useSession } from "next-auth/react";

const SUPER_ADMIN_EMAIL = "designdevproenmanuel@gmail.com";

export const UsersPanel = () => {
  const { data: session } = useSession();
  const {
    users,
    isLoading,
    error,
    filters,
    updateFilters,
    pagination,
    goToPage,
    updateUserRoleInState,
    setItemsPerPage,
    nextPage,
    prevPage,
    removeUserFromState,
  } = useUsersPanel();

  const [userToEdit, setUserToEdit] = useState<{ id: string; role: string; fullName: string; email: string } | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; fullName: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isVerificationRequired, setIsVerificationRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [actionToConfirm, setActionToConfirm] = useState<{ userId: string; newRole: string; userName: string } | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(`✨ ${fieldName} copiado al portapapeles.`);
      },
      (err) => {
        console.error("Error al copiar el texto:", err);
        toast.error("❌ No se pudo copiar el texto.");
      }
    );
  };

  const handleRoleChange = async (userId: string, newRole: string, userName: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update role');
      }
      updateUserRoleInState(userId, newRole);
      toast.success(`🎉 El rol de ${userName} se ha actualizado a ${newRole}.`);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Error desconocido';
      console.error("Failed to update user role:", error);
      toast.error(`❌ Error al actualizar el rol: ${error}`);
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
    
    const originalUser = users.find(u => u.id === id);
    if (!originalUser) return;

    const originalRole = originalUser.role;
    const targetUserIsSuperAdmin = email === SUPER_ADMIN_EMAIL;

    const isPromotionToAdmin = originalRole !== 'admin' && newRole === 'admin';
    const isSuperAdminEdit = targetUserIsSuperAdmin;

    if (isPromotionToAdmin || isSuperAdminEdit) {
      setActionToConfirm({ userId: id, newRole: newRole, userName: fullName });
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
      const response = await fetch('/api/admin/verify-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "La contraseña de autorización es incorrecta.");
      }

      toast.success("✅ Verificación exitosa. Actualizando rol...");
      await handleRoleChange(actionToConfirm.userId, actionToConfirm.newRole, actionToConfirm.userName);

    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Error desconocido';
      setVerificationError(error);
      toast.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete user');
      }
      removeUserFromState(userId);
      toast.success(`🗑️ El usuario ${userToDelete?.fullName} ha sido eliminado.`);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Error desconocido';
      console.error("Failed to delete user:", error);
      toast.error(`❌ Error al eliminar el usuario: ${error}`);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="relative p-1 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl animate-pulse-glow"></div>
        <Card className="card-glass relative">
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative animate-float">
                  <Users className="w-16 h-16 text-primary animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-gradient">Cargando usuarios...</p>
                <p className="text-sm text-muted-foreground">Por favor, espera un momento.</p>
              </div>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative p-1 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 via-destructive/10 to-destructive/20 rounded-2xl blur-xl"></div>
        <Card className="card-glass border-destructive/50 relative">
          <CardContent className="flex flex-col items-center justify-center gap-6 py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative p-4 bg-destructive/10 rounded-full">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-bold text-destructive">Error al cargar los usuarios</p>
              <p className="text-sm text-muted-foreground max-w-md">{error}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="btn-accent"
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative p-1 animate-fade-in">
      {/* Animated border gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-2xl blur-sm animate-pulse-glow"></div>
      
      <Card className="card-glass relative overflow-hidden">
        {/* Premium header with gradient overlay */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"></div>
        
        <CardHeader className="border-b border-border/50 backdrop-blur-sm relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-3 bg-card rounded-xl border border-border/50">
                  <Users className="w-7 h-7 text-gradient" />
                </div>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black tracking-tight flex items-center gap-2">
                  <span className="text-gradient">Gestión de Usuarios</span>
                  <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="badge-accent">
                    {pagination.totalItems} usuarios
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • Actualizado ahora
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pt-8">
          {/* Premium filters with glass effect */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative group sm:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-hover:text-accent transition-colors" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                  className="input-premium pl-12 h-12 text-base border-border/50 hover:border-primary/50 focus:border-accent transition-colors"
                />
              </div>
            </div>

            <SortSelector
              value={filters.sortBy}
              onChange={(value) => updateFilters({ sortBy: value })}
              placeholder="Ordenar por"
              options={[
                { value: "newest", label: "Más nuevos" },
                { value: "oldest", label: "Más antiguos" },
                { value: "name-asc", label: "Nombre (A-Z)" },
                { value: "name-desc", label: "Nombre (Z-A)" },
              ]}
            />
          </div>

          {/* Premium table with enhanced styling */}
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      <div className="flex items-center gap-2">
                        <UserCog className="w-4 h-4" />
                        Nombre
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">Proveedor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">Rol</th>
                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">Miembro desde</th>
                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">Último acceso</th>
                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {users.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className="group hover:bg-muted/20 transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="flex items-center gap-3 cursor-pointer group/copy"
                          onClick={() => handleCopy(user.fullName, "Nombre")}
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground group-hover/copy:text-accent transition-colors">
                              {user.fullName}
                            </span>
                            {user.email === SUPER_ADMIN_EMAIL && (
                              <div className="relative group/badge">
                                <ShieldCheck className="h-5 w-5 text-success animate-pulse" />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-success text-success-foreground text-xs font-bold rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap">
                                  Superadmin
                                </div>
                              </div>
                            )}
                            <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover/copy:opacity-100 transition-all" />
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap cursor-pointer group/copy"
                        onClick={() => handleCopy(user.email, "Email")}
                      >
                        <div className="flex items-center gap-2 text-muted-foreground group-hover/copy:text-accent transition-colors">
                          <span className="text-sm">{user.email}</span>
                          <Copy className="h-4 w-4 opacity-0 group-hover/copy:opacity-100 transition-all" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {user.provider === 'google' && (
                            <>
                              <div className="p-1.5 bg-red-500/10 rounded-lg">
                                <Chrome className="h-4 w-4 text-red-500" />
                              </div>
                              <span className="text-sm font-medium">Google</span>
                            </>
                          )}
                          {user.provider === 'github' && (
                            <>
                              <div className="p-1.5 bg-foreground/10 rounded-lg">
                                <Github className="h-4 w-4 text-foreground" />
                              </div>
                              <span className="text-sm font-medium">GitHub</span>
                            </>
                          )}
                          {user.provider === 'credentials' && (
                            <>
                              <div className="p-1.5 bg-accent/10 rounded-lg">
                                <Mail className="h-4 w-4 text-accent" />
                              </div>
                              <span className="text-sm font-medium">Email</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30">
                            <span className="text-base">👑</span>
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
                            <span className="text-base">👤</span>
                            Usuario
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("es-ES", { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {user.lastSignInAt ? (
                          new Date(user.lastSignInAt).toLocaleString("es-ES", {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        ) : (
                          <span className="text-muted-foreground/50">Nunca</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserToEdit({ id: user.id, role: user.role, fullName: user.fullName, email: user.email })}
                            disabled={isUpdating || isDeleting}
                            className="border-border/50 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserToDelete({ id: user.id, fullName: user.fullName })}
                            disabled={isUpdating || isDeleting || user.email === SUPER_ADMIN_EMAIL}
                            className="border-destructive/50 hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-all disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <AdminPagination
            pagination={pagination}
            onPageChange={goToPage}
            onItemsPerPageChange={setItemsPerPage}
            onNextPage={nextPage}
            onPrevPage={prevPage}
          />

          {/* Edit Role Dialog - Premium Style */}
          <AlertDialog open={!!userToEdit} onOpenChange={() => setUserToEdit(null)}>
            <AlertDialogContent className="card-glass max-w-md border-border/50">
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none"></div>
              
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
                      <strong className="font-semibold">Precaución:</strong> Asignar el rol 'Admin' otorga privilegios elevados en el sistema.
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
                    onValueChange={(value) => setUserToEdit(prev => prev ? { ...prev, role: value } : null)}
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
                      <div className="animate-spin mr-2">⏳</div>
                      Procesando...
                    </>
                  ) : (
                    '✨ Guardar Cambios'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Verification Dialog - Premium Style */}
          <AlertDialog open={isVerificationRequired} onOpenChange={setIsVerificationRequired}>
            <AlertDialogContent className="card-glass max-w-md border-amber-500/20">
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>
              
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
                  Esta es una <strong className="text-amber-400">acción crítica</strong>. 
                  Introduce la contraseña de autorización del superadministrador para continuar.
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
                    className={`input-premium h-12 ${verificationError ? 'input-error' : ''}`}
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
                      <div className="animate-spin mr-2">⏳</div>
                      Verificando...
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

          {/* Delete User Dialog - Premium Style */}
          <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
            <AlertDialogContent className="card-glass max-w-md border-destructive/20">
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-destructive/10 to-transparent pointer-events-none"></div>
              
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
                    Esta acción es <strong className="text-destructive font-bold">permanente e irreversible</strong>.
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
                    Esta operación no se puede deshacer. Todos los datos del usuario se perderán permanentemente.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel className="border-border/50 hover:bg-muted/50">
                  <span className="mr-2">✖</span>
                  No, mantener usuario
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => userToDelete && handleDelete(userToDelete.id)}
                  disabled={isDeleting}
                  className="bg-gradient-to-r from-destructive to-red-600 hover:from-red-600 hover:to-red-700 text-destructive-foreground font-bold shadow-lg shadow-destructive/30 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin mr-2">⏳</div>
                      Eliminando...
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
        </CardContent>
      </Card>

      {/* CSS adicional para animaciones personalizadas */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
                    