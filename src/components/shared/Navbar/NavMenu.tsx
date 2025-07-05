"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Sun,
  Moon,
  Globe,
  User,
  Plus,
  TrendingUp,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useDarkMode } from "@/context/DarkModeContext";
import { useLanguage } from "@/context/LanguajeContext";
import { useRouter } from "next/navigation";

// Tipos e Interfaces
interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

interface UserInfo {
  name?: string | null;
  email?: string | null;
  role?: string;
  image?: string | null;
}

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

// Componente del botón animado principal con protección de autenticación
const AnimatedPostButton = React.memo(
  ({ isMobile = false }: { isMobile?: boolean }) => {
    const { isDarkMode } = useDarkMode();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    // Verificar explícitamente si el usuario está autenticado
    const isAuthenticated = status === "authenticated" && session?.user;
    const isLoading = status === "loading";

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        console.log(
          "HandleClick - Status:",
          status,
          "Session:",
          !!session,
          "User:",
          !!session?.user
        );

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
      },
      [status, session, isAuthenticated, isLoading, router]
    );

    const handleGoToLogin = useCallback(() => {
      setOpen(false);
      window.location.href =
        "/login?callbackUrl=" + encodeURIComponent("/postAd");
    }, []);

    const buttonClasses = useMemo(() => {
      const baseClasses =
        "relative overflow-hidden rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 group cursor-pointer";
      const sizeClasses = isMobile ? "w-full p-4" : "px-6 py-3";
      const gradientClasses =
        "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500";
      const borderClasses = isDarkMode ? "border-white/20" : "border-white/30";

      return `${baseClasses} ${sizeClasses} ${gradientClasses} ${borderClasses}`;
    }, [isMobile, isDarkMode]);

    if (isLoading) {
      return (
        <motion.div
          className={`relative ${isMobile ? "w-full" : ""}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={buttonClasses}>
            <div className="relative flex items-center justify-center gap-3 text-white font-bold opacity-50">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span
                className={`${
                  isMobile ? "text-lg" : "text-sm"
                } font-bold tracking-wide`}
              >
                Cargando...
              </span>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className={`relative ${isMobile ? "w-full" : ""}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isAuthenticated ? (
          <Link
            href="/postAd"
            className={`block ${isMobile ? "w-full" : ""}`}
            aria-label="Publicar nuevo anuncio de vehículo"
          >
            <div className={buttonClasses}>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />
              <div className="relative flex items-center justify-center gap-3 text-white font-bold">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <Plus className="w-5 h-5" />
                </motion.div>
                <span
                  className={`${
                    isMobile ? "text-lg" : "text-sm"
                  } font-bold tracking-wide`}
                >
                  ¡Publica tu Anuncio!
                </span>
                <motion.div
                  animate={{
                    y: [-2, 2, -2],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <TrendingUp className="w-4 h-4 text-yellow-300" />
                </motion.div>
              </div>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-yellow-400/50"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </Link>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                onClick={handleClick}
                className={`block ${isMobile ? "w-full" : ""}`}
                aria-label="Publicar nuevo anuncio de vehículo"
              >
                <div className={buttonClasses}>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="relative flex items-center justify-center gap-3 text-white font-bold">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      <Plus className="w-5 h-5" />
                    </motion.div>
                    <span
                      className={`${
                        isMobile ? "text-lg" : "text-sm"
                      } font-bold tracking-wide`}
                    >
                      ¡Publica tu Anuncio!
                    </span>
                    <motion.div
                      animate={{
                        y: [-2, 2, -2],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <TrendingUp className="w-4 h-4 text-yellow-300" />
                    </motion.div>
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-yellow-400/50"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </button>
            </DialogTrigger>
            <DialogContent
              className={`${
                isDarkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-200"
              } max-w-md`}
            >
              <DialogHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>
                <DialogTitle
                  className={`text-xl font-bold text-center mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ¡Inicia Sesión para Continuar!
                </DialogTitle>
              </DialogHeader>
              <DialogDescription
                className={`text-center mb-6 leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Para publicar tu anuncio de vehículo necesitas tener una cuenta.
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
                  className={`flex-1 ${
                    isDarkMode
                      ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                      : "border-gray-300 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  Cancelar
                </Button>
              </div>
              <div className="mt-4 text-center">
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  ¿No tienes cuenta?{" "}
                  <button
                    onClick={() => {
                      setOpen(false);
                      window.location.href =
                        "/login?callbackUrl=" + encodeURIComponent("/postAd");
                    }}
                    className="text-blue-500 hover:text-blue-600 font-medium underline"
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    );
  }
);

AnimatedPostButton.displayName = "AnimatedPostButton";

// Componente de tema toggle
const ThemeToggle = React.memo(
  ({ isMobile = false }: { isMobile?: boolean }) => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const buttonClasses = useMemo(() => {
      if (isMobile) {
        return `w-full border transition-colors duration-200 ${
          isDarkMode
            ? "border-gray-600 hover:bg-gray-700 text-white"
            : "border-gray-300 hover:bg-gray-100 text-gray-900"
        }`;
      }
      return `${
        isDarkMode
          ? "text-white hover:bg-white/20"
          : "text-white hover:bg-white/20"
      } p-2 rounded-full transition-colors duration-200`;
    }, [isMobile, isDarkMode]);

    return (
      <Button
        variant={isMobile ? "outline" : "ghost"}
        size="sm"
        className={buttonClasses}
        onClick={toggleDarkMode}
        aria-label={`Cambiar a modo ${isDarkMode ? "claro" : "oscuro"}`}
      >
        <motion.div
          animate={{ rotate: isDarkMode ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.div>
        {isMobile && (
          <span className="ml-2">
            {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
          </span>
        )}
      </Button>
    );
  }
);

ThemeToggle.displayName = "ThemeToggle";

// Componente de selector de idioma
const LanguageSelector = React.memo(
  ({ isMobile = false }: { isMobile?: boolean }) => {
    const { language, setLanguage } = useLanguage();
    const { isDarkMode } = useDarkMode();

    const handleLanguageChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "es" || value === "en") {
          setLanguage(value);
        }
      },
      [setLanguage]
    );

    const containerClasses = useMemo(() => {
      const baseClasses =
        "flex items-center gap-2 rounded-xl transition-colors duration-200";
      if (isMobile) {
        return `${baseClasses} p-3 border ${
          isDarkMode ? "border-gray-600" : "border-gray-300"
        }`;
      }
      return `${baseClasses} px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20`;
    }, [isMobile, isDarkMode]);

    const selectClasses = useMemo(() => {
      if (isMobile) {
        return `flex-1 bg-transparent outline-none ${
          isDarkMode ? "text-gray-200" : "text-gray-900"
        }`;
      }
      return "bg-transparent text-white outline-none text-sm";
    }, [isMobile, isDarkMode]);

    return (
      <div className={containerClasses}>
        <Globe
          className={`w-4 h-4 ${
            isMobile
              ? isDarkMode
                ? "text-gray-300"
                : "text-gray-600"
              : "text-white"
          }`}
        />
        <select
          value={language}
          onChange={handleLanguageChange}
          className={selectClasses}
          aria-label="Seleccionar idioma"
        >
          <option value="es" className="text-gray-900">
            Español
          </option>
          <option value="en" className="text-gray-900">
            English
          </option>
        </select>
      </div>
    );
  }
);

LanguageSelector.displayName = "LanguageSelector";

// Componente de información de usuario
const UserInfo = React.memo(
  ({ user, isMobile = false }: { user: UserInfo; isMobile?: boolean }) => {
    const { isDarkMode } = useDarkMode();

    return (
      <div
        className={`${
          isMobile ? "p-3 rounded-xl" : "flex items-center gap-2"
        } ${
          isMobile ? (isDarkMode ? "bg-gray-800/50" : "bg-gray-100/50") : ""
        }`}
      >
        {user.image && (
          <Image
            src={user.image}
            alt="Avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div className={isMobile ? "" : "hidden lg:block"}>
          <p className="text-sm font-medium truncate max-w-32">
            {user.name || user.email}
          </p>
          {user.role && isMobile && (
            <p className="text-xs opacity-70">{user.role}</p>
          )}
        </div>
      </div>
    );
  }
);

UserInfo.displayName = "UserInfo";

// Componente principal
const NavMenu = () => {
  const { isDarkMode } = useDarkMode();
  const { translations } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  // Memoizar la información del usuario
  const userInfo = useMemo((): UserInfo | null => {
    if (!session?.user) return null;
    const sessionUser = session.user as SessionUser;
    return {
      name: sessionUser.name,
      email: sessionUser.email,
      role: sessionUser.role,
      image: sessionUser.image,
    };
  }, [session]);

  // Manejar cierre de sesión
  const handleSignOut = useCallback(async () => {
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, []);

  // Items de navegación
  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: translations.contact,
        href: "/contact",
        icon: <Phone className="w-5 h-5" />,
      },
    ],
    [translations.contact]
  );

  // Manejar toggle del menú
  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Manejar click fuera del menú
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen, handleCloseMenu]);

  // Clases para el contenido del sheet
  const sheetContentClasses = useMemo(() => {
    return `w-[300px] backdrop-blur-xl border-r p-6 ${
      isDarkMode
        ? "bg-gray-900/95 border-gray-700/50 text-white"
        : "bg-white/95 border-gray-200/50 text-gray-800"
    }`;
  }, [isDarkMode]);

  return (
    <>
      {/* Mobile Menu */}
      <div className="sm:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
              onClick={handleToggleMenu}
              aria-label="Abrir menú de navegación"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "open"}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className={sheetContentClasses}
            aria-describedby="menu-description"
          >
            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>

            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="mb-8">
                <h2
                  className={`text-2xl font-bold bg-gradient-to-r ${
                    isDarkMode
                      ? "from-blue-400 to-purple-400"
                      : "from-blue-600 to-purple-600"
                  } bg-clip-text text-transparent`}
                >
                  Menú
                </h2>
                <p
                  id="menu-description"
                  className={`text-sm mt-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Navega y publica tus anuncios fácilmente.
                </p>
              </div>

              {/* Botón de publicar */}
              <div className="mb-6">
                <AnimatedPostButton isMobile={true} />
              </div>

              {/* Navegación */}
              <nav
                className="flex-1"
                role="navigation"
                aria-label="Navegación móvil"
              >
                <ul className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={`${item.label}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href || "#"}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                          isDarkMode
                            ? "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
                            : "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
                        }`}
                        onClick={handleCloseMenu}
                      >
                        <span className="relative group-hover:scale-110 transition-transform duration-200">
                          {item.icon}
                        </span>
                        <span className="font-medium text-lg">
                          {item.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer con controles de usuario */}
              <div className="space-y-4">
                {status === "authenticated" && userInfo ? (
                  <div className="space-y-3">
                    <UserInfo user={userInfo} isMobile={true} />
                    <Button
                      variant="outline"
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white border-none hover:from-red-600 hover:to-pink-700 transition-all duration-200"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    asChild
                  >
                    <Link href="/login" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {translations.signIn}
                    </Link>
                  </Button>
                )}

                <ThemeToggle isMobile={true} />
                <LanguageSelector isMobile={true} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <nav
        className="hidden sm:block"
        role="navigation"
        aria-label="Navegación principal"
      >
        <ul className="flex space-x-4 items-center">
          <li>
            <AnimatedPostButton />
          </li>

          {navItems.map((item, index) => (
            <motion.li
              key={`${item.label}-${index}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href || "#"}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 group"
              >
                <span className="relative group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.li>
          ))}

          {/* Usuario autenticado */}
          {status === "authenticated" && userInfo ? (
            <li className="relative">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/20 rounded-full h-auto p-2 transition-all duration-200"
                  >
                    <UserInfo user={userInfo} />
                    <motion.div
                      animate={{ rotate: 0 }}
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={`w-56 ${
                    isDarkMode
                      ? "bg-gray-900/95 border-gray-700 backdrop-blur-xl"
                      : "bg-white/95 border-gray-200 backdrop-blur-xl"
                  } shadow-xl`}
                  align="end"
                  side="bottom"
                  sideOffset={8}
                  avoidCollisions={true}
                  collisionPadding={8}
                  style={{
                    position: "fixed",
                    zIndex: 9999,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <DropdownMenuLabel className="font-semibold">
                      Mi Cuenta
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer hover:bg-opacity-10 transition-colors duration-150">
                        <User className="w-4 h-4 mr-2" />
                        Perfil
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ) : (
            <li>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-full"
                asChild
              >
                <Link href="/login" aria-label="Iniciar sesión">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
            </li>
          )}

          <li>
            <ThemeToggle />
          </li>
          <li>
            <LanguageSelector />
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavMenu;