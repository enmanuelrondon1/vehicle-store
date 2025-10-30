// src/components/features/home/hero/data.tsx
import { Zap, Users, Shield, TrendingUp } from "lucide-react";

export const features = [
  {
    // CAMBIO CLAVE: Pasamos el componente, no el elemento.
    icon: Zap, 
    title: "Publicación Rápida",
    description:
      "Sube tu anuncio en menos de 5 minutos con nuestro sistema optimizado.",
  },
  {
    icon: Users,
    title: "Miles de Compradores",
    description: "Conecta con una audiencia activa buscando su próximo vehículo.",
  },
  {
    icon: Shield,
    title: "Transacciones Seguras",
    description:
      "Plataforma confiable con verificación de usuarios y soporte 24/7.",
  },
  {
    icon: TrendingUp,
    title: "Mejor Precio",
    description:
      "Herramientas de valuación para obtener el mejor precio por tu vehículo.",
  },
];

// El resto del archivo no necesita cambios.
export const stats = [
  { number: "50K+", label: "Vehículos Vendidos" },
  { number: "25K+", label: "Usuarios Activos" },
  { number: "4.8", label: "Calificación Obtenida" },
  { number: "48h", label: "Tiempo Promedio" },
];

export const benefits = [
  "Sin comisiones ocultas",
  "Soporte 24/7",
  "Proceso 100% digital",
  "Verificación de usuarios",
];