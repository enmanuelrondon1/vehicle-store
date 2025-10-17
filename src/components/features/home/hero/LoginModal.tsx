// src/components/features/home/hero/LoginModal.tsx
"use client";
import React, { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site"; // 1. Importar siteConfig

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = memo(({ isOpen, onClose }) => {
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleLoginRedirect = useCallback(() => {
    onClose();
    // 2. Usar la ruta desde siteConfig
    window.location.href = "/login?callbackUrl=" + encodeURIComponent(siteConfig.paths.publishAd);
  }, [onClose]);

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.7, opacity: 0, rotateY: -15 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.7, opacity: 0, rotateY: 15 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.1,
              type: "spring",
              stiffness: 100
            }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="relative rounded-2xl shadow-2xl border overflow-hidden bg-white/95 dark:bg-gray-800/95 border-gray-200 dark:border-gray-700 backdrop-blur-xl">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-[length:200%_100%]"
              />
              
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 dark:from-white/10 dark:to-black/10" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 backdrop-blur-sm"
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
                  <div className="p-4 rounded-full bg-gradient-to-r from-primary to-indigo-500 shadow-2xl">
                    <User className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent"
                >
                  {"¡Bienvenido de vuelta!"}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="mb-8 leading-relaxed text-gray-600 dark:text-gray-300 text-lg"
                >
                  {"Para publicar tu anuncio de vehículo necesitas tener una cuenta."}
                  <br />
                  <span className="font-medium text-primary">
                    {"¡Es rápido, seguro y gratuito!"}
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
                    className="flex-1 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg py-6"
                  >
                    <User className="w-5 h-5 mr-2" />
                    {"Iniciar Sesión"}
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 transition-all duration-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-lg py-6"
                  >
                    {"Cancelar"}
                  </Button>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  {"¿No tienes cuenta?"}{" "}
                  <button
                    onClick={handleLoginRedirect}
                    className="text-primary hover:text-primary/90 font-medium underline transition-colors"
                  >
                    {"Regístrate aquí"}
                  </button>
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

LoginModal.displayName = "LoginModal";