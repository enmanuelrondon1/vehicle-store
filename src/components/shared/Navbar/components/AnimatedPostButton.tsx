// src/components/shared/Navbar/components/AnimatedPostButton.tsx
"use client";

import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, TrendingUp,  User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useDarkMode } from "@/context/DarkModeContext";
import { useRouter } from "next/navigation";

interface AnimatedPostButtonProps {
  isMobile?: boolean;
}

const AnimatedPostButton = ({ isMobile = false }: AnimatedPostButtonProps) => {
  const { isDarkMode } = useDarkMode();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const isAuthenticated = status === "authenticated" && session?.user;
  const isLoading = status === "loading";

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
    if (isAuthenticated) {
      e.preventDefault();
      router.push("/postAd");
    } else {
      e.preventDefault();
      setOpen(true);
    }
  }, [isAuthenticated, isLoading, router]);

  const handleGoToLogin = useCallback(() => {
    setOpen(false);
    window.location.href = "/login?callbackUrl=" + encodeURIComponent("/postAd");
  }, []);

  const buttonClasses = useMemo(() => {
    const baseClasses = "relative overflow-hidden rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 group cursor-pointer";
    const sizeClasses = isMobile ? "w-full p-4" : "px-6 py-3";
    const gradientClasses = "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500";
    const borderClasses = isDarkMode ? "border-white/20" : "border-white/30";
    return `${baseClasses} ${sizeClasses} ${gradientClasses} ${borderClasses}`;
  }, [isMobile, isDarkMode]);

  if (isLoading) {
    return (
      <motion.div className={`relative ${isMobile ? "w-full" : ""}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <div className={buttonClasses}>
          <div className="relative flex items-center justify-center gap-3 text-white font-bold opacity-50">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className={`${isMobile ? "text-lg" : "text-sm"} font-bold tracking-wide`}>Cargando...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className={`relative ${isMobile ? "w-full" : ""}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      {isAuthenticated ? (
        <Link href="/postAd" className={`block ${isMobile ? "w-full" : ""}`} aria-label="Publicar nuevo anuncio de vehículo">
          <div className={buttonClasses}>
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }} />
            <div className="relative flex items-center justify-center gap-3 text-white font-bold">
              <motion.div animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}>
                <Plus className="w-5 h-5" />
              </motion.div>
              <span className={`${isMobile ? "text-lg" : "text-sm"} font-bold tracking-wide`}>¡Publica tu Anuncio!</span>
              <motion.div animate={{ y: [-2, 2, -2], rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                <TrendingUp className="w-4 h-4 text-yellow-300" />
              </motion.div>
            </div>
            <motion.div className="absolute inset-0 rounded-full border-2 border-yellow-400/50" animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          </div>
        </Link>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button onClick={handleClick} className={`block ${isMobile ? "w-full" : ""}`} aria-label="Publicar nuevo anuncio de vehículo">
              <div className={buttonClasses}>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }} />
                <div className="relative flex items-center justify-center gap-3 text-white font-bold">
                  <motion.div animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}>
                    <Plus className="w-5 h-5" />
                  </motion.div>
                  <span className={`${isMobile ? "text-lg" : "text-sm"} font-bold tracking-wide`}>¡Publica tu Anuncio!</span>
                  <motion.div animate={{ y: [-2, 2, -2], rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                    <TrendingUp className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                </div>
                <motion.div className="absolute inset-0 rounded-full border-2 border-yellow-400/50" animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className={`${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} max-w-md`}>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              <DialogTitle className={`text-xl font-bold text-center mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>¡Inicia Sesión para Continuar!</DialogTitle>
            </DialogHeader>
            <DialogDescription className={`text-center mb-6 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Para publicar tu anuncio de vehículo necesitas tener una cuenta.
              <br />
              <span className="font-medium">¡Es rápido y gratuito!</span>
            </DialogDescription>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleGoToLogin} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-200">
                <User className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
              <Button onClick={() => setOpen(false)} variant="outline" className={`flex-1 ${isDarkMode ? "border-gray-600 hover:bg-gray-700 text-gray-300" : "border-gray-300 hover:bg-gray-50 text-gray-600"}`}>
                Cancelar
              </Button>
            </div>
            <div className="mt-4 text-center">
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                ¿No tienes cuenta?{" "}
                <button onClick={() => { setOpen(false); window.location.href = "/login?callbackUrl=" + encodeURIComponent("/postAd"); }} className="text-blue-500 hover:text-blue-600 font-medium underline">
                  Regístrate aquí
                </button>
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

AnimatedPostButton.displayName = "AnimatedPostButton";
export default AnimatedPostButton;