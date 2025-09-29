// src/components/features/vehicles/registration/Step4_ContactInfo.tsx
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { User, MapPin, Mail, Phone, Check, AlertCircle, Eye, EyeOff, ChevronDown } from "lucide-react";
import { VehicleDataBackend } from "@/types/types";
import { useDarkMode } from "@/context/DarkModeContext";
import { VENEZUELAN_STATES } from "@/constants/form-constants";
import { InputField } from "@/components/shared/forms/InputField";

interface FormErrors {
  [key: string]: string | undefined;
}

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: string) => void;
  phoneCodes: string[];
}

// Hook de validación simple para este componente
const useValidation = (value: string | undefined, rule: (val: string) => boolean) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (value === undefined || value === "") {
      setIsValid(null);
    } else {
      setIsValid(rule(value));
    }
  }, [value, rule]);

  return {
    isValid,
  };
};

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

  useEffect(() => {
    const [currentCity = "", currentState = ""] = value.split(", ").map(s => s.trim());
    setCity(currentCity);
    setSelectedState(currentState);
  }, [value]);

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setIsStateDropdownOpen(false);
    onChange(`${city}, ${state}`);
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    onChange(`${newCity}, ${selectedState}`);
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
                  className={`w-full px-4 py-2 text-left focus:outline-none transition-colors duration-150 ${
                    isDarkMode 
                      ? "text-gray-200 hover:bg-gray-600 focus:bg-gray-600" 
                      : "text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50"
                  } ${selectedState === state ? (isDarkMode ? "bg-indigo-800 font-medium" : "bg-indigo-100 font-medium") : ""}`}
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

const Step4_ContactInfo: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
  phoneCodes,
}) => {
  const { isDarkMode } = useDarkMode();
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Hooks de validación
  const nameValidation = useValidation(formData.sellerContact?.name, 
    useCallback(v => v.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v), [])
  );
  const emailValidation = useValidation(formData.sellerContact?.email, 
    useCallback(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), [])
  );
  const phoneValidation = useValidation(formData.sellerContact?.phone, 
    useCallback(v => (v.split(" ")[1] || "").length === 7 && /^\d+$/.test(v.split(" ")[1] || ""), [])
  );
  const locationValidation = useValidation(formData.location, 
    useCallback(v => v.length >= 5 && v.includes(","), [])
  );

  // Formatear teléfono para mostrar
  const phoneFormatted = useMemo(() => {
    if (formData.sellerContact?.phone) {
      const parts = formData.sellerContact.phone.split(" ");
      const code = parts[0] || "";
      const number = parts[1] || "";
      
      // Formatear número con guiones
      const formatted = number.replace(/(\d{3})(\d{4})/, "$1-$2");
      return `${code} ${formatted}`;
    }
    return "";
  }, [formData.sellerContact?.phone]);

  const inputBaseClass = `w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${
    isDarkMode
      ? "bg-gray-700 border-gray-600 text-gray-200"
      : "bg-white border-gray-200 text-gray-900"
  }`;

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

  const progress = useMemo(() => {
    const fields = [nameValidation.isValid, emailValidation.isValid, phoneValidation.isValid, locationValidation.isValid];
    // Usamos .filter(v => v === true) para ser explícitos y no contar `null`
    const completedCount = fields.filter(v => v === true).length;
    return (completedCount / fields.length) * 100;
  }, [nameValidation, emailValidation, phoneValidation, locationValidation]);


  // Componente de Progreso (estandarizado)
  const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
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
        <ProgressBar progress={progress} />
      </div>

      <div className="space-y-6">
        <InputField
          label="Nombre Completo"
          required
          error={errors["sellerContact.name"]}
          success={nameValidation.isValid === true}
          icon={<User className="w-4 h-4 text-indigo-600" />}
          tooltip="Usa tu nombre real para generar confianza"
        >
          <input
            type="text"
            value={formData.sellerContact?.name || ""}
            onChange={(e) => handleInputChange("sellerContact.name", e.target.value)}
            className={inputBaseClass}
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
          success={emailValidation.isValid === true}
          icon={<Mail className="w-4 h-4 text-indigo-600" />}
          tooltip="Recibirás notificaciones de interesados aquí"
        >
          <div className="relative">
            <input
              type="email"
              value={formData.sellerContact?.email || ""}
              onChange={(e) => handleInputChange("sellerContact.email", e.target.value)}
              className={inputBaseClass}
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
          success={phoneValidation.isValid === true}
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
              className={`w-3/4 ${inputBaseClass}`}
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
          success={locationValidation.isValid === true}
          icon={<MapPin className="w-4 h-4 text-indigo-600" />}
          tooltip="Selecciona tu estado y especifica la ciudad"
        >
          <LocationSelector
            value={formData.location || ""}
            onChange={(value) => handleInputChange("location", value)}
            className={inputBaseClass}
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
          progress === 100
            ? (isDarkMode ? "bg-green-900/20 border-green-700" : "bg-green-50 border-green-200")
            : (isDarkMode ? "bg-orange-900/20 border-orange-700" : "bg-orange-50 border-orange-200")
        } border`}>
          <div className="flex items-center space-x-2">
            {progress === 100 ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            <span className={`font-medium ${
              progress === 100
                ? "text-green-700"
                : "text-orange-700"
            }`}>
              {progress === 100
                ? "¡Información de contacto completa!"
                : `Completa ${4 - [nameValidation, emailValidation, phoneValidation, locationValidation].filter(v => v.isValid === true).length} campos más`
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4_ContactInfo;