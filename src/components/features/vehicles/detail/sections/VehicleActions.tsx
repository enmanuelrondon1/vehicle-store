// src/components/features/vehicles/detail/sections/VehicleActions.tsx
// ✅ OPTIMIZADO: eliminado framer-motion completamente.
//    Este componente es sticky (top-0 z-50) — siempre visible en la página.
//    Tenía:
//    - motion.div whileHover/whileTap en 3 botones
//    - AnimatePresence para spinners de carga (reemplazado por CSS opacity)
//    - motion.div animate scale en el ícono Heart al marcar favorito
//    - motion.div animate rotate en Share2 al compartir
//    Todo reemplazado por CSS transitions.

"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { ArrowLeft, Heart, Share2, Shield, CheckCircle, AlertCircle } from "lucide-react";
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
    if (!session) { signIn(); return; }
    if (isLoadingFavorite) return;
    setIsLoadingFavorite(true);
    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId }),
      });
      if (response.ok) {
        const data = await response.json();
        const isNowFavorited = data.action === "added";
        onFavorite();
        if (isNowFavorited) {
          toast.success("Añadido a favoritos", { description: "Este vehículo ahora está en tu lista de favoritos.", icon: <Heart className="w-4 h-4 fill-current" /> });
        } else {
          toast.info("Eliminado de favoritos", { description: "Este vehículo ha sido eliminado de tu lista de favoritos.", icon: <AlertCircle className="w-4 h-4" /> });
        }
      } else {
        toast.error("No se pudo actualizar favoritos");
      }
    } catch {
      toast.error("Error al actualizar favoritos");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const vehicleUrl = `${window.location.origin}/vehicles/${vehicleId}`;
      if (navigator.share) {
        try {
          await navigator.share({ title: "Vehículo en 1Auto.market", text: "Mira este increíble vehículo en 1Auto.market", url: vehicleUrl });
          toast.success("Compartido exitosamente", { icon: <Share2 className="w-4 h-4" /> });
        } catch {}
      } else {
        try {
          await navigator.clipboard.writeText(vehicleUrl);
          toast.success("Enlace copiado", { icon: <CheckCircle className="w-4 h-4" /> });
        } catch {
          toast.error("No se pudo copiar el enlace");
        }
      }
    } catch {
      toast.error("Error al compartir");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    // ✅ animate-fade-in CSS en lugar de motion.div initial/animate
    <div className="w-full animate-fade-in mb-6">
      <div className="card-glass rounded-2xl shadow-hard border border-border/50 overflow-hidden sticky top-0 z-50">
        <div className="h-1 w-full" style={{ background: "var(--gradient-primary)" }} />

        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">

            {/* Botón volver */}
            {/* ✅ motion.div whileHover/whileTap → hover:scale active:scale CSS */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 font-medium hover:scale-[1.05] active:scale-[0.95]"
              style={{ backgroundColor: "transparent", border: "1px solid var(--border)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver</span>
            </Button>

            {/* Acciones */}
            <div className="flex items-center gap-3">

              {/* Favoritos */}
              <div className="relative">
                <Button
                  variant={isFavorited ? "default" : "outline"}
                  size="sm"
                  onClick={handleFavorite}
                  disabled={isLoadingFavorite}
                  className={cn(
                    "gap-2 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]",
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
                  {/* ✅ motion.div animate scale → CSS transition */}
                  <Heart
                    className={cn(
                      "w-4 h-4 transition-transform duration-300",
                      isFavorited ? "fill-current scale-125" : "scale-100"
                    )}
                  />
                  <span className="hidden sm:inline">{isFavorited ? "Guardado" : "Guardar"}</span>
                </Button>

                {/* ✅ AnimatePresence spinner → CSS opacity transition */}
                {isLoadingFavorite && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                    <div className="w-4 h-4 border-2 border-foreground/30 border-t-transparent animate-spin rounded-full" />
                  </div>
                )}
              </div>

              {/* Compartir */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="gap-2 transition-all duration-300 hover:bg-accent/10 hover:border-accent/20 hover:scale-[1.05] active:scale-[0.95]"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  {/* ✅ motion.div animate rotate → CSS transition */}
                  <Share2
                    className="w-4 h-4 transition-transform duration-300"
                    style={{ transform: isSharing ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                  <span className="hidden sm:inline">Compartir</span>
                </Button>

                {/* ✅ AnimatePresence spinner → CSS opacity */}
                {isSharing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                    <div className="w-4 h-4 border-2 border-foreground/30 border-t-transparent animate-spin rounded-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Badge verificado */}
            <Badge
              className="text-xs font-bold px-3 py-1 animate-fade-in"
              style={{ animationDelay: "200ms", animationFillMode: "both", background: "var(--gradient-success)", color: "var(--success-foreground)" }}
            >
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Verificado
              </div>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};