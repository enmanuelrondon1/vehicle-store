"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BsBank } from "react-icons/bs";
import { banks, type Bank } from "@/constants/form-constants";

interface PaymentConfirmationProps {
  selectedBank: Bank | null;
  setSelectedBank: (bank: Bank) => void;
  referenceNumber: string;
  setReferenceNumber: (value: string) => void;
  paymentProof: File | null;
  setPaymentProof: (file: File | null) => void;
  errors: { [key: string]: string };
  isSubmitting: boolean;
  isDarkMode: boolean;
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
  isDarkMode,
  onSubmit,
  onPrevStep,
}) => {
  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold text-center mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
        Confirmación de Pago
      </h2>
      <p className={`text-center mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        Selecciona un banco, realiza el pago, ingresa el número de referencia y sube el comprobante para finalizar el
        registro.
      </p>

      <div className="grid gap-4 mb-6">
        {banks.map((bank) => (
          <Button
            key={bank.name}
            variant={selectedBank?.name === bank.name ? "default" : "outline"}
            onClick={() => {
              setSelectedBank(bank);
              window.open(bank.url, "_blank", "noopener,noreferrer");
            }}
            className="w-full justify-between text-sm font-medium py-2 px-4 transition-colors duration-200"
            disabled={isSubmitting}
          >
            <span>{bank.name}</span>
            <BsBank className="w-5 h-5 text-blue-500" />
          </Button>
        ))}
        {errors.selectedBank && (
          <p className={`text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`}>{errors.selectedBank}</p>
        )}
      </div>

      <div className="mb-4">
        <label className={`block mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Número de Referencia</label>
        <input
          type="text"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          placeholder="Ingresa el número de referencia del pago"
          className={`w-full p-2 border rounded-md ${
            isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300"
          } ${errors.referenceNumber ? "border-red-500" : ""} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
          disabled={isSubmitting}
        />
        {errors.referenceNumber && (
          <p className={`text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`}>{errors.referenceNumber}</p>
        )}
      </div>

      <div className="mb-6">
        <label className={`block mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Comprobante de Pago</label>
        <input
          type="file"
          accept="image/png,image/jpeg,application/pdf"
          onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
          className={`w-full p-2 border rounded-md ${
            isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300"
          } file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
            errors.paymentProof ? "border-red-500" : ""
          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
          disabled={isSubmitting}
        />
        {paymentProof && (
          <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Archivo seleccionado: {paymentProof.name}
          </p>
        )}
        {errors.paymentProof && (
          <p className={`text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`}>{errors.paymentProof}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onPrevStep}
          disabled={false}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
            isDarkMode
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          Anterior
        </Button>
        <Button
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
            isDarkMode
              ? "bg-gradient-to-r from-blue-700 to-purple-700 text-white hover:from-blue-800 hover:to-purple-800"
              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onClick={onSubmit}
          disabled={isSubmitting || !selectedBank || !referenceNumber || !paymentProof}
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
  );
};