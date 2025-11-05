// src/components/shared/AosInitializer.tsx
"use client"; // <-- Este SÍ es un Client Component

import { useEffect } from "react";

export function AosInitializer() {
  useEffect(() => {
    // Usamos una importación dinámica para evitar problemas de SSR
    import('aos').then((AOS) => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100,
      });
    });
  }, []);

  // Este componente no renderiza nada visualmente
  return null;
}