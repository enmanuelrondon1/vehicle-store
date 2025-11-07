// src/components/features/vehicles/detail/sections/VehicleSummary.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Star, Calendar, Car, MapPin, Eye, Award } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import type { VehicleDataFrontend } from "@/types/types";
import { formatMileage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "./StarRating";

interface VehicleSummaryProps {
  vehicle: VehicleDataFrontend;
}

const _VehicleSummary: React.FC<VehicleSummaryProps> = ({ vehicle }) => {
  const { data: session } = useSession();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(vehicle);
  const [isLoadingRating, setIsLoadingRating] = useState(true);

  // Función para formatear el precio con el símbolo de dólar al inicio
  const formatPriceDisplay = (price: number) => {
    // Formateamos el número con separadores de miles
    const formattedNumber = new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    
    return `$${formattedNumber}`;
  };

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!session?.user?.id) {
        setIsLoadingRating(false);
        return;
      }

      try {
        const response = await fetch(`/api/vehicles/${vehicle._id}/user-rating`);
        const data = await response.json();

        if (response.ok && data.userRating !== null) {
          setUserRating(data.userRating);
        } else {
          setUserRating(null);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
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
        setCurrentVehicle((prev) => ({
          ...prev,
          averageRating: data.averageRating,
          ratingCount: data.ratingCount,
        }));
        setUserRating(rating);
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

  const displayRating = userRating !== null ? userRating : (currentVehicle.averageRating ?? 0);

  return (
    <div 
      data-aos="fade-up" 
      data-aos-duration="800" 
      data-aos-easing="ease-out-cubic"
      data-aos-once="true"
    >
      <Card className="shadow-xl border-border/50 overflow-hidden bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Badges con diseño mejorado */}
          <div 
            className="flex flex-wrap items-center gap-2"
            data-aos="fade-down" 
            data-aos-duration="600" 
            data-aos-delay="100"
          >
            {vehicle.isFeatured && (
              <Badge variant="default" className="text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-md">
                <Award className="w-3.5 h-3.5 mr-1" />
                Destacado
              </Badge>
            )}
            {vehicle.isNegotiable && (
              <Badge variant="secondary" className="text-sm bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                Precio Negociable
              </Badge>
            )}
            <Badge variant="outline" className="text-sm font-medium bg-background/50 backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {vehicle.location}
            </Badge>
          </div>

          {/* Título con efecto de resaltado */}
          <div 
            className="relative"
            data-aos="fade-up" 
            data-aos-duration="700" 
            data-aos-delay="200"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
              {vehicle.brand} {vehicle.model}{" "}
              <span className="text-muted-foreground font-light">{vehicle.year}</span>
            </h1>
            <div className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
          </div>

          {/* Sistema de valoración mejorado */}
          <div 
            className="space-y-2"
            data-aos="fade-up" 
            data-aos-duration="700" 
            data-aos-delay="300"
          >
            {isLoadingRating ? (
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
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
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    Tu valoración: {userRating} estrellas
                  </p>
                )}
              </>
            )}
          </div>

          <Separator className="opacity-50" />

          {/* Precio y detalles con diseño mejorado */}
          <div 
            className="flex flex-col gap-6"
            data-aos="fade-up" 
            data-aos-duration="700" 
            data-aos-delay="400"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="relative">
                {/* ✅ CORRECCIÓN: Usamos la nueva función para formatear el precio */}
                <p className="text-5xl md:text-6xl font-extrabold text-primary">
                  {formatPriceDisplay(vehicle.price)}
                </p>
                <div className="absolute -bottom-1 left-0 w-full h-3 bg-primary/20 rounded-full blur-md"></div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                  <Car className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    {formatMileage(vehicle.mileage)} km
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                  <Eye className="w-5 h-5 text-primary" />
                  <span className="font-medium">{vehicle.views} vistas</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const VehicleSummary = React.memo(_VehicleSummary);