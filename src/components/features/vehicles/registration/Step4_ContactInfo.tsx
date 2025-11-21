// src/components/features/vehicles/registration/Step4_ContactInfo.tsx
"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  User,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Info,
  MessageCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { VehicleDataBackend, FormErrors } from "@/types/types";
import { VENEZUELAN_STATES } from "@/constants/form-constants";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: string | undefined) => void;
  phoneCodes: string[];
  userSession?: {
    name?: string | null;
    email?: string | null;
  };
}

// ============================================
// CONFIGURACIÓN DE VALIDACIÓN
// ============================================
const VALIDATION_CONFIG = {
  name: {
    minLength: 4,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    tips: [
      "✅ Usa tu nombre real para generar confianza",
      "📝 Mínimo 4 caracteres, máximo 100",
      "🔤 Solo letras y espacios permitidos",
      "❌ Sin números ni caracteres especiales",
    ],
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255,
    tips: [
      "✅ Formato válido: nombre@dominio.com",
      "📧 Recibirás notificaciones de interesados aquí",
      "⚡ Usa un correo que revises frecuentemente",
      "🔒 Tu email será visible para compradores",
    ],
  },
  phone: {
    minLength: 7,
    maxLength: 7,
    pattern: /^\d+$/,
    tips: [
      "📱 El número debe tener exactamente 7 dígitos",
      "📞 Incluye el código de área (0414, 0424, etc.)",
      "🔢 Solo números, sin espacios ni guiones",
      "💬 Preferiblemente un número con WhatsApp",
    ],
  },
  location: {
    cityMinLength: 4,
    cityMaxLength: 100,
    tips: [
      "🏙️ Ciudad debe tener mínimo 4 caracteres",
      "📍 Formato: Ciudad, Estado",
      "✅ Ejemplo: Caracas, Distrito Capital",
      "🗺️ Sé específico para facilitar visitas",
    ],
  },
};

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================
const validateName = (name?: string): { isValid: boolean; error?: string } => {
  if (!name) return { isValid: false };
  if (name.length < VALIDATION_CONFIG.name.minLength)
    return {
      isValid: false,
      error: `El nombre debe tener al menos ${VALIDATION_CONFIG.name.minLength} caracteres`,
    };
  if (name.length > VALIDATION_CONFIG.name.maxLength)
    return {
      isValid: false,
      error: `El nombre no puede exceder ${VALIDATION_CONFIG.name.maxLength} caracteres`,
    };
  if (!VALIDATION_CONFIG.name.pattern.test(name))
    return { isValid: false, error: "Solo se permiten letras y espacios" };
  return { isValid: true };
};

const validateEmail = (
  email?: string
): { isValid: boolean; error?: string } => {
  if (!email) return { isValid: false };
  if (email.length > VALIDATION_CONFIG.email.maxLength)
    return {
      isValid: false,
      error: `El email no puede exceder ${VALIDATION_CONFIG.email.maxLength} caracteres`,
    };
  if (!VALIDATION_CONFIG.email.pattern.test(email))
    return { isValid: false, error: "Formato de email inválido" };
  return { isValid: true };
};

const validatePhone = (
  phone?: string
): { isValid: boolean; error?: string } => {
  if (!phone) return { isValid: false };
  const parts = phone.split(" ");
  if (parts.length < 2)
    return { isValid: false, error: "Formato de teléfono incompleto" };

  const numberPart = parts[1] || "";
  if (numberPart.length < VALIDATION_CONFIG.phone.minLength)
    return {
      isValid: false,
      error: `El teléfono debe tener exactamente ${VALIDATION_CONFIG.phone.minLength} dígitos`,
    };
  if (!VALIDATION_CONFIG.phone.pattern.test(numberPart))
    return { isValid: false, error: "Solo se permiten números" };
  return { isValid: true };
};

const validateLocation = (
  location?: string
): { isValid: boolean; error?: string } => {
  if (!location) return { isValid: false };
  const parts = location.split(", ");
  if (parts.length < 2)
    return { isValid: false, error: "Debes especificar ciudad y estado" };

  const city = parts[0] || "";
  const state = parts.slice(1).join(", ").trim();

  if (!city || !state)
    return { isValid: false, error: "Debes especificar ciudad y estado" };
  if (city.length < VALIDATION_CONFIG.location.cityMinLength)
    return {
      isValid: false,
      error: `La ciudad debe tener al menos ${VALIDATION_CONFIG.location.cityMinLength} caracteres`,
    };
  if (city.length > VALIDATION_CONFIG.location.cityMaxLength)
    return {
      isValid: false,
      error: `La ciudad no puede exceder ${VALIDATION_CONFIG.location.cityMaxLength} caracteres`,
    };
  return { isValid: true };
};

