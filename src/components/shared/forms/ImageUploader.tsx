// src/components/shared/forms/ImageUploader.tsx
"use client";

import { useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import imageCompression from 'browser-image-compression';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud, X, Loader2, ImagePlus,
  CheckCircle2, AlertCircle, Star, GripVertical,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// dnd-kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageUploaderProps {
  onUploadChange?: (urls: string[]) => void;
  initialUrls?: string[];
  maxSizeMB?: number;
  children?: ReactNode;
  multiple?: boolean;
  showPreviews?: boolean;
  minImages?: number;
  maxImages?: number;
}

interface UploadedFile {
  id: string;       // unique id for dnd-kit
  preview: string;
  url?: string;
  isLoading: boolean;
  error?: string;
}

// ===================================================
// SUB-COMPONENTE: Imagen sortable individual
// ===================================================
const SortableImage: React.FC<{
  file: UploadedFile;
  index: number;
  onRemove: (id: string) => void;
}> = ({ file, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const isCover = index === 0;

  return (
    <div
      ref={setNodeRef}
      style={style as React.CSSProperties}
      className="relative aspect-square group"
    >
      <Image
        src={file.preview}
        alt={`Foto ${index + 1}`}
        className={`w-full h-full object-cover rounded-xl shadow-md transition-all ${
          isCover ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        fill
        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16.6vw"
      />

      {/* ✅ FIX #16: Indicador "Portada" en la primera imagen */}
      {isCover && !file.isLoading && !file.error && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 flex items-center gap-1 shadow-md">
            <Star className="w-2.5 h-2.5 fill-current" />
            Portada
          </Badge>
        </div>
      )}

      {/* Número de orden */}
      {!isCover && !file.isLoading && !file.error && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <div className="w-5 h-5 rounded-full bg-black/50 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">{index + 1}</span>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {file.isLoading && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-xl gap-1">
          <Loader2 className="h-6 w-6 text-white animate-spin" />
          <span className="text-white text-[10px]">Subiendo...</span>
        </div>
      )}

      {/* Error overlay */}
      {file.error && (
        <div className="absolute inset-0 bg-red-700/80 flex items-center justify-center rounded-xl text-white text-xs font-bold p-1 text-center">
          {file.error}
        </div>
      )}

      {/* ✅ FIX #16: Handle de drag — solo visible en hover */}
      {!file.isLoading && !file.error && (
        <div
          {...attributes}
          {...listeners}
          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-black/50 rounded-full p-1"
          title="Arrastra para reordenar"
        >
          <GripVertical className="h-3 w-3 text-white" />
        </div>
      )}

      {/* Botón eliminar */}
      {!file.isLoading && (
        <button
          onClick={() => onRemove(file.id)}
          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 z-20"
          type="button"
          title="Eliminar foto"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

// ===================================================
// COMPONENTE PRINCIPAL
// ===================================================
export const ImageUploader = ({
  onUploadChange,
  initialUrls = [],
  maxSizeMB = 2,
  children,
  multiple = true,
  showPreviews = true,
  minImages = 1,
  maxImages = 10,
}: ImageUploaderProps) => {
  const [files, setFiles] = useState<UploadedFile[]>(
    initialUrls.map((url, i) => ({
      id: `initial-${i}-${url.slice(-8)}`,
      preview: url,
      url,
      isLoading: false,
    }))
  );

  const previousUrlsRef = useRef<string>('');

  // Sensores dnd-kit — Pointer para mouse/touch, Keyboard para accesibilidad
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  // ✅ FIX #16: Handler de drag end — reordena el array de files
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setFiles(prev => {
      const oldIndex = prev.findIndex(f => f.id === active.id);
      const newIndex = prev.findIndex(f => f.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      // Notificar cambio de orden a formData
      const newUrls = reordered.map(f => f.url).filter((u): u is string => !!u);
      if (onUploadChange && newUrls.length > 0) {
        onUploadChange(newUrls);
      }
      return reordered;
    });

    toast.success('Orden actualizado. La primera imagen es la portada.');
  }, [onUploadChange]);

  const handleUpload = useCallback(async (acceptedFiles: File[]) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      toast.error('Error de configuración: Cloud name no encontrado');
      return;
    }

    const currentCount = files.filter(f => f.url && !f.error).length;
    const availableSlots = maxImages - currentCount;

    if (availableSlots <= 0) {
      toast.error(`Ya alcanzaste el máximo de ${maxImages} imágenes`);
      return;
    }

    const filesToUpload = acceptedFiles.slice(0, availableSlots);
    if (filesToUpload.length < acceptedFiles.length) {
      toast.warning(`Solo se subirán ${filesToUpload.length} imagen${filesToUpload.length > 1 ? 'es' : ''} (límite: ${maxImages})`);
    }

    const newUploads: UploadedFile[] = filesToUpload.map(file => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
      isLoading: true,
    } as UploadedFile & { file: File }));

    setFiles(prev => [...prev, ...newUploads]);
    toast.info(`Subiendo ${filesToUpload.length} imagen${filesToUpload.length > 1 ? 'es' : ''}...`);

    const uploadPromises = (newUploads as (UploadedFile & { file?: File })[]).map(async (upload, index) => {
      try {
        const signResponse = await fetch('/api/cloudinary/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!signResponse.ok) throw new Error(`Error al obtener firma: ${signResponse.status}`);

        const signData = await signResponse.json();
        if (!signData.signature || !signData.apiKey || !signData.timestamp) {
          throw new Error('Datos de firma incompletos');
        }

        const compressedFile = await imageCompression(upload.file!, {
          maxSizeMB,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('api_key', signData.apiKey);
        formData.append('timestamp', signData.timestamp.toString());
        formData.append('signature', signData.signature);
        formData.append('folder', 'vehicles');

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: formData }
        );
        if (!uploadResponse.ok) throw new Error(`Error de carga: ${uploadResponse.status}`);

        const result = await uploadResponse.json();
        if (!result.secure_url) throw new Error('No se recibió URL de la imagen');

        return { id: upload.id, preview: upload.preview, url: result.secure_url };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        toast.error(`Error al subir imagen ${index + 1}: ${errorMessage}`);
        return { id: upload.id, preview: upload.preview, error: errorMessage };
      }
    });

    const results = await Promise.all(uploadPromises);

    if (showPreviews) {
      setFiles(prev => {
        const updated = prev.map(f => {
          const result = results.find(r => r.id === f.id);
          if (!result) return f;
          return {
            ...f,
            isLoading: false,
            url: result.url,
            error: result.error,
          };
        });
        return updated;
      });
    }

    const successCount = results.filter(r => r.url).length;
    if (successCount > 0) {
      toast.success(`${successCount} imagen${successCount > 1 ? 'es' : ''} subida${successCount > 1 ? 's' : ''} correctamente`);
    }
  }, [maxSizeMB, onUploadChange, showPreviews, initialUrls, files, maxImages]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(rejected => {
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
    if (acceptedFiles.length > 0) handleUpload(acceptedFiles);
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: multiple ? maxImages : 1,
    noClick: !!children,
    noKeyboard: true,
    multiple,
  });

  const removeImage = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
    toast.info('Imagen eliminada');
  }, []);

  const uploadedCount = files.filter(f => f.url && !f.error).length;
  const isAtMax = uploadedCount >= maxImages;
  const meetsMinimum = uploadedCount >= minImages;

  return (
    <div className="space-y-4">

      {/* Contador de imágenes */}
      {showPreviews && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {meetsMinimum ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
            <span className={meetsMinimum
              ? "text-green-600 dark:text-green-400 font-medium"
              : "text-amber-600 dark:text-amber-400"
            }>
              {uploadedCount} de {maxImages} imágenes
              {!meetsMinimum && ` (mínimo ${minImages})`}
            </span>
          </div>
          {files.some(f => !f.isLoading && !f.error && f.url) && (
            <span className="text-xs text-muted-foreground">
              Arrastra para reordenar · Primera = portada
            </span>
          )}
          {isAtMax && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Límite alcanzado
            </span>
          )}
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={!children ? `border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isAtMax
            ? 'border-muted cursor-not-allowed opacity-60'
            : isDragActive
            ? 'border-primary bg-primary/5 scale-[1.02] cursor-pointer'
            : 'border-border hover:border-primary/50 hover:bg-muted/30 cursor-pointer'
        }` : 'contents'}
      >
        <input {...getInputProps()} disabled={isAtMax} />
        {children ? (
          <div onClick={!isAtMax ? open : undefined} role="button"
            className={isAtMax ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}>
            {children}
          </div>
        ) : (
          <>
            <UploadCloud className={`mx-auto h-10 w-10 mb-3 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-sm font-medium text-foreground">
              {isAtMax
                ? `Máximo de ${maxImages} imágenes alcanzado`
                : isDragActive
                ? '¡Suelta las imágenes aquí!'
                : 'Arrastra imágenes aquí o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WEBP · Máx {maxSizeMB * 5}MB por imagen · Mínimo {minImages} · Máximo {maxImages}
            </p>
            <Button
              type="button" variant="outline" size="sm"
              className="mt-4" disabled={isAtMax}
              onClick={(e) => { e.stopPropagation(); if (!isAtMax) open(); }}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Seleccionar imágenes
            </Button>
          </>
        )}
      </div>

      {/* ✅ FIX #16: Grid con drag-and-drop */}
      {showPreviews && files.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={files.map(f => f.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {files.map((file, index) => (
                <SortableImage
                  key={file.id}
                  file={file}
                  index={index}
                  onRemove={removeImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Hint de portada */}
      {showPreviews && files.filter(f => f.url && !f.error).length > 1 && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Star className="w-3 h-3 text-primary fill-primary" />
          La primera imagen es la foto de portada del anuncio. Arrastra para cambiarla.
        </p>
      )}
    </div>
  );
};