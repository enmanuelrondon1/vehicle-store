"use client";
import React, { memo, useCallback, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Users,
  Shield,
  TrendingUp,
  Zap,
  CheckCircle,
  X,
  User,
  DollarSign,
  List, // Nuevo icono para "Ver Mis Vehículos"
} from "lucide-react";
import { useLanguage } from "@/context/LanguajeContext";
import { useDarkMode } from "@/context/DarkModeContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Tipos mejorados
interface FeatureCardProps {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
}

interface StatCardProps {
  number: string;
  label: string;
  index: number;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Animaciones optimizadas
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

// Componente Modal mejorado
const LoginModal: React.FC<LoginModalProps> = memo(({ isOpen, onClose }) => {
  const { isDarkMode } = useDarkMode();
  const { translations } = useLanguage();

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleLoginRedirect = useCallback(() => {
    onClose();
    window.location.href = "/login?callbackUrl=" + encodeURIComponent("/postAd");
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...fadeInUp}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          <motion.div
            {...scaleIn}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className={`relative rounded-2xl shadow-2xl border overflow-hidden ${
              isDarkMode 
                ? "bg-gray-900/95 border-gray-700 backdrop-blur-md" 
                : "bg-white/95 border-gray-200 backdrop-blur-md"
            }`}>
              {/* Header con gradiente */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
              
              {/* Botón de cerrar mejorado */}
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                }`}
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Contenido del modal */}
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex justify-center mb-6"
                >
                  <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                
                <motion.h2
                  {...fadeInUp}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {translations.loginRequired || "¡Inicia Sesión para Continuar!"}
                </motion.h2>
                
                <motion.p
                  {...fadeInUp}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className={`mb-6 leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {translations.loginMessage || "Para publicar tu anuncio de vehículo necesitas tener una cuenta."}
                  <br />
                  <span className="font-medium text-blue-500">
                    {translations.quickAndFree || "¡Es rápido y gratuito!"}
                  </span>
                </motion.p>
                
                <motion.div
                  {...fadeInUp}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 mb-4"
                >
                  <Button
                    onClick={handleLoginRedirect}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {translations.loginButton || "Iniciar Sesión"}
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className={`flex-1 transition-all duration-200 ${
                      isDarkMode
                        ? "border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white"
                        : "border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {translations.cancel || "Cancelar"}
                  </Button>
                </motion.div>
                
                <motion.p
                  {...fadeInUp}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {translations.noAccount || "¿No tienes cuenta?"}{" "}
                  <button
                    onClick={handleLoginRedirect}
                    className="text-blue-500 hover:text-blue-600 font-medium underline transition-colors"
                  >
                    {translations.signUp || "Regístrate aquí"}
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

// Componente de tarjeta de características mejorado
const FeatureCard = memo<FeatureCardProps>(({ icon, title, description, delay }) => {
  const { isDarkMode } = useDarkMode();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      {...fadeInUp}
      transition={{ duration: 0.4, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl p-6 border transition-all duration-300 group cursor-pointer ${
        isDarkMode
          ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600/50"
          : "bg-white/80 border-gray-200/50 hover:bg-white hover:border-gray-300/50"
      } backdrop-blur-sm hover:shadow-xl hover:scale-105`}
    >
      {/* Efecto de brillo en hover */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
        className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
      />
      
      <motion.div
        animate={{ 
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
        className={`mb-4 transition-colors ${
          isDarkMode
            ? "text-orange-400 group-hover:text-orange-300"
            : "text-orange-500 group-hover:text-orange-600"
        }`}
      >
        {React.cloneElement(icon, { className: "w-8 h-8" })}
      </motion.div>
      
      <h3 className={`font-semibold text-lg mb-3 ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}>
        {title}
      </h3>
      
      <p className={`text-sm leading-relaxed ${
        isDarkMode ? "text-slate-300" : "text-gray-600"
      }`}>
        {description}
      </p>
    </motion.div>
  );
});

FeatureCard.displayName = "FeatureCard";

// Componente de estadísticas mejorado
const StatCard = memo<StatCardProps>(({ number, label, index }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      {...scaleIn}
      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
      className={`text-center p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
        isDarkMode
          ? "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60"
          : "bg-white/50 border-gray-200/30 hover:bg-white/70"
      }`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
        className={`text-2xl sm:text-3xl font-bold mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {number}
      </motion.div>
      <div className={`text-sm font-medium ${
        isDarkMode ? "text-slate-400" : "text-gray-500"
      }`}>
        {label}
      </div>
    </motion.div>
  );
});

StatCard.displayName = "StatCard";

// Componente de beneficios mejorado
const BenefitCard = memo<{ benefit: string; index: number }>(({ benefit, index }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      {...slideIn}
      transition={{ duration: 0.3, delay: 0.1 * index }}
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
        isDarkMode
          ? "text-slate-300 bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50"
          : "text-gray-700 bg-white/60 border-gray-200/40 hover:bg-white/80"
      }`}
    >
      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
        isDarkMode ? "text-orange-400" : "text-orange-500"
      }`} />
      <span className="font-medium text-sm">{benefit}</span>
    </motion.div>
  );
});

BenefitCard.displayName = "BenefitCard";

// Componente principal
const HeroSection: React.FC = () => {
  const { translations } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const { status } = useSession();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Memorizar las características
  const features = useMemo(() => [
    {
      icon: <Zap />,
      title: translations.quickPost || "Publicación Rápida",
      description: translations.quickPostDesc || "Sube tu anuncio en menos de 5 minutos con nuestro sistema optimizado.",
    },
    {
      icon: <Users />,
      title: translations.buyers || "Miles de Compradores",
      description: translations.buyersDesc || "Conecta con una audiencia activa buscando su próximo vehículo.",
    },
    {
      icon: <Shield />,
      title: translations.secure || "Transacciones Seguras",
      description: translations.secureDesc || "Plataforma confiable con verificación de usuarios y soporte 24/7.",
    },
    {
      icon: <TrendingUp />,
      title: translations.bestPrice || "Mejor Precio",
      description: translations.bestPriceDesc || "Herramientas de valuación para obtener el mejor precio por tu vehículo.",
    },
  ], [translations]);

  // Memorizar estadísticas
  const stats = useMemo(() => [
    { number: translations.statsSold || "50K+", label: translations.statsSoldLabel || "Vehículos Vendidos" },
    { number: translations.statsUsers || "25K+", label: translations.statsUsersLabel || "Usuarios Activos" },
    { number: translations.statsRating || "4.8★", label: translations.statsRatingLabel || "Calificación" },
    { number: translations.statsTime || "48h", label: translations.statsTimeLabel || "Tiempo Promedio" },
  ], [translations]);

  // Memorizar beneficios
  const benefits = useMemo(() => 
    Array.isArray(translations.benefits) 
      ? translations.benefits 
      : [
          "Sin comisiones ocultas",
          "Soporte 24/7",
          "Proceso 100% digital",
          "Verificación de usuarios",
        ], [translations.benefits]);

  // Handlers optimizados
  const handleSellClick = useCallback(() => {
    if (status === "authenticated") {
      router.push("/postAd");
    } else if (status === "unauthenticated") {
      setShowLoginModal(true);
    }
  }, [status, router]);

  // NUEVA FUNCIÓN: Handler para el segundo botón (condicional)
  const handleSecondaryButtonClick = useCallback(() => {
    if (status === "authenticated") {
      // Si está logueado, ir a la lista de vehículos
      router.push("/vehicleList");
    } else {
      // Si no está logueado, mostrar información general o modal de login
      // Puedes cambiar esta lógica según tus necesidades
      setShowLoginModal(true);
    }
  }, [status, router]);

  const handleCloseLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  // NUEVA FUNCIÓN: Obtener el contenido del botón secundario según el estado de auth
  const getSecondaryButtonContent = useCallback(() => {
    if (status === "authenticated") {
      return {
        text: translations.myVehicles || "Mis Vehículos",
        icon: <List className="w-5 h-5 mr-2" />,
        variant: "default" as const,
        className: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      };
    } else {
      return {
        text: translations.learnMore || "Conoce más",
        icon: <DollarSign className="w-5 h-5 mr-2" />,
        variant: "outline" as const,
        className: `transition-all duration-300 ${
          isDarkMode
            ? "border-slate-600 hover:bg-slate-700/50 text-slate-300"
            : "border-gray-300 hover:bg-gray-50 text-gray-700"
        }`
      };
    }
  }, [status, translations, isDarkMode]);

  const secondaryButtonContent = getSecondaryButtonContent();

  return (
    <>
      <section className={`relative min-h-screen flex items-center overflow-hidden ${
        isDarkMode ? "bg-slate-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}>
        {/* Fondo con efectos mejorados */}
        <div className="absolute inset-0">
          {isDarkMode ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/20 to-transparent" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
              />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-300/30 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl"
              />
            </>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido principal */}
            <div className="text-center lg:text-left">
              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.6 }}
                className="mb-4"
              >
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  isDarkMode
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}>
                  🚀 {translations.platformTrusted || "Plataforma más confiable"}
                </span>
              </motion.div>

              <motion.h1
                {...fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                  {translations.sellVehicleTitle || "Vende tu "}
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Vehículo
                </span>
                <br />
                <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                  de forma{" "}
                </span>
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {translations.fastSelling || "Rápida"}
                </span>
              </motion.h1>

              <motion.p
                {...fadeInUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-lg mb-8 leading-relaxed max-w-2xl lg:max-w-none ${
                  isDarkMode ? "text-slate-300" : "text-gray-600"
                }`}
              >
                {translations.description ||
                  "La plataforma más confiable para vender tu auto o moto. Conectamos compradores y vendedores de manera segura y eficiente."}
              </motion.p>

              {/* SECCIÓN DE BOTONES MODIFICADA */}
              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                {/* Botón principal - Vender (siempre visible) */}
                <Button
                  onClick={handleSellClick}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Car className="w-5 h-5 mr-2" />
                  {translations.sellButton || "Vender mi Vehículo"}
                </Button>

                {/* Botón secundario - Condicional */}
                <Button
                  onClick={handleSecondaryButtonClick}
                  variant={secondaryButtonContent.variant}
                  size="lg"
                  className={secondaryButtonContent.className}
                >
                  {secondaryButtonContent.icon}
                  {secondaryButtonContent.text}
                </Button>
              </motion.div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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

            {/* Características */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={0.4 + index * 0.1}
                />
              ))}
            </div>
          </div>

          {/* Sección de beneficios */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-20 text-center"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-12 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              {translations.whyChooseTitle || "¿Por qué elegir nuestra plataforma?"}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit: string, index: number) => (
                <BenefitCard key={index} benefit={benefit} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Call to Action final */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 1 }}
            className={`mt-20 text-center backdrop-blur-sm rounded-3xl p-8 border relative overflow-hidden ${
              isDarkMode
                ? "bg-slate-800/40 border-slate-700/50"
                : "bg-white/70 border-gray-200/50"
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
            
            <h3 className={`text-2xl sm:text-3xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              {translations.callToActionTitle || "🚀 ¡Empieza a vender hoy mismo!"}
            </h3>
            <p className={`mb-8 max-w-2xl mx-auto text-lg ${
              isDarkMode ? "text-slate-300" : "text-gray-600"
            }`}>
              {translations.callToActionDesc ||
                "Miles de compradores están esperando. Publica tu anuncio ahora y vende más rápido."}
            </p>
            <Button
              onClick={handleSellClick}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Car className="w-5 h-5 mr-2" />
              {translations.sellButton || "Vender mi Vehículo"}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Modal de autenticación */}
      <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} />
    </>
  );
};

export default memo(HeroSection);