//src/components/features/vehicles/detail/sections/VehicleActions.tsx
"use client";

import { useDarkMode } from "@/context/DarkModeContext";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { ArrowLeft, Heart, Share2 } from "lucide-react";

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
  const { isDarkMode } = useDarkMode();
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
      <button
        onClick={() => router.back()}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
            : "bg-white hover:bg-gray-50 text-gray-700"
        } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>
      <div className="flex items-center gap-2">
        <button
          onClick={handleFavorite}
          disabled={isLoadingFavorite}
          className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isFavorited
              ? "bg-red-100 text-red-600"
              : isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
              : "bg-white hover:bg-gray-50 text-gray-700"
          } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={onShare}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
              : "bg-white hover:bg-gray-50 text-gray-700"
          } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};