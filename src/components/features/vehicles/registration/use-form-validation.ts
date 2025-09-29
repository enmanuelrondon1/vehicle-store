// src/hooks/use-form-validation.ts
"use client";

import { useCallback } from "react";
import { schemasByStep } from "@/components/features/vehicles/registration/vehicleSchema";
import type { VehicleDataBackend } from "@/types/types";
import type { Bank } from "@/constants/form-constants";

export const useFormValidation = () => {
  const validateStep = useCallback(
    (
      step: number,
      formData: Partial<VehicleDataBackend>,
      selectedBank?: Bank | null,
      paymentProof?: File | null,
      referenceNumber?: string
    ) => {
      const currentSchema = schemasByStep[step as keyof typeof schemasByStep];

      if (!currentSchema) {
        return { isValid: true, errors: {} };
      }

      // Special validation for payment step
      if (step === 6) {
        const paymentErrors: Record<string, string> = {};
        if (!selectedBank) paymentErrors.selectedBank = "Debes seleccionar un banco.";
        if (!referenceNumber || referenceNumber.length < 8) paymentErrors.referenceNumber = "El número de referencia es inválido.";
        if (!paymentProof) paymentErrors.paymentProof = "Debes subir un comprobante.";
        return { isValid: Object.keys(paymentErrors).length === 0, errors: paymentErrors };
      }

      const result = currentSchema.safeParse(formData);

      if (result.success) {
        return { isValid: true, errors: {} };
      }

      const formattedErrors = result.error.flatten().fieldErrors;
      return { isValid: false, errors: formattedErrors };
    },
    []
  );

  return { validateStep };
};