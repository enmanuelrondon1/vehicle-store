// src/components/shared/forms/FileUploader.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { UploadCloud,  CheckCircle, X, Loader2, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onUploadComplete: (result: { url: string; publicId: string }) => void;
  onUploadError: (error: string) => void;
  onFileRemove: () => void;
  allowedTypes?: { [key: string]: string[] };
  maxSizeMB?: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  onUploadError,
  onFileRemove,
  allowedTypes = { 'image/jpeg': [], 'image/png': [], 'application/pdf': [] },
  maxSizeMB = 5,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      const message = error.code === 'file-too-large'
        ? `El archivo es demasiado grande. Máximo ${maxSizeMB}MB.`
        : 'Tipo de archivo no permitido.';
      setErrorMessage(message);
      setStatus('error');
      onUploadError(message);
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setStatus('uploading');
    setErrorMessage('');

    try {
      // 1. Obtener firma segura
      const signResponse = await fetch('/api/cloudinary/sign', { method: 'POST' });
      if (!signResponse.ok) throw new Error('No se pudo obtener la firma del servidor.');
      const signData = await signResponse.json();

      // 2. Preparar FormData para Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append('timestamp', signData.timestamp);
      formData.append('signature', signData.signature);
      formData.append('folder', 'payment-proofs');

      // 3. Subir directamente a Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        { method: 'POST', body: formData }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error.message || 'Error al subir a Cloudinary');
      }

      const result = await uploadResponse.json();
      setStatus('success');
      onUploadComplete({ url: result.secure_url, publicId: result.public_id });

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
      setErrorMessage(message);
      setStatus('error');
      onUploadError(message);
    }
  }, [maxSizeMB, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: allowedTypes,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setStatus('idle');
    setErrorMessage('');
    onFileRemove();
  };

  if (status === 'success' && file) {
    return (
      <div className="p-4 border-2 border-green-500 bg-green-50 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
        </div>
        <button onClick={removeFile} className="p-1 text-gray-500 hover:text-red-600">
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {status === 'uploading' ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-gray-600">Subiendo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <UploadCloud className="w-10 h-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-700">Arrastra o haz clic para subir el comprobante</p>
            <p className="text-xs text-gray-500">PNG, JPG o PDF (Máx {maxSizeMB}MB)</p>
          </div>
        )}
      </div>
      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};