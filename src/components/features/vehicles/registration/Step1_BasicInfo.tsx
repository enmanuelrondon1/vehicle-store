//src/componentes/features/vehicles/registration/steps/Step1_BasicInfo.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Car, ChevronDown, Check, AlertCircle, Info, Search, Calendar, Tag, Layers, Award } from "lucide-react";
import { VehicleCategory, VEHICLE_CATEGORIES_LABELS } from "@/types/shared";
import { VehicleDataBackend } from "@/types/types";
import { useDarkMode } from "@/context/DarkModeContext";
import { CATEGORY_DATA } from "@/constants/form-constants";

interface FormErrors {
  [key: string]: string | undefined;
}

type FormFieldValue = string | number | VehicleCategory | undefined;

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: FormFieldValue) => void;
  isLoading?: boolean;
}

const InputField: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  tooltip?: string;
  counter?: { current: number; max: number };
}> = ({ label, required, error, success, icon, children, tooltip, counter }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className={`space-y-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
      <label className={`flex items-center text-sm font-semibold ${
        isDarkMode ? "text-gray-300" : "text-gray-700"
      }`}>
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {tooltip && (
          <span 
            className="ml-2 text-xs bg-gray-500 text-white px-2 py-1 rounded cursor-help"
            title={tooltip}
          >
            <Info className="w-3 h-3" />
          </span>
        )}
      </label>
      <div className="relative">
        {children}
        {success && !error && (
          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
        )}
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
        )}
      </div>
      {counter && (
        <div className={`text-xs ${
          counter.current > counter.max * 0.9 
            ? "text-orange-500" 
            : isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}>
          {counter.current}/{counter.max} caracteres
        </div>
      )}
      {error && (
        <p className={`text-sm text-red-500 mt-1 flex items-center`}>
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
      {success && !error && (
        <p className="text-sm text-green-500 mt-1 flex items-center">
          <Check className="w-4 h-4 mr-1" />
          ¡Perfecto!
        </p>
      )}
    </div>
  );
};

const SelectField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  success?: boolean;
}> = ({ value, onChange, disabled, placeholder, options, error, success }) => {
  const { isDarkMode } = useDarkMode();
  
  const getSelectClass = () => {
    let borderColor = isDarkMode ? "border-gray-600" : "border-gray-200";
    
    if (error) {
      borderColor = "border-red-400";
    } else if (success) {
      borderColor = "border-green-400";
    }
    
    return `w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 appearance-none ${
      isDarkMode
        ? `bg-gray-700 ${borderColor} text-gray-200`
        : `bg-white ${borderColor} text-gray-900`
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
  };

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={getSelectClass()}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
          isDarkMode ? "text-gray-500" : "text-gray-500"
        } pointer-events-none`}
      />
    </div>
  );
};

// Componente de sugerencias inteligentes
const SmartSuggestions: React.FC<{
  category?: VehicleCategory;
  brand?: string;
  isDarkMode: boolean;
}> = ({ category,  isDarkMode }) => {
  const getSuggestions = () => {
    if (!category) return [];
    
    const suggestions = [];
    
    if (category === VehicleCategory.CAR) {
      suggestions.push("Los sedanes son ideales para familias");
      suggestions.push("Los hatchback son perfectos para la ciudad");
    } else if (category === VehicleCategory.MOTORCYCLE) {
      suggestions.push("Las motos de trabajo son muy demandadas");
      suggestions.push("Verifica que tenga SOAT vigente");
    } else if (category === VehicleCategory.SUV) {
      suggestions.push("Los SUV mantienen mejor su valor");
      suggestions.push("Perfectos para terrenos difíciles");
    }
    
    return suggestions;
  };

  const suggestions = getSuggestions();
  
  if (suggestions.length === 0 || !category) return null;

  return (
    <div className={`mt-4 p-3 rounded-xl ${
      isDarkMode ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"
    } border`}>
      <h4 className={`text-sm font-semibold mb-2 ${
        isDarkMode ? "text-blue-300" : "text-blue-800"
      }`}>
        💡 Consejos para tu {VEHICLE_CATEGORIES_LABELS[category] || "vehículo"}:
      </h4>
      <ul className={`text-xs space-y-1 ${
        isDarkMode ? "text-blue-200" : "text-blue-700"
      }`}>
        {suggestions.map((suggestion, index) => (
          <li key={index}>• {suggestion}</li>
        ))}
      </ul>
    </div>
  );
};

