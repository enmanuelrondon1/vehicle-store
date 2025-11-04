// src/components/features/admin/ImageManager.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Loader2, Upload } from "lucide-react";
import { ImageUploader } from "@/components/shared/forms/ImageUploader";
import { toast } from "sonner";

interface ImageManagerProps {
  vehicleId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export default function ImageManager({
  vehicleId,
  images,
  onImagesChange,
}: ImageManagerProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (imageUrl: string) => {
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
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la imagen."
      );
    } finally {
      setIsDeleting(null);
    }
  };

  // 🎯 CAMBIO PRINCIPAL: Simplificado para trabajar con ImageUploader
  const handleUploadChange = (newUrls: string[]) => {
    console.log('📸 Nuevas URLs recibidas de ImageUploader:', newUrls);
    
    if (images.length + newUrls.length > 10) {
      toast.error("No puedes subir más de 10 imágenes en total.");
      return;
    }
    
    // Combinar imágenes existentes con las nuevas
    const updatedImages = [...images, ...newUrls];
    console.log('✅ Actualizando lista de imágenes:', updatedImages);
    
    // Actualizar el estado del formulario
    onImagesChange(updatedImages);
  };

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

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {/* Imágenes existentes */}
        {images.map((url) => (
          <div key={url} className="relative aspect-square group">
            <Image
              src={url}
              alt="Imagen del vehículo"
              className="w-full h-full object-cover rounded-lg shadow-md"
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16.6vw"
            />
            <button
              onClick={() => handleDelete(url)}
              disabled={isDeleting === url}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg group-hover:opacity-100 opacity-0 transition-opacity focus:opacity-100 disabled:opacity-50"
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

        {/* Botón de subida */}
        {images.length < 10 && (
          <ImageUploader 
            onUploadChange={handleUploadChange}
            initialUrls={[]} // 🔥 No pasar initialUrls aquí
            multiple={true}
            showPreviews={false} // 🔥 No mostrar previews dentro del uploader
          >
            <div className="relative aspect-square flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
              <Upload className="h-8 w-8" />
              <span className="mt-2 text-xs text-center">Añadir</span>
            </div>
          </ImageUploader>
        )}
      </div>

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No hay imágenes. Agrega al menos una.
        </p>
      )}
    </div>
  );
}