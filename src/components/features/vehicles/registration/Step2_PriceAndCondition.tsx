// src/components/features/vehicles/registration/Step2_PriceAndCondition.tsx

"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  DollarSign, 
  Gauge, 
  Shield, 
  Handshake, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Info,
  TrendingUp,
  Eye
} from "lucide-react";
import {
  VehicleCondition,
  WarrantyType,
  Currency,
  VEHICLE_CONDITIONS_LABELS,
  WARRANTY_LABELS,
} from "@/types/shared";
import { VehicleDataBackend } from "@/types/types";
import { useDarkMode } from "@/context/DarkModeContext";

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

// Hook para validación en tiempo real
const useRealTimeValidation = (value: FormFieldValue, field: string) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState<string>("");

  useEffect(() => {
    if (value === undefined || value === "" || value === null) {
      setIsValid(null);
      setValidationMessage("");
      return;
    }

    let valid = false;
    let message = "";

    switch (field) {
      case "price":
        const price = typeof value === "string" ? parseFloat(value) : Number(value);
        if (isNaN(price)) {
          message = "Debe ser un número válido";
        } else if (price < VALIDATION_CONFIG.price.min) {
          message = `El precio mínimo es $${VALIDATION_CONFIG.price.min.toLocaleString()}`;
        } else if (price > VALIDATION_CONFIG.price.max) {
          message = `El precio máximo es $${VALIDATION_CONFIG.price.max.toLocaleString()}`;
        } else {
          valid = true;
          message = "Precio válido";
        }
        break;

      case "mileage":
        const mileage = typeof value === "string" ? parseInt(value.replace(/[^0-9]/g, '')) : Number(value);
        if (isNaN(mileage)) {
          message = "Debe ser un número válido";
        } else if (mileage < 0) {
          message = "El kilometraje no puede ser negativo";
        } else if (mileage > VALIDATION_CONFIG.mileage.max) {
          message = "El kilometraje es muy alto";
        } else {
          valid = true;
          message = "Kilometraje válido";
        }
        break;

      case "condition":
        valid = typeof value === "string" && Object.values(VehicleCondition).includes(value as VehicleCondition);
        message = valid ? "Condición seleccionada" : "Selecciona una condición";
        break;

      default:
        valid = true;
        message = "";
    }

    setIsValid(valid);
    setValidationMessage(message);
  }, [value, field]);

  return { isValid, validationMessage };
};

