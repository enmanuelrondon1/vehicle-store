// src/components/features/admin/VehicleEditForm/PriceSection.tsx
"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { WARRANTY_LABELS } from "@/types/shared";
import { VehicleDataBackend } from "@/types/types";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { DollarSign, Gauge, Shield, Percent, Calendar } from "lucide-react";

interface PriceSectionProps {
  formData: Partial<VehicleDataBackend>;
  handleChange: (field: string, value: any) => void;
  handleNestedChange: (parent: string, field: string, value: any) => void;
  handleSwitchChange: (field: string, checked: boolean) => void;
  handleBlur: (field: string) => void;
  getFieldError: (field: string) => string | undefined;
  isFieldValid: (field: string) => boolean;
  getInputClassName: (field: string) => string;
  isSubmitting: boolean;
}

export function PriceSection({
  formData,
  handleChange,
  handleNestedChange,
  handleSwitchChange,
  handleBlur,
  getFieldError,
  isFieldValid,
  getInputClassName,
  isSubmitting,
}: PriceSectionProps) {
  // --- 1. MANEJADORES DE EVENTOS REFACTORIZADOS ---
  const handlePriceChange = useCallback((value: string) => {
    handleChange("price", Number(value));
  }, [handleChange]);

  const handleMileageChange = useCallback((value: string) => {
    handleChange("mileage", Number(value));
  }, [handleChange]);

  const handleWarrantyChange = useCallback((value: string) => {
    handleChange("warranty", value);
  }, [handleChange]);

  const handleInterestRateChange = useCallback(
    (value: string) => {
      const numericValue = value === "" ? null : Number(value);
      handleNestedChange("financingDetails", "interestRate", numericValue);
    },
    [handleNestedChange]
  );

  const handleLoanTermChange = useCallback(
    (value: string) => {
      const numericValue = value === "" ? null : Number(value);
      handleNestedChange("financingDetails", "loanTerm", numericValue);
    },
    [handleNestedChange]
  );

  return (
    // 2. CONTENEDOR CON GRID RESPONSIVO Y EFECTO HOVER (Consistente con BasicInfoSection)
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start p-6 -m-6 rounded-lg transition-all duration-300 hover:bg-muted/20">
      
      {/* Campos Principales */}
      <InputField
        label="Precio (USD)"
        required
        tooltip="Precio máximo: $10,000,000"
        error={getFieldError("price")}
        success={isFieldValid("price")}
        icon={<DollarSign />}
      >
        <Input
          type="number"
          value={formData.price || ""}
          onChange={(e) => handlePriceChange(e.target.value)}
          onBlur={() => handleBlur("price")}
          className={getInputClassName("price")}
          placeholder="Ej: 15000"
          min={1}
          max={10000000}
          disabled={isSubmitting}
        />
      </InputField>

      <InputField
        label="Kilometraje"
        required
        tooltip="Máximo: 1,000,000 km"
        error={getFieldError("mileage")}
        success={isFieldValid("mileage")}
        icon={<Gauge />}
      >
        <Input
          type="number"
          value={formData.mileage || ""}
          onChange={(e) => handleMileageChange(e.target.value)}
          onBlur={() => handleBlur("mileage")}
          className={getInputClassName("mileage")}
          placeholder="Ej: 50000"
          min={0}
          max={1000000}
          disabled={isSubmitting}
        />
      </InputField>

      <InputField
        label="Garantía"
        required
        error={getFieldError("warranty")}
        success={isFieldValid("warranty")}
        icon={<Shield />}
      >
        <SelectField
          value={formData.warranty || ""}
          onValueChange={handleWarrantyChange}
          onBlur={() => handleBlur("warranty")}
          placeholder="Selecciona la garantía"
          options={Object.entries(WARRANTY_LABELS).map(([key, label]) => ({ value: key, label }))}
          disabled={isSubmitting}
          className={getInputClassName("warranty")}
        />
      </InputField>

      <InputField
        label="¿Precio Negociable?"
        tooltip="Indica si estás abierto a ofertas"
        layout="switch"
      >
        <div className="flex items-center space-x-2 h-10">
          <Switch
            id="isNegotiable"
            checked={formData.isNegotiable || false}
            onCheckedChange={(checked) => handleSwitchChange("isNegotiable", checked)}
            disabled={isSubmitting}
          />
          <label htmlFor="isNegotiable" className="font-normal cursor-pointer text-sm">
            {formData.isNegotiable ? "Sí, es negociable" : "No, precio fijo"}
          </label>
        </div>
      </InputField>

      <InputField
        label="¿Ofrece Financiamiento?"
        tooltip="Indica si proporcionas opciones de financiamiento"
        layout="switch"
      >
        <div className="flex items-center space-x-2 h-10">
          <Switch
            id="offersFinancing"
            checked={formData.offersFinancing || false}
            onCheckedChange={(checked) => handleSwitchChange("offersFinancing", checked)}
            disabled={isSubmitting}
          />
          <label htmlFor="offersFinancing" className="font-normal cursor-pointer text-sm">
            {formData.offersFinancing ? "Sí, se ofrece" : "No se ofrece"}
          </label>
        </div>
      </InputField>

      {/* 3. CAMPOS CONDICIONALES CON ANIMACIÓN DE ENTRADA */}
      {formData.offersFinancing && (
        <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300 sm:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <InputField
              label="Tasa de Interés (%)"
              error={getFieldError("financingDetails.interestRate")}
              success={isFieldValid("financingDetails.interestRate")}
              icon={<Percent />}
            >
              <Input
                type="number"
                value={formData.financingDetails?.interestRate ?? ""}
                onChange={(e) => handleInterestRateChange(e.target.value)}
                onBlur={() => handleBlur("financingDetails.interestRate")}
                className={getInputClassName("financingDetails.interestRate")}
                placeholder="Ej: 18"
                min={0}
                max={50}
                step={0.1}
                disabled={isSubmitting}
              />
            </InputField>

            <InputField
              label="Plazo (meses)"
              error={getFieldError("financingDetails.loanTerm")}
              success={isFieldValid("financingDetails.loanTerm")}
              icon={<Calendar />}
            >
              <Input
                type="number"
                value={formData.financingDetails?.loanTerm ?? ""}
                onChange={(e) => handleLoanTermChange(e.target.value)}
                onBlur={() => handleBlur("financingDetails.loanTerm")}
                className={getInputClassName("financingDetails.loanTerm")}
                placeholder="Ej: 36"
                min={1}
                max={120}
                disabled={isSubmitting}
              />
            </InputField>
          </div>
        </div>
      )}
    </div>
  );
}