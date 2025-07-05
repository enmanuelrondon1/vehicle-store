"use client";
import React, { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Users,
  Shield,
  TrendingUp,
  Zap,
  CheckCircle,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguajeContext";
import { useDarkMode } from "@/context/DarkModeContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactElement<{ className?: string }>; // Especifica que acepta className
  title: string;
  description: string;
  delay: number;
}

// Componente Modal personalizado para el inicio de sesión
const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className={`relative rounded-xl shadow-2xl ${
          isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        } border p-6`}>
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Contenido del modal */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2
              className={`text-xl font-bold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              ¡Inicia Sesión para Continuar!
            </h2>
            <p
              className={`mb-6 leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Para publicar tu anuncio de vehículo necesitas tener una cuenta.
              <br />
              <span className="font-medium">¡Es rápido y gratuito!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  onClose();
                  window.location.href = "/login?callbackUrl=" + encodeURIComponent("/postAd");
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className={`flex-1 ${
                  isDarkMode
                    ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                    : "border-gray-300 hover:bg-gray-50 text-gray-600"
                }`}
              >
                Cancelar
              </Button>
            </div>
            <p
              className={`mt-4 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => {
                  onClose();
                  window.location.href = "/login?callbackUrl=" + encodeURIComponent("/postAd");
                }}
                className="text-blue-500 hover:text-blue-600 font-medium underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoizar el componente de tarjeta para mejor rendimiento
const FeatureCard = memo<FeatureCardProps>(
  ({ icon, title, description, delay }) => {
    const { isDarkMode } = useDarkMode();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className={`${
          isDarkMode
            ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60"
            : "bg-white/80 border-gray-200/50 hover:bg-white/90"
        } backdrop-blur-sm rounded-xl p-5 border transition-colors duration-300 group`}
      >
        <div
          className={`${
            isDarkMode
              ? "text-orange-400 group-hover:text-orange-300"
              : "text-orange-500 group-hover:text-orange-600"
          } mb-3 transition-colors`}
        >
          {React.cloneElement(icon, { className: "w-7 h-7" })}
        </div>
        <h3
          className={`${
            isDarkMode ? "text-white" : "text-gray-900"
          } font-semibold text-base mb-2`}
        >
          {title}
        </h3>
        <p
          className={`${
            isDarkMode ? "text-slate-300" : "text-gray-600"
          } text-sm leading-relaxed`}
        >
          {description}
        </p>
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

// Componente optimizado para estadísticas
const StatCard = memo<{ number: string; label: string; index: number }>(
  ({ number, label, index }) => {
    const { isDarkMode } = useDarkMode();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
        className={`text-center p-3 rounded-lg backdrop-blur-sm border ${
          isDarkMode
            ? "bg-slate-800/30 border-slate-700/30"
            : "bg-white/40 border-gray-200/30"
        }`}
      >
        <div
          className={`text-xl sm:text-2xl font-bold mb-1 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {number}
        </div>
        <div
          className={`text-xs font-medium ${
            isDarkMode ? "text-slate-400" : "text-gray-500"
          }`}
        >
          {label}
        </div>
      </motion.div>
    );
  }
);

StatCard.displayName = "StatCard";

