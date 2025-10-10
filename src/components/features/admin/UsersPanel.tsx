// src/components/features/admin/UsersPanel.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDarkMode } from "@/context/DarkModeContext";
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
import { Users, Search, Trash2, Edit2, AlertCircle } from "lucide-react";

export const UsersPanel = () => {
  const { isDarkMode } = useDarkMode();
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

  const handleRoleChange = async (userId: string, newRole: string) => {
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
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Error desconocido';
      console.error("Failed to update user role:", error);
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
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Error desconocido';
      console.error("Failed to delete user:", error);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <Card className={isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white"}>
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
      <Card className={`${isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white"} border-red-300 dark:border-red-800`}>
        <CardContent className="flex items-center gap-3 pt-6 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white shadow-lg"}>
      <CardHeader className={isDarkMode ? "border-b border-slate-700" : "border-b border-gray-200"}>
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-6 h-6 text-blue-500" />
          <CardTitle className="text-2xl">Gestión de Usuarios</CardTitle>
        </div>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {pagination.totalItems} usuarios encontrados.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
            <Input
              placeholder="Buscar por nombre o email..."
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
              className={`pl-10 ${isDarkMode ? "bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400" : "bg-gray-50 border-gray-200"}`}
            />
          </div>

          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilters({ sortBy: value })}
          >
            <SelectTrigger className={`w-full md:w-[200px] ${isDarkMode ? "bg-slate-700/50 border-slate-600 text-white" : "bg-gray-50"}`}>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className={isDarkMode ? "bg-slate-700 border-slate-600" : ""}>
              <SelectItem value="newest">Más nuevos</SelectItem>
              <SelectItem value="oldest">Más antiguos</SelectItem>
              <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        <div className={`overflow-x-auto rounded-lg border ${isDarkMode ? "border-slate-600" : "border-gray-200"}`}>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
            <thead className={isDarkMode ? "bg-slate-700/80" : "bg-gray-50"}>
              <tr>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Nombre</th>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Email</th>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Rol</th>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Miembro desde</th>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Último acceso</th>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? "bg-slate-800/50 divide-slate-600" : "bg-white divide-gray-200"}`}>
              {users.map((user) => (
                <tr key={user.id} className={`hover:bg-opacity-50 transition-colors ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-50"}`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{user.fullName}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? isDarkMode
                          ? "bg-purple-900/40 text-purple-300"
                          : "bg-purple-100 text-purple-800"
                        : isDarkMode
                        ? "bg-blue-900/40 text-blue-300"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {user.role === "admin" ? "👑 Admin" : "👤 Usuario"}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{new Date(user.createdAt).toLocaleDateString("es-ES")}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString("es-ES") : "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserToEdit({ id: user.id, role: user.role, fullName: user.fullName })}
                      disabled={isUpdating || isDeleting}
                      className={isDarkMode ? "border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white" : ""}
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
          <AlertDialogContent className={`${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white"} border shadow-lg`}>
            <AlertDialogHeader>
              <AlertDialogTitle className={isDarkMode ? "text-white" : ""}>Editar Rol de Usuario</AlertDialogTitle>
              <AlertDialogDescription className={isDarkMode ? "text-gray-300" : ""}>
                Selecciona el nuevo rol para <strong className={isDarkMode ? "text-blue-400" : "text-blue-600"}>{userToEdit?.fullName}</strong>. 
                <br />
                <span className="inline-flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                 Ten cuidado, asignar el rol de &apos;admin&apos; otorga privilegios elevados.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-4 py-6">
              <div>
                <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} block mb-2`}>
                  Seleccionar nuevo rol
                </label>
                <Select
                    value={userToEdit?.role || ""}
                    onValueChange={(value) => setUserToEdit(prev => prev ? {...prev, role: value} : null)}
                >
                    <SelectTrigger className={isDarkMode ? "bg-slate-800 border-slate-600 text-white" : ""}>
                        <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? "bg-slate-800 border-slate-600" : ""}>
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
              <AlertDialogCancel className={isDarkMode ? "bg-slate-700 text-white border-slate-600 hover:bg-slate-600" : ""}>
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
          <AlertDialogContent className={`${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white"} border shadow-lg`}>
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <AlertDialogTitle className={isDarkMode ? "text-white" : ""}>¿Estás seguro?</AlertDialogTitle>
              </div>
              <AlertDialogDescription className={isDarkMode ? "text-gray-300" : ""}>
                Esta acción es <strong>irreversible</strong>. Se eliminará permanentemente al usuario 
                <strong className={isDarkMode ? "text-red-400" : "text-red-600"}> {userToDelete?.fullName}</strong> de la base de datos.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className={isDarkMode ? "bg-slate-700 text-white border-slate-600 hover:bg-slate-600" : ""}>
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