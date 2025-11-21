// src/components/shared/Navbar/AnimatedPostButton.tsx (versión mejorada)
"use client";

import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, User, Sparkles } from "lucide-react";
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
    const baseClasses = "btn-accent relative overflow-hidden rounded-full font-bold text-accent-foreground transition-all duration-300 shadow-lg hover:shadow-xl group glow-effect";
    const sizeClasses = isMobile ? "w-full px-6 py-4 text-base" : "px-6 py-3 text-sm";
    return `${baseClasses} ${sizeClasses}`;
  }, [isMobile]);

  // Efecto shimmer dorado premium mejorado
  const ShimmerEffect = (
    <motion.div
      className="absolute inset-0 opacity-30"
      style={{
        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)'
      }}
      initial={{ x: "-100%" }}
      whileHover={{ x: "100%" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    />
  );

  // Efecto de partículas brillantes
  const SparklesEffect = (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -10, -20],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );

  const ButtonContent = (
    <motion.button
      className={buttonClasses}
      onClick={handleButtonClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {ShimmerEffect}
      {SparklesEffect}
      <div className="relative flex items-center gap-3">
        <motion.span
          animate={{ rotate: isLoading ? 360 : 0 }}
          transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </motion.span>
        <span className="tracking-wide font-semibold">
          {isLoading ? "Cargando..." : "¡Publica tu Anuncio!"}
        </span>
      </div>
    </motion.button>
  );

  // Variante para mobile con animación de entrada
  const MobileWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring" }}
    >
      {children}
    </motion.div>
  );

  const DesktopWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.div>
  );

  const Wrapper = isMobile ? MobileWrapper : DesktopWrapper;

  return (
    <Wrapper>
      {isAuthenticated ? (
        <Link href={siteConfig.paths.publishAd} onClick={onClick} className="block w-full" passHref>
          {ButtonContent}
        </Link>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {ButtonContent}
          </DialogTrigger>
          <DialogContent className="card-glass max-w-md p-0 overflow-hidden">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <DialogHeader className="p-6 pb-4 border-b border-glass-border" style={{ background: 'var(--gradient-hero)' }}>
                <div className="flex justify-center mb-4">
                  <motion.div 
                    className="p-3 rounded-full glow-effect"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <User className="w-8 h-8" />
                  </motion.div>
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
                    className="font-semibold underline-offset-4 hover:underline cursor-pointer flex items-center gap-1 mx-auto"
                    style={{ color: 'var(--accent)' }}
                  >
                    <Sparkles className="w-3 h-3" />
                    Regístrate aquí
                  </button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </Wrapper>
  );
};

AnimatedPostButton.displayName = "AnimatedPostButton";
export default AnimatedPostButton;