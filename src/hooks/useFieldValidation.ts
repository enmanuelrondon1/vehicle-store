//src/hooks/useFieldValidation.ts
"use client";
import { useEffect, useState } from 'react';

type FormFieldValue = string | number | undefined | boolean | string[] | {} | null;

// ✅ FIX #10: Reemplazado isPristine por hasBeenTouched.
//
// PROBLEMA ANTERIOR:
//   isPristine se reseteaba a true cuando el valor volvía a estar vacío.
//   Resultado: usuario escribe → borra → campo queda "pristine" → no muestra
//   error en rojo → botón "Siguiente" bloqueado sin feedback visual claro.
//
// SOLUCIÓN:
//   hasBeenTouched es un estado unidireccional — una vez true, nunca vuelve a false.
//   Así, si el usuario escribe y luego borra, el campo sí muestra el error en rojo.
//
// COMPORTAMIENTO:
//   - Campo vacío sin tocar      → borde neutro (azul al focus)
//   - Campo con valor válido     → borde primary (verde/azul según tema)
//   - Campo tocado + vacío       → borde destructivo (rojo) ← FIX
//   - Campo tocado + con error   → borde destructivo (rojo)
//   - Campo tocado + sin error   → borde primary (válido)

export const useFieldValidation = (value: FormFieldValue, error: string | undefined) => {
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  useEffect(() => {
    // Una vez que el campo tiene valor, se marca como tocado para siempre
    if (!hasBeenTouched && value !== undefined && value !== '' && value !== null) {
      setHasBeenTouched(true);
    }
  }, [value, hasBeenTouched]);

  const hasValue = value !== undefined && value !== '' && value !== null;
  const isValid = hasBeenTouched && hasValue && !error;

  const getBorderClassName = () => {
    // Campo nunca tocado → neutro
    if (!hasBeenTouched) {
      return 'border-input focus:ring-blue-500/20 dark:focus:ring-blue-400/20';
    }

    // Campo tocado con error O campo tocado y vacío → rojo
    if (error || !hasValue) {
      return 'border-destructive focus:ring-destructive/20';
    }

    // Campo tocado, con valor y sin error → válido
    return 'border-primary focus:ring-primary/20';
  };

  return { isValid, getBorderClassName };
};