// src/utils/locationUtils.ts

/**
 * Normaliza y convierte un string de ubicación a un 'slug' canónico.
 * Ejemplo: "Caracas, Distrito Capital" => "caracas-distrito-capital"
 * @param location El string de la ubicación.
 * @returns El slug canónico de la ubicación.
 */
export const getCanonicalLocationSlug = (location: string): string => {
  if (!location) {
    return "";
  }

  return location
    .toLowerCase()
    .normalize("NFD") // Descompone los caracteres acentuados (e.g., 'é' -> 'e' + '´')
    .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos
    .replace(/[^a-z0-9\s-]/g, "") // Elimina caracteres no alfanuméricos, excepto espacios y guiones
    .trim() // Elimina espacios al inicio y al final
    .replace(/\s+/g, "-"); // Reemplaza espacios con guiones
};