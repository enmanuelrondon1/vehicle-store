// src/components/features/home/hero/LoginModal.tsx
"use client";
import React, { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // <-- 1. Importa useRouter
import { siteConfig } from "@/config/site";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = memo(({ isOpen, onClose }) => {
  const router = useRouter(); // <-- 2. Usa el hook de Next.js

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleLoginRedirect = useCallback(() => {
    onClose();
    // --- 3. Usa router.push para una navegación SPA fluida ---
    router.push(`/login?callbackUrl=${encodeURIComponent(siteConfig.paths.publishAd)}`);
  }, [onClose, router]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, rotateY: -15 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.7, opacity: 0, rotateY: 15 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              type: "spring",
              stiffness: 100,
            }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="relative rounded-2xl shadow-2xl border overflow-hidden bg-card text-card-foreground backdrop-blur-xl">
              {/* --- BARRA DE PROGRESO CON COLOR PRIMARIO --- */}
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
              />

              <div className="absolute inset-0 bg-gradient-to-br from-muted/5 via-transparent to-muted/5" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10 p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                  className="flex justify-center mb-6"
                >
                  <div className="p-4 rounded-full bg-primary text-primary-foreground shadow-2xl">
                    <User className="w-10 h-10" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                >
                  ¡Bienvenido de vuelta!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="mb-8 leading-relaxed text-muted-foreground text-lg"
                >
                  Para publicar tu anuncio de vehículo necesitas tener una cuenta.
                  <br />
                  <span className="font-medium text-foreground">
                    ¡Es rápido, seguro y gratuito!
                  </span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 mb-6"
                >
                  <Button
                    onClick={handleLoginRedirect}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg py-6"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 transition-all duration-200"
                  >
                    Cancelar
                  </Button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="text-sm text-muted-foreground"
                >
                  ¿No tienes cuenta?{" "}
                  <button
                    onClick={handleLoginRedirect}
                    className="text-primary hover:text-primary/80 font-medium underline transition-colors"
                  >
                    Regístrate aquí
                  </button>
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
)

LoginModal.displayName = "LoginModal";