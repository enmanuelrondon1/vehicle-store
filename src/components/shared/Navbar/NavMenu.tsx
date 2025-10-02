// TODO: NUEVA 

// src/components/shared/Navbar/NavMenu.tsx
// src/components/shared/Navbar/NavMenu.tsx

"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, LogOut, ChevronDown, User, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
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
import AnimatedPostButton from "./components/AnimatedPostButton";
import ThemeToggle from "./components/ThemeToggle";
import LanguageSelector from "./components/LanguageSelector";
import UserInfo from "./components/UserInfo";

// Tipos e Interfaces
interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  requiresAdmin?: boolean; // 🔥 Nueva propiedad para rutas admin
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

const NavMenu = () => {
  const { isDarkMode } = useDarkMode();
  const { translations } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

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

  // 🔥 Verificar si el usuario es admin
  const isAdmin = useMemo(() => {
    return status === "authenticated" && userInfo?.role === "admin";
  }, [status, userInfo]);

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

  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: translations.contact,
        href: "/contact",
        icon: <Phone className="w-5 h-5" />,
      },
      // 🔥 Agregar AdminPanel solo si es admin
      ...(isAdmin ? [{
        label: "AdminPanel",
        href: "/adminPanel",
        icon: <Shield className="w-5 h-5" />,
        requiresAdmin: true,
      }] : []),
    ],
    [translations.contact, isAdmin]
  );

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen, handleCloseMenu]);

  const sheetContentClasses = useMemo(() => {
    return `w-[300px] backdrop-blur-xl border-r p-6 ${
      isDarkMode
        ? "bg-gray-900/95 border-gray-700/50 text-white"
        : "bg-white/95 border-gray-200/50 text-gray-800"
    }`;
  }, [isDarkMode]);

  return (
    <>
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
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className={sheetContentClasses} aria-describedby="menu-description">
            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
            <div className="flex flex-col h-full">
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
              <div className="mb-6">
                <AnimatedPostButton isMobile={true} />
              </div>
              <nav className="flex-1" role="navigation" aria-label="Navegación móvil">
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
                        } ${
                          // 🔥 Estilo especial para AdminPanel
                          item.requiresAdmin 
                            ? "border border-orange-500/30 bg-gradient-to-r from-orange-500/5 to-red-500/5" 
                            : ""
                        }`}
                        onClick={handleCloseMenu}
                      >
                        <span className={`relative group-hover:scale-110 transition-transform duration-200 ${
                          item.requiresAdmin ? "text-orange-500" : ""
                        }`}>
                          {item.icon}
                        </span>
                        <span className={`font-medium text-lg ${
                          item.requiresAdmin ? "text-orange-500" : ""
                        }`}>
                          {item.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
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
      <nav className="hidden sm:block" role="navigation" aria-label="Navegación principal">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 group ${
                  // 🔥 Estilo especial para AdminPanel en desktop
                  item.requiresAdmin 
                    ? "border border-orange-400/40 bg-gradient-to-r from-orange-500/10 to-red-500/10" 
                    : ""
                }`}
              >
                <span className={`relative group-hover:scale-110 transition-transform duration-200 ${
                  item.requiresAdmin ? "text-orange-400" : ""
                }`}>
                  {item.icon}
                </span>
                <span className={`font-medium ${
                  item.requiresAdmin ? "text-orange-400" : ""
                }`}>
                  {item.label}
                </span>
              </Link>
            </motion.li>
          ))}
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
                  style={{ position: "fixed", zIndex: 9999 }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <DropdownMenuLabel className="font-semibold">Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer hover:bg-opacity-10 transition-colors duration-150">
                        <User className="w-4 h-4 mr-2" />
                        Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-opacity-10 transition-colors duration-150">
                        <Link href="/my-favorites" className="flex items-center w-full">
                          <Heart className="w-4 h-4 mr-2" />
                          Mis Favoritos
                        </Link>
                      </DropdownMenuItem>
                      {/* 🔥 AdminPanel también en el dropdown del usuario */}
                      {isAdmin && (
                        <DropdownMenuItem className="cursor-pointer hover:bg-opacity-10 transition-colors duration-150">
                          <Link href="/adminPanel" className="flex items-center w-full text-orange-500">
                            <Shield className="w-4 h-4 mr-2" />
                            AdminPanel
                          </Link>
                        </DropdownMenuItem>
                      )}
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