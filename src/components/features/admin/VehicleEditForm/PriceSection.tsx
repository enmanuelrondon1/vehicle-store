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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
      
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
          className={`input-premium ${getInputClassName("price")}`}
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
          className={`input-premium ${getInputClassName("mileage")}`}
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
          className={`input-premium ${getInputClassName("warranty")}`}
        />
      </InputField>

      <div />

      <InputField
        label="¿Precio Negociable?"
        tooltip="Indica si estás abierto a ofertas"
        layout="switch"
      >
        <div className="flex items-center space-x-3 h-10">
          <Switch
            id="isNegotiable"
            checked={formData.isNegotiable || false}
            onCheckedChange={(checked) => handleSwitchChange("isNegotiable", checked)}
            disabled={isSubmitting}
          />
          <label htmlFor="isNegotiable" className="font-medium cursor-pointer text-sm text-foreground transition-colors">
            {formData.isNegotiable ? "Sí, es negociable" : "No, precio fijo"}
          </label>
        </div>
      </InputField>

      <InputField
        label="¿Ofrece Financiamiento?"
        tooltip="Indica si proporcionas opciones de financiamiento"
        layout="switch"
      >
        <div className="flex items-center space-x-3 h-10">
          <Switch
            id="offersFinancing"
            checked={formData.offersFinancing || false}
            onCheckedChange={(checked) => handleSwitchChange("offersFinancing", checked)}
            disabled={isSubmitting}
          />
          <label htmlFor="offersFinancing" className="font-medium cursor-pointer text-sm text-foreground transition-colors">
            {formData.offersFinancing ? "Sí, se ofrece" : "No se ofrece"}
          </label>
        </div>
      </InputField>

      {/* Campos Condicionales de Financiamiento */}
      {formData.offersFinancing && (
        <div className="animate-fade-in md:col-span-2 mt-4 p-6 bg-primary/5 rounded-lg border border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            <InputField
              label="Tasa de Interés Anual (%)"
              error={getFieldError("financingDetails.interestRate")}
              success={isFieldValid("financingDetails.interestRate")}
              icon={<Percent />}
            >
              <Input
                type="number"
                value={formData.financingDetails?.interestRate ?? ""}
                onChange={(e) => handleInterestRateChange(e.target.value)}
                onBlur={() => handleBlur("financingDetails.interestRate")}
                className={`input-premium ${getInputClassName("financingDetails.interestRate")}`}
                placeholder="Ej: 18"
                min={0}
                max={50}
                step={0.1}
                disabled={isSubmitting}
              />
            </InputField>

            <InputField
              label="Plazo del Préstamo (meses)"
              error={getFieldError("financingDetails.loanTerm")}
              success={isFieldValid("financingDetails.loanTerm")}
              icon={<Calendar />}
            >
              <Input
                type="number"
                value={formData.financingDetails?.loanTerm ?? ""}
                onChange={(e) => handleLoanTermChange(e.target.value)}
                onBlur={() => handleBlur("financingDetails.loanTerm")}
                className={`input-premium ${getInputClassName("financingDetails.loanTerm")}`}
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
