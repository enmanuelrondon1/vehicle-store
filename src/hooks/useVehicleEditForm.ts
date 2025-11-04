// src/hooks/useVehicleEditForm.ts
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Vehicle, VehicleDataBackend } from "@/types/types";
import { toast } from "sonner";
import { schemasByStep } from "@/lib/vehicleSchema";
import { parsePhoneNumber, initializeFormData } from "@/lib/vehicleFormUtils";

type FormErrors = Record<string, string[]>;

export function useVehicleEditForm(vehicle: Vehicle) {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<VehicleDataBackend>>(() =>
    initializeFormData(vehicle)
  );
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============= VALIDACIÓN =============
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    const dataToValidate = {
      ...formDataRef.current,
      sellerContact: {
        ...formDataRef.current.sellerContact,
        phone: `${
          (formDataRef.current.sellerContact as any)?.phoneCode || "+58 412"
        } ${
          (formDataRef.current.sellerContact as any)?.phoneNumber || ""
        }`.trim(),
      },
    };

    // console.log('🔍 ========== INICIANDO VALIDACIÓN ==========');
    // console.log('📦 Data completa a validar:', JSON.stringify(dataToValidate, null, 2));

    // Validación de imágenes
    if (!dataToValidate.images || dataToValidate.images.length === 0) {
      newErrors["images"] = ["Debes tener al menos una imagen"];
      console.log("❌ ERROR: No hay imágenes");
    } else if (dataToValidate.images.length > 10) {
      newErrors["images"] = ["No puedes tener más de 10 imágenes"];
      console.log("❌ ERROR: Demasiadas imágenes");
    } else {
      console.log(
        `✅ IMÁGENES VÁLIDAS: ${dataToValidate.images.length} imagen(es)`
      );
    }

    // Validar todos los steps
    [1, 2, 3, 4, 5].forEach((step) => {
      const result = schemasByStep[
        step as keyof typeof schemasByStep
      ].safeParse(
        step === 3 || step === 5
          ? { ...dataToValidate, category: dataToValidate.category }
          : dataToValidate
      );

      if (!result.success) {
        const stepErrors = result.error.flatten().fieldErrors;
        // console.log(`❌ STEP ${ step } - ERRORES:`, stepErrors);
        Object.assign(newErrors, stepErrors);
      } else {
        // console.log(`✅ STEP ${ step } - VÁLIDO`);
      }
    });

    // Validación especial para teléfono
    const phoneNumber =
      (formDataRef.current.sellerContact as any)?.phoneNumber || "";
    if (phoneNumber && !/^\d{7}$/.test(phoneNumber)) {
      newErrors["sellerContact.phoneNumber"] = [
        "Debe tener exactamente 7 dígitos",
      ];
      console.log("❌ ERROR EN TELÉFONO:", phoneNumber);
    }

    // console.log('📋 RESULTADO FINAL DE VALIDACIÓN:');
    // console.log('   - Total errores:', Object.keys(newErrors).length);
    // console.log('   - Campos con error:', Object.keys(newErrors));
    // console.log('   - Detalles:', newErrors);
    // console.log('🔍 ========== FIN VALIDACIÓN ==========');

    setErrors(newErrors);
    return newErrors;
  }, []);

  // Validar al montar
  useEffect(() => {
    // console.log('🚀 VALIDACIÓN INICIAL AL MONTAR COMPONENTE');
    validateForm();
  }, [validateForm]);

  const debouncedValidate = useCallback(() => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = setTimeout(() => {
      console.log("⏱️ EJECUTANDO VALIDACIÓN CON DEBOUNCE");
      validateForm();
    }, 300);
  }, [validateForm]);

  // ============= HANDLERS =============
  const handleChange = useCallback(
    (field: string, value: any) => {
      console.log(`🔄 CAMBIO EN CAMPO: ${field} = `, value);

      setFormData((prevData) => {
        if (prevData[field as keyof typeof prevData] === value) {
          console.log("⚠️ Valor igual al anterior, no actualizar");
          return prevData;
        }

        const newData = {
          ...prevData,
          [field]: value,
        };

        console.log("✅ Nuevo formData:", newData);
        return newData;
      });

      setTouchedFields((prev) => new Set(prev).add(field));
      setHasUnsavedChanges(true);
      debouncedValidate();
    },
    [debouncedValidate]
  );

  const handleBlur = useCallback(
    (field: string) => {
      console.log(`🔵 BLUR EN CAMPO: ${field}`);
      setTouchedFields((prev) => new Set(prev).add(field));
      debouncedValidate();
    },
    [debouncedValidate]
  );

  const handleChangeWithoutTouch = useCallback(
    (field: string, value: any) => {
      console.log(`🔄 CAMBIO (sin touch) EN CAMPO: ${field} = `, value);

      setFormData((prevData) => {
        if (prevData[field as keyof typeof prevData] === value) {
          console.log("⚠️ Valor igual al anterior, no actualizar (sin touch)");
          return prevData;
        }

        const newData = {
          ...prevData,
          [field]: value,
        };

        console.log("✅ Nuevo formData (sin touch):", newData);
        return newData;
      });

      setHasUnsavedChanges(true);
      debouncedValidate();
    },
    [debouncedValidate]
  );

  const handleNestedChange = useCallback(
    (parent: string, field: string, value: any) => {
      console.log(`🔄 CAMBIO NESTED: ${parent}.${field} = `, value);

      setFormData((prevData) => {
        const newData = {
          ...prevData,
          [parent]: {
            ...(prevData[parent as keyof typeof prevData] as any),
            [field]: value,
          },
        };

        console.log("✅ Nuevo formData (nested):", newData);
        return newData;
      });

      setTouchedFields((prev) => new Set(prev).add(`${parent}.${field}`));
      setHasUnsavedChanges(true);
      debouncedValidate();
    },
    [debouncedValidate]
  );

  const handleSwitchChange = useCallback(
    (field: string, checked: boolean) => {
      console.log(`🔄 CAMBIO SWITCH: ${field} = `, checked);

      setFormData((prevData) => {
        const newData = { ...prevData, [field]: checked };

        if (field === "offersFinancing" && !checked) {
          delete newData.financingDetails;
        }
        if (field === "offersFinancing" && checked) {
          newData.financingDetails = {
            interestRate: 18,
            loanTerm: 36,
          };
        }

        return newData;
      });

      setTouchedFields((prev) => new Set(prev).add(field));
      setHasUnsavedChanges(true);
      debouncedValidate();
    },
    [debouncedValidate]
  );

  const handleFeatureToggle = useCallback(
    (feature: string) => {
      console.log(`🔄 TOGGLE FEATURE:`, feature);

      setFormData((prev) => ({
        ...prev,
        features: prev.features?.includes(feature)
          ? prev.features.filter((f) => f !== feature)
          : [...(prev.features || []), feature],
      }));
      setTouchedFields((prev) => new Set(prev).add("features"));
      setHasUnsavedChanges(true);
      debouncedValidate();
    },
    [debouncedValidate]
  );

  const handleDocumentationToggle = useCallback(
    (docType: string) => {
      console.log(`🔄 TOGGLE DOCUMENTATION:`, docType);

      setFormData((prev) => {
        const currentDocs = prev.documentation || [];
        const docExists = currentDocs.includes(docType);

        return {
          ...prev,
          documentation: docExists
            ? currentDocs.filter((doc) => doc !== docType)
            : [...currentDocs, docType],
        };
      });
      setTouchedFields((prev) => new Set(prev).add("documentation"));
      setHasUnsavedChanges(true);
      debouncedValidate();
    },
    [debouncedValidate]
  );

  const handleImagesChange = useCallback(
    (images: string[]) => {
      console.log(`🔄 CAMBIO DIRECTO EN IMÁGENES: ${images.length} imágenes`);

      setFormData((prev) => ({ ...prev, images }));
      setTouchedFields((prev) => new Set(prev).add("images"));
      setHasUnsavedChanges(true);

      debouncedValidate();
    },
    [debouncedValidate]
  );

  // ============= UTILIDADES =============
  const isDocumentationSelected = useCallback(
    (docType: string): boolean => {
      return formData.documentation?.includes(docType) || false;
    },
    [formData.documentation]
  );

  const getFieldError = useCallback(
    (field: string): string | undefined => {
      if (!touchedFields.has(field)) return undefined;
      return errors[field]?.[0];
    },
    [touchedFields, errors]
  );

  const isFieldValid = useCallback(
    (field: string): boolean => {
      return touchedFields.has(field) && !errors[field];
    },
    [touchedFields, errors]
  );

  const getInputClassName = useCallback(
    (field: string) => {
      const baseClass = "transition-all duration-200";
      if (!touchedFields.has(field)) return baseClass;
      if (errors[field])
        return `${baseClass} border-destructive focus:ring-destructive/20`;
      return `${baseClass} border-green-500 focus:ring-green-500/20`;
    },
    [touchedFields, errors]
  );

  // ============= COMPUTED VALUES =============
  const isFormValid = useMemo(() => {
    const valid = Object.keys(errors).length === 0;

    // console.log('🎯 ============ EVALUACIÓN isFormValid ============');
    // console.log('❌ Errores actuales:', errors);
    // console.log('📊 Cantidad de errores:', Object.keys(errors).length);
    // console.log('✅ ¿Es válido?:', valid);
    // console.log('🔘 Estado del botón:', valid && !isSubmitting ? 'HABILITADO' : 'DESHABILITADO');
    // console.log('================================================');

    return valid;
  }, [errors, isSubmitting]);

  const criticalErrorsCount = useMemo(() => {
    const requiredFields = [
      "category",
      "brand",
      "model",
      "year",
      "price",
      "mileage",
      "warranty",
      "color",
      "sellerContact.name",
      "sellerContact.email",
      "sellerContact.phoneNumber",
      "location",
      "images",
    ];
    return Object.keys(errors).filter((key) => requiredFields.includes(key))
      .length;
  }, [errors]);

  // ============= SUBMIT =============
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allFields = [
      "category",
      "brand",
      "model",
      "year",
      "price",
      "mileage",
      "warranty",
      "color",
      "sellerContact.name",
      "sellerContact.email",
      "sellerContact.phoneNumber",
      "location",
      "description",
      "images",
      "features",
      "documentation",
    ];
    setTouchedFields(new Set(allFields));

    const currentErrors = validateForm();

    if (Object.keys(currentErrors).length > 0) {
      toast.error("Por favor corrige los errores en el formulario", {
        description: `Hay ${Object.keys(currentErrors).length} campo${
          Object.keys(currentErrors).length !== 1 ? "s" : ""
        } con errores`,
      });

      const firstErrorField = document.querySelector(".border-destructive");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    toast.info("Guardando cambios...");

    try {
      const dataToSubmit = {
        ...formData,
        sellerContact: {
          name: formData.sellerContact?.name,
          email: formData.sellerContact?.email,
          phone: `${(formData.sellerContact as any)?.phoneCode || "+58 412"} ${
            (formData.sellerContact as any)?.phoneNumber || ""
          }`.trim(),
        },
      };

      delete (dataToSubmit.sellerContact as any).phoneCode;
      delete (dataToSubmit.sellerContact as any).phoneNumber;

      console.log("📦 ========== DATA A ENVIAR ==========");
      console.log("🖼️ Imágenes en dataToSubmit:", dataToSubmit.images);
      console.log("📋 Data completa:", JSON.stringify(dataToSubmit, null, 2));
      console.log("=====================================");

      const response = await fetch(`/api/admin/vehicles/${vehicle._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el vehículo");
      }

      const result = await response.json();
      if (result.success) {
        toast.success(result.message || "Vehículo actualizado con éxito");
        setHasUnsavedChanges(false);
        router.refresh();
      } else {
        toast.error(result.error || "Ocurrió un error inesperado");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al guardar los cambios"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    formData,
    isSubmitting,
    errors,
    touchedFields,
    hasUnsavedChanges,

    // Computed
    isFormValid,
    criticalErrorsCount,

    // Handlers
    handleChange,
    handleChangeWithoutTouch,
    handleNestedChange,
    handleSwitchChange,
    handleFeatureToggle,
    handleDocumentationToggle,
    handleSubmit,
    handleBlur,
    handleImagesChange,

    // Utilities
    isDocumentationSelected,
    getFieldError,
    isFieldValid,
    getInputClassName,

    // Router
    router,
  };
}
