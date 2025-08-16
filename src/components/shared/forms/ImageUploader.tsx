// src/components/shared/forms/ImageUploader.tsx
"use client";

import { useState, useCallback, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  onUploadChange?: (urls: string[]) => void;
  initialUrls?: string[];
  maxSizeMB?: number;
}

interface UploadedFile {
  file?: File;
  preview: string;
  url?: string;
  isLoading: boolean;
  error?: string;
}

export const ImageUploader = ({
  onUploadChange,
  initialUrls = [],
  maxSizeMB = 2, // Establecemos 2MB como valor por defecto
}: ImageUploaderProps) => {
  const [files, setFiles] = useState<UploadedFile[]>(
    initialUrls.map(url => ({ preview: url, url, isLoading: false }))
  );

  // Notificar al padre cuando la lista de URLs finales cambie
  useEffect(() => {
    const finalUrls = files.map(f => f.url).filter((url): url is string => !!url);
    if (typeof onUploadChange === 'function') onUploadChange(finalUrls);
  }, [files, onUploadChange]);

  const handleUpload = useCallback(async (acceptedFiles: File[]) => {
    // Solo verificar cloud name (que sí está disponible en cliente)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      console.error('Cloud name de Cloudinary no configurado');
      alert('Error de configuración: Cloud name no encontrado');
      return;
    }

    const newUploads: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isLoading: true,
    }));

    setFiles(prev => [...prev, ...newUploads]);

    const uploadPromises = newUploads.map(async (upload) => {
      // Opciones de compresión
      const compressionOptions = {
        maxSizeMB: maxSizeMB, // Usa la prop para el tamaño máximo de compresión
        maxWidthOrHeight: 1920, // Redimensiona a un máximo de 1920px en el lado más largo
        useWebWorker: true, // Usa web workers para no bloquear la interfaz
      };

      try {
        // Obtener la firma del servidor (el timestamp se genera allí)
        const signResponse = await fetch('/api/cloudinary/sign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!signResponse.ok) {
          throw new Error(`Error al obtener firma: ${signResponse.status}`);
        }

        const signData = await signResponse.json();
        
        if (!signData.signature || !signData.apiKey || !signData.timestamp) {
          throw new Error('No se recibió datos completos del servidor');
        }

        // Comprimir la imagen antes de subirla
        const compressedFile = await imageCompression(upload.file!, compressionOptions);

        // Preparar FormData para la carga
        const formData = new FormData();
        formData.append('file', compressedFile); // Usamos el archivo comprimido
        formData.append('api_key', signData.apiKey);
        formData.append('timestamp', signData.timestamp.toString());
        formData.append('signature', signData.signature);
        formData.append('folder', 'vehicles');

        // Subir a Cloudinary
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { 
            method: 'POST', 
            body: formData 
          }
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Error de carga: ${uploadResponse.status} - ${errorText}`);
        }

        const result = await uploadResponse.json();
        
        if (!result.secure_url) {
          throw new Error('No se recibió URL de la imagen');
        }

        return { preview: upload.preview, url: result.secure_url };

      } catch (error) {
        console.error('Upload error:', error);
        return { 
          preview: upload.preview, 
          error: error instanceof Error ? error.message : 'Error desconocido al subir'
        };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);

      setFiles(prev => {
        const updated = [...prev];
        results.forEach(result => {
          const index = updated.findIndex(f => f.preview === result.preview);
          if (index !== -1) {
            updated[index].isLoading = false;
            if (result.url) {
              updated[index].url = result.url;
            } else {
              updated[index].error = result.error || 'Error al subir';
            }
          }
        });
        return updated;
      });
    } catch (error) {
      console.error('Error procesando uploads:', error);
    }
  }, [maxSizeMB]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 10) {
      alert('Máximo 10 imágenes permitidas');
      return;
    }
    handleUpload(acceptedFiles);
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    maxSize: 10 * 1024 * 1024, // Aumentamos el límite a 10MB, ya que se comprimirá
    maxFiles: 10, // Mantenemos el máximo de 10 archivos
  });

  const removeImage = (previewToRemove: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.preview === previewToRemove);
      if (fileToRemove?.preview && fileToRemove.preview.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.preview !== previewToRemove);
    });
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Arrastra y suelta tus imágenes aquí, o haz clic para seleccionarlas.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          PNG, JPG, WEBP hasta 10MB. Máximo 10 imágenes.
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {files.map((file, index) => (
            <div key={file.preview} className="relative aspect-square group">
              <Image
                src={file.preview}
                alt={`Vista previa de la imagen ${index + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-md"
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16.6vw"
              />
              {file.isLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              )}
              {file.error && (
                <div className="absolute inset-0 bg-red-700/80 flex items-center justify-center rounded-lg text-white text-xs font-bold p-1 text-center">
                  {file.error}
                </div>
              )}
              {!file.isLoading && (
                <button 
                  onClick={() => removeImage(file.preview)} 
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg group-hover:opacity-100 opacity-0 transition-opacity focus:opacity-100"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};