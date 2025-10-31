// src/components/features/payment/payment-confirmation.tsx
// VERSIÓN CON DISEÑO UNIFICADO

"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { BsBank } from "react-icons/bs";
import { banks, type Bank } from "@/constants/form-constants";
import { InputField } from "@/components/shared/forms/InputField";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useFieldValidation } from "@/hooks/useFieldValidation";

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
  const referenceValidation = useFieldValidation(referenceNumber, errors.referenceNumber);
  const paymentProofValidation = useFieldValidation(paymentProof, errors.paymentProof);

  const isReferenceValid = useMemo(() => {
    return referenceNumber.length >= 8 && !errors.referenceNumber;
  }, [referenceNumber, errors.referenceNumber]);

  // ========== Cálculo de Progreso ==========
  const { progressPercentage, isComplete } = useMemo(() => {
    const fields = [
      isReferenceValid,
      paymentProof !== null,
    ];
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
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      {/* ========== ENCABEZADO MEJORADO ========== */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10">
            <CreditCard className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
              Confirmación de Pago
            </h2>
            <p className="text-base text-muted-foreground mt-0.5">
              Selecciona un banco, realiza el pago y sube el comprobante
            </p>
          </div>
        </div>

        {/* ========== BARRA DE PROGRESO MEJORADA ========== */}
        <div className="w-full max-w-md mx-auto pt-2">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-sm font-medium text-muted-foreground">Progreso</span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2.5 bg-muted" />
        </div>
      </div>

      {/* ========== FORMULARIO ========== */}
      <div className="space-y-7">
        {/* SELECCIÓN DE BANCO */}
        <InputField
          label="Selecciona un Banco"
          icon={<BsBank className="w-4 h-4 text-primary" />}
          tooltip="Selecciona el banco donde realizarás el pago. Se abrirá una nueva pestaña con la página del banco."
        >
          {/* ========== VISTA MÓVIL (ACORDEÓN) ========== */}
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
                <AccordionContent className="pt-4">
                  <div className="grid grid-cols-1 gap-3">
                    {banks.map((bank) => (
                      <Button
                        key={bank.name}
                        variant={
                          selectedBank?.name === bank.name
                            ? "secondary"
                            : "outline"
                        }
                        onClick={() => {
                          setSelectedBank(bank);
                          window.open(
                            bank.url,
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }}
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

          {/* ========== VISTA ESCRITORIO (GRID) ========== */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {banks.map((bank) => (
              <Button
                key={bank.name}
                variant={
                  selectedBank?.name === bank.name ? "default" : "outline"
                }
                onClick={() => {
                  setSelectedBank(bank);
                  window.open(bank.url, "_blank", "noopener,noreferrer");
                }}
                className="w-full justify-between h-auto whitespace-normal py-3"
                disabled={isSubmitting}
              >
                <span className="text-left">{bank.name}</span>
                <BsBank className="w-5 h-5 text-primary ml-2 flex-shrink-0" />
              </Button>
            ))}
          </div>
        </InputField>

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
            <div className="flex items-start gap-2 mt-2 p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                Mínimo 8 dígitos requeridos
              </p>
            </div>
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
            <p className="w-full min-w-0 truncate text-sm text-muted-foreground">
              {paymentProof ? paymentProof.name : "Ningún archivo seleccionado"}
            </p>
          </div>
          {errors.paymentProof && (
            <div className="flex items-start gap-2 mt-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs text-destructive font-medium">
                {errors.paymentProof}
              </p>
            </div>
          )}
        </InputField>

        {/* ========== RESUMEN DE COMPLETITUD MEJORADO ========== */}
        <div
          className={`p-5 rounded-xl border-2 shadow-sm transition-all duration-300 ${
            isComplete
              ? "border-green-500/40 bg-green-50/50 dark:bg-green-950/20"
              : "border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  isComplete ? "bg-green-500/20" : "bg-amber-500/20"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground text-base">
                  {isComplete
                    ? "¡Información de pago completa!"
                    : "Faltan algunos campos obligatorios"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isComplete
                    ? "Puedes finalizar el registro"
                    : `${Math.round(progressPercentage)}% completado`}
                </p>
              </div>
            </div>
            <Badge
              variant={isComplete ? "default" : "secondary"}
              className="text-sm font-bold px-3 py-1"
            >
              {Math.round(progressPercentage)}%
            </Badge>
          </div>
        </div>

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