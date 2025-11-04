// ============================================
// src/components/features/admin/VehicleEditForm/ContactSection.tsx
// ============================================
"use client";

import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/shared/forms/SelectField";
import { VehicleDataBackend } from "@/types/types";
import { FieldWrapper } from "./FieldWrapper";
import { useEffect, useState, useMemo } from "react";

// ✅ 1. Añadimos la lógica de validación directamente en este componente
const VALIDATION_CONFIG = {
  phone: {
    exactLength: 7,
  },
  location: {
    cityMinLength: 4,
    cityMaxLength: 100,
  },
};

const validatePhone = (
  phoneCode?: string,
  phoneNumber?: string
): { isValid: boolean; error?: string } => {
  if (!phoneCode || !phoneNumber) return { isValid: false };

  if (phoneNumber.length !== VALIDATION_CONFIG.phone.exactLength) {
    return {
      isValid: false,
      error: `El teléfono debe tener ${VALIDATION_CONFIG.phone.exactLength} dígitos`,
    };
  }
  if (!/^\d+$/.test(phoneNumber)) {
    return { isValid: false, error: "El teléfono solo debe contener números" };
  }
  return { isValid: true };
};

const validateLocation = (
  location?: string
): { isValid: boolean; error?: string } => {
  if (!location) return { isValid: false };
  const parts = location.split(",");
  if (parts.length < 2 || !parts[0].trim() || !parts[1].trim()) {
    return { isValid: false, error: "Debes especificar ciudad y estado" };
  }

  const city = parts[0].trim();
  if (city.length < VALIDATION_CONFIG.location.cityMinLength) {
    return {
      isValid: false,
      error: `La ciudad debe tener al menos ${VALIDATION_CONFIG.location.cityMinLength} caracteres`,
    };
  }
  return { isValid: true };
};

interface ContactSectionProps {
  formData: Partial<VehicleDataBackend>;
  handleChange: (field: string, value: any) => void;
  handleNestedChange: (parent: string, field: string, value: any) => void;
  getInputClassName: (field: string) => string;
  isFieldValid: (field: string) => boolean;
  getFieldError: (field: string) => string | undefined;
}

const PHONE_CODES = [
  { value: "+58 412", label: "+58 412 (Digitel)" },
  { value: "+58 414", label: "+58 414 (Movilnet)" },
  { value: "+58 424", label: "+58 424 (Movistar)" },
  { value: "+58 416", label: "+58 416 (Movistar)" },
  { value: "+58 426", label: "+58 426 (Movistar)" },
];

// Estados de Venezuela
const ESTADOS_VENEZUELA = [
  "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo",
  "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón", "Guárico", "Lara",
  "Mérida", "Miranda", "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira",
  "Trujillo", "Vargas", "Yaracuy", "Zulia"
];

export function ContactSection({
  formData,
  handleChange,
  handleNestedChange,
  getInputClassName,
  isFieldValid,
  getFieldError,
}: ContactSectionProps) {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    if (formData.location) {
      // ✅ CORRECCIÓN: No usar trim() en la ciudad para permitir espacios
      const locationParts = formData.location.split(",");
      setCity(locationParts[0] || "");
      setState(locationParts.length > 1 ? locationParts[1].trim() : "");
    }
  }, [formData.location]);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = e.target.value;
    setCity(newCity);
    handleChange("location", `${newCity}, ${state}`);
  };

  const handleStateChange = (newState: string) => {
    setState(newState);
    handleChange("location", `${city}, ${newState}`);
  };

  // ✅ 2. Usamos useMemo para una validación local e instantánea
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
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
        Información de Contacto
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldWrapper
          label="Nombre del Vendedor"
          field="sellerContact.name"
          required
          error={getFieldError("sellerContact.name")}
          isValid={isFieldValid("sellerContact.name")}
        >
          <Input
            id="sellerContact.name"
            value={formData.sellerContact?.name || ""}
            onChange={(e) =>
              handleNestedChange("sellerContact", "name", e.target.value)
            }
            className={getInputClassName("sellerContact.name")}
            placeholder="Ej: Juan Pérez"
            maxLength={100}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Email"
          field="sellerContact.email"
          required
          error={getFieldError("sellerContact.email")}
          isValid={isFieldValid("sellerContact.email")}
        >
          <Input
            id="sellerContact.email"
            type="email"
            value={formData.sellerContact?.email || ""}
            onChange={(e) =>
              handleNestedChange("sellerContact", "email", e.target.value)
            }
            className={getInputClassName("sellerContact.email")}
            placeholder="Ej: juan@ejemplo.com"
            maxLength={255}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Código de Área"
          field="sellerContact.phoneCode"
          required
          // ✅ 3. Usamos nuestra validación local
          error={phoneValidation.error}
          isValid={phoneValidation.isValid}
        >
          <SelectField
            value={(formData.sellerContact as any)?.phoneCode || ""}
            onValueChange={(value) =>
              handleNestedChange("sellerContact", "phoneCode", value)
            }
            options={PHONE_CODES}
            placeholder="Selecciona el código"
            className={getInputClassName("sellerContact.phoneCode")}
            disabled={false}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Número de Teléfono"
          field="sellerContact.phoneNumber"
          required
          tooltip="7 dígitos"
          // ✅ 3. Usamos nuestra validación local
          error={phoneValidation.error}
          isValid={phoneValidation.isValid}
        >
          <Input
            id="sellerContact.phoneNumber"
            type="tel"
            value={(formData.sellerContact as any)?.phoneNumber || ""}
            onChange={(e) =>
              handleNestedChange(
                "sellerContact",
                "phoneNumber",
                e.target.value.replace(/\D/g, "")
              )
            }
            className={getInputClassName("sellerContact.phoneNumber")}
            placeholder="1234567"
            maxLength={7}
          />
        </FieldWrapper>

        {/* CAMPOS SEPARADOS PARA UBICACIÓN */}
        <FieldWrapper
          label="Ciudad / Municipio"
          field="location"
          required
          tooltip="Mínimo 4 caracteres"
          // ✅ 3. Usamos nuestra validación local
          error={locationValidation.error}
          isValid={locationValidation.isValid}
        >
          <Input
            id="city"
            value={city}
            onChange={handleCityChange}
            className={getInputClassName("location")}
            placeholder="Ej: Caracas, Maturín, Valencia"
            maxLength={100}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Estado"
          field="location"
          required
          // ✅ 3. Usamos nuestra validación local
          error={locationValidation.error}
          isValid={locationValidation.isValid}
        >
          <SelectField
            value={state}
            onValueChange={handleStateChange}
            options={ESTADOS_VENEZUELA.map((estado) => ({
              value: estado,
              label: estado,
            }))}
            placeholder="Selecciona el estado"
            className={getInputClassName("location")}
            disabled={false}
          />
        </FieldWrapper>
      </div>
    </div>
  );
}