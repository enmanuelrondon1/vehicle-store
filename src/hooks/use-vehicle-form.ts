"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { type VehicleDataBackend, ApprovalStatus } from "@/types/types"
import type { Bank } from "@/constants/form-constants"
import { compressAndUploadImages } from "@/utils/image-utils"
import { useFormValidation } from "./use-form-validation"

interface FormErrors {
  [key: string]: string
}

export const useVehicleForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<VehicleDataBackend>>({
    features: [],
    images: [],
    sellerContact: { name: "", email: "", phone: "" },
    year: new Date().getFullYear(),
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle")
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [referenceNumber, setReferenceNumber] = useState<string>("")

  const { validateStep } = useFormValidation()

  // Load saved data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vehicleFormData")
      if (saved) {
        try {
          setFormData(JSON.parse(saved))
        } catch (error) {
          console.error("Error loading saved data:", error)
        }
      }
    }
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && submissionStatus !== "success") {
      setSaveStatus("saving")
      localStorage.setItem("vehicleFormData", JSON.stringify(formData))
      const timer = setTimeout(() => {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [formData, submissionStatus])

  const handleInputChange = useCallback(
    (field: string, value: unknown) => {
      setFormData((prev) => {
        if (field === "sellerContact") {
          const contactValue = typeof value === "object" && value !== null ? value : {}
          return {
            ...prev,
            sellerContact: {
              name: prev.sellerContact?.name || "",
              email: prev.sellerContact?.email || "",
              phone: prev.sellerContact?.phone || "",
              ...contactValue,
            },
          }
        }
        if (field.startsWith("sellerContact.")) {
          const contactField = field.split(".")[1]
          return {
            ...prev,
            sellerContact: {
              name: prev.sellerContact?.name || "",
              email: prev.sellerContact?.email || "",
              phone: prev.sellerContact?.phone || "",
              [contactField]: value,
            },
          }
        }
        return { ...prev, [field]: value }
      })

      if (errors[field] || (field.startsWith("sellerContact.") && errors[field])) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          if (field.startsWith("sellerContact.")) {
            delete newErrors[field]
          }
          return newErrors
        })
      }
    },
    [errors],
  )

  const handleFeatureToggle = useCallback((feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...(prev.features || []), feature],
    }))
  }, [])

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setIsLoading(true)

      try {
        const imageUrls = await compressAndUploadImages(files)
        setFormData((prev) => ({
          ...prev,
          images: prev.images ? [...prev.images, ...imageUrls] : [...imageUrls],
        }))
      } catch (error) {
        console.error("Error al subir imágenes:", error)
        alert("Error al subir imágenes. Revisa la consola.")
      } finally {
        setIsLoading(false)
      }
    }
  }, [])

  const handleRemoveImage = useCallback((index: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta imagen?")) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images!.filter((_, i) => i !== index),
      }))
    }
  }, [])

  const validateCurrentStep = useCallback(() => {
    const validation = validateStep(currentStep, formData, selectedBank, paymentProof, referenceNumber)
    setErrors(validation.errors)
    return validation.isValid
  }, [currentStep, formData, selectedBank, paymentProof, referenceNumber, validateStep])

  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 6))
    }
  }, [validateCurrentStep])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const manualSave = useCallback(() => {
    localStorage.setItem("vehicleFormData", JSON.stringify(formData))
    setSaveStatus("saved")
    setTimeout(() => setSaveStatus("idle"), 2000)
  }, [formData])

  const handleSubmit = useCallback(async () => {
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // 1. Preparar todos los datos en un solo objeto
      const vehiclePayload = {
        ...formData,
        features: formData.features || [],
        images: formData.images || [],
        status: ApprovalStatus.PENDING,
        warranty: formData.warranty || "NO_WARRANTY",
        selectedBank: selectedBank?.name,
        referenceNumber,
      }

      // 2. Crear un único FormData para enviar todo junto
      const submissionFormData = new FormData();
      submissionFormData.append("vehicleData", JSON.stringify(vehiclePayload));
      
      if (paymentProof) {
        submissionFormData.append("paymentProof", paymentProof);
      }

      // 3. Hacer una única llamada a la API
      const response = await fetch("/api/post-ad", {
        method: "POST",
        body: submissionFormData, // No se necesita 'Content-Type', el navegador lo pone por nosotros
      })

      const result = await response.json();

      if (!response.ok || !result.success) {
        setSubmissionStatus("error")
        setErrors(result.validationErrors || { general: result.error || "Ocurrió un error desconocido." });
        return
      }

      setSubmissionStatus("success")
      setFormData((prev) => ({
        ...prev,
        _id: result.data._id,
        paymentProof: result.data.paymentProof,
      }))
      setCurrentStep(7)
      localStorage.removeItem("vehicleFormData")
    } catch (error) {
      setSubmissionStatus("error")
      console.error("Error en submit:", error)
      setErrors({
        general: error instanceof Error ? error.message : "Error de red",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateCurrentStep, selectedBank, referenceNumber, paymentProof])

  return {
    // State
    currentStep,
    formData,
    errors,
    isSubmitting,
    isLoading,
    saveStatus,
    submissionStatus,
    selectedBank,
    paymentProof,
    referenceNumber,

    // Setters
    setCurrentStep,
    setSelectedBank,
    setPaymentProof,
    setReferenceNumber,

    // Handlers
    handleInputChange,
    handleFeatureToggle,
    handleImageUpload,
    handleRemoveImage,
    nextStep,
    prevStep,
    manualSave,
    handleSubmit,
  }
}
