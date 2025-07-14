"use client"

import { useCallback } from "react"
import type { VehicleDataBackend } from "@/types/types"
import type { Bank } from "@/constants/form-constants"

interface FormErrors {
  [key: string]: string
}

export const useFormValidation = () => {
  const validateStep = useCallback(
    (
      step: number,
      formData: Partial<VehicleDataBackend>,
      selectedBank: Bank | null,
      paymentProof: File | null,
      referenceNumber: string,
    ): { isValid: boolean; errors: FormErrors } => {
      const newErrors: FormErrors = {}

      if (step === 1) {
        if (!formData.category) newErrors.category = "Selecciona una categoría"
        if (!formData.brand) newErrors.brand = "Ingresa la marca"
        if (!formData.model) newErrors.model = "Ingresa el modelo"
        if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1)
          newErrors.year = "Ingresa un año válido (1900 - próximo año)"
        if (!formData.subcategory) newErrors.subcategory = "Selecciona una subcategoría"
      } else if (step === 2) {
        if (!formData.price || formData.price <= 0) newErrors.price = "Ingresa un precio válido"
        if (formData.mileage === undefined || formData.mileage < 0) newErrors.mileage = "Ingresa el kilometraje"
        if (!formData.condition) newErrors.condition = "Selecciona la condición"
      } else if (step === 3) {
        if (!formData.color) newErrors.color = "Selecciona un color"
        if (!formData.transmission) newErrors.transmission = "Selecciona la transmisión"
        if (!formData.fuelType) newErrors.fuelType = "Selecciona el tipo de combustible"
        if (formData.doors !== undefined && formData.doors < 1)
          newErrors.doors = "El número de puertas debe ser al menos 1"
        if (formData.seats !== undefined && formData.seats < 1)
          newErrors.seats = "El número de asientos debe ser al menos 1"
      } else if (step === 4) {
        if (!formData.sellerContact?.name) newErrors["sellerContact.name"] = "Ingresa tu nombre"
        if (!formData.sellerContact?.email || !formData.sellerContact.email.includes("@"))
          newErrors["sellerContact.email"] = "Ingresa un email válido (debe incluir @)"
        if (
          !formData.sellerContact?.phone ||
          !/^(0412|0424|0414|0426|0416)\s?\d{7}$/.test(formData.sellerContact.phone)
        )
          newErrors["sellerContact.phone"] = "Ingresa un teléfono válido (ej: 0412 1234567)"
        if (!formData.location) newErrors.location = "Ingresa la ubicación"
      } else if (step === 5) {
        if (formData.features?.length === 0) newErrors.features = "Selecciona al menos una característica"
      } else if (step === 6) {
        if (!selectedBank) newErrors.selectedBank = "Debes seleccionar un banco"
        if (!paymentProof) newErrors.paymentProof = "Debes subir un comprobante de pago"
        if (!referenceNumber) newErrors.referenceNumber = "Ingresa el número de referencia del pago"
      }

      return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors,
      }
    },
    [],
  )

  return { validateStep }
}
