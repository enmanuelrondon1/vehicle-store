// src/components/features/admin/VehicleEditForm/BasicInfoSection.tsx
"use client";

import { useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { VEHICLE_CATEGORIES_LABELS } from "@/types/shared";
import { CATEGORY_DATA } from "@/constants/form-constants";
import { VehicleDataBackend } from "@/types/types";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { Car, Tag, Wrench, Calendar } from "lucide-react";

interface BasicInfoSectionProps {
  formData: Partial<VehicleDataBackend>;
  handleChange: (field: string, value: any) => void;
  handleChangeWithoutTouch: (field: string, value: any) => void;
  handleBlur: (field: string) => void;
  getFieldError: (field: string) => string | undefined;
  isFieldValid: (field: string) => boolean;
  getInputClassName: (field: string) => string;
  isSubmitting: boolean;
}

export function BasicInfoSection({
  formData,
  handleChange,
  handleChangeWithoutTouch,
  handleBlur,
  getFieldError,
  isFieldValid,
  getInputClassName,
  isSubmitting,
}: BasicInfoSectionProps) {
  // --- Lógica de Opciones Optimizada ---
  const brandOptions = useMemo(() => {
    if (!formData.category || !CATEGORY_DATA[formData.category as keyof typeof CATEGORY_DATA]) return [];
    return Object.keys(CATEGORY_DATA[formData.category as keyof typeof CATEGORY_DATA].brands).map((brand) => ({
      value: brand,
      label: brand,
    }));
  }, [formData.category]);

  const modelOptions = useMemo(() => {
    if (
      !formData.category ||
      !formData.brand ||
      !CATEGORY_DATA[formData.category as keyof typeof CATEGORY_DATA]?.brands[formData.brand]
    )
      return [];
    return CATEGORY_DATA[formData.category as keyof typeof CATEGORY_DATA].brands[formData.brand].map((model: string) => ({
      value: model,
      label: model,
    }));
  }, [formData.category, formData.brand]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1899 }, (_, i) => {
      const year = currentYear + 1 - i;
      return { value: year.toString(), label: year.toString() };
    });
  }, []);

  // --- Manejadores de Eventos Refactorizados ---
  const handleCategoryChange = useCallback((value: string) => {
    handleChange("category", value);
    handleChangeWithoutTouch("brand", "");
    handleChangeWithoutTouch("model", "");
    handleChangeWithoutTouch("brandOther", undefined);
    handleChangeWithoutTouch("modelOther", undefined);
  }, [handleChange, handleChangeWithoutTouch]);

  const handleBrandChange = useCallback((value: string) => {
    handleChange("brand", value);
    handleChangeWithoutTouch("model", "");
    handleChangeWithoutTouch("modelOther", undefined);
    if (formData.brand === "Otra" && value !== "Otra") {
      handleChangeWithoutTouch("brandOther", undefined);
    }
  }, [handleChange, handleChangeWithoutTouch, formData.brand]);

  const handleModelChange = useCallback((value: string) => {
    handleChange("model", value);
    if (formData.model === "Otro" && value !== "Otro") {
      handleChangeWithoutTouch("modelOther", undefined);
    }
  }, [handleChange, handleChangeWithoutTouch, formData.model]);

  return (
    // Contenedor con micro-interacción de hover
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start p-6 -m-6 rounded-lg transition-all duration-300 hover:bg-muted/20">
      
      {/* Campo de Categoría */}
      <div className="sm:col-span-2">
        <InputField
          label="Categoría"
          required
          tooltip="El tipo de vehículo"
          error={getFieldError("category")}
          success={isFieldValid("category")}
          icon={<Car />}
        >
          <SelectField
            value={formData.category || ""}
            onValueChange={handleCategoryChange}
            onBlur={() => handleBlur("category")}
            placeholder="Selecciona una categoría"
            options={Object.entries(VEHICLE_CATEGORIES_LABELS).map(([key, label]) => ({ value: key, label }))}
            disabled={isSubmitting}
            className={getInputClassName("category")}
          />
        </InputField>
      </div>

      {/* Campo de Marca */}
      <InputField
        label="Marca"
        required
        tooltip="La marca del fabricante"
        error={getFieldError("brand")}
        success={isFieldValid("brand")}
        icon={<Wrench />}
      >
        <SelectField
          value={formData.brand || ""}
          onValueChange={handleBrandChange}
          onBlur={() => handleBlur("brand")}
          placeholder={!formData.category ? "Primero selecciona categoría" : "Selecciona la marca"}
          options={brandOptions}
          disabled={!formData.category || isSubmitting}
          className={getInputClassName("brand")}
        />
      </InputField>

      {/* Campo de Modelo */}
      <InputField
        label="Modelo"
        required
        error={getFieldError("model")}
        success={isFieldValid("model")}
        icon={<Tag />}
        tips={["Elige el modelo exacto de la lista.", "Si no lo encuentras, selecciona 'Otro' y especifícalo."]}
      >
        <SelectField
          value={formData.model || ""}
          onValueChange={handleModelChange}
          onBlur={() => handleBlur("model")}
          placeholder={!formData.brand ? "Primero selecciona marca" : "Selecciona el modelo"}
          options={modelOptions}
          disabled={!formData.brand || isSubmitting}
          className={getInputClassName("model")}
        />
      </InputField>

      {/* Campo Condicional: Especificar Marca */}
      {formData.brand === "Otra" && (
        <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <InputField
            label="Especificar Marca"
            required
            counter={{ current: formData.brandOther?.length || 0, max: 50 }}
            tooltip="Mínimo 2 caracteres"
            error={getFieldError("brandOther")}
            success={isFieldValid("brandOther")}
            icon={<Wrench />}
          >
            <Input
              value={formData.brandOther || ""}
              onChange={(e) => handleChange("brandOther", e.target.value)}
              onBlur={() => handleBlur("brandOther")}
              maxLength={50}
              className={getInputClassName("brandOther")}
              placeholder="Escribe la marca"
              disabled={isSubmitting}
            />
          </InputField>
        </div>
      )}

      {/* Campo Condicional: Especificar Modelo */}
      {formData.model === "Otro" && (
        <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <InputField
            label="Especificar Modelo"
            required
            counter={{ current: formData.modelOther?.length || 0, max: 50 }}
            tooltip="Mínimo 2 caracteres"
            error={getFieldError("modelOther")}
            success={isFieldValid("modelOther")}
            icon={<Tag />}
          >
            <Input
              value={formData.modelOther || ""}
              onChange={(e) => handleChange("modelOther", e.target.value)}
              onBlur={() => handleBlur("modelOther")}
              maxLength={50}
              className={getInputClassName("modelOther")}
              placeholder="Escribe el modelo"
              disabled={isSubmitting}
            />
          </InputField>
        </div>
      )}

      {/* Campo de Versión */}
      <InputField
        label="Versión / Edición"
        counter={{ current: formData.version?.length || 0, max: 100 }}
        tooltip="Opcional. Ej: XEI, Limited, Sport (mínimo 2 caracteres si se llena)"
        error={getFieldError("version")}
        success={isFieldValid("version")}
      >
        <Input
          value={formData.version || ""}
          onChange={(e) => handleChange("version", e.target.value)}
          onBlur={() => handleBlur("version")}
          maxLength={100}
          className={getInputClassName("version")}
          placeholder="Ej: XEI, Limited, Sport"
          disabled={isSubmitting}
        />
      </InputField>

      {/* Campo de Año */}
      <InputField
        label="Año"
        required
        tooltip="Año de fabricación"
        error={getFieldError("year")}
        success={isFieldValid("year")}
        icon={<Calendar />}
      >
        <SelectField
          value={formData.year?.toString() || ""}
          onValueChange={(value) => handleChange("year", parseInt(value))}
          onBlur={() => handleBlur("year")}
          placeholder="Selecciona el año"
          options={yearOptions}
          disabled={isSubmitting}
          className={getInputClassName("year")}
        />
      </InputField>
    </div>
  );
}