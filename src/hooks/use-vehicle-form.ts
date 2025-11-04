// src/hooks/use-vehicle-form.ts
"use client"

import { toast } from "sonner"
import { useState, useCallback, useEffect } from "react"
import { type VehicleDataBackend, ApprovalStatus, Documentation } from "@/types/types" // Importación corregida
import type { Bank } from "@/constants/form-constants"
import { useFormValidation } from "./use-form-validation"

// ========== TIPOS ==========
type FormErrors = { [key: string]: string };

interface UseVehicleFormProps {
  formRef: React.RefObject<HTMLDivElement>;
}

// ========== DATOS INICIALES ==========
const initialFormData: Partial<VehicleDataBackend> = {
  features: [],
  images: [],
  sellerContact: { name: "", email: "", phone: "" },
  year: new Date().getFullYear(),
  documentation: [], // Array de strings, no de enums
  offersFinancing: false,
  isFeatured: false, // ✅ Añadido: Campo para vehículo destacado
};

// ========== HOOK PRINCIPAL ==========
export const useVehicleForm = ({ formRef }: UseVehicleFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [highestCompletedStep, setHighestCompletedStep] = useState(1);
  const [formData, setFormData] =
    useState<Partial<VehicleDataBackend>>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false); // Nuevo estado
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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
          const parsedData = JSON.parse(saved)
          // Asegurar que la documentación sea un array de strings
          if (parsedData.documentation && Array.isArray(parsedData.documentation)) {
            parsedData.documentation = parsedData.documentation.map((doc: string | Documentation) => 
              typeof doc === 'string' ? doc : String(doc)
            )
          }
          if (parsedData.highestCompletedStep) {
            setHighestCompletedStep(parsedData.highestCompletedStep);
          }
          setFormData(parsedData)
        } catch (error) {
          console.error("Error loading saved data:", error)
        }
      }
      setIsLoading(false)
    }
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && submissionStatus !== "success" && !isLoading) {
      setSaveStatus("saving")
      localStorage.setItem("vehicleFormData", JSON.stringify({
        ...formData,
        highestCompletedStep,
      }));
      const timer = setTimeout(() => {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [formData, submissionStatus, isLoading, highestCompletedStep])

  // Efecto para validar el paso actual en tiempo real
  useEffect(() => {
    // Validamos y actualizamos los errores en tiempo real.
    const validation = validateStep(currentStep, formData, selectedBank, paymentProof, referenceNumber);
    setIsCurrentStepValid(validation.isValid);
    // ¡AQUÍ ESTÁ LA MAGIA! Actualizamos los errores para que la UI reaccione.
    setErrors(validation.errors);
  }, [formData, currentStep, selectedBank, paymentProof, referenceNumber, validateStep]);


  const handleSwitchChange = useCallback((field: keyof VehicleDataBackend, checked: boolean) => {
    setFormData(prev => {
      const newState: Partial<VehicleDataBackend> = { ...prev, [field]: checked };

      if (field === 'offersFinancing') {
        if (checked) {
          // Si se activa, nos aseguramos de que financingDetails exista
          newState.financingDetails = newState.financingDetails || {
            interestRate: 18,
            loanTerm: 36,
          };
        } else {
          // Si se desactiva, eliminamos financingDetails
          delete newState.financingDetails;
        }
      } else if (field === 'isFeatured') {
        newState.isFeatured = checked;
      }
      
      return newState;
    });
  }, []);


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
          };
        }
        if (field === "financingDetails") {
          const financingValue =
            typeof value === "object" && value !== null ? value : {};
          return {
            ...prev,
            financingDetails: {
              interestRate: prev.financingDetails?.interestRate || 0,
              loanTerm: prev.financingDetails?.loanTerm || 0,
              ...financingValue,
            },
          };
        }
        if (field.startsWith("sellerContact.")) {
          const contactField = field.split(".")[1];
          return {
            ...prev,
            sellerContact: {
              name: prev.sellerContact?.name || "",
              email: prev.sellerContact?.email || "",
              phone: prev.sellerContact?.phone || "",
              [contactField]: value,
            },
          };
        }
        return { ...prev, [field]: value };
      });

      // Clear related errors
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

  // CORRECCIÓN: Manejar documentación como strings
  const handleDocumentationToggle = useCallback((docType: Documentation) => {
    setFormData((prev) => {
      const currentDocs = prev.documentation || [];
      const docString = docType.toString(); // Convertir enum a string
      const docExists = currentDocs.includes(docString);
      
      if (docExists) {
        return {
          ...prev,
          documentation: currentDocs.filter(doc => doc !== docString)
        };
      } else {
        return {
          ...prev,
          documentation: [...currentDocs, docString]
        };
      }
    });
  }, [])

  // CORRECCIÓN: Verificar documentación como strings
  const isDocumentationSelected = useCallback((docType: Documentation) => {
    return formData.documentation?.includes(docType.toString()) || false;
  }, [formData.documentation])

  const handleImagesChange = useCallback((urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: urls,
    }));
  }, [])

  const validateCurrentStep = useCallback(() => {
    const validation = validateStep(
      currentStep,
      formData,
      selectedBank,
      paymentProof,
      referenceNumber
    );
    setErrors(validation.errors);
    return validation.isValid;
  }, [
    currentStep,
    formData,
    selectedBank,
    paymentProof,
    referenceNumber,
    validateStep,
  ]);

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      const next = Math.min(currentStep + 1, 6);
      setCurrentStep(next);
      setHighestCompletedStep((prev) => Math.max(prev, next));
      scrollToTop();
    }
  }, [validateCurrentStep, currentStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToTop();
  }, []);

  // ✅ CORRECCIÓN: Agregar highestCompletedStep a las dependencias
  const manualSave = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vehicleFormData", JSON.stringify({
        ...formData,
        highestCompletedStep,
      }));
      setSaveStatus("saved")
      toast.success("¡Progreso guardado exitosamente!")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }, [formData, highestCompletedStep]) // ← Dependencia agregada aquí

  const handleSubmit = useCallback(async () => {
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // Preparar datos del vehículo
      const vehiclePayload = {
        ...formData,
        features: formData.features || [],
        images: formData.images || [],
        status: ApprovalStatus.PENDING,
        warranty: formData.warranty || "NO_WARRANTY",
        selectedBank: selectedBank?.name,
        referenceNumber,
        // Asegurar que la documentación sea un array de strings
        documentation: formData.documentation || [],
      }

      // Crear FormData para el envío
      const submissionFormData = new FormData();
      submissionFormData.append("vehicleData", JSON.stringify(vehiclePayload));
      
      if (paymentProof) {
        submissionFormData.append("paymentProof", paymentProof);
      }

      // Llamada a la API
      const response = await fetch("/api/post-ad", {
        method: "POST",
        body: submissionFormData,
      })

      const result = await response.json();

      if (!response.ok || !result.success) {
        setSubmissionStatus("error")
        setErrors(result.validationErrors || { general: result.error || "Ocurrió un error desconocido." });
        return
      }

      // Éxito
      setSubmissionStatus("success")
      setFormData((prev) => ({
        ...prev,
        _id: result.data._id,
        paymentProof: result.data.paymentProof,
      }))
      setCurrentStep(7)
      
      // Limpiar localStorage solo en caso de éxito
      if (typeof window !== "undefined") {
        localStorage.removeItem("vehicleFormData")
      }
    } catch (error) {
      setSubmissionStatus("error")
      console.error("Error en submit:", error)
      setErrors({
        general: error instanceof Error ? error.message : "Error de red",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateCurrentStep, referenceNumber, paymentProof])

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setErrors({});
    setSubmissionStatus("idle");
    setSelectedBank(null);
    setPaymentProof(null);
    setReferenceNumber("");
    setSaveStatus("idle");
    setHighestCompletedStep(1);
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("vehicleFormData");
    }
  }, []);

  return {
    // State
    currentStep,
    highestCompletedStep,
    formData,
    isCurrentStepValid, // Exponer el nuevo estado
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
    setFormData,
    setSelectedBank,
    setPaymentProof,
    setReferenceNumber,

    // Handlers
    handleInputChange,
    handleFeatureToggle,
    handleDocumentationToggle,
    isDocumentationSelected,
    handleImagesChange,
    handleSwitchChange,
    nextStep,
    prevStep,
    manualSave,
    handleSubmit,
    resetForm,
  }
}