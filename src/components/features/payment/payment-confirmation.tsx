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
  const getReferenceNumberColor = () => {
    if (referenceNumber.length < 8) return "text-yellow-600 dark:text-yellow-400";
    if (referenceNumber.length >= 8 && referenceNumber.length <= 20)
      return "text-green-600 dark:text-green-400";
    return "text-red-500 dark:text-red-400";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Confirmación de Pago</CardTitle>
        <CardDescription>
          Selecciona un banco, realiza el pago, ingresa el número de referencia y
          sube el comprobante para finalizar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Selecciona un Banco (Opcional)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {banks.map((bank) => (
              <Button
                key={bank.name}
                variant={selectedBank?.name === bank.name ? "default" : "outline"}
                onClick={() => {
                  setSelectedBank(bank);
                  window.open(bank.url, "_blank", "noopener,noreferrer");
                }}
                className="w-full justify-between h-auto whitespace-normal py-3"
                disabled={isSubmitting}
              >
                <span className="text-left">{bank.name}</span>
                <BsBank className="w-5 h-5 text-blue-500 ml-2 flex-shrink-0" />
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referenceNumber">
            Número de Referencia <span className="text-red-500">*</span>
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
            className={errors.referenceNumber ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-1 text-xs">
            <div>
              {errors.referenceNumber ? (
                <p className="text-red-500 dark:text-red-400">
                  {errors.referenceNumber}
                </p>
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
          <Label htmlFor="paymentProof">Comprobante de Pago</Label>
          <Input
            id="paymentProof"
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
            className={errors.paymentProof ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {paymentProof && (
            <p className="text-sm text-muted-foreground mt-1">
              Archivo seleccionado: {paymentProof.name}
            </p>
          )}
          {errors.paymentProof && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-1">
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
            disabled={
              isSubmitting || !referenceNumber || !paymentProof
            }
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
  );
};