// src/components/features/admin/VehicleEditForm/ContactSection.tsx
"use client";

import { Input } from "@/components/ui/input";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { VehicleDataBackend } from "@/types/types";
import { useCallback, useEffect, useState, useMemo } from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";

// Helper function to capitalize each word in a string
const capitalizeWords = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");
};

// --- Lógica de validación y constantes ---
const VALIDATION_CONFIG = {
  phone: { exactLength: 7 },
  location: { cityMinLength: 4, cityMaxLength: 100 },
};

const validatePhone = (
  phoneCode?: string,
  phoneNumber?: string
): { isValid: boolean; error?: string } => {
  if (!phoneCode || !phoneNumber) return { isValid: false };
  if (phoneNumber.length !== VALIDATION_CONFIG.phone.exactLength)
    return {
      isValid: false,
      error: `El teléfono debe tener ${VALIDATION_CONFIG.phone.exactLength} dígitos`,
    };
  if (!/^\d+$/.test(phoneNumber))
    return { isValid: false, error: "El teléfono solo debe contener números" };
  return { isValid: true };
};

const validateLocation = (
  location?: string
): { isValid: boolean; error?: string } => {
  if (!location) return { isValid: false };
  const parts = location.split(",");
  if (parts.length < 2 || !parts[0].trim() || !parts[1].trim())
    return { isValid: false, error: "Debes especificar ciudad y estado" };
  const city = parts[0].trim();
  if (city.length < VALIDATION_CONFIG.location.cityMinLength)
    return {
      isValid: false,
      error: `La ciudad debe tener al menos ${VALIDATION_CONFIG.location.cityMinLength} caracteres`,
    };
  return { isValid: true };
};

const PHONE_CODES = [
  { value: "+58 412", label: "+58 412 (Digitel)" },
  { value: "+58 414", label: "+58 414 (Movilnet)" },
  { value: "+58 424", label: "+58 424 (Movistar)" },
  { value: "+58 416", label: "+58 416 (Movistar)" },
  { value: "+58 426", label: "+58 426 (Movistar)" },
];

const ESTADOS_VENEZUELA = [
  "Amazonas",
  "Anzoátegui",
  "Apure",
  "Aragua",
  "Barinas",
  "Bolívar",
  "Carabobo",
  "Cojedes",
  "Delta Amacuro",
  "Distrito Capital",
  "Falcón",
  "Guárico",
  "Lara",
  "Mérida",
  "Miranda",
  "Monagas",
  "Nueva Esparta",
  "Portuguesa",
  "Sucre",
  "Táchira",
  "Trujillo",
  "Vargas",
  "Yaracuy",
  "Zulia",
];

interface ContactSectionProps {
  formData: Partial<VehicleDataBackend>;
  handleChange: (field: string, value: any) => void;
  handleNestedChange: (parent: string, field: string, value: any) => void;
  handleBlur: (field: string) => void;
  getInputClassName: (field: string) => string;
  isFieldValid: (field: string) => boolean;
  getFieldError: (field: string) => string | undefined;
  isSubmitting: boolean;
}

