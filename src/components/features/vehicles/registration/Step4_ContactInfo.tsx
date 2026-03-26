// src/components/features/vehicles/registration/Step4_ContactInfo.tsx
"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  User,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  MessageCircle,
  Sparkles,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { VehicleDataBackend, FormErrors } from "@/types/types";
import { VENEZUELAN_STATES } from "@/constants/form-constants";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import CompletionSummary from "@/components/shared/forms/CompletionSummary";
import { useFieldValidation } from "@/hooks/useFieldValidation";
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

const INPUT_CLASS =
  "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
  "placeholder:text-muted-foreground/60 " +
  "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
  "transition-all duration-200 ease-out hover:border-border/80";

const FIELD_TIPS = {
  name: [
    "✅ Usa tu nombre real para generar confianza",
    "📝 Mínimo 4 caracteres, máximo 100",
    "🔤 Solo letras y espacios permitidos",
    "❌ Sin números ni caracteres especiales",
  ],
  email: [
    "✅ Formato válido: nombre@dominio.com",
    "📧 Recibirás notificaciones de interesados aquí",
    "⚡ Usa un correo que revises frecuentemente",
    "🔒 Tu email será visible para compradores",
  ],
  phone: [
    "📱 El número debe tener exactamente 7 dígitos",
    "📞 Incluye el código de área (0414, 0424, etc.)",
    "🔢 Solo números, sin espacios ni guiones",
    "💬 Preferiblemente un número con WhatsApp",
  ],
  location: [
    "🏙️ Ciudad debe tener mínimo 4 caracteres",
    "📍 Formato: Ciudad, Estado",
    "✅ Ejemplo: Caracas, Distrito Capital",
    "🗺️ Sé específico para facilitar visitas",
  ],
};

const CONTACT_TIPS = [
  "Mantén tu teléfono disponible para WhatsApp y activa las notificaciones",
  "Responde rápido a los mensajes para generar confianza y cerrar ventas",
  "Sé específico con tu ubicación para facilitar visitas presenciales",
  "Usa un email que revises frecuentemente para no perder oportunidades",
];

const formatPhone = (phone?: string) => {
  if (!phone) return null;
  const parts = phone.split(" ");
  return `${parts[0] || ""} ${(parts[1] || "").replace(/(\d{3})(\d{4})/, "$1-$2")}`;
};

