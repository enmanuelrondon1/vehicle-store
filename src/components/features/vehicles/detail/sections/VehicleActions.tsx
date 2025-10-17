//src/components/features/vehicles/detail/sections/VehicleActions.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex items-center justify-between mb-8">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavorite}
          disabled={isLoadingFavorite}
          className={`disabled:opacity-50 disabled:cursor-not-allowed ${
            isFavorited ? "text-red-600 hover:text-red-700" : ""
          }`}
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorited ? "fill-current" : "group-hover:fill-red-100"
            }`}
          />
        </Button>
        <Button variant="ghost" size="icon" onClick={onShare}>
          <Share2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};