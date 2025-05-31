"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Car,
  Phone,
  Heart,
  Sun,
  Moon,
  Globe,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useDarkMode } from "@/context/DarkModeContext";
import { useLanguage } from "@/context/LanguajeContext";
import { useFavorites } from "@/context/FavoritesContext";

// Tipos e Interfaces
interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const NavMenu = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { language, setLanguage, translations } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { favorites } = useFavorites();

  const navItems: NavItem[] = [
    {
      label: translations.catalog,
      href: "/catalog",
      icon: <Car className="w-5 h-5" />,
    },
    {
      label: translations.contact,
      href: "/contact",
      icon: <Phone className="w-5 h-5" />,
    },
    {
      label: translations.favorites || "Favoritos",
      href: "/favorites",
      icon: <Heart className="w-5 h-5" />,
    },
  ];

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const isFavoritesItem = (label: string) => {
    const favoritesLabel = translations.favorites || "Favoritos";
    return label.toLowerCase() === favoritesLabel.toLowerCase();
  };

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
              aria-label="Toggle Menu"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.div>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] bg-gradient-to-br from-white/95 to-gray-100/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 text-gray-800 dark:text-white p-6"
            aria-describedby="menu-description"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Menu
                </h2>
                <p id="menu-description" className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Navigate through our catalog, contact us, and manage your preferences.
                </p>
              </div>

              <nav className="flex-1">
                <ul className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href || "#"}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-200 group"
                        onClick={handleCloseMenu}
                      >
                        <span className="relative group-hover:scale-110 transition-transform duration-200">
                          {item.icon}
                          {isFavoritesItem(item.label) && favorites.size > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-gray-800">
                              {favorites.size}
                            </span>
                          )}
                        </span>
                        <span className="font-medium text-lg">{item.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="space-y-4">
                {/* Auth Button */}
                <SignedOut>
                  <Button
                    variant="outline"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    asChild
                  >
                    <Link href="/sign-in" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {translations.signIn}
                    </Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>

                {/* Theme Toggle */}
                <Button
                  variant="outline"
                  className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  <span className="ml-2">
                    {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
                  </span>
                </Button>

                {/* Language Selector */}
                <div className="flex items-center gap-2 p-3 border rounded-xl border-gray-300 dark:border-gray-600">
                  <Globe className="w-4 h-4" />
                  <select
                    value={language}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "es" || value === "en") {
                        setLanguage(value);
                      }
                    }}
                    className="flex-1 bg-transparent text-gray-900 dark:text-gray-200 outline-none"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden sm:block">
        <ul className="flex space-x-2 items-center">
          {navItems.map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href || "#"}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 group"
              >
                <span className="relative group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                  {isFavoritesItem(item.label) && favorites.size > 0 && (
                    <span className="absolute -top-3 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-gray-800">
                      {favorites.size}
                    </span>
                  )}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.li>
          ))}

          {/* Auth Button */}
          <li>
            <SignedOut>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-full"
                asChild
              >
                <Link href="/sign-in">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </li>

          {/* Theme Toggle */}
          <li>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2 rounded-full"
              onClick={toggleDarkMode}
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
            </Button>
          </li>

          {/* Language Selector */}
          <li>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Globe className="w-4 h-4 text-white" />
              <select
                value={language}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "es" || value === "en") {
                    setLanguage(value);
                  }
                }}
                className="bg-transparent text-white outline-none text-sm"
              >
                <option value="es" className="text-gray-900">
                  Español
                </option>
                <option value="en" className="text-gray-900">
                  English
                </option>
              </select>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavMenu;