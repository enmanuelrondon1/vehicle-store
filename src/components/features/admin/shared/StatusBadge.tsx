// src/components/features/admin/shared/StatusBadge.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { ApprovalStatus } from "@/types/types";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatusBadgeProps {
  status: ApprovalStatus;
}

// ✅ Define el tipo de configuración explícitamente
type StatusConfig = {
  variant: "secondary" | "default" | "destructive";
  icon: LucideIcon;
  text: string;
  className: string;
};

// ✅ Tipado correcto: Record parcial que mapea ApprovalStatus a StatusConfig
type StatusVariants = Partial<Record<ApprovalStatus, StatusConfig>>;

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variants: StatusVariants = {
    [ApprovalStatus.PENDING]: {
      variant: "secondary",
      icon: Clock,
      text: "Pendiente",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    [ApprovalStatus.APPROVED]: {
      variant: "default",
      icon: CheckCircle,
      text: "Aprobado",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    [ApprovalStatus.REJECTED]: {
      variant: "destructive",
      icon: XCircle,
      text: "Rechazado",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    [ApprovalStatus.UNDER_REVIEW]: {
      variant: "default",
      icon: Eye,
      text: "En Revisión",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
  };

  // ✅ Configuración por defecto bien tipada
  const defaultConfig: StatusConfig = {
    variant: "secondary",
    icon: Clock,
    text: "Pendiente",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  const config = variants[status] || defaultConfig;
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1 text-xs ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      <span className="hidden xs:inline">{config.text}</span>
    </Badge>
  );
};