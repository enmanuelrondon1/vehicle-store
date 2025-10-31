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
import { Users, Search, Trash2, Edit2, AlertCircle, Copy, Mail, Github, Chrome } from "lucide-react";
import { toast } from "sonner";
import { SortSelector } from "@/components/ui/seraui-selector";

export const UsersPanel = () => {
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

  const [userToEdit, setUserToEdit] = useState<{ id: string; role: string; fullName: string } | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; fullName: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(`${fieldName} copiado al portapapeles.`);
      },
      (err) => {
        console.error("Error al copiar el texto:", err);
        toast.error("No se pudo copiar el texto.");
      }
    );
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!userToEdit) return;

    const userName = userToEdit.fullName;
    setUserToEdit(null);
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
      toast.success(`El rol de ${userName} se ha actualizado a ${newRole}.`);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Error desconocido';
      console.error("Failed to update user role:", error);
      toast.error(`Error al actualizar el rol: ${error}`);
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
      toast.success(`El usuario ${userToDelete?.fullName} ha sido eliminado.`);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Error desconocido';
      console.error("Failed to delete user:", error);
      toast.error(`Error al eliminar el usuario: ${error}`);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-800/60 dark:border-slate-700">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Cargando usuarios...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-300 bg-white dark:border-red-800 dark:bg-slate-800/60">
        <CardContent className="flex items-center gap-3 pt-6 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800/60">
      <CardHeader className="border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-6 h-6 text-blue-500" />
          <CardTitle className="text-2xl">Gestión de Usuarios</CardTitle>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {pagination.totalItems} usuarios encontrados.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Filtros */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
              className="border-gray-200 bg-gray-50 pl-10 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder:text-gray-400"
            />
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

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-600">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
            <thead className="bg-gray-50 dark:bg-slate-700/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300">Nombre</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300">Email</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300">Proveedor</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300">Rol</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300">Miembro desde</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300">Último acceso</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-600 dark:bg-slate-800/50">
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td
                    className="group cursor-pointer whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200"
                    onClick={() => handleCopy(user.fullName, "Nombre")}
                  >
                    <span className="flex items-center gap-2">
                      {user.fullName}
                      <Copy className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </td>
                  <td
                    className="group cursor-pointer whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                    onClick={() => handleCopy(user.email, "Email")}
                  >
                    <span className="flex items-center gap-2">
                      {user.email}
                      <Copy className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      {user.provider === 'google' && <Chrome className="h-4 w-4 text-red-500" />}
                      {user.provider === 'github' && <Github className="h-4 w-4 text-gray-800 dark:text-gray-200" />}
                      {user.provider === 'credentials' && <Mail className="h-4 w-4 text-blue-500" />}
                      <span className="capitalize">{user.provider}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                    }`}>
                      {user.role === "admin" ? "👑 Admin" : "👤 Usuario"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{new Date(user.createdAt).toLocaleDateString("es-ES")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString("es-ES") : "N/A"}</td>
                  <td className="flex flex-wrap gap-2 px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserToEdit({ id: user.id, role: user.role, fullName: user.fullName })}
                      disabled={isUpdating || isDeleting}
                      className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setUserToDelete({ id: user.id, fullName: user.fullName })}
                      disabled={isUpdating || isDeleting}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminPagination
          pagination={pagination}
          onPageChange={goToPage}
          onItemsPerPageChange={setItemsPerPage}
          onNextPage={nextPage}
          onPrevPage={prevPage}
        />

        {/* Edit Role Dialog */}
        <AlertDialog open={!!userToEdit} onOpenChange={() => setUserToEdit(null)}>
          <AlertDialogContent className="border bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <AlertDialogHeader>
              <AlertDialogTitle className="dark:text-white">Editar Rol de Usuario</AlertDialogTitle>
              <AlertDialogDescription className="dark:text-gray-300">
                Selecciona el nuevo rol para <strong className="text-blue-600 dark:text-blue-400">{userToEdit?.fullName}</strong>. 
                <br />
                <span className="mt-2 inline-flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                 Ten cuidado, asignar el rol de &apos;admin&apos; otorga privilegios elevados.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-4 py-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Seleccionar nuevo rol
                </label>
                <Select
                    value={userToEdit?.role || ""}
                    onValueChange={(value) => setUserToEdit(prev => prev ? {...prev, role: value} : null)}
                >
                    <SelectTrigger className="dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                        <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-slate-600 dark:bg-slate-800">
                        <SelectItem value="user">
                          <span className="flex items-center gap-2">
                            👤 Usuario
                          </span>
                        </SelectItem>
                        <SelectItem value="admin">
                          <span className="flex items-center gap-2">
                            👑 Admin
                          </span>
                        </SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel className="dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => userToEdit && handleRoleChange(userToEdit.id, userToEdit.role)}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUpdating ? 'Actualizando...' : 'Guardar Cambios'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete User Dialog */}
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent className="border bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <AlertDialogTitle className="dark:text-white">¿Estás seguro?</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="dark:text-gray-300">
                Esta acción es <strong>irreversible</strong>. Se eliminará permanentemente al usuario 
                <strong className="text-red-600 dark:text-red-400"> {userToDelete?.fullName}</strong> de la base de datos.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => userToDelete && handleDelete(userToDelete.id)}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? 'Eliminando...' : '🗑️ Sí, eliminar usuario'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};