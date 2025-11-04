// src/components/shared/forms/ImageUploader.tsx
"use client";

import { useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import imageCompression from 'browser-image-compression';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2, ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onUploadChange?: (urls: string[]) => void;
  initialUrls?: string[];
  maxSizeMB?: number;
  children?: ReactNode;
  multiple?: boolean;
  showPreviews?: boolean;
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
  maxSizeMB = 2,
  children,
  multiple = true,
  showPreviews = true,
}: ImageUploaderProps) => {
  const [files, setFiles] = useState<UploadedFile[]>(
    initialUrls.map(url => ({ preview: url, url, isLoading: false }))
  );

  const previousUrlsRef = useRef<string>('');

  useEffect(() => {
    const finalUrls = files.map(f => f.url).filter((url): url is string => !!url);
    const urlsString = JSON.stringify(finalUrls);
    
    if (urlsString !== previousUrlsRef.current) {
      previousUrlsRef.current = urlsString;
      if (typeof onUploadChange === 'function' && showPreviews) {
        onUploadChange(finalUrls);
      }
    }
  }, [files, onUploadChange, showPreviews]);

  const handleUpload = useCallback(async (acceptedFiles: File[]) => {
    console.log('🎯 Iniciando upload de', acceptedFiles.length, 'archivos');
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      console.error('❌ Cloud name de Cloudinary no configurado');
      toast.error('Error de configuración: Cloud name no encontrado');
      return;
    }

    console.log('☁️ Cloud name configurado:', cloudName);

    const newUploads: UploadedFile[] = acceptedFiles.map(file => {
      console.log('📁 Archivo:', file.name, '- Tamaño:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      return {
        file,
        preview: URL.createObjectURL(file),
        isLoading: true,
      };
    });

    setFiles(prev => [...prev, ...newUploads]);
    toast.info(`Subiendo ${acceptedFiles.length} imagen${acceptedFiles.length > 1 ? 'es' : ''}...`);

    const uploadPromises = newUploads.map(async (upload, index) => {
      const compressionOptions = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        console.log(`🚀 [${index + 1}/${newUploads.length}] Solicitando firma al servidor...`);
        
        const signResponse = await fetch('/api/cloudinary/sign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(`📡 [${index + 1}] Respuesta del servidor:`, {
          status: signResponse.status,
          ok: signResponse.ok,
        });

        if (!signResponse.ok) {
          const errorText = await signResponse.text();
          console.error(`❌ [${index + 1}] Error del servidor:`, errorText);
          throw new Error(`Error al obtener firma: ${signResponse.status}`);
        }

        const signData = await signResponse.json();
        
        if (!signData.signature || !signData.apiKey || !signData.timestamp) {
          console.error(`❌ [${index + 1}] Datos incompletos:`, signData);
          throw new Error('Datos de firma incompletos');
        }

        console.log(`🗜️ [${index + 1}] Comprimiendo imagen...`);
        const compressedFile = await imageCompression(upload.file!, compressionOptions);
        console.log(`✅ [${index + 1}] Comprimida: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('api_key', signData.apiKey);
        formData.append('timestamp', signData.timestamp.toString());
        formData.append('signature', signData.signature);
        formData.append('folder', 'vehicles');

        console.log(`☁️ [${index + 1}] Subiendo a Cloudinary...`);
        
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { 
            method: 'POST', 
            body: formData 
          }
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(`❌ [${index + 1}] Error de Cloudinary:`, errorText);
          throw new Error(`Error de carga: ${uploadResponse.status}`);
        }

        const result = await uploadResponse.json();
        
        if (!result.secure_url) {
          console.error(`❌ [${index + 1}] No se recibió URL:`, result);
          throw new Error('No se recibió URL de la imagen');
        }

        console.log(`🎉 [${index + 1}] Imagen subida exitosamente!`);
        toast.success(`Imagen ${index + 1} subida correctamente`);
        return { preview: upload.preview, url: result.secure_url };

      } catch (error) {
        console.error(`💥 [${index + 1}] Error:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        toast.error(`Error al subir imagen ${index + 1}: ${errorMessage}`);
        return { 
          preview: upload.preview, 
          error: errorMessage
        };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      console.log('✅ Todos los uploads completados');

      const newUrls = results.filter(r => r.url).map(r => r.url as string);
      if (onUploadChange && newUrls.length > 0) {
        onUploadChange(newUrls);
      }

      if (showPreviews) {
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
      } else {
        // Si no mostramos previews, limpiamos los archivos temporales
        setFiles(prev => prev.filter(f => initialUrls.includes(f.preview)));
      }


      const successCount = results.filter(r => r.url).length;
      if (successCount > 0) {
        toast.success(`${successCount} imagen${successCount > 1 ? 'es' : ''} subida${successCount > 1 ? 's' : ''} correctamente`);
      }
    } catch (error) {
      console.error('💥 Error procesando uploads:', error);
      toast.error('Error al procesar las imágenes');
    }
  }, [maxSizeMB, onUploadChange, showPreviews, initialUrls]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    console.log('📥 Drop detectado!');
    console.log('  - Archivos aceptados:', acceptedFiles.length);
    console.log('  - Archivos rechazados:', rejectedFiles.length);

    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(rejected => {
        console.error('❌ Archivo rechazado:', rejected.file.name, rejected.errors);
        rejected.errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            toast.error(`${rejected.file.name} es muy grande (máx 10MB)`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${rejected.file.name} no es una imagen válida`);
          } else {
            toast.error(`Error con ${rejected.file.name}: ${error.message}`);
          }
        });
      });
    }

    if (acceptedFiles.length > 10) {
      toast.error('Máximo 10 imágenes permitidas');
      return;
    }

    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles);
    }
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: multiple ? 10 : 1,
    noClick: !!children,
    noKeyboard: true,
    multiple,
  });

  const removeImage = (previewToRemove: string) => {
    console.log('🗑️ Eliminando imagen del preview');
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.preview === previewToRemove);
      if (fileToRemove?.preview && fileToRemove.preview.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.preview !== previewToRemove);
    });
    toast.info('Imagen eliminada del preview');
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={!children ? `border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }` : 'contents'}
      >
        <input {...getInputProps()} />
        {children ? (
          <div onClick={open} role="button" className="cursor-pointer">
            {children}
          </div>
        ) : (
          <>
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              {isDragActive 
                ? '¡Suelta las imágenes aquí!' 
                : 'Arrastra imágenes aquí o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, WEBP hasta 10MB. Máximo 10 imágenes.
            </p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                console.log('🖱️ Botón clickeado - abriendo selector');
                open();
              }}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Seleccionar imágenes
            </Button>
          </>
        )}
      </div>

      {showPreviews && files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {files.map((file, index) => (
            <div key={file.preview} className="relative aspect-square group">
              <Image
                src={file.preview}
                alt={`Vista previa ${index + 1}`}
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