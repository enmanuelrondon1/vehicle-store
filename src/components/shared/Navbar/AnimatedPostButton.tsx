// src/components/shared/Navbar/AnimatedPostButton.tsx
"use client";
import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogTrigger,
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
  const [open, setOpen] = useState(false);

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.push(siteConfig.paths.publishAd);
    } else {
      e.preventDefault();
      setOpen(true);
    }
    onClick?.();
  }, [isAuthenticated, isLoading, router, onClick]);

  const handleGoToLogin = useCallback(() => {
    setOpen(false);
    router.push(`/login?callbackUrl=${encodeURIComponent(siteConfig.paths.publishAd)}`);
  }, [router]);

  const buttonClasses = useMemo(() => {
    const base = "btn-accent relative overflow-hidden rounded-full font-bold text-accent-foreground transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 active:scale-95 glow-effect";
    const size = isMobile ? "w-full px-6 py-4 text-base" : "px-6 py-3 text-sm";
    return `${base} ${size}`;
  }, [isMobile]);

  const ButtonContent = (
    <button className={buttonClasses} onClick={handleButtonClick}>
      {/* Shimmer con CSS puro */}
      <span className="absolute inset-0 -skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      <span className="relative flex items-center gap-3">
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
        <span className="tracking-wide font-semibold">
          {isLoading ? "Cargando..." : "¡Publica tu Anuncio!"}
        </span>
      </span>
    </button>
  );

  return (
    <div className={isMobile ? "animate-in slide-in-from-bottom-4 duration-300" : "animate-in slide-in-from-left-4 duration-300"}>
      {isAuthenticated ? (
        <Link href={siteConfig.paths.publishAd} onClick={onClick} className="block w-full">
          {ButtonContent}
        </Link>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {ButtonContent}
          </DialogTrigger>
          <DialogContent className="card-glass max-w-md p-0 overflow-hidden">
            <DialogHeader
              className="p-6 pb-4 border-b border-glass-border"
              style={{ background: "var(--gradient-hero)" }}
            >
              <div className="flex justify-center mb-4">
                <div
                  className="p-3 rounded-full transition-transform duration-200 hover:scale-110 hover:rotate-3"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  <User className="w-8 h-8" />
                </div>
              </div>
              <DialogTitle className="text-xl font-heading font-bold text-center text-gradient">
                ¡Inicia Sesión para Continuar!
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-4">
              <DialogDescription className="text-center mb-6 leading-relaxed text-muted-foreground">
                Para publicar tu anuncio necesitas tener una cuenta.
                <br />
                <span className="font-semibold text-foreground">¡Es rápido y gratuito!</span>
              </DialogDescription>
              <div className="flex flex-col gap-3">
                <Button onClick={handleGoToLogin} className="btn-primary">
                  <User className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">¿No tienes cuenta? </span>
                <button
                  onClick={handleGoToLogin}
                  className="font-semibold underline-offset-4 hover:underline flex items-center gap-1 mx-auto"
                  style={{ color: "var(--accent)" }}
                >
                  <Sparkles className="w-3 h-3" />
                  Regístrate aquí
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

AnimatedPostButton.displayName = "AnimatedPostButton";
export default AnimatedPostButton;