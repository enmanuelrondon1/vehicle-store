// src/components/features/vehicles/registration/Step2_PriceAndCondition.tsx

"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  DollarSign, 
  Gauge, 
  Shield, 
  Handshake,
  Loader2, 
  Info,
  Eye,
} from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Importar el componente Switch
import {
  VehicleCondition,
  WarrantyType,
  Currency,
  VEHICLE_CONDITIONS_LABELS,
  WARRANTY_LABELS,
} from "@/types/shared";
import { VehicleDataBackend } from "@/types/types";
import { useDarkMode } from "@/context/DarkModeContext";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormErrors {
  [key: string]: string | undefined;
}

type FormFieldValue = string | number | boolean | undefined;

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: FormFieldValue) => void;
}

// Configuración de validación
const VALIDATION_CONFIG = {
  price: {
    min: 100,
    max: 1000000,
    tips: [
      "💡 Investiga precios similares en el mercado",
      "🎯 Un precio justo atrae más compradores",
      "📈 Considera la depreciación por año y kilometraje"
    ]
  },
  mileage: {
    min: 0,
    max: 999999,
    tips: [
      "🚗 Kilometraje bajo aumenta el valor",
      "📊 El promedio anual es 15,000-20,000 km",
      "✅ Sé honesto con el kilometraje real"
    ]
  }
};

// Componente de Progreso
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
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
};

