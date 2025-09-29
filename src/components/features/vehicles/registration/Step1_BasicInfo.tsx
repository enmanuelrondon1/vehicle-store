// src/components/features/vehicles/registration/Step1_BasicInfo.tsx
"use client";
import React, {  useMemo } from 'react';
import { Car, Check, AlertCircle, Search, Calendar, Tag, Layers, Award } from 'lucide-react';
import { VehicleCategory, VEHICLE_CATEGORIES_LABELS } from "@/types/shared";
import { VehicleDataBackend } from "@/types/types";
import { useDarkMode } from "@/context/DarkModeContext";
import { CATEGORY_DATA } from "@/constants/form-constants";
import { useFieldValidation } from '@/hooks/useFieldValidation';
import { InputField } from '@/components/shared/forms/InputField';
import { SelectField } from '@/components/shared/forms/SelectField';

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

// Componente de Progreso (estandarizado)
const ProgressBar: React.FC<{ progress: number; isDarkMode: boolean }> = ({ progress, isDarkMode }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Progreso del formulario
      </span>
      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {Math.round(progress)}%
      </span>
    </div>
    <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
      <div 
        className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);


const Step1_BasicInfo: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const { isDarkMode } = useDarkMode();

  // Hooks de validación para cada campo
  const categoryValidation = useFieldValidation(formData.category, errors.category);
  const brandValidation = useFieldValidation(formData.brand, errors.brand);
  const brandOtherValidation = useFieldValidation(formData.brandOther, errors.brandOther);
  const modelValidation = useFieldValidation(formData.model, errors.model);
  const modelOtherValidation = useFieldValidation(formData.modelOther, errors.modelOther);
  const versionValidation = useFieldValidation(formData.version, errors.version);
  const yearValidation = useFieldValidation(formData.year, errors.year);

  const inputClass = `w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 ${
    isDarkMode
      ? "bg-gray-700 text-gray-200"
      : "bg-white text-gray-900"
  }`;



  // Memoización para el progreso
  const { completedRequiredFields, progressPercentage } = useMemo(() => {
    const requiredFields = ['category', 'brand', 'model', 'year'];
    const completed = requiredFields.filter(field => {
      const value = formData[field as keyof typeof formData];
      return (!!value || value === 0) && !errors[field];
    }).length;
    const progress = (completed / requiredFields.length) * 100;
    return { completedRequiredFields: completed, progressPercentage: progress };
  }, [formData, errors]);

  const categoryOptions = Object.values(VehicleCategory).map((cat) => ({
    value: cat,
    label: VEHICLE_CATEGORIES_LABELS[cat],
  }));

  const currentCategory = formData.category as VehicleCategory | undefined;

  const brandOptions = useMemo(() => {
    if (!currentCategory || !CATEGORY_DATA[currentCategory]) return [];
    // ¡NUEVA LÓGICA! Leemos las claves (nombres de marcas) del objeto.
    return Object.keys(CATEGORY_DATA[currentCategory].brands).map(brand => ({
      value: brand,
      label: brand,
    }));
  }, [currentCategory]);
      
  const modelOptions = useMemo(() => {
    // ¡NUEVA LÓGICA! Buscamos los modelos dentro de la categoría y marca seleccionadas.
    if (!currentCategory || !formData.brand || !CATEGORY_DATA[currentCategory]?.brands[formData.brand]) return [];
    return CATEGORY_DATA[currentCategory].brands[formData.brand].map(model => ({
      value: model,
      label: model,
    }));
  }, [currentCategory, formData.brand]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1899 }, (_, i) => {
    const year = currentYear + 1 - i;
    return { value: year.toString(), label: year.toString() };
  });

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
        <ProgressBar progress={progressPercentage} isDarkMode={isDarkMode} />
      </div>

      <div className="space-y-6">
        <InputField
          label="Categoría del Vehículo"
          required
          error={errors.category}
          success={categoryValidation.isValid}
          icon={<Layers className="w-4 h-4 text-blue-600" />}
          tooltip="Selecciona el tipo que mejor describe tu vehículo"
          tips={[
            "🚗 Los carros y camionetas (SUV) son los más buscados.",
            "🏍️ Las motos de baja cilindrada tienen alta demanda para trabajo.",
            "🚚 Si es un camión, asegúrate de detallar su capacidad en los siguientes pasos."
          ]}
        >
          <SelectField
            value={formData.category || ""}
            onChange={(value) => {
              handleInputChange("category", value as VehicleCategory);
              handleInputChange("brand", "");
              handleInputChange("model", "");
            }}
            placeholder="Selecciona el tipo de vehículo"
            onBlur={categoryValidation.handleBlur}
            options={categoryOptions}
            className={`${inputClass} ${categoryValidation.getBorderColor(isDarkMode)}`}
            error={errors.category}
          />
        </InputField>

        <InputField 
          label="Marca" 
          required 
          error={errors.brand}
          success={brandValidation.isValid}
          icon={<Award className="w-4 h-4 text-blue-600" />}
          tooltip="La marca del fabricante del vehículo"
          tips={[
            "👍 Marcas como Toyota, Honda y Ford son muy populares y confiables.",
            "🏍️ Para motos, Empire Keeway, Bera y Yamaha son líderes en el mercado.",
            "❓ Si no encuentras tu marca, selecciona 'Otra' y escríbela manualmente."
          ]}
        >
          <SelectField
            value={formData.brand || ""}
            onChange={(value) => {
              handleInputChange("brand", value);
              handleInputChange("model", ""); // Reset model when brand changes
            }}
            disabled={!formData.category}
            onBlur={brandValidation.handleBlur}
            isLoading={!!formData.category && brandOptions.length === 0}
            placeholder={
              !formData.category
                ? "Primero selecciona una categoría"
                : "Selecciona la marca"
            }
            options={brandOptions}
            className={`${inputClass} ${brandValidation.getBorderColor(isDarkMode)}`}
            error={errors.brand}
          />
        </InputField>

        {/* Campo condicional para especificar otra marca */}
        {formData.brand === "Otra" && (
          <InputField
            label="Especificar Marca"
            required
            error={errors.brandOther}
            success={brandOtherValidation.isValid}
            icon={<Award className="w-4 h-4 text-blue-600" />}
            tooltip="Escribe el nombre exacto de la marca"
            counter={{ current: formData.brandOther?.length || 0, max: 50 }}
          >
            <input
              type="text"
              value={formData.brandOther || ""}
              onChange={(e) => handleInputChange("brandOther", e.target.value)}
              onBlur={brandOtherValidation.handleBlur}
              maxLength={50}
              className={`${inputClass} ${brandOtherValidation.getBorderColor(isDarkMode)}`}
              placeholder="Ej: Empire Keeway, Skygo, Lifan"
            />
          </InputField>
        )}

        <InputField 
          label="Modelo" 
          required 
          error={errors.model}
          success={modelValidation.isValid}
          icon={<Search className="w-4 h-4 text-blue-600" />}
          tooltip="El modelo específico del vehículo"
          tips={[
            "✨ Sé lo más específico posible (Ej: Corolla XEI, no solo Corolla).",
            "💡 Si tu modelo no aparece, asegúrate de haber seleccionado la marca correcta.",
          ]}
        >
          <SelectField
            value={formData.model || ""}
            onChange={(value) => handleInputChange("model", value)}
            disabled={!formData.brand || formData.brand === 'Otra'}
            onBlur={modelValidation.handleBlur}
            isLoading={!!formData.brand && modelOptions.length === 0 && formData.brand !== 'Otra'}
            placeholder={
              !formData.brand || formData.brand === 'Otra'
                ? "Primero selecciona una marca"
                : "Selecciona el modelo"
            }
            options={modelOptions}
            className={`${inputClass} ${modelValidation.getBorderColor(isDarkMode)}`}
            error={errors.model}
          />
        </InputField>

        {/* Campo condicional para especificar otro modelo */}
        {formData.model === "Otro" && (
          <InputField
            label="Especificar Modelo"
            required
            error={errors.modelOther}
            success={modelOtherValidation.isValid}
            icon={<Search className="w-4 h-4 text-blue-600" />}
            tooltip="Escribe el nombre exacto del modelo"
            counter={{ current: formData.modelOther?.length || 0, max: 50 }}
          >
            <input
              type="text"
              value={formData.modelOther || ""}
              onChange={(e) => handleInputChange("modelOther", e.target.value)}
              onBlur={modelOtherValidation.handleBlur}
              maxLength={50}
              className={`${inputClass} ${modelOtherValidation.getBorderColor(isDarkMode)}`}
              placeholder="Ej: Corolla Cross, F-250, etc."
            />
          </InputField>
        )}

        <InputField
          label="Versión / Edición (Opcional)"
          error={errors.version}
          success={versionValidation.isValid}
          icon={<Tag className="w-4 h-4 text-blue-600" />}
          tooltip="Añade detalles específicos del modelo. Ej: XEI, Limited, 4x4, etc."
          counter={{ current: formData.version?.length || 0, max: 100 }}
        >
          <input
            type="text"
            value={formData.version || ""}
            onChange={(e) => handleInputChange("version", e.target.value)}
            onBlur={versionValidation.handleBlur}
            maxLength={100}
            className={`${inputClass} ${versionValidation.getBorderColor(isDarkMode)}`}
            placeholder="Ej: XEI, Limited, Sport, 4x4"
            autoComplete="off"
            disabled={!formData.model}
          />
        </InputField>

        <InputField 
          label="Año" 
          required 
          error={errors.year}
          success={yearValidation.isValid}
          icon={<Calendar className="w-4 h-4 text-blue-600" />}
          tooltip="Año de fabricación del vehículo"
          tips={[
            "📈 El año del modelo es uno de los factores más importantes en el precio.",
            "🆕 Los vehículos más nuevos suelen tener mayor valor de reventa.",
            "❗ Asegúrate de que el año coincida con los papeles del vehículo."
          ]}
        >
          <SelectField
            value={formData.year?.toString() || ""}
            onChange={(value) =>
              handleInputChange("year", parseInt(value) || 0)
            }
            onBlur={yearValidation.handleBlur}
            placeholder="Selecciona el año"
            options={yearOptions}
            className={`${inputClass} ${yearValidation.getBorderColor(isDarkMode)}`}
            error={errors.year}
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
          completedRequiredFields >= 4
            ? (isDarkMode ? "bg-green-900/20 border-green-700" : "bg-green-50 border-green-200")
            : (isDarkMode ? "bg-orange-900/20 border-orange-700" : "bg-orange-50 border-orange-200")
        } border`}>
          <div className="flex items-center space-x-2">
            {completedRequiredFields >= 4 ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            <span className={`font-medium ${
              completedRequiredFields >= 4
                ? "text-green-700"
                : "text-orange-700"
            }`}>
              {completedRequiredFields >= 4
                ? "¡Información básica completa!"
                : `Completa ${4 - completedRequiredFields} campos más para continuar`
              }
            </span>
          </div>
          <div className={`text-xs mt-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Progreso: {completedRequiredFields}/4 campos requeridos
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_BasicInfo;