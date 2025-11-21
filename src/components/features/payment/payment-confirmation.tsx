// src/components/features/payment/payment-confirmation.tsx
// VERSIÓN CON DISEÑO PREMIUM UNIFICADO
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CreditCard,
  Upload,
  CheckCircle2,
  AlertCircle,
  Info,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react";
import { BsBank } from "react-icons/bs";
import { banks, type Bank } from "@/constants/form-constants";
import { InputField } from "@/components/shared/forms/InputField";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PaymentConfirmationProps {
  selectedBank: Bank | null;
  setSelectedBank: (bank: Bank) => void;
  referenceNumber: string;
  setReferenceNumber: (value: string) => void;
  paymentProof: File | null;
  setPaymentProof: (file: File | null) => void;
  errors: { [key: string]: string };
  isSubmitting: boolean;
  onSubmit: () => void;
  onPrevStep: () => void;
}

// ============================================
// SUB-COMPONENTE: Encabezado y Progreso
// ============================================
const FormHeader: React.FC<{ progress: number }> = React.memo(({ progress }) => (
  <div className="text-center space-y-6">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl"></div>
      <div className="relative flex items-center justify-center gap-4 p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 border border-border/50 shadow-glass">
        <div className="p-4 rounded-2xl shadow-lg bg-gradient-to-br from-accent to-accent/80 ring-4 ring-accent/10">
          <CreditCard className="w-8 h-8 text-accent-foreground" />
        </div>
        <div className="text-left">
          <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
            Confirmación de Pago
          </h2>
          <p className="text-base text-muted-foreground mt-1">
            Selecciona un banco, realiza el pago y sube el comprobante
          </p>
        </div>
      </div>
    </div>
    
    <div className="w-full max-w-md mx-auto pt-2">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-sm font-medium text-muted-foreground">Progreso</span>
        <span className="text-sm font-bold text-foreground tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} variant="glow" className="h-3 bg-muted" />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">Completando información</span>
        <span className="text-xs text-muted-foreground">Paso 6 de 7</span>
      </div>
    </div>
  </div>
));
FormHeader.displayName = "FormHeader";

