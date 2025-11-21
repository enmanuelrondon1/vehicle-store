// src/components/features/vehicles/detail/sections/VehicleActions.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { ArrowLeft, Heart, Share2, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const [isSharing, setIsSharing] = useState(false);

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
            icon: <Heart className="w-4 h-4 fill-current" />,
          });
        } else {
          toast.info("Eliminado de favoritos", {
            description: "Este vehículo ha sido eliminado de tu lista de favoritos.",
            icon: <AlertCircle className="w-4 h-4" />,
          });
        }
      } else {
        toast.error("No se pudo actualizar favoritos", {
          description: "Por favor, inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos", {
        description: "Ocurrió un problema inesperado. Por favor, inténtalo de nuevo.",
      });
      console.error("Error updating favorite status:", error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    
    try {
      const vehicleUrl = `${window.location.origin}/vehicles/${vehicleId}`;
      const shareData = {
        title: `Vehículo en 1Auto.market`,
        text: `Mira este increíble vehículo en 1Auto.market`,
        url: vehicleUrl,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          toast.success("Compartido exitosamente", {
            description: "El enlace del vehículo ha sido compartido.",
            icon: <Share2 className="w-4 h-4" />,
          });
        } catch (error) {
          console.log("Share was cancelled or failed", error);
        }
      } else {
        try {
          await navigator.clipboard.writeText(vehicleUrl);
          toast.success("Enlace copiado", {
            description: "El enlace del vehículo ha sido copiado al portapapeles.",
            icon: <CheckCircle className="w-4 h-4" />,
          });
        } catch {
          toast.error("No se pudo copiar el enlace", {
            description: "Tu navegador no permite copiar enlaces automáticamente.",
            icon: <AlertCircle className="w-4 h-4" />,
          });
        }
      }
    } catch (error) {
      toast.error("Error al compartir", {
        description: "Ocurrió un problema al intentar compartir el vehículo.",
        icon: <AlertCircle className="w-4 h-4" />,
      });
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <div className="card-glass rounded-2xl shadow-hard border border-border/50 overflow-hidden sticky top-0 z-50">
        {/* Efecto de brillo superior */}
        <div
          className="h-1 w-full"
          style={{ background: "var(--gradient-primary)" }}
        />
        
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            {/* Botón de volver */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 font-medium"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid var(--border)",
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
            </motion.div>

            {/* Contenedor de acciones principales */}
            <div className="flex items-center gap-3">
              {/* Botón de favoritos */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={isFavorited ? "default" : "outline"}
                  size="sm"
                  onClick={handleFavorite}
                  disabled={isLoadingFavorite}
                  className={cn(
                    "gap-2 transition-all duration-300",
                    isFavorited
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500 shadow-md shadow-red-500/25"
                      : "hover:bg-red-50 hover:border-red-200 hover:text-red-500 dark:hover:bg-red-950/20"
                  )}
                  style={{
                    backgroundColor: isFavorited ? "var(--destructive)" : "transparent",
                    borderColor: isFavorited ? "var(--destructive)" : "var(--border)",
                    color: isFavorited ? "var(--destructive-foreground)" : "var(--foreground)",
                  }}
                >
                  <motion.div
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
                  
                  {/* Indicador de carga */}
                  <AnimatePresence>
                    {isLoadingFavorite && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md"
                      >
                        <div className="w-4 h-4 border-2 border-foreground/30 border-t-transparent animate-spin" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              {/* Botón de compartir */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="gap-2 transition-all duration-300 hover:bg-accent/10 hover:border-accent/20"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <motion.div
                    animate={{ rotate: isSharing ? [0, 90, 180, 270] : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.div>
                  <span className="hidden sm:inline">Compartir</span>
                  
                  {/* Indicador de carga */}
                  <AnimatePresence>
                    {isSharing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md"
                      >
                        <div className="w-4 h-4 border-2 border-foreground/30 border-t-transparent animate-spin" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>

            {/* Badge de verificación */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Badge
                className="text-xs font-bold px-3 py-1"
                style={{
                  background: "var(--gradient-success)",
                  color: "var(--success-foreground)",
                }}
              >
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Verificado
                </div>
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};