// ============================================
// SUB-COMPONENTE: Encabezado y Progreso
// ============================================
const FormHeader: React.FC<{ progress: number }> = React.memo(
  ({ progress }) => (
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl"></div>
        <div className="relative flex items-center justify-center gap-4 p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 border border-border/50 shadow-glass">
          <div className="p-4 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
              Información de Contacto
            </h2>
            <p className="text-base text-muted-foreground mt-1">
              Datos para que los compradores te contacten
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto pt-2">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-sm font-medium text-muted-foreground">
            Progreso
          </span>
          <span className="text-sm font-bold text-foreground tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} variant="glow" className="h-3 bg-muted" />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            Completando información
          </span>
          <span className="text-xs text-muted-foreground">Paso 4 de 5</span>
        </div>
      </div>
    </div>
  )
);
FormHeader.displayName = "FormHeader";

// ============================================
// SUB-COMPONENTE: Vista Previa de Contacto
// ============================================
const ContactPreviewCard: React.FC<{
  formData: Partial<VehicleDataBackend>;
}> = React.memo(({ formData }) => {
  const formatPhone = (phone?: string) => {
    if (!phone) return null;
    const parts = phone.split(" ");
    const code = parts[0] || "";
    const number = parts[1] || "";
    const formatted = number.replace(/(\d{3})(\d{4})/, "$1-$2");
    return `${code} ${formatted}`;
  };

  return (
    <Card className="card-glass border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Vista Previa del Contacto
            </h3>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {formData.sellerContact?.name && (
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Vendedor
              </span>
              <span className="font-medium text-sm text-foreground">
                {formData.sellerContact.name}
              </span>
            </div>
          )}

          {formData.sellerContact?.email && (
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email
              </span>
              <span className="font-medium text-sm text-foreground truncate max-w-[200px]">
                {formData.sellerContact.email}
              </span>
            </div>
          )}

          {formData.sellerContact?.phone && (
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                Teléfono
              </span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">
                  {formatPhone(formData.sellerContact.phone)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  WhatsApp
                </Badge>
              </div>
            </div>
          )}

          {formData.location && (
            <div className="flex justify-between items-start py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5" />
                Ubicación
              </span>
              <span className="font-medium text-sm text-foreground text-right max-w-[200px]">
                {formData.location}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
ContactPreviewCard.displayName = "ContactPreviewCard";

// ============================================
// SUB-COMPONENTE: Resumen de Completitud
// ============================================
const CompletionSummary: React.FC<{ progress: number }> = React.memo(
  ({ progress }) => {
    const isComplete = progress >= 100;
    const borderColor = isComplete
      ? "border-success/40"
      : "border-amber-500/40";
    const bgColor = isComplete
      ? "bg-success/5 dark:bg-success/5"
      : "bg-amber-500/5 dark:bg-amber-950/20";
    const iconBgColor = isComplete ? "bg-success/20" : "bg-amber-500/20";
    const textColor = isComplete
      ? "text-success"
      : "text-amber-600 dark:text-amber-400";

    return (
      <div
        className={`p-5 rounded-xl border-2 shadow-sm transition-all duration-300 ${borderColor} ${bgColor} card-hover`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${iconBgColor}`}>
              {isComplete ? (
                <CheckCircle2 className={`w-5 h-5 ${textColor}`} />
              ) : (
                <AlertCircle className={`w-5 h-5 ${textColor}`} />
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground text-base">
                {isComplete
                  ? "¡Información de contacto completa!"
                  : "Faltan algunos campos"}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isComplete
                  ? "Puedes continuar al siguiente paso"
                  : `${Math.round(progress)}% completado`}
              </p>
            </div>
          </div>
          <Badge
            variant={isComplete ? "default" : "secondary"}
            className="text-sm font-bold px-3 py-1"
          >
            {Math.round(progress)}%
          </Badge>
        </div>

        {!isComplete && (
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
CompletionSummary.displayName = "CompletionSummary";

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const Step4_ContactInfo: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
  phoneCodes,
  userSession,
}) => {
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Estados locales para manejar ciudad y estado por separado
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (userSession) {
      if (!formData.sellerContact?.name && userSession.name) {
        handleInputChange("sellerContact.name", userSession.name ?? undefined);
      }
      if (!formData.sellerContact?.email && userSession.email) {
        handleInputChange(
          "sellerContact.email",
          userSession.email ?? undefined
        );
      }
    }
  }, [userSession, formData.sellerContact, handleInputChange]);

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
    "placeholder:text-muted-foreground/60 " +
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
    "transition-all duration-200 ease-out hover:border-border/80";

  // Efecto para sincronizar los estados locales con formData.location
  useEffect(() => {
    if (formData.location) {
      const parts = formData.location.split(", ");
      const currentCity = parts[0] || "";
      const currentState = parts.slice(1).join(", ").trim();
      setCity(currentCity);
      setSelectedState(currentState);
    }
  }, [formData.location]);

  // Opciones para el SelectField de estados
  const stateOptions = useMemo(
    () =>
      VENEZUELAN_STATES.map((state) => {
        const formatted = state
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return { value: formatted, label: formatted };
      }),
    []
  );

  // Manejadores de cambio que actualizan los estados locales y el formData combinado
  const handleStateChange = useCallback(
    (newState: string) => {
      setSelectedState(newState);
      handleInputChange("location", `${city}, ${newState}`);
    },
    [city, handleInputChange]
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCity = e.target.value;
      setCity(newCity);
      handleInputChange("location", `${newCity}, ${selectedState}`);
    },
    [selectedState, handleInputChange]
  );

  const handleCityBlur = useCallback(() => {
    const formattedCity = city
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    if (formattedCity !== city) {
      setCity(formattedCity);
      handleInputChange("location", `${formattedCity}, ${selectedState}`);
    }
  }, [city, selectedState, handleInputChange]);

  // Validaciones
  const nameValidation = useMemo(
    () => validateName(formData.sellerContact?.name),
    [formData.sellerContact?.name]
  );
  const emailValidation = useMemo(
    () => validateEmail(formData.sellerContact?.email),
    [formData.sellerContact?.email]
  );
  const phoneValidation = useMemo(
    () => validatePhone(formData.sellerContact?.phone),
    [formData.sellerContact?.phone]
  );
  const locationValidation = useMemo(
    () => validateLocation(formData.location),
    [formData.location]
  );

  const nameFieldValidation = useFieldValidation(
    formData.sellerContact?.name,
    errors["sellerContact.name"]
  );
  const emailFieldValidation = useFieldValidation(
    formData.sellerContact?.email,
    errors["sellerContact.email"]
  );
  const phoneFieldValidation = useFieldValidation(
    formData.sellerContact?.phone,
    errors["sellerContact.phone"]
  );
  const locationFieldValidation = useFieldValidation(
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
      const code =
        formData.sellerContact?.phone?.split(" ")[0] || phoneCodes[0];
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

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <FormHeader progress={progressPercentage} />

      <div className="space-y-7">
        {/* NOMBRE Y EMAIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Nombre Completo"
            required
            error={errors["sellerContact.name"]}
            success={nameValidation.isValid}
            icon={<User className="w-4 h-4 text-primary" />}
            tooltip="Usa tu nombre real para generar confianza con los compradores"
            tips={VALIDATION_CONFIG.name.tips}
            counter={{
              current: formData.sellerContact?.name?.length || 0,
              max: 100,
            }}
          >
            <input
              type="text"
              value={formData.sellerContact?.name || ""}
              onChange={(e) =>
                handleInputChange(
                  "sellerContact.name",
                  e.target.value || undefined
                )
              }
              className={`${inputClass} ${nameFieldValidation.getBorderClassName()}`}
              placeholder="Ej: Juan Carlos Pérez"
              maxLength={100}
            />
          </InputField>

          <InputField
            label="Correo Electrónico"
            required
            error={errors["sellerContact.email"]}
            success={emailValidation.isValid}
            icon={<Mail className="w-4 h-4 text-primary" />}
            tooltip="Recibirás notificaciones de interesados en este correo"
            tips={VALIDATION_CONFIG.email.tips}
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
                className={`${inputClass} ${
                  formData.sellerContact?.email ? "pr-12" : ""
                } ${emailFieldValidation.getBorderClassName()}`}
                placeholder="Ej: juan.perez@email.com"
                maxLength={255}
              />
              {formData.sellerContact?.email && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setShowEmailPreview(!showEmailPreview)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {showEmailPreview ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {showEmailPreview ? "Ocultar" : "Mostrar"} vista previa
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </InputField>
        </div>

        {/* VISTA PREVIA DEL EMAIL */}
        {showEmailPreview &&
          formData.sellerContact?.email &&
          !emailValidation.error && (
            <Card className="card-glass border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">
                      Vista previa del anuncio:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Los compradores verán{" "}
                      <span className="font-semibold text-primary">
                        {formData.sellerContact.email}
                      </span>{" "}
                      para contactarte
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* TELÉFONO */}
        <InputField
          label="Teléfono"
          required
          error={errors["sellerContact.phone"]}
          icon={<Phone className="w-4 h-4 text-primary" />}
          tooltip="Preferiblemente WhatsApp para contacto directo con compradores"
          tips={VALIDATION_CONFIG.phone.tips}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SelectField
              value={
                formData.sellerContact?.phone?.split(" ")[0] || phoneCodes[0]
              }
              onValueChange={handlePhoneCodeChange}
              options={phoneCodes.map((code) => ({ value: code, label: code }))}
              className={`${inputClass} ${phoneFieldValidation.getBorderClassName()}`}
              placeholder="Código"
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
            <div className="sm:col-span-2 relative">
              <input
                type="tel"
                pattern="[0-9]*"
                maxLength={7}
                value={formData.sellerContact?.phone?.split(" ")[1] || ""}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`${inputClass} ${phoneFieldValidation.getBorderClassName()} ${
                  phoneValidation.isValid ? "pr-12" : ""
                }`}
                placeholder="1234567"
                inputMode="numeric"
              />
              {phoneValidation.isValid && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>
          </div>
        </InputField>

        {/* FORMATO DE TELÉFONO */}
        {phoneFormatted && !phoneValidation.error && (
          <Card className="card-glass border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Formato:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {phoneFormatted}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    WhatsApp
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* UBICACIÓN */}
        <InputField
          label="Ubicación"
          required
          error={errors.location}
          icon={<MapPin className="w-4 h-4 text-primary" />}
          tooltip="Selecciona tu estado y especifica la ciudad"
          tips={VALIDATION_CONFIG.location.tips}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SelectField
              value={selectedState}
              onValueChange={handleStateChange}
              options={stateOptions}
              className={`${inputClass} ${locationFieldValidation.getBorderClassName()}`}
              placeholder="Seleccionar estado"
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              onBlur={handleCityBlur}
              className={`${inputClass} ${locationFieldValidation.getBorderClassName()}`}
              placeholder="Ciudad o municipio"
              maxLength={100}
            />
          </div>
        </InputField>

        {/* VISTA PREVIA DE UBICACIÓN */}
        {(city || selectedState) && !locationValidation.error && (
          <Card className="card-glass border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground mb-1">
                    Ubicación que verán los compradores:
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {city && selectedState
                      ? `${city}, ${selectedState}`
                      : city
                      ? `${city} (selecciona un estado)`
                      : `(escribe tu ciudad) ${selectedState}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CONSEJOS PARA MEJOR CONTACTO */}
        <Card className="card-glass border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border/30">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Consejos para un mejor contacto
              </h4>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5 font-bold">•</span>
                  <span className="leading-relaxed">
                    Mantén tu teléfono disponible para WhatsApp y activa las
                    notificaciones
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5 font-bold">•</span>
                  <span className="leading-relaxed">
                    Responde rápido a los mensajes para generar confianza y
                    cerrar ventas
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5 font-bold">•</span>
                  <span className="leading-relaxed">
                    Sé específico con tu ubicación para facilitar visitas
                    presenciales
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5 font-bold">•</span>
                  <span className="leading-relaxed">
                    Usa un email que revises frecuentemente para no perder
                    oportunidades
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* VISTA PREVIA */}
        <ContactPreviewCard formData={formData} />

        {/* RESUMEN DE COMPLETITUD */}
        <CompletionSummary progress={progressPercentage} />
      </div>
    </div>
  );
};

export default Step4_ContactInfo;