// ============================================
// SUB-COMPONENTE: Selección de Banco
// ============================================
const BankSelection: React.FC<{
  selectedBank: Bank | null;
  setSelectedBank: (bank: Bank) => void;
  isSubmitting: boolean;
}> = React.memo(({ selectedBank, setSelectedBank, isSubmitting }) => {
  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    window.open(bank.url, "_blank", "noopener,noreferrer");
  };

  return (
    <InputField
      label="Selecciona un Banco"
      icon={<BsBank className="w-4 h-4 text-primary" />}
      tooltip="Selecciona el banco donde realizarás el pago. Se abrirá una nueva pestaña con la página del banco."
    >
      <Card className="card-glass border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {/* Vista móvil (acordeón) */}
          <div className="sm:hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="banks" className="border-b-0">
                <AccordionTrigger
                  className={`w-full text-left no-underline hover:no-underline rounded-xl border-2 bg-background px-4 py-3.5 text-foreground transition-all duration-200 ease-out hover:border-border/80 ${
                    selectedBank ? "border-primary" : "border-border"
                  }`}
                >
                  <span className="truncate">
                    {selectedBank
                      ? selectedBank.name
                      : "Toca para seleccionar un banco"}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-3 pt-4 pb-5 px-5">
                    {banks.map((bank) => (
                      <Button
                        key={bank.name}
                        variant={
                          selectedBank?.name === bank.name
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleBankSelect(bank)}
                        className="w-full justify-between h-auto whitespace-normal py-3"
                        disabled={isSubmitting}
                      >
                        <span className="text-left">{bank.name}</span>
                        <BsBank className="w-5 h-5 text-muted-foreground ml-2 flex-shrink-0" />
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Vista escritorio (grid) */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {banks.map((bank) => (
              <Button
                key={bank.name}
                variant={
                  selectedBank?.name === bank.name ? "default" : "outline"
                }
                onClick={() => handleBankSelect(bank)}
                className="w-full justify-between h-auto whitespace-normal py-3"
                disabled={isSubmitting}
              >
                <span className="text-left">{bank.name}</span>
                <BsBank className="w-5 h-5 text-primary ml-2 flex-shrink-0" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </InputField>
  );
});
BankSelection.displayName = "BankSelection";

// ============================================
// SUB-COMPONENTE: Información de Seguridad
// ============================================
const SecurityInfo: React.FC = React.memo(() => (
  <Card className="card-glass border-border/50 overflow-hidden">
    <CardContent className="p-0">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border/30">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Información de Seguridad
        </h4>
      </div>
      <div className="p-5">
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Pago Seguro</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tu información está protegida con encriptación de extremo a extremo
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Verificación Rápida</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tu pago será verificado en menos de 24 horas hábiles
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Soporte</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Si tienes problemas, contáctanos a través de nuestro chat de soporte
              </p>
            </div>
          </li>
        </ul>
      </div>
    </CardContent>
  </Card>
));
SecurityInfo.displayName = "SecurityInfo";

// ============================================
// SUB-COMPONENTE: Resumen de Completitud
// ============================================
const CompletionSummary: React.FC<{ progress: number }> = React.memo(({ progress }) => {
  const isComplete = progress >= 100;
  const borderColor = isComplete ? "border-success/40" : "border-amber-500/40";
  const bgColor = isComplete ? "bg-success/5 dark:bg-success/5" : "bg-amber-500/5 dark:bg-amber-950/20";
  const iconBgColor = isComplete ? "bg-success/20" : "bg-amber-500/20";
  const textColor = isComplete ? "text-success" : "text-amber-600 dark:text-amber-400";

  return (
    <div className={`p-5 rounded-xl border-2 shadow-sm transition-all duration-300 ${borderColor} ${bgColor} card-hover`}>
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
              {isComplete ? "¡Información de pago completa!" : "Faltan algunos campos"}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isComplete ? "Puedes finalizar el registro" : `${Math.round(progress)}% completado`}
            </p>
          </div>
        </div>
        <Badge variant={isComplete ? "default" : "secondary"} className="text-sm font-bold px-3 py-1">
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
});
CompletionSummary.displayName = "CompletionSummary";

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  selectedBank,
  setSelectedBank,
  referenceNumber,
  setReferenceNumber,
  paymentProof,
  setPaymentProof,
  errors,
  isSubmitting,
  onSubmit,
  onPrevStep,
}) => {
  // ========== Clase Mejorada de Inputs ==========
  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
    "placeholder:text-muted-foreground/60 " +
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
    "transition-all duration-200 ease-out hover:border-border/80";

  // ========== Hooks de Validación ==========
  const referenceValidation = useFieldValidation(
    referenceNumber,
    errors.referenceNumber
  );
  const paymentProofValidation = useFieldValidation(
    paymentProof,
    errors.paymentProof
  );

  const isReferenceValid = useMemo(() => {
    return referenceNumber.length >= 8 && !errors.referenceNumber;
  }, [referenceNumber, errors.referenceNumber]);

  // ========== Cálculo de Progreso ==========
  const { progressPercentage, isComplete } = useMemo(() => {
    const fields = [isReferenceValid, paymentProof !== null];
    const completedCount = fields.filter(Boolean).length;
    const progress = (completedCount / fields.length) * 100;
    return { progressPercentage: progress, isComplete: progress === 100 };
  }, [isReferenceValid, paymentProof]);

  // ========== Manejadores de Cambio ==========
  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 20);
    setReferenceNumber(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentProof(e.target.files?.[0] || null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <FormHeader progress={progressPercentage} />

      <div className="space-y-7">
        {/* SELECCIÓN DE BANCO */}
        <BankSelection
          selectedBank={selectedBank}
          setSelectedBank={setSelectedBank}
          isSubmitting={isSubmitting}
        />

        {/* NÚMERO DE REFERENCIA */}
        <InputField
          label="Número de Referencia"
          required
          error={errors.referenceNumber}
          success={isReferenceValid}
          icon={<CreditCard className="w-4 h-4 text-primary" />}
          tooltip="Ingresa el número de referencia de tu transferencia (8-20 dígitos)"
          counter={{ current: referenceNumber.length, max: 20 }}
        >
          <div className="relative">
            <Input
              type="text"
              value={referenceNumber}
              onChange={handleReferenceChange}
              placeholder="Ingresa el número de referencia"
              className={`${inputClass} ${referenceValidation.getBorderClassName()} ${
                isReferenceValid ? "pr-12" : ""
              }`}
              disabled={isSubmitting}
              maxLength={20}
            />
            {isReferenceValid && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            )}
          </div>
          {referenceNumber.length > 0 && referenceNumber.length < 8 && (
            <Card className="card-glass border-amber-500/50 mt-2">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                    Mínimo 8 dígitos requeridos
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </InputField>

        {/* COMPROBANTE DE PAGO */}
        <InputField
          label="Comprobante de Pago"
          required
          error={errors.paymentProof}
          success={paymentProofValidation.isValid}
          icon={<Upload className="w-4 h-4 text-primary" />}
          tooltip="Sube una imagen o PDF del comprobante de pago"
        >
          <div className="flex items-center space-x-4 rounded-xl border-2 border-border bg-background pr-4 transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
            <Label
              htmlFor="paymentProof"
              className="cursor-pointer rounded-l-lg border-r-2 border-border bg-muted/50 px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {paymentProof ? "Cambiar" : "Seleccionar archivo"}
            </Label>
            <Input
              id="paymentProof"
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <p className="w-full min-w-0 truncate text-sm text-foreground">
              {paymentProof ? paymentProof.name : "Ningún archivo seleccionado"}
            </p>
          </div>
          {errors.paymentProof && (
            <Card className="card-glass border-destructive/50 mt-2">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-destructive font-medium">
                    {errors.paymentProof}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </InputField>

        {/* INFORMACIÓN DE SEGURIDAD */}
        <SecurityInfo />
        
        {/* RESUMEN DE COMPLETITUD */}
        <CompletionSummary progress={progressPercentage} />

        {/* BOTONES DE ACCIÓN */}
        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            onClick={onPrevStep}
            className="flex-1"
            disabled={isSubmitting}
          >
            Anterior
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || !referenceNumber || !paymentProof}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Registrando...
              </>
            ) : (
              "Finalizar Registro"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};