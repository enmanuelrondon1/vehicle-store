"use client";
import React, { useState, useEffect } from "react";
import { Car, ChevronDown, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { VehicleCategory, VEHICLE_CATEGORIES_LABELS } from "@/types/shared";
import { useDarkMode } from "@/context/DarkModeContext";

interface FormErrors {
  [key: string]: string | undefined;
  category?: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  year?: string;
}

// Tipos específicos para los valores del formulario
type FormFieldValue = string | number | VehicleCategory | undefined;

interface BasicInfoStepProps {
  formData: {
    category: VehicleCategory | string;
    subcategory?: string;
    brand: string;
    model: string;
    year: number;
  };
  errors: FormErrors;
  handleInputChange: (field: string, value: FormFieldValue) => void;
  subcategories: { [key: string]: string[] };
  brands: { [key: string]: string[] };
  isLoading?: boolean;
}

const useFieldValidation = (value: FormFieldValue, fieldName: string, errors: FormErrors) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (value && showValidation) {
      const hasError = errors[fieldName];
      setIsValid(!hasError);
    }
  }, [value, fieldName, errors, showValidation]);

  const handleBlur = () => {
    setShowValidation(true);
  };

  return { isValid, handleBlur, showValidation };
};

interface InputFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  isValid?: boolean | null;
  showValidation?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  required,
  error,
  children,
  isValid,
  showValidation,
}) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`space-y-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
      <label className={`flex items-center text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {showValidation && isValid === true && (
          <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
        )}
        {showValidation && isValid === false && (
          <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
        )}
      </label>
      {children}
      {error && (
        <div className={`flex items-center space-x-1 text-sm ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  isLoading?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  onBlur,
  disabled,
  placeholder,
  options,
  error,
  isLoading,
}) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled || isLoading}
        className={`
          w-full px-4 py-3 rounded-xl
          focus:outline-none focus:ring-4 focus:ring-blue-500/20
          transition-all duration-200 appearance-none
          ${isDarkMode
            ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
            : "bg-white border-gray-200 text-gray-900 focus:border-blue-500 hover:border-gray-300"
          }
          ${error
            ? "border-red-300 focus:border-red-500"
            : ""
          }
          ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}
          ${isLoading ? "animate-pulse" : ""}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className={`
        absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5
        ${disabled || isLoading ? "text-gray-400" : isDarkMode ? "text-gray-500" : "text-gray-500"}
        ${isLoading ? "animate-spin" : ""}
        pointer-events-none
      `} />
      {isLoading && (
        <Loader2 className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
      )}
    </div>
  );
};

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  errors,
  handleInputChange,
  subcategories,
  brands,
  isLoading = false,
}) => {
  const { isDarkMode } = useDarkMode();
  const categoryValidation = useFieldValidation(formData.category, "category", errors);
  const subcategoryValidation = useFieldValidation(formData.subcategory, "subcategory", errors);
  const brandValidation = useFieldValidation(formData.brand, "brand", errors);
  const modelValidation = useFieldValidation(formData.model, "model", errors);
  const yearValidation = useFieldValidation(formData.year, "year", errors);

  const categoryOptions = Object.values(VehicleCategory).map((cat) => ({
    value: cat,
    label: VEHICLE_CATEGORIES_LABELS[cat],
  }));

  const subcategoryOptions =
    formData.category && subcategories[formData.category]
      ? subcategories[formData.category].map((sub) => ({ value: sub, label: sub }))
      : [];

  const brandOptions =
    formData.category && brands[formData.category]
      ? brands[formData.category].map((brand) => ({ value: brand, label: brand }))
      : [];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1899 }, (_, i) => {
    const year = currentYear + 1 - i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <div className={`max-w-2xl mx-auto ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`p-3 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gray-700"
                : "bg-gradient-to-br from-blue-500 to-blue-600"
            }`}
          >
            <Car
              className={`w-6 h-6 ${isDarkMode ? "text-gray-200" : "text-white"}`}
            />
          </div>
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Información Básica
            </h2>
            <p
              className={`text-gray-600 text-sm ${
                isDarkMode ? "text-gray-400" : ""
              }`}
            >
              Completa los datos principales de tu vehículo
            </p>
          </div>
        </div>
        <div
          className={`w-full rounded-full h-2 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <div
            className={`h-2 rounded-full w-1/4 transition-all duration-500 ${
              isDarkMode
                ? "bg-gray-500"
                : "bg-gradient-to-r from-blue-500 to-blue-600"
            }`}
          />
        </div>
      </div>

      <div className="space-y-6">
        <InputField
          label="Categoría del Vehículo"
          required
          error={errors.category}
          isValid={categoryValidation.isValid}
          showValidation={categoryValidation.showValidation}
        >
          <SelectField
            value={formData.category || ""}
            onChange={(value) => {
              handleInputChange("category", value as VehicleCategory);
              handleInputChange("subcategory", "");
              handleInputChange("brand", "");
            }}
            onBlur={categoryValidation.handleBlur}
            placeholder="Selecciona el tipo de vehículo"
            options={categoryOptions}
            error={errors.category}
            isLoading={isLoading}
          />
        </InputField>

        <InputField
          label="Subcategoría"
          error={errors.subcategory}
          isValid={subcategoryValidation.isValid}
          showValidation={subcategoryValidation.showValidation}
        >
          <SelectField
            value={formData.subcategory || ""}
            onChange={(value) => handleInputChange("subcategory", value)}
            onBlur={subcategoryValidation.handleBlur}
            disabled={!formData.category}
            placeholder={
              !formData.category
                ? "Primero selecciona una categoría"
                : "Selecciona una subcategoría"
            }
            options={subcategoryOptions}
            error={errors.subcategory}
            isLoading={isLoading && !!formData.category}
          />
        </InputField>

        <InputField
          label="Marca"
          required
          error={errors.brand}
          isValid={brandValidation.isValid}
          showValidation={brandValidation.showValidation}
        >
          <SelectField
            value={formData.brand || ""}
            onChange={(value) => handleInputChange("brand", value)}
            onBlur={brandValidation.handleBlur}
            disabled={!formData.category}
            placeholder={
              !formData.category
                ? "Primero selecciona una categoría"
                : "Selecciona la marca"
            }
            options={brandOptions}
            error={errors.brand}
            isLoading={isLoading && !!formData.category}
          />
        </InputField>

        <InputField
          label="Modelo"
          required
          error={errors.model}
          isValid={modelValidation.isValid}
          showValidation={modelValidation.showValidation}
        >
          <input
            type="text"
            value={formData.model || ""}
            onChange={(e) => handleInputChange("model", e.target.value)}
            onBlur={modelValidation.handleBlur}
            maxLength={100}
            className={`
              w-full px-4 py-3 rounded-xl
              focus:outline-none focus:ring-4 focus:ring-blue-500/20
              transition-all duration-200
              ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                : "bg-white border-gray-200 text-gray-900 focus:border-blue-500 hover:border-gray-300"
              }
              ${errors.model
                ? "border-red-300 focus:border-red-500"
                : ""
              }
            `}
            placeholder="Ej: Corolla, Civic, F-150, CBR600RR"
            autoComplete="off"
          />
        </InputField>

        <InputField
          label="Año"
          required
          error={errors.year}
          isValid={yearValidation.isValid}
          showValidation={yearValidation.showValidation}
        >
          <SelectField
            value={formData.year?.toString() || ""}
            onChange={(value) => handleInputChange("year", parseInt(value) || 0)}
            onBlur={yearValidation.handleBlur}
            placeholder="Selecciona el año"
            options={yearOptions}
            error={errors.year}
          />
        </InputField>
      </div>

      <div
        className={`mt-8 p-4 rounded-xl border ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-gray-200"
            : "bg-blue-50 border-blue-200 text-blue-700"
        }`}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Progreso del formulario</span>
          <span className="font-bold">1 de 4 pasos</span>
        </div>
        <div
          className={`mt-2 text-xs ${
            isDarkMode ? "text-gray-400" : "text-blue-600"
          }`}
        >
          Completa todos los campos requeridos para continuar al siguiente paso
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;