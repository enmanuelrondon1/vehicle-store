// src/components/features/vehicles/detail/sections/RatingSection.tsx
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";

interface RatingSectionProps {
  vehicleId: string;
  averageRating: number;
  ratingCount: number;
  userRating?: number;
  onRatingSuccess: (data: { averageRating: number; ratingCount: number }) => void;
}

export const RatingSection: React.FC<RatingSectionProps> = ({
  vehicleId,
  averageRating,
  ratingCount,
  userRating: initialUserRating = 0,
  onRatingSuccess,
}) => {
  const { data: session } = useSession();
  const [userRating, setUserRating] = useState(initialUserRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = (rate: number) => {
    setUserRating(rate);
  };

  const handleSubmitRating = async () => {
    if (!session) {
      toast.error("Inicia sesión", {
        description: "Debes iniciar sesión para valorar un vehículo.",
      });
      return;
    }

    if (userRating === 0) {
      toast.warning("Selecciona una valoración", {
        description: "Por favor, selecciona de 1 a 5 estrellas.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: userRating }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("¡Gracias por tu valoración!", {
          description: "Tu opinión ha sido registrada.",
        });
        onRatingSuccess(result);
      } else {
        toast.error("Error al valorar", {
          description: result.error || "No se pudo enviar tu valoración.",
        });
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Error de red", {
        description: "No se pudo conectar con el servidor.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="bg-card p-6 rounded-2xl border border-border shadow-lg"
      variants={itemVariants}
    >
      <h3 className="text-xl font-bold mb-4 text-foreground">
        Valoración del Vehículo
      </h3>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Valoración media:</p>
        <StarRating rating={averageRating} ratingCount={ratingCount} />
      </div>

      {session && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-2">
            {initialUserRating > 0
              ? "Actualiza tu valoración:"
              : "Valora este vehículo:"}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <StarRating
              rating={userRating}
              onRating={handleRating}
              isInteractive={true}
              showRatingValue={false}
            />
            <Button
              onClick={handleSubmitRating}
              disabled={isSubmitting || userRating === 0}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Enviando..." : "Enviar Valoración"}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};