// src/hooks/useDebounce.ts
"use client";

import { useState, useEffect } from "react";

/**
 * Un custom hook que retrasa la actualización de un valor.
 * Es útil para evitar ejecuciones excesivas de funciones costosas
 * (como llamadas a API o filtrados complejos) mientras el usuario escribe.
 *
 * @param value El valor que se quiere "debouncear".
 * @param delay El tiempo de espera en milisegundos.
 * @returns El valor "debounceado" después del tiempo de espera.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}