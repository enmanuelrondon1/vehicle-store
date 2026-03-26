// src/hooks/use-vehicle-form.ts
"use client"

import { toast } from "sonner"
import { useState, useCallback, useEffect, useRef } from "react"
import { type VehicleDataBackend, ApprovalStatus, Documentation } from "@/types/types"
import type { Bank } from "@/constants/form-constants"
import { useFormValidation } from "./use-form-validation"
import { z } from "zod"

// ========== TIPOS ==========
type FormErrors = { [key: string]: string };

interface UseVehicleFormProps {
  formRef: React.RefObject<HTMLDivElement>;
}

// ✅ FIX #15: Información del progreso guardado para mostrar en el modal
export interface SavedProgressInfo {
  brand?: string;
  model?: string;
  year?: number;
  highestStep: number;
  savedAt?: string;
}

// ========== DATOS INICIALES ==========
const initialFormData: Partial<VehicleDataBackend> = {
  features: [],
  images: [],
  sellerContact: { name: "", email: "", phone: "" },
  year: new Date().getFullYear(),
  documentation: [],
  offersFinancing: false,
  isFeatured: false,
};

const CACHE_VERSION = "v1";
const STORAGE_KEY = "vehicleFormData";
const STORAGE_VERSION_KEY = "vehicleFormVersion";
const STORAGE_SAVED_AT_KEY = "vehicleFormSavedAt";

function loadFromStorage(): { formData: Partial<VehicleDataBackend>; highestStep: number } | null {
  try {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CACHE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_SAVED_AT_KEY);
      localStorage.setItem(STORAGE_VERSION_KEY, CACHE_VERSION);
      return null;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsedData = JSON.parse(saved);

    const basicValidation = z.object({
      year: z.number().optional(),
      category: z.string().optional(),
      brand: z.string().optional(),
      model: z.string().optional(),
      features: z.array(z.string()).optional(),
      images: z.array(z.string()).optional(),
      documentation: z.array(z.string()).optional(),
    }).safeParse(parsedData);

    if (!basicValidation.success) {
      console.warn("Datos de localStorage inválidos, descartando:", basicValidation.error.flatten());
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_SAVED_AT_KEY);
      return null;
    }

    if (parsedData.documentation && Array.isArray(parsedData.documentation)) {
      parsedData.documentation = parsedData.documentation.map(
        (doc: string | Documentation) => typeof doc === "string" ? doc : String(doc)
      );
    }

    const { highestCompletedStep: highestStep = 1, ...cleanData } = parsedData;
    return { formData: cleanData, highestStep };
  } catch (error) {
    console.error("Error loading saved data:", error);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_SAVED_AT_KEY);
    return null;
  }
}

// ✅ FIX #15: Lee solo los metadatos del progreso sin cargar todo el formData.
// Se usa para mostrar el modal antes de que el usuario decida qué hacer.
function peekSavedProgress(): SavedProgressInfo | null {
  try {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CACHE_VERSION) return null;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsedData = JSON.parse(saved);

    // Solo mostrar modal si hay progreso real
    const hasRealProgress = parsedData.brand || parsedData.model || parsedData.category;
    if (!hasRealProgress) return null;

    const { highestCompletedStep: highestStep = 1 } = parsedData;

    return {
      brand: parsedData.brand,
      model: parsedData.model,
      year: parsedData.year,
      highestStep,
      savedAt: localStorage.getItem(STORAGE_SAVED_AT_KEY) || undefined,
    };
  } catch {
    return null;
  }
}

