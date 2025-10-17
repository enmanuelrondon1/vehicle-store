// src/components/features/home/hero/data.tsx
import { Users, Shield, TrendingUp, Zap } from "lucide-react";

export const features = [
  {
    icon: <Zap />,
    title: "Publicación Rápida",
    description:
      "Sube tu anuncio en menos de 5 minutos con nuestro sistema optimizado.",
    textColor: "text-primary",
    borderColor: "border-primary",
    bgColor: "bg-primary/5",
    iconBg: "bg-primary/10",
  },
  {
    icon: <Users />,
    title: "Miles de Compradores",
    description: "Conecta con una audiencia activa buscando su próximo vehículo.",
    textColor: "text-[var(--chart-2)]",
    borderColor: "border-[var(--chart-2)]",
    bgColor: "bg-[var(--chart-2)]/5",
    iconBg: "bg-[var(--chart-2)]/10",
  },
  {
    icon: <Shield />,
    title: "Transacciones Seguras",
    description:
      "Plataforma confiable con verificación de usuarios y soporte 24/7.",
    textColor: "text-[var(--chart-3)]",
    borderColor: "border-[var(--chart-3)]",
    bgColor: "bg-[var(--chart-3)]/5",
    iconBg: "bg-[var(--chart-3)]/10",
  },
  {
    icon: <TrendingUp />,
    title: "Mejor Precio",
    description:
      "Herramientas de valuación para obtener el mejor precio por tu vehículo.",
    textColor: "text-[var(--chart-4)]",
    borderColor: "border-[var(--chart-4)]",
    bgColor: "bg-[var(--chart-4)]/5",
    iconBg: "bg-[var(--chart-4)]/10",
  },
];

export const stats = [
  {
    number: "50K+",
    label: "Vehículos Vendidos",
    textColor: "text-[var(--chart-3)]",
    bgColor: "bg-[var(--chart-3)]/10",
    borderColor: "border-[var(--chart-3)]/30",
  },
  {
    number: "25K+",
    label: "Usuarios Activos",
    textColor: "text-[var(--chart-2)]",
    bgColor: "bg-[var(--chart-2)]/10",
    borderColor: "border-[var(--chart-2)]/30",
  },
  {
    number: "4.8",
    label: "Calificación Obtenida",
    textColor: "text-[var(--chart-4)]",
    bgColor: "bg-[var(--chart-4)]/10",
    borderColor: "border-[var(--chart-4)]/30",
  },
  {
    number: "48h",
    label: "Tiempo Promedio",
    textColor: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
];

export const benefits = [
  "Sin comisiones ocultas",
  "Soporte 24/7",
  "Proceso 100% digital",
  "Verificación de usuarios",
];