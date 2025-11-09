// src/hooks/useMatchHeight.ts
import { useEffect, useRef } from 'react';

/**
 * Un hook personalizado para igualar la altura de dos elementos.
 * @param sourceRefId - El ID del elemento cuya altura se desea copiar (la columna principal).
 * @param targetRef - El ref del elemento cuya altura se va a ajustar (la columna lateral).
 */
export const useMatchHeight = (sourceRefId: string, targetRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const sourceElement = document.getElementById(sourceRefId);
    const targetElement = targetRef.current;

    if (!sourceElement || !targetElement) {
      // Si los elementos no existen, salimos del efecto.
      // Esto es importante en SSR (Next.js) donde el DOM no está disponible al principio.
      return;
    }

    // Función para igualar las alturas
    const matchHeight = () => {
      const sourceHeight = sourceElement.getBoundingClientRect().height;
      // Usamos minHeight en lugar de height para no recortar el contenido si el lateral es naturalmente más alto
      targetElement.style.minHeight = `${sourceHeight}px`;
    };

    // Crear un ResizeObserver para observar cambios en el tamaño del elemento fuente
    const resizeObserver = new ResizeObserver(() => {
      matchHeight();
    });

    // Empezar a observar
    resizeObserver.observe(sourceElement);

    // Igualar la altura inicialmente por si ya hay contenido cargado
    matchHeight();

    // Limpieza: desconectar el observer cuando el componente se desmonte
    return () => {
      resizeObserver.disconnect();
    };
  }, [sourceRefId, targetRef]); // Se vuelve a ejecutar si los refs cambian
};