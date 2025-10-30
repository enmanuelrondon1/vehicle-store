// src/components/features/payment/payment-confirmation.tsx

"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BsBank } from "react-icons/bs";
import { banks, type Bank } from "@/constants/form-constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  // ESTILO ACTUALIZADO: Colores de tema para los estados de la referencia.
  const getReferenceNumberColor = () => {
    if (referenceNumber.length < 8)
      return "text-yellow-600 dark:text-yellow-400";
    if (referenceNumber.length >= 8 && referenceNumber.length <= 20)
      return "text-green-600 dark:text-green-400";
    return "text-destructive";
  };

  // ESTILO ACTUALIZADO: Clase base para inputs, consistente con los pasos anteriores.
  const inputClass =
    "w-full rounded-xl border-2 border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 pl-4 pr-10 py-4 text-base";
  // ... (justo después de la definición de inputClass)

  return (
    // ESTILO ACTUALIZADO: Añadida animación de entrada.
    <div className="w-full max-w-2xl mx-auto animate-in fade-in-0 duration-500">
      {/* ESTILO ACTUALIZADO: Tarjeta con sombra sutil y borde de tema. */}
      <Card className="shadow-sm border-border">
        <CardHeader className="text-center">
          {/* ESTILO ACTUALIZADO: Título con fuente de encabezado. */}
          <CardTitle className="text-2xl font-heading font-bold">
            Confirmación de Pago
          </CardTitle>
          <CardDescription>
            Selecciona un banco, realiza el pago, ingresa el número de
            referencia y sube el comprobante para finalizar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Selecciona un Banco (Opcional)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  {/* ESTILO ACTUALIZADO: Icono con color primario. */}
                  <BsBank className="w-5 h-5 text-primary ml-2 flex-shrink-0" />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNumber">
              Número de Referencia <span className="text-destructive">*</span>
            </Label>
            <Input
              id="referenceNumber"
              type="text"
              value={referenceNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 20);
                setReferenceNumber(value);
              }}
              placeholder="Ingresa el número de referencia (8-20 dígitos)"
              minLength={8}
              maxLength={20}
              // ESTILO ACTUALIZADO: Uso de la clase base y estado de error.
              className={`${inputClass} ${
                errors.referenceNumber
                  ? "border-destructive focus:ring-destructive"
                  : ""
              }`}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-1 text-xs">
              <div>
                {errors.referenceNumber ? (
                  // ESTILO ACTUALIZADO: Error con color de tema.
                  <p className="text-destructive">{errors.referenceNumber}</p>
                ) : referenceNumber.length > 0 && referenceNumber.length < 8 ? (
                  <p className="text-yellow-600 dark:text-yellow-400">
                    Mínimo 8 dígitos requeridos
                  </p>
                ) : referenceNumber.length >= 8 ? (
                  <p className="text-green-600 dark:text-green-400">
                    ✓ Número válido
                  </p>
                ) : null}
              </div>
              <span className={getReferenceNumberColor()}>
                {referenceNumber.length}/20
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentProof">
              Comprobante de Pago <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center space-x-4 rounded-xl border-2 border-input bg-background pr-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <Label
                htmlFor="paymentProof"
                className="cursor-pointer rounded-l-lg border-r-2 border-input bg-muted/50 px-4 py-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {paymentProof ? "Cambiar" : "Seleccionar archivo"}
              </Label>
              <Input
                id="paymentProof"
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                className="hidden"
                disabled={isSubmitting}
              />
              <p className="w-full min-w-0 truncate text-sm text-muted-foreground">
                {paymentProof
                  ? paymentProof.name
                  : "Ningún archivo seleccionado"}
              </p>
            </div>
            {errors.paymentProof && (
              <p className="mt-1 text-sm text-destructive">
                {errors.paymentProof}
              </p>
            )}
          </div>

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
              // ESTILO ACTUALIZADO: Botón principal con gradiente de tema.
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
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
        </CardContent>
      </Card>
    </div>
  );
};