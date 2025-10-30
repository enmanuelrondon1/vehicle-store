//src/components/features/vehicles/detail/sections/VehicleActions.tsx
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
        onFavorite(); // Notifica al componente padre para que actualice el estado
        if (isNowFavorited) {
          toast.success("Añadido a favoritos", {
            description: "Este vehículo ahora está en tu lista de favoritos.",
          });
        } else {
          toast.info("Eliminado de favoritos", {
            description:
              "Este vehículo ha sido eliminado de tu lista de favoritos.",
          });
        }
      } else {
        toast.error("No se pudo actualizar favoritos", {
          description: "Por favor, inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos", {
        description:
          "Ocurrió un problema de conexión. Por favor, inténtalo de nuevo.",
      });
      console.error("Error updating favorite status:", error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </Button>
        <div className="flex items-center gap-1 rounded-full border bg-background p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                disabled={isLoadingFavorite}
                className="rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorited
                      ? "text-red-500 fill-red-500"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="sr-only">
                  {isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"}
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
                variant="ghost"
                size="icon"
                onClick={onShare}
                className="rounded-full"
              >
                <Share2 className="w-5 h-5 text-muted-foreground" />
                <span className="sr-only">Compartir</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Compartir</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};