const ContactPreviewCard: React.FC<{ formData: Partial<VehicleDataBackend> }> = React.memo(({ formData }) => {
  const rows = [
    { icon: User,   label: "Vendedor",  value: formData.sellerContact?.name,               extra: null },
    { icon: Mail,   label: "Email",     value: formData.sellerContact?.email,              extra: null, truncate: true },
    { icon: Phone,  label: "Teléfono",  value: formatPhone(formData.sellerContact?.phone),
      extra: <Badge variant="secondary" className="text-xs"><MessageCircle className="w-3 h-3 mr-1" />WhatsApp</Badge> },
    { icon: MapPin, label: "Ubicación", value: formData.location, alignTop: true },
  ].filter(({ value }) => !!value);

  if (rows.length === 0) return null;

  return (
    <Card className="card-glass border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Vista Previa del Contacto</h3>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {rows.map(({ icon: Icon, label, value, extra, truncate, alignTop }, i) => (
            <div key={label} className={`flex justify-between ${alignTop ? "items-start" : "items-center"} py-2 ${i < rows.length - 1 ? "border-b border-border/50" : ""}`}>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${alignTop ? "mt-0.5" : ""}`} />
                {label}
              </span>
              <div className="flex items-center gap-2">
                <span className={`font-medium text-sm text-foreground ${truncate ? "truncate max-w-[200px]" : "text-right max-w-[200px]"}`}>
                  {value}
                </span>
                {extra}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
ContactPreviewCard.displayName = "ContactPreviewCard";

const Step4_ContactInfo: React.FC<StepProps> = ({
  formData, errors, handleInputChange, phoneCodes, userSession,
}) => {
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");

  // ✅ FIX #19: Estado local para confirmación de email
  const [emailConfirm, setEmailConfirm] = useState("");
  const [emailConfirmTouched, setEmailConfirmTouched] = useState(false);

  useEffect(() => {
    if (userSession) {
      if (!formData.sellerContact?.name && userSession.name)
        handleInputChange("sellerContact.name", userSession.name ?? undefined);
      if (!formData.sellerContact?.email && userSession.email) {
        handleInputChange("sellerContact.email", userSession.email ?? undefined);
        setEmailConfirm(userSession.email ?? "");
      }
    }
  }, [userSession, formData.sellerContact, handleInputChange]);

  useEffect(() => {
    if (formData.location) {
      const parts = formData.location.split(", ");
      setCity(parts[0] || "");
      setSelectedState(parts.slice(1).join(", ").trim());
    }
  }, [formData.location]);

  const stateOptions = useMemo(
    () => VENEZUELAN_STATES.map((state) => {
      const formatted = state.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      return { value: formatted, label: formatted };
    }),
    []
  );

  const handleStateChange = useCallback((newState: string) => {
    setSelectedState(newState);
    handleInputChange("location", `${city}, ${newState}`);
  }, [city, handleInputChange]);

  const handleCityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = e.target.value;
    setCity(newCity);
    handleInputChange("location", `${newCity}, ${selectedState}`);
  }, [selectedState, handleInputChange]);

  const handleCityBlur = useCallback(() => {
    const formattedCity = city.toLowerCase().split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    if (formattedCity !== city) {
      setCity(formattedCity);
      handleInputChange("location", `${formattedCity}, ${selectedState}`);
    }
  }, [city, selectedState, handleInputChange]);

  const handlePhoneChange = useCallback((value: string) => {
    const code = formData.sellerContact?.phone?.split(" ")[0] || phoneCodes[0];
    const cleanNumber = value.replace(/\D/g, "").slice(0, 7);
    handleInputChange("sellerContact.phone", `${code} ${cleanNumber}`);
  }, [formData.sellerContact?.phone, phoneCodes, handleInputChange]);

  const handlePhoneCodeChange = useCallback((code: string) => {
    const numberPart = formData.sellerContact?.phone?.split(" ")[1] || "";
    handleInputChange("sellerContact.phone", `${code} ${numberPart}`);
  }, [formData.sellerContact?.phone, handleInputChange]);

  const nameFieldValidation     = useFieldValidation(formData.sellerContact?.name,  errors["sellerContact.name"]);
  const emailFieldValidation    = useFieldValidation(formData.sellerContact?.email, errors["sellerContact.email"]);
  const phoneFieldValidation    = useFieldValidation(formData.sellerContact?.phone, errors["sellerContact.phone"]);
  const locationFieldValidation = useFieldValidation(formData.location,             errors.location);

  const phoneFormatted = useMemo(() => formatPhone(formData.sellerContact?.phone) || "", [formData.sellerContact?.phone]);

  // ✅ FIX #19: Lógica de confirmación de email
  const emailValue       = formData.sellerContact?.email || "";
  const emailsMatch      = emailConfirm === emailValue;
  const showEmailMismatch = emailConfirmTouched && emailConfirm.length > 0 && !emailsMatch;
  const showEmailMatch    = emailConfirmTouched && emailConfirm.length > 0 && emailsMatch && !!emailValue;

  const confirmBorderClass = showEmailMismatch
    ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10"
    : showEmailMatch
    ? "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/10"
    : "";

  const progressPercentage = useMemo(() => {
    const fields = [
      { value: formData.sellerContact?.name,  error: errors["sellerContact.name"] },
      { value: formData.sellerContact?.email, error: errors["sellerContact.email"] },
      { value: formData.sellerContact?.phone, error: errors["sellerContact.phone"] },
      { value: formData.location,             error: errors.location },
      // ✅ FIX #19: confirmación cuenta para el progreso
      { value: emailsMatch && emailConfirm ? emailConfirm : undefined, error: showEmailMismatch ? "no-match" : undefined },
    ];
    const completed = fields.filter(({ value, error }) => !!value && !error).length;
    return (completed / fields.length) * 100;
  }, [formData.sellerContact, formData.location, errors, emailsMatch, emailConfirm, showEmailMismatch]);

  const isPhoneValid = !!formData.sellerContact?.phone && !errors["sellerContact.phone"];
  const isEmailValid = !!formData.sellerContact?.email && !errors["sellerContact.email"];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-7">

        {/* NOMBRE */}
        <InputField
          label="Nombre Completo" required
          error={errors["sellerContact.name"]} success={nameFieldValidation.isValid}
          icon={<User className="w-4 h-4 text-primary" />}
          tooltip="Usa tu nombre real para generar confianza con los compradores"
          tips={FIELD_TIPS.name}
          counter={{ current: formData.sellerContact?.name?.length || 0, max: 100 }}
        >
          <input
            type="text"
            value={formData.sellerContact?.name || ""}
            onChange={(e) => handleInputChange("sellerContact.name", e.target.value || undefined)}
            className={`${INPUT_CLASS} ${nameFieldValidation.getBorderClassName()}`}
            placeholder="Ej: Juan Carlos Pérez"
            maxLength={100}
          />
        </InputField>

        {/* EMAIL + CONFIRMACIÓN en grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Correo Electrónico" required
            error={errors["sellerContact.email"]} success={emailFieldValidation.isValid}
            icon={<Mail className="w-4 h-4 text-primary" />}
            tooltip="Recibirás notificaciones de interesados en este correo"
            tips={FIELD_TIPS.email}
          >
            <div className="relative">
              <input
                type="email"
                value={formData.sellerContact?.email || ""}
                onChange={(e) => {
                  handleInputChange("sellerContact.email", e.target.value || undefined);
                  // Resetear confirmación cuando el email cambia
                  if (emailConfirmTouched) setEmailConfirm("");
                }}
                className={`${INPUT_CLASS} ${formData.sellerContact?.email ? "pr-12" : ""} ${emailFieldValidation.getBorderClassName()}`}
                placeholder="Ej: juan.perez@email.com"
                maxLength={255}
                autoComplete="email"
              />
              {formData.sellerContact?.email && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setShowEmailPreview(!showEmailPreview)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {showEmailPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent><p>{showEmailPreview ? "Ocultar" : "Mostrar"} vista previa</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </InputField>

          {/* ✅ FIX #19: Confirmación de email */}
          <InputField
            label="Confirmar Correo" required
            error={showEmailMismatch ? "Los correos no coinciden" : undefined}
            success={showEmailMatch}
            icon={<Mail className="w-4 h-4 text-primary" />}
            tooltip="Escribe nuevamente tu correo para evitar errores de tipeo"
          >
            <div className="relative">
              <input
                type="email"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                onBlur={() => setEmailConfirmTouched(true)}
                onPaste={(e) => e.preventDefault()} // fuerza escribir — evita pegar el mismo error
                className={`${INPUT_CLASS} pr-12 ${confirmBorderClass}`}
                placeholder="Repite tu correo electrónico"
                maxLength={255}
                autoComplete="off"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {showEmailMatch    && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {showEmailMismatch && <AlertCircle  className="w-5 h-5 text-destructive" />}
              </div>
            </div>
          </InputField>
        </div>

        {/* VISTA PREVIA DEL EMAIL */}
        {showEmailPreview && formData.sellerContact?.email && isEmailValid && (
          <Card className="card-glass border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Vista previa del anuncio:</p>
                  <p className="text-sm text-muted-foreground">
                    Los compradores verán{" "}
                    <span className="font-semibold text-primary">{formData.sellerContact.email}</span>{" "}
                    para contactarte
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TELÉFONO */}
        <InputField
          label="Teléfono" required
          error={errors["sellerContact.phone"]}
          icon={<Phone className="w-4 h-4 text-primary" />}
          tooltip="Preferiblemente WhatsApp para contacto directo con compradores"
          tips={FIELD_TIPS.phone}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SelectField
              value={formData.sellerContact?.phone?.split(" ")[0] || phoneCodes[0]}
              onValueChange={handlePhoneCodeChange}
              options={phoneCodes.map((code) => ({ value: code, label: code }))}
              className={`${INPUT_CLASS} ${phoneFieldValidation.getBorderClassName()}`}
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
                className={`${INPUT_CLASS} ${phoneFieldValidation.getBorderClassName()} ${isPhoneValid ? "pr-12" : ""}`}
                placeholder="1234567"
                inputMode="numeric"
              />
              {isPhoneValid && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>
          </div>
        </InputField>

        {/* FORMATO DE TELÉFONO */}
        {phoneFormatted && isPhoneValid && (
          <Card className="card-glass border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Formato:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{phoneFormatted}</span>
                  <Badge variant="secondary" className="text-xs">
                    <MessageCircle className="w-3 h-3 mr-1" />WhatsApp
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* UBICACIÓN */}
        <InputField
          label="Ubicación" required
          error={errors.location}
          icon={<MapPin className="w-4 h-4 text-primary" />}
          tooltip="Selecciona tu estado y especifica la ciudad"
          tips={FIELD_TIPS.location}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SelectField
              value={selectedState}
              onValueChange={handleStateChange}
              options={stateOptions}
              className={`${INPUT_CLASS} ${locationFieldValidation.getBorderClassName()}`}
              placeholder="Seleccionar estado"
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              onBlur={handleCityBlur}
              className={`${INPUT_CLASS} ${locationFieldValidation.getBorderClassName()}`}
              placeholder="Ciudad o municipio"
              maxLength={100}
            />
          </div>
        </InputField>

        {/* VISTA PREVIA DE UBICACIÓN */}
        {(city || selectedState) && !errors.location && (
          <Card className="card-glass border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground mb-1">Ubicación que verán los compradores:</p>
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

        {/* CONSEJOS */}
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
                {CONTACT_TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 font-bold">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <ContactPreviewCard formData={formData} />

        <CompletionSummary
          progress={progressPercentage}
          completeLabel="¡Información de contacto completa!"
        />
      </div>
    </div>
  );
};

export default Step4_ContactInfo;