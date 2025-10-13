// src/components/features/admin/shared/StatusBadge.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { ApprovalStatus } from "@/types/types";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";

interface StatusBadgeProps {
  status: ApprovalStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variants = {
    [ApprovalStatus.PENDING]: {
      variant: "secondary" as const,
      icon: Clock,
      text: "Pendiente",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    [ApprovalStatus.APPROVED]: {
      variant: "default" as const,
      icon: CheckCircle,
      text: "Aprobado",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    [ApprovalStatus.REJECTED]: {
      variant: "destructive" as const,
      icon: XCircle,
      text: "Rechazado",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    [ApprovalStatus.UNDER_REVIEW]: {
      variant: "default" as const,
      icon: Eye,
      text: "En Revisión",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
  };

  const config = variants[status] || variants[ApprovalStatus.PENDING];
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