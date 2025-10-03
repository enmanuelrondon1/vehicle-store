//src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  ApprovalStatus,
  Documentation,
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
  WARRANTY_LABELS,
} from "@/types/types";



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Convierte una cadena de texto a formato "Title Case".
 * Ejemplo: "enmanuel perez" -> "Enmanuel Perez"
 * @param str La cadena de texto a convertir.
 * @returns La cadena en formato Title Case.
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

export const formatMileage = (mileage: number) =>
  new Intl.NumberFormat("es-ES").format(mileage);

export const formatDate = (dateString?: string) => {
  if (!dateString) return "Fecha desconocida";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// --- Translation Maps and Functions ---

export const DOCUMENTATION_MAP: Record<Documentation, string> = {
  [Documentation.TITLE]: "Título de Propiedad",
  [Documentation.ORIGIN_CERTIFICATE]: "Certificado de Origen",
  [Documentation.TRANSIT_REVIEW]: "Revisión de Tránsito (INTT)",
  [Documentation.BOLIVARIAN_PLATES]: "Placas Bolivarianas",
};

export const STATUS_MAP: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]: "Pendiente",
  [ApprovalStatus.UNDER_REVIEW]: "En Revisión",
  [ApprovalStatus.APPROVED]: "Aprobado",
  [ApprovalStatus.REJECTED]: "Rechazado",
};

/**
 * Traduce un valor de un enum o tipo a una cadena legible por humanos usando un mapa.
 * @param value El valor a traducir.
 * @param map El mapa de traducción.
 * @returns La cadena traducida o el valor original si no se encuentra.
 */
export const translateValue = <T extends string, M extends Record<T, string>>(
  value: T,
  map: M
): M[T] | T => {
  return map[value] || value;
};

export { VEHICLE_CONDITIONS_LABELS, FUEL_TYPES_LABELS, TRANSMISSION_TYPES_LABELS, WARRANTY_LABELS };