// src/components/features/home/hero/LoginModal.tsx
"use client";
import React, { memo, useCallback } from "react";
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = memo(({ isOpen, onClose }) => {
  const router = useRouter();

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const handleLoginRedirect = useCallback(() => {
    onClose();
    router.push(`/login?callbackUrl=${encodeURIComponent(siteConfig.paths.publishAd)}`);
  }, [onClose, router]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="relative z-10 w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="relative rounded-2xl shadow-2xl border overflow-hidden bg-card text-card-foreground">

          {/* Barra superior animada con CSS */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-shimmer bg-[length:200%_100%]" />

          <div className="absolute inset-0 bg-gradient-to-br from-muted/5 via-transparent to-muted/5 pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary text-primary-foreground shadow-2xl animate-in zoom-in duration-500 delay-100">
                <User className="w-10 h-10" />
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
              ¡Bienvenido de vuelta!
            </h2>

            <p className="mb-8 leading-relaxed text-muted-foreground text-lg animate-in fade-in duration-300 delay-200">
              Para publicar tu anuncio de vehículo necesitas tener una cuenta.
              <br />
              <span className="font-medium text-foreground">
                ¡Es rápido, seguro y gratuito!
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
              <Button
                onClick={handleLoginRedirect}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg py-6"
              >
                <User className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1 transition-all duration-200">
                Cancelar
              </Button>
            </div>

            <p className="text-sm text-muted-foreground animate-in fade-in duration-300 delay-500">
              ¿No tienes cuenta?{" "}
              <button
                onClick={handleLoginRedirect}
                className="text-primary hover:text-primary/80 font-medium underline transition-colors"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

LoginModal.displayName = "LoginModal";