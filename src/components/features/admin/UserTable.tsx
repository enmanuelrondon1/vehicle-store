// src/components/features/admin/UserTable.tsx
"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Edit2,
  Trash2,
  Copy,
  Mail,
  Github,
  Chrome,
  ShieldCheck,
  LayoutList,
  MoreVertical,
  Calendar,
  Clock,
} from "lucide-react";

const SUPER_ADMIN_EMAIL = "designdevproenmanuel@gmail.com";

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  provider: string;
  createdAt: string;
  vehicleCount: number;
  lastSignInAt: string | null;
}

interface UserTableProps {
  users: UserData[];
  isUpdating: boolean;
  isDeleting: boolean;
  onEdit: (user: { id: string; role: string; fullName: string; email: string }) => void;
  onDelete: (user: { id: string; fullName: string }) => void;
  onCopy: (text: string, fieldName: string) => void;
  onViewVehicles: (userId: string, userName: string) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const PROVIDER_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  google: {
    icon: <Chrome className="h-3.5 w-3.5" />,
    label: "Google",
    color: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  github: {
    icon: <Github className="h-3.5 w-3.5" />,
    label: "GitHub",
    color: "text-foreground bg-foreground/10 border-border/30",
  },
  credentials: {
    icon: <Mail className="h-3.5 w-3.5" />,
    label: "Email",
    color: "text-accent bg-accent/10 border-accent/20",
  },
};

const getInitialColor = (name: string) => {
  const colors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-blue-600",
  ];
  return colors[name.charCodeAt(0) % colors.length];
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatLastSeen = (dateStr: string | null) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleString("es-ES", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = memo(({ name, isSuperAdmin }: { name: string; isSuperAdmin: boolean }) => (
  <div className="relative flex-shrink-0">
    <div
      className={`w-9 h-9 bg-gradient-to-br ${getInitialColor(name)} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
    {isSuperAdmin && (
      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-background">
        <ShieldCheck className="w-2.5 h-2.5 text-white" />
      </div>
    )}
  </div>
));
Avatar.displayName = "Avatar";

// ── Provider chip ─────────────────────────────────────────────────────────────
const ProviderChip = memo(({ provider }: { provider: string }) => {
  const cfg = PROVIDER_CONFIG[provider] ?? PROVIDER_CONFIG.credentials;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
});
ProviderChip.displayName = "ProviderChip";

// ── Role badge ────────────────────────────────────────────────────────────────
const RoleBadge = memo(({ role }: { role: string }) =>
  role === "admin" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
      👑 Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
      👤 Usuario
    </span>
  )
);
RoleBadge.displayName = "RoleBadge";

// ── Actions dropdown (shared between card and row) ────────────────────────────
const ActionsMenu = memo(
  ({
    user,
    isUpdating,
    isDeleting,
    onEdit,
    onDelete,
    onCopy,
    onViewVehicles,
  }: {
    user: UserData;
    isUpdating: boolean;
    isDeleting: boolean;
    onEdit: UserTableProps["onEdit"];
    onDelete: UserTableProps["onDelete"];
    onCopy: UserTableProps["onCopy"];
    onViewVehicles: UserTableProps["onViewVehicles"];
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 flex-shrink-0"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 card-glass border-border/50">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
          {user.fullName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />

        <DropdownMenuItem
          onClick={() => onCopy(user.email, "Email")}
          className="gap-2 cursor-pointer text-sm"
        >
          <Copy className="w-3.5 h-3.5" />
          Copiar email
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            onEdit({ id: user.id, role: user.role, fullName: user.fullName, email: user.email })
          }
          disabled={isUpdating || isDeleting}
          className="gap-2 cursor-pointer text-sm"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Editar rol
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onViewVehicles(user.id, user.fullName)}
          className="gap-2 cursor-pointer text-sm"
        >
          <LayoutList className="w-3.5 h-3.5" />
          Ver anuncios
          {user.vehicleCount > 0 && (
            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent/20 text-accent">
              {user.vehicleCount > 9 ? "9+" : user.vehicleCount}
            </span>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border/50" />

        <DropdownMenuItem
          onClick={() => onDelete({ id: user.id, fullName: user.fullName })}
          disabled={isUpdating || isDeleting || user.email === SUPER_ADMIN_EMAIL}
          className="gap-2 cursor-pointer text-sm text-destructive/80 focus:text-destructive focus:bg-destructive/10 disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Eliminar usuario
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
);
ActionsMenu.displayName = "ActionsMenu";

// ── Mobile card ───────────────────────────────────────────────────────────────
const UserCard = memo(
  ({
    user,
    index,
    ...actions
  }: { user: UserData; index: number } & Omit<UserTableProps, "users">) => {
    const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;
    const lastSeen = formatLastSeen(user.lastSignInAt);

    return (
      <div
        className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card/30 hover:bg-card/60 hover:border-border/50 transition-all duration-200 animate-fade-in"
        style={{ animationDelay: `${index * 40}ms` }}
      >
        <Avatar name={user.fullName} isSuperAdmin={isSuperAdmin} />

        <div className="flex-1 min-w-0 space-y-1">
          {/* Name + role */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-semibold text-sm text-foreground cursor-pointer hover:text-accent transition-colors leading-tight"
              onClick={() => actions.onCopy(user.fullName, "Nombre")}
            >
              {user.fullName}
            </span>
            <RoleBadge role={user.role} />
          </div>

          {/* Email */}
          <div
            className="text-xs text-muted-foreground truncate cursor-pointer hover:text-accent/80 transition-colors"
            onClick={() => actions.onCopy(user.email, "Email")}
          >
            {user.email}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            <ProviderChip provider={user.provider} />
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
              <Calendar className="w-3 h-3" />
              {formatDate(user.createdAt)}
            </span>
            {lastSeen ? (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                <Clock className="w-3 h-3" />
                {lastSeen}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground/40 italic">Sin acceso</span>
            )}
          </div>
        </div>

        <ActionsMenu user={user} {...actions} />
      </div>
    );
  }
);
UserCard.displayName = "UserCard";

// ── Desktop table row ─────────────────────────────────────────────────────────
const UserRow = memo(
  ({
    user,
    index,
    ...actions
  }: { user: UserData; index: number } & Omit<UserTableProps, "users">) => {
    const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;
    const lastSeen = formatLastSeen(user.lastSignInAt);

    return (
      <tr
        className="group hover:bg-muted/10 transition-colors duration-150 animate-fade-in"
        style={{ animationDelay: `${index * 40}ms` }}
      >
        {/* Usuario (nombre + email) */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar name={user.fullName} isSuperAdmin={isSuperAdmin} />
            <div className="min-w-0">
              <div
                className="font-semibold text-sm text-foreground truncate max-w-[160px] cursor-pointer hover:text-accent transition-colors"
                onClick={() => actions.onCopy(user.fullName, "Nombre")}
              >
                {user.fullName}
              </div>
              <div
                className="text-xs text-muted-foreground truncate max-w-[160px] cursor-pointer hover:text-accent/70 transition-colors"
                onClick={() => actions.onCopy(user.email, "Email")}
              >
                {user.email}
              </div>
            </div>
          </div>
        </td>

        {/* Proveedor */}
        <td className="px-4 py-3">
          <ProviderChip provider={user.provider} />
        </td>

        {/* Rol */}
        <td className="px-4 py-3">
          <RoleBadge role={user.role} />
        </td>

        {/* Fechas — solo en xl para no saturar */}
        <td className="px-4 py-3 hidden xl:table-cell">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              {formatDate(user.createdAt)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
              <Clock className="w-3 h-3 flex-shrink-0" />
              {lastSeen ?? <span className="italic">Sin acceso</span>}
            </div>
          </div>
        </td>

        {/* Acciones */}
        <td className="px-4 py-3">
          <ActionsMenu user={user} {...actions} />
        </td>
      </tr>
    );
  }
);
UserRow.displayName = "UserRow";

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <Users className="w-10 h-10 text-muted-foreground/30" />
    <p className="text-sm text-muted-foreground">No se encontraron usuarios</p>
  </div>
);

// ── Main export ───────────────────────────────────────────────────────────────
export const UserTable = memo(
  ({ users, ...props }: UserTableProps) => {
    if (users.length === 0) return <EmptyState />;

    return (
      <div className="rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">

        {/* ── Móvil: lista de tarjetas (<md) ── */}
        <div className="md:hidden space-y-1.5 p-2">
          {users.map((user, index) => (
            <UserCard key={user.id} user={user} index={index} {...props} />
          ))}
        </div>

        {/* ── Desktop: tabla (≥md) ── */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                {["Usuario", "Proveedor", "Rol"].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                  >
                    {label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase hidden xl:table-cell">
                  Fechas
                </th>
                <th className="px-4 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {users.map((user, index) => (
                <UserRow key={user.id} user={user} index={index} {...props} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);
UserTable.displayName = "UserTable";