// ========== HOOK PRINCIPAL ==========
export const useVehicleForm = ({ formRef }: UseVehicleFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [highestCompletedStep, setHighestCompletedStep] = useState(1);
  const [formData, setFormData] = useState<Partial<VehicleDataBackend>>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string>("");

  // ✅ FIX #15: Estado del modal de recuperación
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [savedProgressInfo, setSavedProgressInfo] = useState<SavedProgressInfo | null>(null);
  // Guardamos los datos completos en memoria al detectarlos — así el auto-save
  // no puede sobreescribirlos en localStorage antes de que el usuario decida
  const savedDataRef = useRef<{ formData: Partial<VehicleDataBackend>; highestStep: number } | null>(null);
  // isMounted evita que el auto-save sobreescriba localStorage en el primer render
  // antes de que el useEffect de mount haya guardado los datos viejos en savedDataRef
  const isMountedRef = useRef(false);

  const { validateStep } = useFormValidation();

  // ✅ FIX #15: Al montar, leer datos completos en memoria (ref) Y metadatos para el modal.
  // Los datos completos van al ref — el auto-save puede sobreescribir localStorage
  // pero los datos originales quedan seguros en memoria hasta que el usuario decida.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = loadFromStorage();
    if (stored) {
      const progressInfo = peekSavedProgress();
      if (progressInfo) {
        savedDataRef.current = stored;
        setHasSavedProgress(true);
        setSavedProgressInfo(progressInfo);
      }
    }
    // Habilitar auto-save despues de leer localStorage
    isMountedRef.current = true;
  }, []);

  const confirmResume = useCallback(() => {
    const stored = savedDataRef.current;
    setHasSavedProgress(false);
    setSavedProgressInfo(null);
    savedDataRef.current = null;
    if (stored) {
      setTimeout(() => {
        setFormData(stored.formData);
        setHighestCompletedStep(stored.highestStep);
        setCurrentStep(stored.highestStep);
        toast.success('Progreso restaurado. Continua desde donde lo dejaste.');
      }, 50);
    }
  }, []);

  // ✅ FIX #15: Usuario elige EMPEZAR DE NUEVO → limpiar storage y cerrar modal
  const discardSaved = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_VERSION_KEY);
    localStorage.removeItem(STORAGE_SAVED_AT_KEY);
    setHasSavedProgress(false);
    setSavedProgressInfo(null);
  }, []);

  // Auto-save — corre siempre excepto durante submit exitoso o carga inicial
  // ✅ FIX #15: NO bloqueamos por hasSavedProgress — el modal solo lee metadatos
  // con peekSavedProgress() al montar, ANTES de cualquier auto-save nuevo.
  // Si el usuario llena campos con el modal abierto, esos datos SÍ se guardan.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMountedRef.current) return; // esperar a que mount lea localStorage primero
    if (submissionStatus === "success") return;
    if (isLoading) return;

    setSaveStatus("saving");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...formData, highestCompletedStep }));
      localStorage.setItem(STORAGE_VERSION_KEY, CACHE_VERSION);
      localStorage.setItem(STORAGE_SAVED_AT_KEY, new Date().toISOString());
    } catch (e) {
      console.warn("Auto-save falló (localStorage no disponible):", e);
      setSaveStatus("idle");
      return;
    }

    const timer = setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData, submissionStatus, highestCompletedStep]);

  // Validación en tiempo real
  useEffect(() => {
    const validation = validateStep(currentStep, formData, selectedBank, paymentProof, referenceNumber);
    setIsCurrentStepValid(validation.isValid);
    setErrors(validation.errors);
  }, [formData, currentStep, selectedBank, paymentProof, referenceNumber, validateStep]);

  const handleSwitchChange = useCallback((field: keyof VehicleDataBackend, checked: boolean) => {
    setFormData(prev => {
      const newState: Partial<VehicleDataBackend> = { ...prev, [field]: checked };
      if (field === "offersFinancing") {
        if (checked) {
          newState.financingDetails = newState.financingDetails || { interestRate: 18, loanTerm: 36 };
        } else {
          delete newState.financingDetails;
        }
      } else if (field === "isFeatured") {
        newState.isFeatured = checked;
      }
      return newState;
    });
  }, []);

  const handleInputChange = useCallback(
    (field: string, value: unknown) => {
      setFormData((prev) => {
        if (field === "sellerContact") {
          const contactValue = typeof value === "object" && value !== null ? value : {};
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
          const financingValue = typeof value === "object" && value !== null ? value : {};
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

      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleFeatureToggle = useCallback((feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...(prev.features || []), feature],
    }));
  }, []);

  const handleDocumentationToggle = useCallback((docType: Documentation) => {
    setFormData((prev) => {
      const currentDocs = prev.documentation || [];
      const docString = docType.toString();
      const docExists = currentDocs.includes(docString);
      return {
        ...prev,
        documentation: docExists
          ? currentDocs.filter(doc => doc !== docString)
          : [...currentDocs, docString],
      };
    });
  }, []);

  const isDocumentationSelected = useCallback((docType: Documentation) => {
    return formData.documentation?.includes(docType.toString()) || false;
  }, [formData.documentation]);

  const handleImagesChange = useCallback((urls: string[]) => {
    setFormData((prev) => ({ ...prev, images: urls }));
  }, []);

  const validateCurrentStep = useCallback(() => {
    const validation = validateStep(currentStep, formData, selectedBank, paymentProof, referenceNumber);
    setErrors(validation.errors);
    return validation.isValid;
  }, [currentStep, formData, selectedBank, paymentProof, referenceNumber, validateStep]);

  const scrollToTop = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [formRef]);

  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      const next = Math.min(currentStep + 1, 6);
      setCurrentStep(next);
      setHighestCompletedStep((prev) => Math.max(prev, next));
      scrollToTop();
    }
  }, [validateCurrentStep, currentStep, scrollToTop]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToTop();
  }, [scrollToTop]);

  const manualSave = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...formData, highestCompletedStep }));
      localStorage.setItem(STORAGE_VERSION_KEY, CACHE_VERSION);
      localStorage.setItem(STORAGE_SAVED_AT_KEY, new Date().toISOString());
      setSaveStatus("saved");
      toast.success("¡Progreso guardado exitosamente!");
    } catch (e) {
      toast.error("No se pudo guardar el progreso. Verifica el almacenamiento del navegador.");
      console.warn("manualSave falló:", e);
    }
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, [formData, highestCompletedStep]);

  const handleSubmit = useCallback(async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const vehiclePayload = {
        ...formData,
        features: formData.features || [],
        images: formData.images || [],
        status: ApprovalStatus.PENDING,
        warranty: formData.warranty || "NO_WARRANTY",
        selectedBank: selectedBank?.name,
        referenceNumber,
        documentation: formData.documentation || [],
      };

      const submissionFormData = new FormData();
      submissionFormData.append("vehicleData", JSON.stringify(vehiclePayload));
      if (paymentProof) submissionFormData.append("paymentProof", paymentProof);

      const response = await fetch("/api/post-ad", {
        method: "POST",
        body: submissionFormData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setSubmissionStatus("error");
        setErrors(result.validationErrors || { general: result.error || "Ocurrió un error desconocido." });
        return;
      }

      setSubmissionStatus("success");
      setFormData((prev) => ({
        ...prev,
        _id: result.data._id,
        paymentProof: result.data.paymentProof,
      }));
      setCurrentStep(7);

      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_VERSION_KEY);
        localStorage.removeItem(STORAGE_SAVED_AT_KEY);
      }
    } catch (error) {
      setSubmissionStatus("error");
      console.error("Error en submit:", error);
      setErrors({ general: error instanceof Error ? error.message : "Error de red" });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateCurrentStep, referenceNumber, paymentProof, selectedBank]);

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
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_VERSION_KEY);
      localStorage.removeItem(STORAGE_SAVED_AT_KEY);
    }
  }, []);

  return {
    currentStep,
    highestCompletedStep,
    formData,
    isCurrentStepValid,
    errors,
    isSubmitting,
    isLoading,
    saveStatus,
    submissionStatus,
    selectedBank,
    paymentProof,
    referenceNumber,
    hasSavedProgress,
    savedProgressInfo,
    confirmResume,
    discardSaved,
    setCurrentStep,
    setFormData,
    setSelectedBank,
    setPaymentProof,
    setReferenceNumber,
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
  };
};