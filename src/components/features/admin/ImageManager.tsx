// src/components/features/admin/ImageManager.tsx
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, Loader2, Upload, ImageOff, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/shared/forms/ImageUploader";
import { toast } from "sonner";

interface ImageManagerProps {
  vehicleId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  isSubmitting?: boolean; // Prop para deshabilitar todo el formulario
}

export default function ImageManager({
  vehicleId,
  images,
  onImagesChange,
  isSubmitting = false,
}: ImageManagerProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 1. MANEJADOR DE ELIMINACIÓN CON useCallback
  const handleDelete = useCallback(async (imageUrl: string) => {
    if (isSubmitting) return;
    setIsDeleting(imageUrl);
    try {
      const response = await fetch(`/api/admin/vehicles/${vehicleId}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar la imagen.");
      }

      const newImageList = images.filter((img) => img !== imageUrl);
      onImagesChange(newImageList);
      toast.success("Imagen eliminada correctamente.");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la imagen.");
    } finally {
      setIsDeleting(null);
    }
  }, [vehicleId, images, onImagesChange, isSubmitting]);

  // 2. MANEJADOR DE SUBIDA CON useCallback
  const handleUploadChange = useCallback((newUrls: string[]) => {
    if (isSubmitting) return;
    if (images.length + newUrls.length > 10) {
      toast.error("No puedes subir más de 10 imágenes en total.");
      return;
    }
    const updatedImages = [...images, ...newUrls];
    onImagesChange(updatedImages);
  }, [images, onImagesChange, isSubmitting]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Imágenes
          <span className="text-sm text-muted-foreground ml-2">
            ({images.length}/10)
          </span>
        </h3>
      </div>

      {/* 3. GRID DE IMÁGENES CON MEJOR RESPONSIVIDAD */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {images.map((url, index) => (
          <div key={url} className="relative aspect-square group">
            <Image
              src={url}
              alt="Imagen del vehículo"
              className={cn(
                "w-full h-full object-cover rounded-lg shadow-md transition-all duration-300",
                isSubmitting && "opacity-50"
              )}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16.6vw"
            />
            {/* 4. INDICADOR DE IMAGEN DE PORTADA */}
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                Portada
              </div>
            )}
            {/* 5. BOTÓN DE ELIMINAR MEJORADO */}
            <button
              onClick={() => handleDelete(url)}
              disabled={isDeleting === url || isSubmitting}
              className={cn(
                "absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 shadow-lg transition-all duration-200 focus:opacity-100 focus:scale-110 group-hover:opacity-100 group-hover:scale-110 opacity-0",
                (isDeleting === url || isSubmitting) && "cursor-not-allowed opacity-50"
              )}
              type="button"
              aria-label="Eliminar imagen"
            >
              {isDeleting === url ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}

        {/* 6. BOTÓN DE AÑADIR IMAGEN MEJORADO */}
        {images.length < 10 && !isSubmitting && (
          <ImageUploader
            onUploadChange={handleUploadChange}
            initialUrls={[]}
            multiple={true}
            showPreviews={false}
          >
            <div className="relative aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary hover:bg-muted/50 transition-all duration-200 cursor-pointer group">
              <Upload className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <span className="mt-2 text-xs text-center font-medium">Añadir</span>
            </div>
          </ImageUploader>
        )}
      </div>

      {/* 7. ESTADO VACÍO MEJORADO */}
      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ImageOff className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            No hay imágenes. Agrega al menos una para mostrar el vehículo.
          </p>
        </div>
      )}
    </div>
  );
}