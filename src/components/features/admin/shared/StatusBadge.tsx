// src/components/features/admin/shared/StatusBadge.tsx
// ✅ OPTIMIZADO: eliminado framer-motion completamente.
//    Tenía motion.div con animate opacity+scale repeat:Infinity (glow pulsante)
//    y motion.div con rotate/scale repeat:Infinity en el ícono.
//    Reemplazado por animate-pulse CSS para el glow y CSS transitions para hover.
//    Este componente se renderiza en CADA tarjeta de vehículo — el impacto era alto.

"use client";

import React from "react";
import { CheckCircle, Clock, XCircle, Eye, type LucideIcon } from "lucide-react";
import { ApprovalStatus } from "@/types/types";

interface StatusBadgeProps {
  status: ApprovalStatus;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  animated = true,
  size = "md",
}) => {
  type BadgeConfig = {
    label: string;
    icon: LucideIcon;
    bgColor: string;
    textColor: string;
    borderColor: string;
    glowColor: string;
  };

  const statusConfig: Partial<Record<ApprovalStatus, BadgeConfig>> = {
    [ApprovalStatus.PENDING]: {
      label: "Pendiente",
      icon: Clock,
      bgColor: "rgba(250, 204, 21, 0.95)",
      textColor: "#713f12",
      borderColor: "#fbbf24",
      glowColor: "rgba(250, 204, 21, 0.4)",
    },
    [ApprovalStatus.UNDER_REVIEW]: {
      label: "En Revisión",
      icon: Eye,
      bgColor: "rgba(59, 130, 246, 0.95)",
      textColor: "#1e3a8a",
      borderColor: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.4)",
    },
    [ApprovalStatus.APPROVED]: {
      label: "Aprobado",
      icon: CheckCircle,
      bgColor: "rgba(34, 197, 94, 0.95)",
      textColor: "#14532d",
      borderColor: "#22c55e",
      glowColor: "rgba(34, 197, 94, 0.4)",
    },
    [ApprovalStatus.REJECTED]: {
      label: "Rechazado",
      icon: XCircle,
      bgColor: "rgba(239, 68, 68, 0.95)",
      textColor: "#7f1d1d",
      borderColor: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.4)",
    },
  };

  const config = (statusConfig[status] ??
    statusConfig[ApprovalStatus.PENDING]) as BadgeConfig;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const BadgeContent = (
    <div
      className={`inline-flex items-center gap-2 rounded-lg font-bold shadow-lg backdrop-blur-sm ${sizeClasses[size]}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: `2px solid ${config.borderColor}`,
      }}
    >
      {/* ✅ CSS puro: ícono giratorio = animate-spin, pulsante = animate-pulse */}
      <Icon
        className={`${iconSizes[size]} ${
          status === ApprovalStatus.UNDER_REVIEW && animated
            ? "animate-spin"
            : status === ApprovalStatus.PENDING && animated
            ? "animate-pulse"
            : ""
        }`}
        strokeWidth={2.5}
      />
      <span className="font-extrabold tracking-tight uppercase text-xs">
        {config.label}
      </span>
    </div>
  );

  if (animated) {
    return (
      <div className="inline-block relative hover:scale-105 hover:-translate-y-0.5 transition-transform duration-200">
        {/* ✅ Glow con animate-pulse CSS — idéntico visualmente, 0 JS */}
        <div
          className="absolute inset-0 rounded-lg blur-lg -z-10 animate-pulse"
          style={{
            backgroundColor: config.glowColor,
            boxShadow: `0 0 20px ${config.glowColor}, 0 0 40px ${config.glowColor}`,
          }}
        />
        {BadgeContent}
      </div>
    );
  }

  return BadgeContent;
};

export default StatusBadge;