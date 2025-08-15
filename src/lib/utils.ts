import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
