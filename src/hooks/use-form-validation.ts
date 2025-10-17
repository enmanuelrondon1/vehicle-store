// src/hooks/use-form-validation.ts
import { useCallback } from "react";
import { schemasByStep, VehicleDataBackend } from "@/lib/vehicleSchema";
import { Bank } from "@/constants/form-constants";

// type ErrorRecord = Partial<Record<keyof any, string>>;

export function useFormValidation() {
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
        if (!selectedBank)
          paymentErrors.selectedBank = "Debes seleccionar un banco.";
        if (!referenceNumber || referenceNumber.length < 8)
          paymentErrors.referenceNumber = "El número de referencia es inválido.";
        if (!paymentProof)
          paymentErrors.paymentProof = "Debes subir un comprobante.";
        return {
          isValid: Object.keys(paymentErrors).length === 0,
          errors: paymentErrors,
        };
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
}