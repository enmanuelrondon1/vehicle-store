// src//components/sections/PostAd/UploadPaymentProof.tsx
"use client";
import React, { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";

// Componente que usa useSearchParams - debe estar dentro de Suspense
const UploadPaymentProofContent: React.FC = () => {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        setError(null);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!vehicleId) {
        setError("No se proporcionó un ID de vehículo.");
        return;
      }
      if (!file) {
        setError("Por favor selecciona un archivo.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const formData = new FormData();
        formData.append("vehicleId", vehicleId);
        formData.append("file", file);

        const res = await fetch("/api/upload-payment-proof", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          setSuccess(data.message || "Comprobante subido exitosamente");
          setFile(null);
        } else {
          setError(data.error || "Error al subir el comprobante");
        }
      } catch (error) {
        console.error("Error al subir el comprobante:", error);
        setError("Error de conexión. Por favor, intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    },
    [file, vehicleId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Cargar Comprobante de Pago
        </h2>
        <p className="text-gray-600 mb-6">
          Sube tu comprobante de pago (PNG, JPG o PDF, máximo 5MB) para activar
          tu anuncio.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !file}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Subir Comprobante
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

// Componente de carga mientras se resuelve el Suspense
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
        <span className="text-gray-600">Cargando...</span>
      </div>
    </div>
  </div>
);

// Componente principal con Suspense
const UploadPaymentProof: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UploadPaymentProofContent />
    </Suspense>
  );
};

export default UploadPaymentProof;