// Componente de Tooltip
const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  const [show, setShow] = useState(false);
  const { isDarkMode } = useDarkMode();

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {show && (
        <div className={`absolute z-10 p-2 text-xs rounded-lg shadow-lg w-48 bottom-full left-1/2 transform -translate-x-1/2 mb-2 ${
          isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-900 text-white'
        }`}>
          {content}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            isDarkMode ? 'border-t-gray-800' : 'border-t-gray-900'
          }`}></div>
        </div>
      )}
    </div>
  );
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

const InputField: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isValid?: boolean | null;
  validationMessage?: string;
  tooltip?: string;
  tips?: string[];
}> = ({ label, required, error, icon, children, isValid, validationMessage, tooltip, tips }) => {
  const { isDarkMode } = useDarkMode();
  const [showTips, setShowTips] = useState(false);
  
  const getValidationIcon = () => {
    if (isValid === true) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (isValid === false) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className={`space-y-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
      <div className="flex items-center justify-between">
        <label className={`flex items-center text-sm font-semibold ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}>
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {tooltip && (
            <Tooltip content={tooltip}>
              <Info className="w-3 h-3 ml-1 text-gray-400" />
            </Tooltip>
          )}
        </label>
        
        <div className="flex items-center space-x-2">
          {getValidationIcon()}
          {tips && (
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/70' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Tips
            </button>
          )}
        </div>
      </div>
      
      {children}
      
      {/* Mensaje de validación en tiempo real */}
      {validationMessage && (
        <p className={`text-xs mt-1 flex items-center ${
          isValid ? 'text-green-600' : 'text-orange-500'
        }`}>
          {isValid ? '✅' : '⚠️'} {validationMessage}
        </p>
      )}
      
      {/* Error del formulario */}
      {error && <p className="text-sm text-red-500 mt-1">🚨 {error}</p>}
      
      {/* Tips expandibles */}
      {showTips && tips && (
        <div className={`mt-2 p-3 rounded-lg space-y-1 ${
          isDarkMode ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'
        }`}>
          {tips.map((tip, index) => (
            <p key={index} className={`text-xs ${
              isDarkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              {tip}
            </p>
          ))}
        </div>
      )}
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

  // Validaciones en tiempo real
  const priceValidation = useRealTimeValidation(formData.price, "price");
  const mileageValidation = useRealTimeValidation(formData.mileage, "mileage");
  const conditionValidation = useRealTimeValidation(formData.condition, "condition");

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
        const response = await fetch('/api/exchange-rate');
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
    const value = parseFloat(e.target.value);
    handleInputChange("price", isNaN(value) ? undefined : value);
  }, [handleInputChange]);

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
          error={errors.price}
          icon={<DollarSign className="w-4 h-4 text-green-600" />}
          isValid={priceValidation.isValid}
          validationMessage={priceValidation.validationMessage}
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
              type="number"
              value={formData.price || ""}
              onChange={handlePriceChange}
              className={`w-full pl-8 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 ${
                priceValidation.isValid === true
                  ? 'border-green-500 focus:ring-green-500/20'
                  : priceValidation.isValid === false
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'focus:ring-green-500/20'
              } ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
              placeholder="25,000"
              min="0"
              step="0.01"
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

        <div className="flex items-center justify-end -mt-2">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.isNegotiable || false}
              onChange={(e) => handleInputChange("isNegotiable", e.target.checked)}
              className={`w-4 h-4 rounded focus:ring-2 transition-colors ${
                isDarkMode 
                  ? 'text-blue-400 bg-gray-600 border-gray-500 focus:ring-blue-400' 
                  : 'text-blue-600 border-gray-300 focus:ring-blue-500'
              }`}
            />
            <span className={`text-sm font-medium transition-colors group-hover:text-blue-600 ${
              isDarkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700'
            }`}>
              Precio Negociable
            </span>
            <Handshake className={`w-4 h-4 transition-colors ${
              isDarkMode ? 'text-gray-500 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-600'
            }`} />
            <Tooltip content="Marcar como negociable puede atraer más compradores interesados">
              <Info className="w-3 h-3 text-gray-400" />
            </Tooltip>
          </label>
        </div>

        <InputField
          label="Kilometraje"
          required
          error={errors.mileage}
          icon={<Gauge className="w-4 h-4 text-blue-600" />}
          isValid={mileageValidation.isValid}
          validationMessage={mileageValidation.validationMessage}
          tooltip="Introduce el kilometraje actual del vehículo. Se formatará automáticamente."
          tips={VALIDATION_CONFIG.mileage.tips}
        >
          <div className="relative">
            <input
              type="text"
              value={formatMileage(formData.mileage)}
              onChange={handleMileageChange}
              className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 ${
                mileageValidation.isValid === true
                  ? 'border-green-500 focus:ring-green-500/20'
                  : mileageValidation.isValid === false
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'focus:ring-blue-500/20'
              } ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
              placeholder="85,000"
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
          error={errors.condition}
          icon={<Shield className="w-4 h-4 text-orange-600" />}
          isValid={conditionValidation.isValid}
          validationMessage={conditionValidation.validationMessage}
          tooltip="La condición del vehículo afecta significativamente su valor de mercado"
        >
          <select
            value={formData.condition || ""}
            onChange={(e) => handleInputChange("condition", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer ${
              conditionValidation.isValid === true
                ? 'border-green-500 focus:ring-green-500/20'
                : conditionValidation.isValid === false
                ? 'border-red-500 focus:ring-red-500/20'
                : 'focus:ring-orange-500/20'
            } ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <option value="">Selecciona la condición</option>
            {Object.values(VehicleCondition).map((condition) => (
              <option key={condition} value={condition}>
                {VEHICLE_CONDITIONS_LABELS[condition]}
              </option>
            ))}
          </select>
        </InputField>

        <InputField
          label="Garantía"
          error={errors.warranty}
          icon={<Shield className="w-4 h-4 text-purple-600" />}
          tooltip="La garantía puede ser un factor decisivo para muchos compradores"
        >
          <select
            value={formData.warranty || ""}
            onChange={(e) => handleInputChange("warranty", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 appearance-none cursor-pointer ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <option value="">Selecciona tipo de garantía</option>
            {Object.values(WarrantyType).map((warranty) => (
              <option key={warranty} value={warranty}>
                {WARRANTY_LABELS[warranty]}
              </option>
            ))}
          </select>
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