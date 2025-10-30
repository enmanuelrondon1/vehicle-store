// src/components/shared/Navbar/AnimatedPostButton.tsx
"use client";

import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

interface AnimatedPostButtonProps {
  isMobile?: boolean;
  onClick?: () => void;
}

const AnimatedPostButton = ({ isMobile = false, onClick }: AnimatedPostButtonProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const isAuthenticated = status === "authenticated" && session?.user;
  const isLoading = status === "loading";

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.push(siteConfig.paths.publishAd);
    } else {
      e.preventDefault();
      setOpen(true);
    }
  }, [isAuthenticated, isLoading, router]);

  const handleGoToLogin = useCallback(() => {
    setOpen(false);
    window.location.href = "/login?callbackUrl=" + encodeURIComponent(siteConfig.paths.publishAd);
  }, []);

  const buttonClasses = useMemo(() => {
    const baseClasses = "relative overflow-hidden rounded-full font-bold text-accent-foreground transition-all duration-300 shadow-lg hover:shadow-xl group";
    const sizeClasses = isMobile ? "w-full p-4 text-lg" : "px-6 py-3 text-sm";
    const colorClasses = "bg-accent hover:bg-accent/90";
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  }, [isMobile]);

  if (isLoading) {
    return (
      <div className={`relative ${isMobile ? "w-full" : ""}`}>
        <div className={buttonClasses}>
          <div className="relative flex items-center justify-center gap-3 opacity-80">
            <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
            <span className="tracking-wide">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isMobile ? "w-full" : ""}`}>
      {isAuthenticated ? (
        <Link href={siteConfig.paths.publishAd} onClick={onClick} className={`block ${isMobile ? "w-full" : ""}`} aria-label="Publicar nuevo anuncio de vehículo">
          <motion.div
            className={buttonClasses}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <div className="relative flex items-center justify-center gap-3">
              <Plus className="w-5 h-5" />
              <span className="tracking-wide">¡Publica tu Anuncio!</span>
            </div>
          </motion.div>
        </Link>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {/* ¡El cambio clave está aquí! Usamos motion.button y movemos todas las clases y props. */}
            <motion.button
              className={buttonClasses}
              onClick={handleClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Publicar nuevo anuncio de vehículo"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <div className="relative flex items-center justify-center gap-3">
                <Plus className="w-5 h-5" />
                <span className="tracking-wide">¡Publica tu Anuncio!</span>
              </div>
            </motion.button>
          </DialogTrigger>
          <DialogContent className="bg-card text-card-foreground border-border max-w-md">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary text-primary-foreground">
                  <User className="w-8 h-8" />
                </div>
              </div>
              <DialogTitle className="text-xl font-heading font-bold text-center mb-3">
                ¡Inicia Sesión para Continuar!
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-center mb-6 leading-relaxed text-muted-foreground">
              Para publicar tu anuncio de vehículo necesitas tener una cuenta.
              <br />
              <span className="font-medium text-foreground">¡Es rápido y gratuito!</span>
            </DialogDescription>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleGoToLogin} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <User className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
              <Button onClick={() => setOpen(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => {
                    setOpen(false);
                    window.location.href = "/login?callbackUrl=" + encodeURIComponent(siteConfig.paths.publishAd);
                  }}
                  className="text-primary hover:text-primary/80 font-medium underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

AnimatedPostButton.displayName = "AnimatedPostButton";
export default AnimatedPostButton;