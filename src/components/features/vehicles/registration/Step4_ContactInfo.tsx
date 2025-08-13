// src/components/features/vehicles/registration/Step4_ContactInfo.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { User, MapPin, Mail, Phone, Check, AlertCircle, Eye, EyeOff, ChevronDown } from "lucide-react";
import { VehicleDataBackend } from "@/types/types";
import { useDarkMode } from "@/context/DarkModeContext";
import { VENEZUELAN_STATES } from "@/constants/form-constants";

interface FormErrors {
  [key: string]: string | undefined;
}

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: string) => void;
  phoneCodes: string[];
}

// Componente selector de ubicación
// Componente selector de ubicación corregido
const LocationSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  className: string;
  isDarkMode: boolean;
}> = ({ value, onChange, className, isDarkMode }) => {
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [lastParsedValue, setLastParsedValue] = useState("");

  // Parsear el valor inicial SOLO cuando el valor externo cambia y es diferente
  useEffect(() => {
    if (value !== lastParsedValue) {
      if (value) {
        const parts = value.split(", ");
        if (parts.length >= 2) {
          setCity(parts[0]);
          setSelectedState(parts[1]);
        } else {
          // Si solo hay una parte, verificar si es un estado conocido
          const isKnownState = VENEZUELAN_STATES.includes(parts[0]);
          if (isKnownState) {
            setCity("");
            setSelectedState(parts[0]);
          } else {
            setCity(parts[0]);
            setSelectedState("");
          }
        }
      } else {
        setCity("");
        setSelectedState("");
      }
      setLastParsedValue(value);
    }
  }, [value, lastParsedValue]);

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setIsStateDropdownOpen(false);
    // CORREGIDO: Solo actualizar si hay ciudad, si no, solo guardar el estado internamente
    // pero no enviarlo como valor completo hasta que haya ciudad
    if (city.trim()) {
      onChange(`${city}, ${state}`);
    } else {
      // Si no hay ciudad, enviar string vacío o solo el estado si así lo prefieres
      // Para este caso, enviamos string vacío para forzar que llenen la ciudad
      onChange("");
    }
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    // CORREGIDO: Solo crear el valor completo si ambos campos tienen contenido
    if (newCity.trim() && selectedState) {
      onChange(`${newCity}, ${selectedState}`);
    } else if (newCity.trim() && !selectedState) {
      // Si hay ciudad pero no estado, enviar solo la ciudad
      onChange(newCity);
    } else {
      // Si no hay ciudad, enviar string vacío
      onChange("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        {/* Selector de Estado */}
        <div className="relative w-1/2">
          <button
            type="button"
            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
            className={`${className} flex items-center justify-between text-left`}
          >
            <span className={selectedState ? "" : "text-gray-400"}>
              {selectedState || "Seleccionar estado"}
            </span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                isStateDropdownOpen ? "rotate-180" : ""
              }`} 
            />
          </button>
          
          {isStateDropdownOpen && (
            <div className={`absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-xl border-2 shadow-lg ${
              isDarkMode 
                ? "bg-gray-700 border-gray-600" 
                : "bg-white border-gray-200"
            }`}>
              {VENEZUELAN_STATES.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => handleStateSelect(state)}
                  className={`w-full px-4 py-2 text-left hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none ${
                    isDarkMode 
                      ? "hover:bg-gray-600 focus:bg-gray-600 text-gray-200" 
                      : "hover:bg-indigo-50 focus:bg-indigo-50 text-gray-900"
                  } ${selectedState === state ? "bg-indigo-100 font-medium" : ""}`}
                >
                  {state}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Campo de Ciudad */}
        <input
          type="text"
          value={city}
          onChange={(e) => handleCityChange(e.target.value)}
          className={`${className} w-1/2`}
          placeholder="Ciudad o municipio"
          maxLength={100}
        />
      </div>

      {/* Vista previa del resultado */}
      {(city || selectedState) && (
        <div className={`text-xs p-2 rounded-lg ${
          isDarkMode 
            ? "bg-gray-800 text-gray-400" 
            : "bg-gray-50 text-gray-600"
        }`}>
          <strong>Ubicación:</strong> {
            city && selectedState 
              ? `${city}, ${selectedState}` 
              : city 
                ? `${city} (selecciona un estado)` 
                : `(escribe tu ciudad) ${selectedState}`
          }
        </div>
      )}
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  tooltip?: string;
}> = ({ label, required, error, success, icon, children, tooltip }) => {
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
            ?
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
      {error && <p className={`text-sm text-red-500 mt-1 flex items-center`}>
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </p>}
      {success && !error && (
        <p className="text-sm text-green-500 mt-1 flex items-center">
          <Check className="w-4 h-4 mr-1" />
          ¡Perfecto!
        </p>
      )}
    </div>
  );
};

const Step4_ContactInfo: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
  phoneCodes,
}) => {
  const { isDarkMode } = useDarkMode();
  const [validationState, setValidationState] = useState<{[key: string]: boolean}>({});
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [phoneFormatted, setPhoneFormatted] = useState("");

  // Validación en tiempo real
  const validateField = (field: string, value: string): boolean => {
    switch (field) {
      case "sellerContact.name":
        return value.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
      case "sellerContact.email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "sellerContact.phone":
        const phoneNumber = value.split(" ")[1] || "";
        return phoneNumber.length >= 7 && /^\d+$/.test(phoneNumber);
      case "location":
        return value.length >= 5 && value.includes(","); // Requiere ciudad y estado
      default:
        return false;
    }
  };

  // Actualizar estado de validación cuando cambien los datos
  useEffect(() => {
    const newValidationState: {[key: string]: boolean} = {};
    
    if (formData.sellerContact?.name) {
      newValidationState["sellerContact.name"] = validateField("sellerContact.name", formData.sellerContact.name);
    }
    if (formData.sellerContact?.email) {
      newValidationState["sellerContact.email"] = validateField("sellerContact.email", formData.sellerContact.email);
    }
    if (formData.sellerContact?.phone) {
      newValidationState["sellerContact.phone"] = validateField("sellerContact.phone", formData.sellerContact.phone);
    }
    if (formData.location) {
      newValidationState["location"] = validateField("location", formData.location);
    }

    setValidationState(newValidationState);
  }, [formData.sellerContact?.name, formData.sellerContact?.email, formData.sellerContact?.phone, formData.location]);

  // Formatear teléfono para mostrar
  useEffect(() => {
    if (formData.sellerContact?.phone) {
      const parts = formData.sellerContact.phone.split(" ");
      const code = parts[0] || "";
      const number = parts[1] || "";
      
      // Formatear número con guiones
      const formatted = number.replace(/(\d{3})(\d{4})/, "$1-$2");
      setPhoneFormatted(`${code} ${formatted}`);
    }
  }, [formData.sellerContact?.phone]);

  const inputBaseClass = `w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${
    isDarkMode
      ? "bg-gray-700 border-gray-600 text-gray-200"
      : "bg-white border-gray-200 text-gray-900"
  }`;

  const getInputClass = (fieldName: string) => {
    const hasError = errors[fieldName];
    const isValid = validationState[fieldName] && !hasError;
    
    let borderColor = isDarkMode ? "border-gray-600" : "border-gray-200";
    
    if (hasError) {
      borderColor = "border-red-400";
    } else if (isValid) {
      borderColor = "border-green-400";
    }
    
    return `${inputBaseClass} ${borderColor}`;
  };

  // Memoizar el manejador de cambio de teléfono
  const handlePhoneChange = useCallback((value: string) => {
    const code = formData.sellerContact?.phone?.split(" ")[0] || phoneCodes[0];
    const cleanNumber = value.replace(/\D/g, "").slice(0, 7); // Limitamos a 7 dígitos
    handleInputChange("sellerContact.phone", `${code} ${cleanNumber}`);
  }, [formData.sellerContact?.phone, phoneCodes, handleInputChange]);

  const handlePhoneCodeChange = useCallback((code: string) => {
    const numberPart = formData.sellerContact?.phone?.split(" ")[1] || "";
    handleInputChange("sellerContact.phone", `${code} ${numberPart}`);
  }, [formData.sellerContact?.phone, handleInputChange]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 rounded-xl shadow-lg ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-600 to-gray-700"
              : "bg-gradient-to-br from-indigo-500 to-indigo-600"
          }`}>
            <User className={`w-6 h-6 ${isDarkMode ? "text-gray-200" : "text-white"}`} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}>
              Información de Contacto
            </h2>
            <p className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Datos para que los compradores te contacten de forma segura
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${Object.values(validationState).filter(Boolean).length * 25}%` 
            }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        <InputField
          label="Nombre Completo"
          required
          error={errors["sellerContact.name"]}
          success={validationState["sellerContact.name"]}
          icon={<User className="w-4 h-4 text-indigo-600" />}
          tooltip="Usa tu nombre real para generar confianza"
        >
          <input
            type="text"
            value={formData.sellerContact?.name || ""}
            onChange={(e) => handleInputChange("sellerContact.name", e.target.value)}
            className={getInputClass("sellerContact.name")}
            placeholder="Ej: Juan Carlos Pérez"
            maxLength={100}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.sellerContact?.name?.length || 0}/100 caracteres
          </div>
        </InputField>

        <InputField
          label="Correo Electrónico"
          required
          error={errors["sellerContact.email"]}
          success={validationState["sellerContact.email"]}
          icon={<Mail className="w-4 h-4 text-indigo-600" />}
          tooltip="Recibirás notificaciones de interesados aquí"
        >
          <div className="relative">
            <input
              type="email"
              value={formData.sellerContact?.email || ""}
              onChange={(e) => handleInputChange("sellerContact.email", e.target.value)}
              className={getInputClass("sellerContact.email")}
              placeholder="Ej: juan.perez@email.com"
              maxLength={255}
            />
            {formData.sellerContact?.email && (
              <button
                type="button"
                onClick={() => setShowEmailPreview(!showEmailPreview)}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1"
              >
                {showEmailPreview ? 
                  <EyeOff className="w-4 h-4 text-gray-400" /> : 
                  <Eye className="w-4 h-4 text-gray-400" />
                }
              </button>
            )}
          </div>
          {showEmailPreview && formData.sellerContact?.email && (
            <div className={`text-xs p-2 rounded mt-2 ${
              isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
            }`}>
              Vista previa: Los compradores verán este email para contactarte
            </div>
          )}
        </InputField>

        <InputField
          label="Teléfono"
          required
          error={errors["sellerContact.phone"]}
          success={validationState["sellerContact.phone"]}
          icon={<Phone className="w-4 h-4 text-indigo-600" />}
          tooltip="Preferiblemente WhatsApp para contacto directo"
        >
          <div className="flex space-x-2">
            <select
              value={formData.sellerContact?.phone?.split(" ")[0] || phoneCodes[0]}
              onChange={(e) => handlePhoneCodeChange(e.target.value)}
              className={`w-1/4 px-3 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              {phoneCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              pattern="[0-9]*"
              maxLength={7}
              value={formData.sellerContact?.phone?.split(" ")[1] || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-3/4 ${getInputClass("sellerContact.phone")}`}
              placeholder="1234567"
            />
          </div>
          {phoneFormatted && (
            <div className={`text-xs mt-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Formato: {phoneFormatted}
            </div>
          )}
        </InputField>

        <InputField
          label="Ubicación"
          required
          error={errors.location}
          success={validationState.location}
          icon={<MapPin className="w-4 h-4 text-indigo-600" />}
          tooltip="Selecciona tu estado y especifica la ciudad"
        >
          <LocationSelector
            value={formData.location || ""}
            onChange={(value) => handleInputChange("location", value)}
            className={getInputClass("location")}
            isDarkMode={isDarkMode}
          />
          <div className="text-xs text-gray-500 mt-1">
            Formato: Ciudad, Estado
          </div>
        </InputField>

        {/* Información adicional */}
        <div className={`mt-8 p-4 rounded-xl ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"
        } border`}>
          <h3 className={`font-semibold mb-2 ${
            isDarkMode ? "text-gray-200" : "text-blue-900"
          }`}>
            💡 Consejos para un mejor contacto:
          </h3>
          <ul className={`text-sm space-y-1 ${
            isDarkMode ? "text-gray-400" : "text-blue-700"
          }`}>
            <li>• Mantén tu teléfono disponible para WhatsApp</li>
            <li>• Responde rápido a los mensajes para generar confianza</li>
            <li>• Sé específico con tu ubicación para facilitar visitas</li>
            <li>• Usa un email que revises frecuentemente</li>
          </ul>
        </div>

        {/* Resumen de completitud */}
        <div className={`mt-6 p-4 rounded-xl ${
          Object.values(validationState).filter(Boolean).length === 4
            ? (isDarkMode ? "bg-green-900/20 border-green-700" : "bg-green-50 border-green-200")
            : (isDarkMode ? "bg-orange-900/20 border-orange-700" : "bg-orange-50 border-orange-200")
        } border`}>
          <div className="flex items-center space-x-2">
            {Object.values(validationState).filter(Boolean).length === 4 ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            <span className={`font-medium ${
              Object.values(validationState).filter(Boolean).length === 4
                ? "text-green-700"
                : "text-orange-700"
            }`}>
              {Object.values(validationState).filter(Boolean).length === 4
                ? "¡Información de contacto completa!"
                : `Completa ${4 - Object.values(validationState).filter(Boolean).length} campos más`
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4_ContactInfo;