// src/components/features/admin/shared/StatusBadge.tsx - VERSION VISIBLE Y PROFESIONAL
"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { ApprovalStatus } from "@/types/types";

interface StatusBadgeProps {
  status: ApprovalStatus;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  animated = true,
  size = "md" 
}) => {
  type BadgeConfig = {
    label: string;
    icon: React.ComponentType<any>;
    bgColor: string;
    textColor: string;
    borderColor: string;
    glowColor: string;
  };

  const statusConfig: Partial<Record<ApprovalStatus, BadgeConfig>> = {
    [ApprovalStatus.PENDING]: {
      label: "Pendiente",
      icon: Clock,
      bgColor: "rgba(250, 204, 21, 0.95)", // Amarillo brillante
      textColor: "#713f12", // Texto oscuro
      borderColor: "#fbbf24",
      glowColor: "rgba(250, 204, 21, 0.4)"
    },
    [ApprovalStatus.UNDER_REVIEW]: {
      label: "En Revisión",
      icon: Eye,
      bgColor: "rgba(59, 130, 246, 0.95)", // Azul brillante
      textColor: "#1e3a8a",
      borderColor: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.4)"
    },
    [ApprovalStatus.APPROVED]: {
      label: "Aprobado",
      icon: CheckCircle,
      bgColor: "rgba(34, 197, 94, 0.95)", // Verde brillante
      textColor: "#14532d",
      borderColor: "#22c55e",
      glowColor: "rgba(34, 197, 94, 0.4)"
    },
    [ApprovalStatus.REJECTED]: {
      label: "Rechazado",
      icon: XCircle,
      bgColor: "rgba(239, 68, 68, 0.95)", // Rojo brillante
      textColor: "#7f1d1d",
      borderColor: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.4)"
    }
  };

  const config = (statusConfig[status] ?? statusConfig[ApprovalStatus.PENDING]) as BadgeConfig;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const BadgeContent = (
    <div 
      className={`inline-flex items-center gap-2 rounded-lg font-bold shadow-lg backdrop-blur-sm ${sizeClasses[size]}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: `2px solid ${config.borderColor}`
      }}
    >
      {animated ? (
        <motion.div
          animate={{ 
            rotate: status === ApprovalStatus.UNDER_REVIEW ? 360 : 0,
            scale: status === ApprovalStatus.PENDING ? [1, 1.15, 1] : 1
          }}
          transition={{ 
            duration: status === ApprovalStatus.UNDER_REVIEW ? 2 : 1.5,
            repeat: animated ? Infinity : 0,
            ease: "linear"
          }}
        >
          <Icon className={iconSizes[size]} strokeWidth={2.5} />
        </motion.div>
      ) : (
        <Icon className={iconSizes[size]} strokeWidth={2.5} />
      )}
      <span className="font-extrabold tracking-tight uppercase text-xs">
        {config.label}
      </span>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ duration: 0.2 }}
        className="inline-block relative"
      >
        {/* Efecto de glow MÁS FUERTE */}
        <motion.div
          className="absolute inset-0 rounded-lg blur-lg -z-10"
          style={{ 
            backgroundColor: config.glowColor,
            boxShadow: `0 0 20px ${config.glowColor}, 0 0 40px ${config.glowColor}`
          }}
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {BadgeContent}
      </motion.div>
    );
  }

  return BadgeContent;
};

export default StatusBadge;