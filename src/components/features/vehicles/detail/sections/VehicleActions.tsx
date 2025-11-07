// src/components/features/vehicles/detail/sections/VehicleActions.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
// Importamos Framer Motion
import { motion } from "framer-motion";

interface VehicleActionsProps {
  vehicleId: string;
  isFavorited: boolean;
  onFavorite: () => void;
  onShare: () => void;
}

export const VehicleActions: React.FC<VehicleActionsProps> = ({
  vehicleId,
  isFavorited,
  onFavorite,
  onShare,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!session) {
      signIn();
      return;
    }

    if (isLoadingFavorite) return;

    setIsLoadingFavorite(true);

    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleId }),
      });

      if (response.ok) {
        const data = await response.json();
        const isNowFavorited = data.action === "added";
        onFavorite();
        if (isNowFavorited) {
          toast.success("Añadido a favoritos", {
            description: "Este vehículo ahora está en tu lista de favoritos.",
          });
        } else {
          toast.info("Eliminado de favoritos", {
            description: "Este vehículo ha sido eliminado de tu lista de favoritos.",
          });
        }
      } else {
        toast.error("No se pudo actualizar favoritos", {
          description: "Por favor, inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos", {
        description: "Ocurrió un problema de conexión. Por favor, inténtalo de nuevo.",
      });
      console.error("Error updating favorite status:", error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      {/* Envuelve la tarjeta con motion.div para la animación de entrada */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} // Comienza invisible y 20px arriba
        animate={{ opacity: 1, y: 0 }}    // Animar a visible y su posición original
        transition={{ duration: 0.5, ease: "easeOut" }} // Duración y suavizado
      >
        <Card className="shadow-lg border-border/50 backdrop-blur-md bg-card/90 sticky top-0 z-40">
          <CardContent className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver</span>
            </Button>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isFavorited ? "default" : "outline"}
                    size="sm"
                    onClick={handleFavorite}
                    disabled={isLoadingFavorite}
                    className={cn(
                      "gap-2 transition-all duration-300",
                      "hover:scale-105 active:scale-95", // Micro-interacción al hacer click
                      isFavorited
                        ? "bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-md shadow-red-500/25"
                        : "hover:bg-red-50 hover:border-red-200 hover:text-red-500 dark:hover:bg-red-950/20"
                    )}
                  >
                    <motion.div
                      // Animación específica para el icono del corazón
                      animate={{ scale: isFavorited ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4",
                          isFavorited && "fill-current"
                        )}
                      />
                    </motion.div>
                    <span className="hidden sm:inline">
                      {isFavorited ? "Guardado" : "Guardar"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShare}
                    className="transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="sr-only">Compartir</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compartir anuncio</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};