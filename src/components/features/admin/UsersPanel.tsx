//  src/components/features/admin/UsersPanel.tsx
"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search, AlertCircle, Sparkles } from "lucide-react";
import { SortSelector } from "@/components/ui/seraui-selector";

import { useUsersPanel } from "@/hooks/use-users-panel";
import { useUserActions } from "@/hooks/use-user-actions";

import { AdminPagination } from "./AdminPagination";
import { UserTable } from "./UserTable";
import { UserDialogs } from "./UserDialogs";
import { UserVehiclesDialog } from "./UserVehiclesDialog";

// ── Loading state ─────────────────────────────────────────────────────────────
const UsersPanelLoading = memo(() => (
  <div className="relative p-1 animate-fade-in">
    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl animate-pulse-glow" />
    <Card className="card-glass relative">
      <CardContent className="flex items-center justify-center h-96">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative animate-float">
              <Users className="w-16 h-16 text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-bold text-gradient">Cargando usuarios...</p>
            <p className="text-sm text-muted-foreground">Por favor, espera un momento.</p>
          </div>
          <div className="flex justify-center gap-2">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
));
UsersPanelLoading.displayName = "UsersPanelLoading";

// ── Error state ───────────────────────────────────────────────────────────────
const UsersPanelError = memo(({ error }: { error: string }) => (
  <div className="relative p-1 animate-fade-in">
    <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 via-destructive/10 to-destructive/20 rounded-2xl blur-xl" />
    <Card className="card-glass border-destructive/50 relative">
      <CardContent className="flex flex-col items-center justify-center gap-6 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
          <div className="relative p-4 bg-destructive/10 rounded-full">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-destructive">Error al cargar los usuarios</p>
          <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} className="btn-accent">
          Reintentar
        </Button>
      </CardContent>
    </Card>
  </div>
));
UsersPanelError.displayName = "UsersPanelError";

// ── Main panel ────────────────────────────────────────────────────────────────
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

  const actions = useUserActions({ users, updateUserRoleInState, removeUserFromState });

  if (isLoading) return <UsersPanelLoading />;
  if (error) return <UsersPanelError error={error} />;

  return (
    <>
      <div className="relative p-1 animate-fade-in">
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-2xl blur-sm animate-pulse-glow" />

        <Card className="card-glass relative overflow-hidden">
          {/* Premium header overlay */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

          <CardHeader className="border-b border-border/50 backdrop-blur-sm relative">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
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
                  <span className="badge-accent">{pagination.totalItems} usuarios</span>
                  <span className="text-xs text-muted-foreground">• Actualizado ahora</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-8">
            {/* Filters */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative group sm:col-span-2">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
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

            {/* Table */}
            <UserTable
              users={users}
              isUpdating={actions.isUpdating}
              isDeleting={actions.isDeleting}
              onEdit={actions.setUserToEdit}
              onDelete={actions.setUserToDelete}
              onCopy={actions.handleCopy}
              onViewVehicles={actions.openVehiclesDialog}
            />

            {/* Pagination */}
            <AdminPagination
              pagination={pagination}
              onPageChange={goToPage}
              onItemsPerPageChange={setItemsPerPage}
              onNextPage={nextPage}
              onPrevPage={prevPage}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialogs — fuera del Card para evitar z-index issues */}
      <UserDialogs
        userToEdit={actions.userToEdit}
        setUserToEdit={actions.setUserToEdit}
        initiateRoleChange={actions.initiateRoleChange}
        isUpdating={actions.isUpdating}
        isVerificationRequired={actions.isVerificationRequired}
        setIsVerificationRequired={actions.setIsVerificationRequired}
        passwordInput={actions.passwordInput}
        setPasswordInput={actions.setPasswordInput}
        verificationError={actions.verificationError}
        setVerificationError={actions.setVerificationError}
        handleVerificationAndSubmit={actions.handleVerificationAndSubmit}
        userToDelete={actions.userToDelete}
        setUserToDelete={actions.setUserToDelete}
        handleDelete={actions.handleDelete}
        isDeleting={actions.isDeleting}
      />

      <UserVehiclesDialog
        open={actions.userVehiclesDialog.open}
        onClose={actions.closeVehiclesDialog}
        userId={actions.userVehiclesDialog.userId}
        userName={actions.userVehiclesDialog.userName}
      />

      {/* Shake animation — solo se aplica a .animate-shake, no bloquea nada */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </>
  );
};