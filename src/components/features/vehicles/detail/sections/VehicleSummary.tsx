// src/components/features/vehicles/detail/sections/VehicleSummary.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Star, Calendar, Car, MapPin, Eye } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import type { VehicleDataFrontend } from "@/types/types";
import { formatPrice, formatMileage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";

interface VehicleSummaryProps {
  vehicle: VehicleDataFrontend;
}

const VehicleSummaryComponent: React.FC<VehicleSummaryProps> = ({
  vehicle,
}) => {
  const { data: session } = useSession();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(vehicle);
  const [isLoadingRating, setIsLoadingRating] = useState(true);

  // ✅ Cargar la valoración del usuario al montar
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!session?.user?.id) {
        console.log("❌ No hay sesión activa");
        setIsLoadingRating(false);
        return;
      }

      console.log("🔍 Buscando valoración para:");
      console.log("  - Vehicle ID:", vehicle._id);
      console.log("  - User ID:", session.user.id);

      try {
        const response = await fetch(
          `/api/vehicles/${vehicle._id}/user-rating`
        );
        const data = await response.json();

        console.log("📦 Respuesta del servidor:", data);

        if (response.ok && data.userRating !== null) {
          console.log("✅ Valoración encontrada:", data.userRating);
          setUserRating(data.userRating);
        } else {
          console.log("⚠️ No hay valoración previa para este usuario");
          setUserRating(null);
        }
      } catch (error) {
        console.error("❌ Error fetching user rating:", error);
      } finally {
        setIsLoadingRating(false);
      }
    };

    fetchUserRating();
  }, [session, vehicle._id]);

  const handleSetRating = async (rating: number) => {
    if (isSubmittingRating) return;

    if (!session) {
      toast.info("Debes iniciar sesión para valorar un vehículo.");
      signIn();
      return;
    }

    setIsSubmittingRating(true);
    try {
      const response = await fetch(`/api/vehicles/${vehicle._id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("¡Gracias por tu valoración!");
        
        // Actualizar el vehículo con los nuevos datos
        setCurrentVehicle((prev) => ({
          ...prev,
          averageRating: data.averageRating,
          ratingCount: data.ratingCount,
        }));
        
        // Actualizar la valoración del usuario
        setUserRating(rating);
        
        console.log("✅ Valoración guardada:", {
          userRating: rating,
          averageRating: data.averageRating,
          ratingCount: data.ratingCount
        });
      } else {
        toast.error(data.error || "No se pudo guardar la valoración.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Error al enviar la valoración.");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Determinar qué rating mostrar
  const displayRating = userRating !== null ? userRating : (currentVehicle.averageRating ?? 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {vehicle.isFeatured && (
          <Badge variant="special" className="text-sm">
            <Star className="w-3.5 h-3.5 mr-1" />
            Destacado
          </Badge>
        )}
        {vehicle.isNegotiable && (
          <Badge variant="secondary" className="text-sm">
            Precio Negociable
          </Badge>
        )}
        <Badge variant="outline" className="text-sm font-medium">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          {vehicle.location}
        </Badge>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
        {vehicle.brand} {vehicle.model}{" "}
        <span className="text-muted-foreground font-light">{vehicle.year}</span>
      </h1>

      <div className="mt-2">
        {isLoadingRating ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Cargando valoración...</span>
          </div>
        ) : (
          <>
            <StarRating
              rating={displayRating}
              ratingCount={currentVehicle.ratingCount ?? 0}
              isInteractive={!isSubmittingRating && !!session}
              onRating={handleSetRating}
            />
            {userRating !== null && (
              <p className="text-xs text-muted-foreground mt-1">
                Tu valoración: {userRating} estrellas
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
        <p className="text-5xl md:text-6xl font-extrabold text-primary">
          {formatPrice(vehicle.price)}
        </p>
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            <span className="font-medium">
              {formatMileage(vehicle.mileage)} km
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span className="font-medium">{vehicle.views} vistas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VehicleSummary = React.memo(VehicleSummaryComponent);