const Step1_BasicInfo: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const { isDarkMode } = useDarkMode();
  const [validationState, setValidationState] = useState<{[key: string]: boolean}>({});
  const [modelSuggestions, setModelSuggestions] = useState<string[]>([]);

  // Validación en tiempo real - usar useCallback para evitar recreación
  const validateField = useCallback((field: string, value: FormFieldValue): boolean => {
    switch (field) {
      case "category":
        return !!value && Object.values(VehicleCategory).includes(value as VehicleCategory);
      case "brand":
        return !!value && typeof value === 'string' && value.length >= 2;
      case "brandOther":
        return !formData.brand || formData.brand !== "Otra" || (!!value && typeof value === 'string' && value.length >= 2);
      case "model":
        return !!value && typeof value === 'string' && value.trim().length >= 2 && value.length <= 100;
      case "year":
        const currentYear = new Date().getFullYear();
        return !!value && typeof value === 'number' && value >= 1900 && value <= currentYear + 1;
      default:
        return false;
    }
  }, [formData.brand]);

  // Actualizar estado de validación
  useEffect(() => {
    const newValidationState: {[key: string]: boolean} = {};
    
    newValidationState["category"] = validateField("category", formData.category);
    newValidationState["brand"] = validateField("brand", formData.brand);
    newValidationState["brandOther"] = validateField("brandOther", formData.brandOther);
    newValidationState["model"] = validateField("model", formData.model);
    newValidationState["year"] = validateField("year", formData.year);

    setValidationState(newValidationState);
  }, [formData.category, formData.brand, formData.brandOther, formData.model, formData.year, validateField]);

  // Sugerencias de modelos basadas en marca
  useEffect(() => {
    if (formData.brand && formData.category) {
      const suggestions = getModelSuggestions(formData.brand, formData.category);
      setModelSuggestions(suggestions);
    } else {
      setModelSuggestions([]);
    }
  }, [formData.brand, formData.category]);

  const getModelSuggestions = (brand: string, category: VehicleCategory): string[] => {
    const modelsByBrand: {[key: string]: {[key in VehicleCategory]?: string[]}} = {
      "Toyota": {
        [VehicleCategory.CAR]: ["Corolla", "Camry", "Prius", "Yaris"],
        [VehicleCategory.SUV]: ["RAV4", "Highlander", "4Runner", "Land Cruiser"],
        [VehicleCategory.TRUCK]: ["Hilux", "Tacoma"]
      },
      "Ford": {
        [VehicleCategory.CAR]: ["Fiesta", "Focus", "Mustang"],
        [VehicleCategory.SUV]: ["Explorer", "Escape", "Expedition"],
        [VehicleCategory.TRUCK]: ["F-150", "Ranger"]
      },
      "Yamaha": {
        [VehicleCategory.MOTORCYCLE]: ["YBR 125", "FZ16", "R15", "MT-03", "XTZ 250"]
      },
      "Honda": {
        [VehicleCategory.CAR]: ["Civic", "Accord", "CR-V"],
        [VehicleCategory.MOTORCYCLE]: ["CBR", "CB", "CRF", "PCX"]
      }
    };

    return modelsByBrand[brand]?.[category] || [];
  };

  const categoryOptions = Object.values(VehicleCategory).map((cat) => ({
    value: cat,
    label: VEHICLE_CATEGORIES_LABELS[cat],
  }));

  const currentCategory = formData.category as VehicleCategory | undefined;
  const subcategoryOptions =
    currentCategory && CATEGORY_DATA[currentCategory]
      ? CATEGORY_DATA[currentCategory].subcategories.map((sub) => ({
          value: sub,
          label: sub,
        }))
      : [];

  const brandOptions =
    currentCategory && CATEGORY_DATA[currentCategory]
      ? CATEGORY_DATA[currentCategory].brands.map((brand) => ({
          value: brand,
          label: brand,
        }))
      : [];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1899 }, (_, i) => {
    const year = currentYear + 1 - i;
    return { value: year.toString(), label: year.toString() };
  });

  const totalRequiredFields = 4; // category, brand, model, year
  const completedRequiredFields = [
    validationState["category"],
    validationState["brand"],
    validationState["model"], 
    validationState["year"]
  ].filter(Boolean).length;
  
  const progressPercentage = (completedRequiredFields / totalRequiredFields) * 100;

  return (
    <div className={`max-w-2xl mx-auto ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 rounded-xl shadow-lg ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-600 to-gray-700"
              : "bg-gradient-to-br from-blue-500 to-blue-600"
          }`}>
            <Car className={`w-6 h-6 ${isDarkMode ? "text-gray-200" : "text-white"}`} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              Información Básica
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Completa los datos principales de tu vehículo
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        <InputField
          label="Categoría del Vehículo"
          required
          error={errors.category}
          success={validationState.category}
          icon={<Layers className="w-4 h-4 text-blue-600" />}
          tooltip="Selecciona el tipo que mejor describe tu vehículo"
        >
          <SelectField
            value={formData.category || ""}
            onChange={(value) => {
              handleInputChange("category", value as VehicleCategory);
              handleInputChange("subcategory", "");
              handleInputChange("brand", "");
              handleInputChange("model", "");
            }}
            placeholder="Selecciona el tipo de vehículo"
            options={categoryOptions}
            error={errors.category}
            success={validationState.category}
          />
        </InputField>

        <InputField 
          label="Subcategoría" 
          error={errors.subcategory}
          success={!!formData.subcategory && !errors.subcategory}
          icon={<Tag className="w-4 h-4 text-blue-600" />}
          tooltip="Especifica el tipo exacto para mejor clasificación"
        >
          <SelectField
            value={formData.subcategory || ""}
            onChange={(value) => handleInputChange("subcategory", value)}
            disabled={!formData.category}
            placeholder={
              !formData.category
                ? "Primero selecciona una categoría"
                : "Selecciona una subcategoría"
            }
            options={subcategoryOptions}
            error={errors.subcategory}
            success={!!formData.subcategory && !errors.subcategory}
          />
        </InputField>

        <InputField 
          label="Marca" 
          required 
          error={errors.brand}
          success={validationState.brand}
          icon={<Award className="w-4 h-4 text-blue-600" />}
          tooltip="La marca del fabricante del vehículo"
        >
          <SelectField
            value={formData.brand || ""}
            onChange={(value) => {
              handleInputChange("brand", value);
              handleInputChange("model", ""); // Reset model when brand changes
            }}
            disabled={!formData.category}
            placeholder={
              !formData.category
                ? "Primero selecciona una categoría"
                : "Selecciona la marca"
            }
            options={brandOptions}
            error={errors.brand}
            success={validationState.brand}
          />
        </InputField>

        {/* Campo condicional para especificar otra marca */}
        {formData.brand === "Otra" && (
          <InputField
            label="Especificar Marca"
            required
            error={errors.brandOther}
            success={validationState.brandOther}
            icon={<Award className="w-4 h-4 text-blue-600" />}
            tooltip="Escribe el nombre exacto de la marca"
            counter={{ current: formData.brandOther?.length || 0, max: 50 }}
          >
            <input
              type="text"
              value={formData.brandOther || ""}
              onChange={(e) => handleInputChange("brandOther", e.target.value)}
              maxLength={50}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-200 text-gray-900"
              } ${errors.brandOther ? "border-red-400" : validationState.brandOther ? "border-green-400" : ""}`}
              placeholder="Ej: Empire Keeway, Skygo, Lifan"
            />
          </InputField>
        )}

        <InputField 
          label="Modelo" 
          required 
          error={errors.model}
          success={validationState.model}
          icon={<Search className="w-4 h-4 text-blue-600" />}
          tooltip="El modelo específico del vehículo"
          counter={{ current: formData.model?.length || 0, max: 100 }}
        >
          <div className="relative">
            <input
              type="text"
              value={formData.model || ""}
              onChange={(e) => handleInputChange("model", e.target.value)}
              maxLength={100}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-200 text-gray-900"
              } ${errors.model ? "border-red-400" : validationState.model ? "border-green-400" : ""}`}
              placeholder="Ej: Corolla, Civic, F-150, CBR600RR"
              autoComplete="off"
              list="model-suggestions"
            />
            {modelSuggestions.length > 0 && (
              <datalist id="model-suggestions">
                {modelSuggestions.map((suggestion, index) => (
                  <option key={index} value={suggestion} />
                ))}
              </datalist>
            )}
          </div>
          {modelSuggestions.length > 0 && !formData.model && (
            <div className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              💡 Sugerencias: {modelSuggestions.slice(0, 3).join(", ")}
            </div>
          )}
        </InputField>

        <InputField 
          label="Año" 
          required 
          error={errors.year}
          success={validationState.year}
          icon={<Calendar className="w-4 h-4 text-blue-600" />}
          tooltip="Año de fabricación del vehículo"
        >
          <SelectField
            value={formData.year?.toString() || ""}
            onChange={(value) =>
              handleInputChange("year", parseInt(value) || 0)
            }
            placeholder="Selecciona el año"
            options={yearOptions}
            error={errors.year}
            success={validationState.year}
          />
        </InputField>

        {/* Sugerencias inteligentes */}
        <SmartSuggestions 
          category={currentCategory}
          brand={formData.brand}
          isDarkMode={isDarkMode}
        />

        {/* Resumen de completitud */}
        <div className={`mt-6 p-4 rounded-xl ${
          completedRequiredFields === totalRequiredFields
            ? (isDarkMode ? "bg-green-900/20 border-green-700" : "bg-green-50 border-green-200")
            : (isDarkMode ? "bg-orange-900/20 border-orange-700" : "bg-orange-50 border-orange-200")
        } border`}>
          <div className="flex items-center space-x-2">
            {completedRequiredFields === totalRequiredFields ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            <span className={`font-medium ${
              completedRequiredFields === totalRequiredFields
                ? "text-green-700"
                : "text-orange-700"
            }`}>
              {completedRequiredFields === totalRequiredFields
                ? "¡Información básica completa!"
                : `Completa ${totalRequiredFields - completedRequiredFields} campos más para continuar`
              }
            </span>
          </div>
          <div className={`text-xs mt-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Progreso: {completedRequiredFields}/{totalRequiredFields} campos requeridos
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_BasicInfo;