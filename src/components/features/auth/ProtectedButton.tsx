"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDarkMode } from "@/context/DarkModeContext";
import { Button } from "@/components/ui/button";
import { User, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProtectedButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isMobile?: boolean;
}

const ProtectedButton = ({ href, children, className = "" }: ProtectedButtonProps) => {
  const { isDarkMode } = useDarkMode();
  // Solución: Solo desestructura 'status' ya que 'session' no se usa
  const { status } = useSession();
  const [open, setOpen] = useState(false);

  const buttonClasses = useMemo(() => {
    const baseClasses = `bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto`;
    return `${baseClasses} ${className}`;
  }, [className]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (status !== "authenticated") {
        e.preventDefault();
        setOpen(true);
        return;
      }
    },
    [status]
  );

  const handleGoToLogin = useCallback(() => {
    setOpen(false);
    window.location.href = `/login?callbackUrl=${href}`;
  }, [href]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Link href={href} className="block w-full" onClick={handleClick}>
            <Button className={buttonClasses}>
              {children}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </DialogTrigger>
        <DialogContent className={`${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} max-w-md`}>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className={`text-xl font-bold text-center mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              ¡Inicia Sesión para Continuar!
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className={`text-center mb-6 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Para acceder a esta sección necesitas tener una cuenta. 
            <br />
            <span className="font-medium">¡Es rápido y gratuito!</span>
          </DialogDescription>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGoToLogin}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <User className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className={`flex-1 ${isDarkMode ? "border-gray-600 hover:bg-gray-700 text-gray-300" : "border-gray-300 hover:bg-gray-50 text-gray-600"}`}
            >
              Cancelar
            </Button>
          </div>
          <div className="mt-4 text-center">
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => {
                  setOpen(false);
                  window.location.href = `/login?callbackUrl=${href}`;
                }}
                className="text-blue-500 hover:text-blue-600 font-medium underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProtectedButton;