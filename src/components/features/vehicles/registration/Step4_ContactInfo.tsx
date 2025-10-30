// src/components/features/vehicles/registration/Step4_ContactInfo.tsx
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

// Componente de Ubicación (Estilizado)
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

  const capitalizeWords = (input: string) => {
    if (!input) return "";
    return input
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  React.useEffect(() => {
    const parts = value.split(", ");
    const currentCity = parts[0] || "";
    const currentState = parts.slice(1).join(", ").trim();
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

  const handleCityBlur = () => {
    const formattedCity = capitalizeWords(city);
    if (formattedCity !== city) {
      setCity(formattedCity);
      onChange(`${formattedCity}, ${selectedState}`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <div className="relative w-1/2">
          <button
            type="button"
            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
            // ESTILO ACTUALIZADO: Botón del dropdown con estilo de tema.
            className={`${className} flex items-center justify-between text-left appearance-none`}
          >
            <span className={selectedState ? "" : "text-muted-foreground"}>
              {selectedState || "Seleccionar estado"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 text-muted-foreground ${
                isStateDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isStateDropdownOpen && (
            // ESTILO ACTUALIZADO: Dropdown con colores de tema.
            <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-xl border-2 shadow-lg bg-popover text-popover-foreground border-border">
              {VENEZUELAN_STATES.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => handleStateSelect(state)}
                  className={`w-full px-4 py-2 text-left focus:outline-none transition-colors duration-150 hover:bg-accent focus:bg-accent ${
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
          onBlur={handleCityBlur}
          className={`${className} w-1/2`}
          placeholder="Ciudad o municipio"
          maxLength={100}
        />
      </div>

      {(city || selectedState) && (
        // ESTILO ACTUALIZADO: Vista previa con colores de tema.
        <div className="text-xs p-2 rounded-lg bg-muted text-muted-foreground">
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

  // ESTILO ACTUALIZADO: Clase base para inputs, consistente con los pasos anteriores.
  const inputClass = "w-full rounded-xl border-2 border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 pl-4 pr-10 py-4 text-base";

  return (
    // ESTILO ACTUALIZADO: Añadida animación de entrada y espaciado consistente.
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          {/* ESTILO ACTUALIZADO: Icono con colores de tema. */}
          <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-primary to-accent">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            {/* ESTILO ACTUALIZADO: Título con fuente de encabezado. */}
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Información de Contacto
            </h2>
            <p className="text-sm text-muted-foreground">
              Datos para que los compradores te contacten de forma segura
            </p>
          </div>
        </div>

        {/* ESTILO ACTUALIZADO: Barra de progreso con colores de tema. */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              Progreso del formulario
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
      </div>

      <div className="space-y-6">
        <InputField
          label="Nombre Completo"
          required
          error={errors["sellerContact.name"]}
          success={nameValidation.isValid}
          // ESTILO ACTUALIZADO: Icono con color primario.
          icon={<User className="w-4 h-4 text-primary" />}
          tooltip="Usa tu nombre real para generar confianza"
          tips={[
            "✅ Mínimo 2 caracteres",
            "✅ Solo letras y espacios",
            "❌ Sin caracteres especiales",
          ]}
        >
          <input
            type="text"
            value={formData.sellerContact?.name || ""}
            onChange={(e) =>
              handleInputChange("sellerContact.name", e.target.value || undefined)
            }
            // ESTILO ACTUALIZADO: Uso de la clase base para inputs.
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
          // ESTILO ACTUALIZADO: Icono con color primario.
          icon={<Mail className="w-4 h-4 text-primary" />}
          tooltip="Recibirás notificaciones de interesados aquí"
          tips={[
            "✅ Formato: nombre@dominio.com",
            "✅ Recibirás notificaciones aquí",
          ]}
        >
          <div className="relative">
            <input
              type="email"
              value={formData.sellerContact?.email || ""}
              onChange={(e) =>
                handleInputChange(
                  "sellerContact.email",
                  e.target.value || undefined
                )
              }
              // ESTILO ACTUALIZADO: Uso de la clase base para inputs.
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
            // ESTILO ACTUALIZADO: Vista previa con colores de tema.
            <div className="text-xs p-2 rounded mt-2 bg-muted text-muted-foreground">
              Vista previa: Los compradores verán este email para contactarte
            </div>
          )}
        </InputField>

        <InputField
          label="Teléfono"
          required
          error={errors["sellerContact.phone"]}
          success={phoneValidation.isValid}
          // ESTILO ACTUALIZADO: Icono con color primario.
          icon={<Phone className="w-4 h-4 text-primary" />}
          tooltip="Preferiblemente WhatsApp para contacto directo"
          tips={[
            "✅ El número debe tener 7 dígitos",
            "✅ Código de área + número",
            "✅ Solo números",
            "✅ Ejemplo: 0414 1234567",
          ]}
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
              // ESTILO ACTUALIZADO: Uso de la clase base para inputs.
              className={`w-1/3 ${inputClass} ${phoneValidation.getBorderClassName()}`}
              placeholder="Código"
            />
            <input
              type="tel"
              pattern="[0-9]*"
              maxLength={7}
              value={formData.sellerContact?.phone?.split(" ")[1] || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              // ESTILO ACTUALIZADO: Uso de la clase base para inputs.
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
          // ESTILO ACTUALIZADO: Icono con color primario.
          icon={<MapPin className="w-4 h-4 text-primary" />}
          tooltip="Selecciona tu estado y especifica la ciudad"
          tips={[
            "✅ Ciudad mín. 4 caracteres",
            "✅ Formato: Ciudad, Estado",
            "✅ Ejemplo: Caracas, Distrito Capital",
          ]}
        >
          <LocationSelector
            value={formData.location || ""}
            onChange={(value) => handleInputChange("location", value || undefined)}
            // ESTILO ACTUALIZADO: Uso de la clase base para inputs.
            className={`${inputClass} ${locationValidation.getBorderClassName()}`}
          />
          <div className="text-xs text-muted-foreground mt-1">
            Formato: Ciudad, Estado
          </div>
        </InputField>

        {/* ESTILO ACTUALIZADO: Tarjeta de consejos con colores de tema. */}
        <div className="mt-8 p-4 rounded-xl border bg-card shadow-sm">
          <h3 className="font-semibold mb-2 text-foreground flex items-center">
            <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
            💡 Consejos para un mejor contacto:
          </h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Mantén tu teléfono disponible para WhatsApp</li>
            <li>• Responde rápido a los mensajes para generar confianza</li>
            <li>• Sé específico con tu ubicación para facilitar visitas</li>
            <li>• Usa un email que revises frecuentemente</li>
          </ul>
        </div>

        {/* ESTILO ACTUALIZADO: Tarjeta de estado con colores de tema. */}
        <div className={`mt-6 p-4 rounded-xl border bg-card shadow-sm ${
          isComplete ? 'border-green-600/50' : 'border-destructive/50'
        }`}>
          <div className="flex items-center space-x-2">
            {isComplete ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive" />
            )}
            <span className={`font-medium text-foreground`}>
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