//src/components/features/vehicles/registration/Step4_ContactInfo.tsx
"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { VehicleDataBackend, FormErrors } from "@/types/types";
import { VENEZUELAN_STATES } from "@/constants/form-constants";
import { InputField } from "@/components/shared/forms/InputField";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { Progress } from "@/components/ui/progress";
import { SelectField } from "@/components/shared/forms/SelectField";

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: string | undefined) => void;
  phoneCodes: string[];
}

const LocationSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  className: string;
}> = ({ value, onChange, className }) => {
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);

  // Función para capitalizar el nombre del estado. Ej: "nueva-esparta" -> "Nueva Esparta"
  const capitalizeState = (state: string) => {
    if (!state) return "";
    return state
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  React.useEffect(() => {
    const [currentCity = "", currentState = ""] = value
      .split(", ")
      .map((s) => s.trim());
    setCity(currentCity);
    setSelectedState(currentState);
  }, [value]);

  const handleStateSelect = (state: string) => {
    const formattedState = capitalizeState(state);
    setSelectedState(formattedState);
    setIsStateDropdownOpen(false);
    onChange(`${city}, ${formattedState}`);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = e.target.value;
    setCity(newCity);
    onChange(`${newCity}, ${selectedState}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <div className="relative w-1/2">
          <button
            type="button"
            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
            className={`${className} flex items-center justify-between text-left`}
          >
            <span className={selectedState ? "" : "text-muted-foreground"}>
              {selectedState || "Seleccionar estado"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isStateDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isStateDropdownOpen && (
            <div
              className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-xl border-2 shadow-lg bg-background border-border"
            >
              {VENEZUELAN_STATES.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => handleStateSelect(state)}
                  className={`w-full px-4 py-2 text-left focus:outline-none transition-colors duration-150 text-foreground hover:bg-accent focus:bg-accent ${
                    selectedState === capitalizeState(state)
                      ? "bg-accent font-medium"
                      : ""
                  }`}
                >
                  {capitalizeState(state)}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          className={`${className} w-1/2`}
          placeholder="Ciudad o municipio"
          maxLength={100}
        />
      </div>

      {(city || selectedState) && (
        <div
          className="text-xs p-2 rounded-lg bg-muted text-muted-foreground"
        >
          <strong>Ubicación:</strong>{" "}
          {city && selectedState
            ? `${city}, ${selectedState}`
            : city
            ? `${city} (selecciona un estado)`
            : `(escribe tu ciudad) ${selectedState}`}
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
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const nameValidation = useFieldValidation(
    formData.sellerContact?.name,
    errors["sellerContact.name"]
  );
  const emailValidation = useFieldValidation(
    formData.sellerContact?.email,
    errors["sellerContact.email"]
  );
  const phoneValidation = useFieldValidation(
    formData.sellerContact?.phone,
    errors["sellerContact.phone"]
  );
  const locationValidation = useFieldValidation(
    formData.location,
    errors.location
  );

  const phoneFormatted = useMemo(() => {
    if (formData.sellerContact?.phone) {
      const parts = formData.sellerContact.phone.split(" ");
      const code = parts[0] || "";
      const number = parts[1] || "";
      const formatted = number.replace(/(\d{3})(\d{4})/, "$1-$2");
      return `${code} ${formatted}`;
    }
    return "";
  }, [formData.sellerContact?.phone]);

  const handlePhoneChange = useCallback(
    (value: string) => {
      const code = formData.sellerContact?.phone?.split(" ")[0] || phoneCodes[0];
      const cleanNumber = value.replace(/\D/g, "").slice(0, 7);
      handleInputChange("sellerContact.phone", `${code} ${cleanNumber}`);
    },
    [formData.sellerContact?.phone, phoneCodes, handleInputChange]
  );

  const handlePhoneCodeChange = useCallback(
    (code: string) => {
      const numberPart = formData.sellerContact?.phone?.split(" ")[1] || "";
      handleInputChange("sellerContact.phone", `${code} ${numberPart}`);
    },
    [formData.sellerContact?.phone, handleInputChange]
  );

  const { progressPercentage, isComplete } = useMemo(() => {
    const fields = [
      nameValidation.isValid,
      emailValidation.isValid,
      phoneValidation.isValid,
      locationValidation.isValid,
    ];
    const completedCount = fields.filter((v) => v === true).length;
    const progress = (completedCount / fields.length) * 100;
    return { progressPercentage: progress, isComplete: progress === 100 };
  }, [nameValidation, emailValidation, phoneValidation, locationValidation]);

  const inputClass = `w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 bg-background text-foreground placeholder-muted-foreground`;

  return (
    <div className="max-w-2xl mx-auto text-foreground">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div
            className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600"
          >
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Información de Contacto
            </h2>
            <p className="text-sm text-muted-foreground">
              Datos para que los compradores te contacten de forma segura
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Progreso del formulario
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} />
        </div>
      </div>

      <div className="space-y-6">
        <InputField
          label="Nombre Completo"
          required
          error={errors["sellerContact.name"]}
          success={nameValidation.isValid}
          icon={<User className="w-4 h-4 text-indigo-400" />}
          tooltip="Usa tu nombre real para generar confianza"
        >
          <input
            type="text"
            value={formData.sellerContact?.name || ""}
            onChange={(e) =>
              handleInputChange("sellerContact.name", e.target.value)
            }
            className={`${inputClass} ${nameValidation.getBorderClassName()}`}
            placeholder="Ej: Juan Carlos Pérez"
            maxLength={100}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {formData.sellerContact?.name?.length || 0}/100 caracteres
          </div>
        </InputField>

        <InputField
          label="Correo Electrónico"
          required
          error={errors["sellerContact.email"]}
          success={emailValidation.isValid}
          icon={<Mail className="w-4 h-4 text-indigo-400" />}
          tooltip="Recibirás notificaciones de interesados aquí"
        >
          <div className="relative">
            <input
              type="email"
              value={formData.sellerContact?.email || ""}
              onChange={(e) =>
                handleInputChange("sellerContact.email", e.target.value)
              }
              className={`${inputClass} ${emailValidation.getBorderClassName()}`}
              placeholder="Ej: juan.perez@email.com"
              maxLength={255}
            />
            {formData.sellerContact?.email && (
              <button
                type="button"
                onClick={() => setShowEmailPreview(!showEmailPreview)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground"
              >
                {showEmailPreview ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          {showEmailPreview && formData.sellerContact?.email && (
            <div
              className="text-xs p-2 rounded mt-2 bg-muted text-muted-foreground"
            >
              Vista previa: Los compradores verán este email para contactarte
            </div>
          )}
        </InputField>

        <InputField
          label="Teléfono"
          required
          error={errors["sellerContact.phone"]}
          success={phoneValidation.isValid}
          icon={<Phone className="w-4 h-4 text-indigo-400" />}
          tooltip="Preferiblemente WhatsApp para contacto directo"
        >
          <div className="flex space-x-2">
            <SelectField
              value={
                formData.sellerContact?.phone?.split(" ")[0] || phoneCodes[0]
              }
              onChange={handlePhoneCodeChange}
              options={phoneCodes.map((code) => ({
                value: code,
                label: code,
              }))}
              className={`w-1/3 ${inputClass} ${phoneValidation.getBorderClassName()}`}
              placeholder="Código"
            />
            <input
              type="tel"
              pattern="[0-9]*"
              maxLength={7}
              value={formData.sellerContact?.phone?.split(" ")[1] || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-2/3 ${inputClass} ${phoneValidation.getBorderClassName()}`}
              placeholder="1234567"
            />
          </div>
          {phoneFormatted && (
            <div className="text-xs mt-1 text-muted-foreground">
              Formato: {phoneFormatted}
            </div>
          )}
        </InputField>

        <InputField
          label="Ubicación"
          required
          error={errors.location}
          success={locationValidation.isValid}
          icon={<MapPin className="w-4 h-4 text-indigo-400" />}
          tooltip="Selecciona tu estado y especifica la ciudad"
        >
          <LocationSelector
            value={formData.location || ""}
            onChange={(value) => handleInputChange("location", value)}
            className={`${inputClass} ${locationValidation.getBorderClassName()}`}
          />
          <div className="text-xs text-muted-foreground mt-1">
            Formato: Ciudad, Estado
          </div>
        </InputField>

        <div
          className="mt-8 p-4 rounded-xl border bg-blue-50 border-blue-200 dark:bg-accent/20 dark:border-border"
        >
          <h3
            className="font-semibold mb-2 text-blue-900 dark:text-foreground"
          >
            💡 Consejos para un mejor contacto:
          </h3>
          <ul
            className="text-sm space-y-1 text-blue-700 dark:text-muted-foreground"
          >
            <li>• Mantén tu teléfono disponible para WhatsApp</li>
            <li>• Responde rápido a los mensajes para generar confianza</li>
            <li>• Sé específico con tu ubicación para facilitar visitas</li>
            <li>• Usa un email que revises frecuentemente</li>
          </ul>
        </div>

        <div
          className={`mt-6 p-4 rounded-xl border ${
            isComplete
              ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700"
              : "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700"
          }`}
        >
          <div className="flex items-center space-x-2">
            {isComplete ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            <span
              className={`font-medium ${
                isComplete
                  ? "text-green-700 dark:text-green-400"
                  : "text-orange-700 dark:text-orange-400"
              }`}
            >
              {isComplete
                ? "¡Información de contacto completa!"
                : `Completa los campos requeridos para continuar`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4_ContactInfo;