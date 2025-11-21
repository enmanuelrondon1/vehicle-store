// src/components/features/vehicles/detail/sections/VehicleSummary.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Calendar,
  Car,
  MapPin,
  Eye,
  Award,
  Sparkles,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { VehicleDataFrontend } from "@/types/types";
import { formatMileage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

  const formatPriceDisplay = (price: number) => {
    const formattedNumber = new Intl.NumberFormat("es-ES", {
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
        const response = await fetch(
          `/api/vehicles/${vehicle._id}/user-rating`
        );
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

  const displayRating =
    userRating !== null ? userRating : currentVehicle.averageRating ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
      className="card-premium rounded-2xl overflow-hidden"
    >
      {/* Barra superior con gradiente */}
      <div
        className="h-1 w-full"
        style={{ background: "var(--gradient-accent)" }}
      />

      <div className="p-6 md:p-8">
        {/* Badges mejorados */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-wrap items-center gap-2 mb-6"
        >
          {vehicle.isFeatured && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge
                className="text-xs sm:text-sm font-bold px-3 py-1.5 flex items-center gap-1.5"
                style={{
                  background: "var(--gradient-accent)",
                  color: "#ffffff",
                }}
              >
                <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                Destacado
              </Badge>
            </motion.div>
          )}

          {vehicle.isNegotiable && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge
                className="text-xs sm:text-sm font-bold px-3 py-1.5 flex items-center gap-1.5"
                style={{
                  background: "var(--gradient-success)",
                  color: "#ffffff",
                }}
              >
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                Negociable
              </Badge>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge
              className="text-xs sm:text-sm font-bold px-3 py-1.5 flex items-center gap-1.5"
              style={{
                background: "var(--gradient-primary)",
                color: "var(--primary-foreground)",
              }}
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              Verificado
            </Badge>
          </motion.div>
        </motion.div>

        {/* Título mejorado */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-foreground tracking-tight">
            {currentVehicle.brand} {currentVehicle.model}{" "}
            <span className="text-muted-foreground font-normal">
              ({currentVehicle.year})
            </span>
          </h1>
        </motion.div>

        {/* Sistema de valoración */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-6"
        >
          {isLoadingRating ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <StarRating
                rating={displayRating}
                ratingCount={currentVehicle.ratingCount ?? 0}
                isInteractive={!isSubmittingRating && !!session}
                onRating={handleSetRating}
              />

              {userRating !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                >
                  <Star className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "var(--accent)" }} />
                  <span>Tu valoración: {userRating} estrellas</span>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {/* ✅ PRECIO MEJORADO - Más visible y profesional */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <p 
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-tight"
              style={{ color: "var(--accent)" }}
            >
              {formatPriceDisplay(currentVehicle.price)}
            </p>
            
            {/* Efecto de resplandor sutil */}
            <div
              className="absolute -bottom-2 left-0 h-3 w-full rounded-full blur-xl opacity-30"
              style={{ backgroundColor: "var(--accent)" }}
            />
          </div>
        </motion.div>

        {/* Detalles mejorados con mejor contraste */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all"
            style={{ 
              borderColor: "var(--border)",
              backgroundColor: "var(--muted)"
            }}
          >
            <Car className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <p className="text-sm font-semibold text-foreground text-center">
              {currentVehicle.transmission}
            </p>
            <p className="text-xs text-muted-foreground">Transmisión</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all"
            style={{ 
              borderColor: "var(--border)",
              backgroundColor: "var(--muted)"
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-20)" }}
            >
              <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>
                km
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground text-center">
              {formatMileage(currentVehicle.mileage)}
            </p>
            <p className="text-xs text-muted-foreground">Kilometraje</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all"
            style={{ 
              borderColor: "var(--border)",
              backgroundColor: "var(--muted)"
            }}
          >
            <MapPin className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <p className="text-sm font-semibold text-foreground text-center">
              {currentVehicle.location}
            </p>
            <p className="text-xs text-muted-foreground">Ubicación</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all"
            style={{ 
              borderColor: "var(--border)",
              backgroundColor: "var(--muted)"
            }}
          >
            <Eye className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <p className="text-sm font-semibold text-foreground text-center">
              {currentVehicle.views?.toLocaleString() || "0"}
            </p>
            <p className="text-xs text-muted-foreground">Vistas</p>
          </motion.div>
        </motion.div>

        {/* Indicador de actualización */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-center justify-center mt-6 text-xs text-muted-foreground"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-3 h-3 mr-1.5" style={{ color: "var(--accent)" }} />
          </motion.div>
          <span>Información actualizada en tiempo real</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const VehicleSummary = React.memo(_VehicleSummary);