// Componente de Vista Previa
const PreviewCard: React.FC<{ formData: Partial<VehicleDataBackend>; exchangeRate: number | null }> = ({ formData, exchangeRate }) => {
  const { isDarkMode } = useDarkMode();
  
  const priceInVes = useMemo(() => {
    if (formData.price && exchangeRate && formData.currency === Currency.USD) {
      return (formData.price * exchangeRate).toLocaleString('es-VE', { 
        style: 'currency', 
        currency: 'VES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }
    return null;
  }, [formData.price, exchangeRate, formData.currency]);

  return (
    <div className={`mt-6 p-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
      isDarkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50'
    }`}>
      <h3 className={`flex items-center text-sm font-semibold mb-3 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <Eye className="w-4 h-4 mr-2" />
        Vista Previa del Anuncio
      </h3>
      
      <div className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <div className="flex justify-between">
          <span>Precio:</span>
          <span className="font-semibold text-green-600">
            {formData.price ? `$${formData.price.toLocaleString()} USD` : "No especificado"}
            {formData.isNegotiable && " (Negociable)"}
          </span>
        </div>
        
        {priceInVes && (
          <div className="flex justify-between">
            <span>Equivalente:</span>
            <span className="font-medium">{priceInVes}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Kilometraje:</span>
          <span>{formData.mileage ? `${formData.mileage.toLocaleString()} km` : "No especificado"}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Condición:</span>
          <span>{formData.condition ? VEHICLE_CONDITIONS_LABELS[formData.condition as VehicleCondition] : "No especificada"}</span>
        </div>
        
        {formData.warranty && (
          <div className="flex justify-between">
            <span>Garantía:</span>
            <span>{WARRANTY_LABELS[formData.warranty as WarrantyType]}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Step2_PriceAndCondition: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const { isDarkMode } = useDarkMode();
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  // Hooks de validación
  const priceValidation = useFieldValidation(formData.price, errors.price);
  const mileageValidation = useFieldValidation(formData.mileage, errors.mileage);
  const conditionValidation = useFieldValidation(formData.condition, errors.condition);
  const warrantyValidation = useFieldValidation(formData.warranty, errors.warranty);

  const inputClass = `w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 ${
    isDarkMode
      ? "bg-gray-700 text-gray-200"
      : "bg-white text-gray-900"
  }`;


  // Calcular progreso del formulario
  const formProgress = useMemo(() => {
    const fields = ['price', 'mileage', 'condition'];
    const completedFields = fields.filter(field => {
      const value = formData[field as keyof typeof formData];
      return value !== undefined && value !== '' && value !== null;
    }).length;
    
    return (completedFields / fields.length) * 100;
  }, [formData]);

  // Establecer USD como moneda por defecto al cargar el componente
  useEffect(() => {
    if (!formData.currency) {
      handleInputChange("currency", Currency.USD);
    }
  }, [formData.currency, handleInputChange]);

  // Efecto para obtener la tasa de cambio al cargar el componente
  useEffect(() => {
    const fetchRate = async () => {
      setIsLoadingRate(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/exchange-rate`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.success && data.rate) {
          setExchangeRate(data.rate);
        }
      } catch (error) {
        console.error("Error al obtener la tasa de cambio:", error);
        // Tasa de respaldo en caso de que la API falle
        setExchangeRate(126.28);
      } finally {
        setIsLoadingRate(false);
      }
    };

    fetchRate();
  }, []);

  // Cálculo del precio en Bolívares
  const priceInVes = useMemo(() => {
    if (formData.price && exchangeRate && formData.currency === Currency.USD) {
      return (formData.price * exchangeRate).toLocaleString('es-VE', { 
        style: 'currency', 
        currency: 'VES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }
    return null;
  }, [formData.price, exchangeRate, formData.currency]);

  // Función mejorada para manejar el input de kilometraje con formateo
  const handleMileageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir números y limitar a un número razonable de dígitos
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 8);
    
    if (numericValue === '') {
      handleInputChange("mileage", undefined);
    } else {
      const parsedValue = parseInt(numericValue, 10);
      // Validar que el kilometraje sea razonable (máximo 999,999 km)
      if (parsedValue <= 999999) {
        handleInputChange("mileage", parsedValue);
      }
    }
  }, [handleInputChange]);

  // Función para formatear el kilometraje con separadores de miles
  const formatMileage = (value: number | undefined): string => {
    if (!value) return '';
    return value.toLocaleString('es-VE');
  };

  // Función mejorada para el precio con validación
  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Eliminar todo excepto los dígitos
    const numericValue = rawValue.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      handleInputChange("price", undefined);
    } else {
      const parsedValue = parseInt(numericValue, 10);
      if (!isNaN(parsedValue)) {
        handleInputChange("price", parsedValue);
      }
    }
  }, [handleInputChange]);

  const formatPrice = (value: number | undefined): string => {
    return value !== undefined ? value.toLocaleString('es-VE') : '';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`p-3 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gray-700"
                : "bg-gradient-to-br from-green-500 to-green-600"
            }`}
          >
            <DollarSign
              className={`w-6 h-6 ${
                isDarkMode ? "text-gray-200" : "text-white"
              }`}
            />
          </div>
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Precio y Condición
            </h2>
            <p
              className={`text-gray-600 text-sm ${
                isDarkMode ? "text-gray-400" : ""
              }`}
            >
              Define el precio y estado del vehículo
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Progreso */}
      <ProgressBar progress={formProgress} />
      
      <div className="space-y-6">
        <InputField
          label="Precio (USD)"
          required
          success={priceValidation.isValid}
          error={errors.price}
          icon={<DollarSign className="w-4 h-4 text-green-600" />}
          tooltip="El precio debe estar en dólares estadounidenses. Se mostrará la conversión automática a bolívares."
          tips={VALIDATION_CONFIG.price.tips}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className={`text-sm font-medium ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                $
              </span>
            </div>
            <input
              type="text"
              value={formatPrice(formData.price)}
              onChange={handlePriceChange}
              className={`${inputClass} pl-8 ${priceValidation.getBorderColor(isDarkMode)}`}
              placeholder="25,000"
              onBlur={priceValidation.handleBlur}
              inputMode="numeric"
            />
          </div>
          
          {/* Mostrar el precio convertido y el estado de carga */}
          {isLoadingRate && (
            <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 flex items-center">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Obteniendo tasa del día...
            </p>
          )}
          {priceInVes && !isLoadingRate && (
            <div className={`mt-2 p-3 rounded-lg border ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
            }`}>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Equivalente aproximado: <span className="font-semibold text-green-600 dark:text-green-400">{priceInVes}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                💡 Los compradores verán ambas monedas
              </p>
            </div>
          )}
        </InputField>

        <div className="flex items-center justify-between rounded-lg p-3 -mt-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <span className={`text-sm font-medium transition-colors group-hover:text-blue-600 ${
              isDarkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700'
            }`}>
              ¿Precio Negociable?
            </span>
            <Handshake className={`w-4 h-4 transition-colors group-hover:scale-110 ${
              formData.isNegotiable ? 'text-blue-500' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
            }`} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>Marcar como negociable puede atraer más compradores interesados</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Switch
            checked={formData.isNegotiable || false}
            onCheckedChange={(checked) => handleInputChange("isNegotiable", checked)}
          />
        </div>

        <InputField
          label="Kilometraje"
          required
          success={mileageValidation.isValid}
          error={errors.mileage}
          icon={<Gauge className="w-4 h-4 text-blue-600" />}
          tooltip="Introduce el kilometraje actual del vehículo. Se formatará automáticamente."
          tips={VALIDATION_CONFIG.mileage.tips}
        >
          <div className="relative">
            <input
              type="text"
              value={formatMileage(formData.mileage)}
              onChange={handleMileageChange}
              className={`${inputClass} pr-12 ${mileageValidation.getBorderColor(isDarkMode)}`}
              placeholder="85,000"
              onBlur={mileageValidation.handleBlur}
              inputMode="numeric"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                km
              </span>
            </div>
          </div>
        </InputField>

        <InputField
          label="Condición"
          required
          success={conditionValidation.isValid}
          error={errors.condition}
          icon={<Shield className="w-4 h-4 text-orange-600" />}
          tooltip="La condición del vehículo afecta significativamente su valor de mercado"
        >
          <SelectField
            value={formData.condition || ""}
            onChange={(value) => handleInputChange("condition", value)}
            onBlur={conditionValidation.handleBlur}
            options={[VehicleCondition.EXCELLENT, VehicleCondition.GOOD].map(c => ({
              value: c,
              label: VEHICLE_CONDITIONS_LABELS[c]
            }))}
            placeholder="Selecciona la condición"
            error={errors.condition}
            className={`${inputClass} ${conditionValidation.getBorderColor(isDarkMode)}`}
          />
        </InputField>

        <InputField
          label="Garantía"
          error={errors.warranty}
          success={warrantyValidation.isValid}
          icon={<Shield className="w-4 h-4 text-purple-600" />}
          tooltip="La garantía puede ser un factor decisivo para muchos compradores"
        >
          <SelectField
            value={formData.warranty || ""}
            onChange={(value) => handleInputChange("warranty", value)}
            options={[WarrantyType.NO_WARRANTY, WarrantyType.SELLER_WARRANTY].map(w => ({
              value: w,
              label: WARRANTY_LABELS[w]
            }))}
            placeholder="Selecciona tipo de garantía"
            error={errors.warranty}
            className={`${inputClass} ${warrantyValidation.getBorderColor(isDarkMode)}`}
          />
        </InputField>

        {/* Vista Previa */}
        <PreviewCard formData={formData} exchangeRate={exchangeRate} />

        {/* Resumen de Completitud */}
        <div className={`mt-6 p-4 rounded-xl ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Estado del Formulario
          </h3>
          <div className="flex items-center justify-between">
            <span className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {formProgress === 100 ? '🎉 ¡Formulario completo!' : `📝 ${Math.round(formProgress)}% completado`}
            </span>
            {formProgress === 100 && (
              <span className="text-xs text-green-600 font-medium">
                ✅ Listo para continuar
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_PriceAndCondition;