export function ContactSection({
  formData,
  handleChange,
  handleNestedChange,
  handleBlur,
  getInputClassName,
  isFieldValid,
  getFieldError,
  isSubmitting,
}: ContactSectionProps) {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    if (formData.location) {
      const locationParts = formData.location.split(",");
      setCity(locationParts[0] || "");
      setState(locationParts.length > 1 ? locationParts[1].trim() : "");
    }
  }, [formData.location]);

  // --- Manejadores de eventos ---
  const handleNameChange = useCallback(
    (value: string) => handleNestedChange("sellerContact", "name", value),
    [handleNestedChange]
  );

  const handleEmailChange = useCallback(
    (value: string) => handleNestedChange("sellerContact", "email", value),
    [handleNestedChange]
  );

  const handlePhoneCodeChange = useCallback(
    (value: string) => handleNestedChange("sellerContact", "phoneCode", value),
    [handleNestedChange]
  );

  const handlePhoneNumberChange = useCallback(
    (value: string) =>
      handleNestedChange(
        "sellerContact",
        "phoneNumber",
        value.replace(/\D/g, "")
      ),
    [handleNestedChange]
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCity = e.target.value;
      setCity(newCity);
      handleChange("location", `${newCity}, ${state}`);
    },
    [handleChange, state]
  );

  const handleStateChange = useCallback(
    (newState: string) => {
      setState(newState);
      handleChange("location", `${city}, ${newState}`);
    },
    [handleChange, city]
  );

  // --- Validación local ---
  const phoneValidation = useMemo(() => {
    const phoneCode = (formData.sellerContact as any)?.phoneCode;
    const phoneNumber = (formData.sellerContact as any)?.phoneNumber;
    return validatePhone(phoneCode, phoneNumber);
  }, [formData.sellerContact]);

  const locationValidation = useMemo(
    () => validateLocation(formData.location),
    [formData.location]
  );

  return (
    <div className="card-premium p-6 space-y-6 animate-fade-in">
      {/* Header de sección */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-accent/10">
          <User className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Información de Contacto
          </h3>
          <p className="text-sm text-muted-foreground">
            Datos del vendedor para contacto directo
          </p>
        </div>
      </div>

      {/* Grid de campos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Nombre del Vendedor */}
        <InputField
          label="Nombre del Vendedor"
          required
          error={getFieldError("sellerContact.name")}
          success={isFieldValid("sellerContact.name")}
          icon={<User className="w-4 h-4" />}
        >
          <Input
            id="sellerContact.name"
            value={formData.sellerContact?.name || ""}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={(e) => {
              const capitalized = capitalizeWords(e.target.value);
              if (formData.sellerContact?.name !== capitalized) {
                handleNameChange(capitalized);
              }
              handleBlur("sellerContact.name");
            }}
            className={`input-premium ${getInputClassName("sellerContact.name")}`}
            placeholder="Ej: Juan Pérez"
            maxLength={100}
            disabled={isSubmitting}
          />
        </InputField>

        {/* Email */}
        <InputField
          label="Email"
          required
          error={getFieldError("sellerContact.email")}
          success={isFieldValid("sellerContact.email")}
          icon={<Mail className="w-4 h-4" />}
        >
          <Input
            id="sellerContact.email"
            type="email"
            value={formData.sellerContact?.email || ""}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={() => handleBlur("sellerContact.email")}
            className={`input-premium ${getInputClassName("sellerContact.email")}`}
            placeholder="ejemplo@correo.com"
            maxLength={255}
            disabled={isSubmitting}
          />
        </InputField>

        {/* Código de Área */}
        <InputField
          label="Código de Área"
          required
          error={phoneValidation.error}
          success={phoneValidation.isValid}
          icon={<Phone className="w-4 h-4" />}
        >
          <SelectField
            value={(formData.sellerContact as any)?.phoneCode || ""}
            onValueChange={handlePhoneCodeChange}
            onBlur={() => handleBlur("sellerContact.phoneCode")}
            options={PHONE_CODES}
            placeholder="Selecciona código"
            className={getInputClassName("sellerContact.phoneCode")}
            disabled={isSubmitting}
          />
        </InputField>

        {/* Número de Teléfono */}
        <InputField
          label="Número de Teléfono"
          required
          tooltip="7 dígitos"
          error={phoneValidation.error}
          success={phoneValidation.isValid}
          icon={<Phone className="w-4 h-4" />}
        >
          <Input
            id="sellerContact.phoneNumber"
            type="tel"
            value={(formData.sellerContact as any)?.phoneNumber || ""}
            onChange={(e) => handlePhoneNumberChange(e.target.value)}
            onBlur={() => handleBlur("sellerContact.phoneNumber")}
            className={`input-premium ${getInputClassName("sellerContact.phoneNumber")}`}
            placeholder="1234567"
            maxLength={7}
            disabled={isSubmitting}
          />
        </InputField>

        {/* Ciudad */}
        <InputField
          label="Ciudad / Municipio"
          required
          tooltip="Mínimo 4 caracteres"
          error={locationValidation.error}
          success={locationValidation.isValid}
          icon={<MapPin className="w-4 h-4" />}
        >
          <Input
            id="city"
            value={city}
            onChange={handleCityChange}
            onBlur={(e) => {
              const capitalizedCity = capitalizeWords(e.target.value);
              setCity(capitalizedCity);
              handleChange("location", `${capitalizedCity}, ${state}`);
              handleBlur("location");
            }}
            className={`input-premium ${getInputClassName("location")}`}
            placeholder="Ej: Caracas, Valencia"
            maxLength={100}
            disabled={isSubmitting}
          />
        </InputField>

        {/* Estado */}
        <InputField
          label="Estado"
          required
          error={locationValidation.error}
          success={locationValidation.isValid}
          icon={<MapPin className="w-4 h-4" />}
        >
          <SelectField
            value={state}
            onValueChange={handleStateChange}
            onBlur={() => handleBlur("location")}
            options={ESTADOS_VENEZUELA.map((estado) => ({
              value: estado,
              label: estado,
            }))}
            placeholder="Selecciona estado"
            className={getInputClassName("location")}
            disabled={isSubmitting}
          />
        </InputField>
      </div>

      {/* Badge informativo */}
      <div className="flex items-center gap-2 pt-4 border-t border-border">
        <div className="badge-accent">
          <Phone className="w-3 h-3 mr-1" />
          Contacto Verificado
        </div>
        <div className="badge-success">
          <MapPin className="w-3 h-3 mr-1" />
          Venezuela
        </div>
      </div>
    </div>
  );
}