const HeroSection: React.FC = () => {
  const { translations } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const { status } = useSession();
  const router = useRouter();
  
  // Estado para controlar el modal de autenticación
  const [showLoginModal, setShowLoginModal] = useState(false);

  const features = [
    {
      icon: <Zap />,
      title: translations.quickPost || "Publicación Rápida",
      description:
        translations.quickPostDesc ||
        "Sube tu anuncio en menos de 5 minutos con nuestro sistema optimizado.",
    },
    {
      icon: <Users />,
      title: translations.buyers || "Miles de Compradores",
      description:
        translations.buyersDesc ||
        "Conecta con una audiencia activa buscando su próximo vehículo.",
    },
    {
      icon: <Shield />,
      title: translations.secure || "Transacciones Seguras",
      description:
        translations.secureDesc ||
        "Plataforma confiable con verificación de usuarios y soporte 24/7.",
    },
    {
      icon: <TrendingUp />,
      title: translations.bestPrice || "Mejor Precio",
      description:
        translations.bestPriceDesc ||
        "Herramientas de valuación para obtener el mejor precio por tu vehículo.",
    },
  ];

  const stats = [
    { number: translations.statsSold || "50K+", label: translations.statsSoldLabel || "Vehículos Vendidos" },
    { number: translations.statsUsers || "25K+", label: translations.statsUsersLabel || "Usuarios Activos" },
    { number: translations.statsRating || "4.8★", label: translations.statsRatingLabel || "Calificación" },
    { number: translations.statsTime || "48h", label: translations.statsTimeLabel || "Tiempo Promedio" },
  ];

  const benefits: string[] = Array.isArray(translations.benefits)
    ? translations.benefits
    : [
        "Sin comisiones ocultas",
        "Soporte 24/7",
        "Proceso 100% digital",
        "Verificación de usuarios",
      ];

  // Función corregida para manejar el click del botón vender
  const handleSellClick = useCallback(() => {
    if (status === "authenticated") {
      router.push("/postAd");
    } else if (status === "unauthenticated") {
      setShowLoginModal(true);
    }
  }, [status, router]);

  // Función para cerrar el modal
  const handleCloseLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  return (
    <>
      <section
        className={`relative min-h-screen flex items-center ${
          isDarkMode
            ? "bg-slate-900"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        }`}
      >
        {/* Fondo optimizado con regla 60-30-10 */}
        <div className="absolute inset-0">
          {isDarkMode ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/30 to-transparent" />
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: "2s" }}
              />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/40 to-transparent" />
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-300/20 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-200/20 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: "2s" }}
              />
            </>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Contenido principal */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Placeholder para contenido inicial si lo necesitas */}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                  {translations.sellVehicleTitle || "Vende tu "}
                </span>
                <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
                  Vehículo
                </span>
                <br />
                <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                  de forma{" "}
                </span>
                <span
                  className={isDarkMode ? "text-orange-400" : "text-orange-500"}
                >
                  {translations.fastSelling || "Rápida"}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`text-lg mb-8 leading-relaxed max-w-2xl lg:max-w-none ${
                  isDarkMode ? "text-slate-300" : "text-gray-600"
                }`}
              >
                {translations.description ||
                  "La plataforma más confiable para vender tu auto o moto. Conectamos compradores y vendedores de manera segura y eficiente."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <button
                  onClick={handleSellClick}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Car className="w-5 h-5 mr-2" />
                  {translations.sellButton || "Vender mi Vehículo"}
                </button>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((stat, index) => (
                  <StatCard
                    key={index}
                    number={stat.number}
                    label={stat.label}
                    index={index}
                  />
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={0.4 + index * 0.05}
                />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <h2
              className={`text-2xl sm:text-3xl font-bold mb-8 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {translations.whyChooseTitle || "¿Por qué elegir nuestra plataforma?"}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit: string, index: number) => (
                <div
                  key={index}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                    isDarkMode
                      ? "text-slate-300 bg-slate-800/30 border-slate-700/30"
                      : "text-gray-700 bg-white/50 border-gray-200/40"
                  }`}
                >
                  <CheckCircle
                    className={`w-4 h-4 flex-shrink-0 ${
                      isDarkMode ? "text-orange-400" : "text-orange-500"
                    }`}
                  />
                  <span className="font-medium text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className={`mt-12 text-center backdrop-blur-sm rounded-2xl p-6 border ${
              isDarkMode
                ? "bg-slate-800/40 border-slate-700/50"
                : "bg-white/60 border-gray-200/50"
            }`}
          >
            <h3
              className={`text-xl sm:text-2xl font-bold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {translations.callToActionTitle || "🚀 ¡Empieza a vender hoy mismo!"}
            </h3>
            <p
              className={`mb-6 max-w-2xl mx-auto text-sm sm:text-base ${
                isDarkMode ? "text-slate-300" : "text-gray-600"
              }`}
            >
              {translations.callToActionDesc ||
                "Miles de compradores están esperando. Publica tu anuncio ahora y vende más rápido."}
            </p>
            <button
              onClick={handleSellClick}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {translations.sellButton || "Vender mi Vehículo"}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Modal de autenticación */}
      <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} />
    </>
  );
};

export default memo(HeroSection);