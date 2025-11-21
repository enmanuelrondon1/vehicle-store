// src/components/shared/Navbar/NavMenu.tsx (versión mejorada)
"use client";

import React, { memo, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  LogOut,
  ChevronDown,
  User,
  Shield,
  Heart,
  List,
  Plus,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useLanguage } from "@/context/LanguajeContext";
import AnimatedPostButton from "./AnimatedPostButton";
import UserInfo from "./UserInfo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

// Componente NavItem estandarizado (mejorado)
const NavItem = memo(
  ({
    item,
    onClick,
    isMobile = false,
  }: {
    item: any;
    onClick?: () => void;
    isMobile?: boolean;
  }) => {
    return (
      <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href={item.href || "#"}
          className={cn(
            "relative overflow-hidden group",
            buttonVariants({ variant: "ghost" }),
            isMobile ? "w-full justify-start gap-3 text-lg py-6" : "gap-2",
            item.requiresAdmin &&
              "hover:bg-destructive/10 hover:text-destructive"
          )}
          onClick={onClick}
          style={{
            color: item.requiresAdmin ? "var(--destructive)" : "inherit",
          }}
        >
          {/* Efecto de subrayado animado para escritorio */}
          {!isMobile && (
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 w-full origin-left"
              style={{ backgroundColor: "var(--accent)" }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          )}
          
          <motion.span
            style={{ color: "var(--accent)" }}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.3 }}
          >
            {item.icon}
          </motion.span>
          <span>{item.label}</span>
        </Link>
      </motion.li>
    );
  }
);

NavItem.displayName = "NavItem";

const NavMenu = () => {
  const { translations } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const userInfo = useMemo(() => {
    if (!session?.user) return null;
    return {
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      image: session.user.image,
    };
  }, [session]);

  const isAdmin = status === "authenticated" && userInfo?.role === "admin";

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: siteConfig.paths.home, redirect: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, []);

  const navItems = useMemo(
    () => [
      {
        label: translations.contact,
        href: siteConfig.paths.contact,
        icon: <Phone className="w-5 h-5" />,
      },
      ...(isAdmin
        ? [
            {
              label: "AdminPanel",
              href: siteConfig.paths.adminPanel,
              icon: <Shield className="w-5 h-5" />,
              requiresAdmin: true,
            },
          ]
        : []),
    ],
    [translations.contact, isAdmin]
  );

  return (
    <>
      {/* Menú Móvil (Sheet) - con glassmorphism mejorado */}
      <div className="sm:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Abrir menú de navegación"
              className="card-glass hover:bg-accent/10"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2, type: "spring" }}
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
          <SheetContent side="left" className="w-[300px] p-0 card-glass">
            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>

            {/* Header del menú mobile con gradient mejorado */}
            <div
              className="p-6 border-b border-glass-border relative overflow-hidden"
              style={{
                background: "var(--gradient-hero)",
              }}
            >
              {/* Efecto de brillo sutil en el header */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-heading font-bold text-gradient">
                  Menú
                </h2>
                <p className="text-sm mt-1 text-muted-foreground">
                  Navega y publica tus anuncios fácilmente.
                </p>
              </div>
            </div>

            {/* Botón Publicar en mobile */}
            <div className="p-4 border-b border-glass-border">
              <AnimatedPostButton
                isMobile={true}
                onClick={() => setIsMenuOpen(false)}
              />
            </div>

            {/* Items de navegación */}
            <nav className="flex-1 overflow-y-auto py-2" role="navigation">
              <ul className="space-y-1">
                <AnimatePresence>
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05, type: "spring" }}
                    >
                      <NavItem
                        item={item}
                        onClick={() => setIsMenuOpen(false)}
                        isMobile={true}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ul>
            </nav>

            {/* Sección de usuario */}
            <div className="mt-auto p-4 border-t border-glass-border space-y-3">
              {status === "authenticated" && userInfo ? (
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring" }}
                  >
                    <UserInfo user={userInfo} isMobile={true} />
                  </motion.div>
                  <DropdownMenuSeparator className="bg-glass-border" />
                  <NavItem
                    item={{
                      label: "Perfil",
                      href: siteConfig.paths.profile,
                      icon: <User className="w-5 h-5" />,
                    }}
                    onClick={() => setIsMenuOpen(false)}
                    isMobile={true}
                  />
                  <NavItem
                    item={{
                      label: "Mis Favoritos",
                      href: siteConfig.paths.myFavorites,
                      icon: <Heart className="w-5 h-5" />,
                    }}
                    onClick={() => setIsMenuOpen(false)}
                    isMobile={true}
                  />
                  <NavItem
                    item={{
                      label: "Ver Publicaciones",
                      href: siteConfig.paths.vehicleList,
                      icon: <List className="w-5 h-5" />,
                    }}
                    onClick={() => setIsMenuOpen(false)}
                    isMobile={true}
                  />
                  {isAdmin && (
                    <NavItem
                      item={{
                        label: "AdminPanel",
                        href: siteConfig.paths.adminPanel,
                        icon: <Shield className="w-5 h-5" />,
                        requiresAdmin: true,
                      }}
                      onClick={() => setIsMenuOpen(false)}
                      isMobile={true}
                    />
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring" }}
                >
                  <Button className="btn-primary w-full" asChild>
                    <Link
                      href={siteConfig.paths.login}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </Link>
                  </Button>
                </motion.div>
              )}

              {/* Theme toggle centrado */}
              <div className="flex justify-center pt-2">
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Menú de Escritorio - con animaciones premium */}
      <nav className="hidden sm:flex items-center" role="navigation">
        <motion.ul
          className="flex space-x-2 items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <li>
            <AnimatedPostButton />
          </li>

          {navItems.map((item, index) => (
            <NavItem key={item.label} item={item} />
          ))}

          {status === "authenticated" && userInfo ? (
            <li>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full h-auto p-2 hover:bg-accent/10"
                  >
                    <UserInfo user={userInfo} />
                    <ChevronDown className="w-4 h-4 ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 card-glass"
                  align="end"
                  sideOffset={8}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.2, type: "spring" }}
                  >
                    <DropdownMenuLabel className="font-heading font-bold text-gradient">
                      Mi Cuenta
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-glass-border" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link
                          href={siteConfig.paths.profile}
                          className="flex items-center gap-3 cursor-pointer hover:bg-accent/10"
                        >
                          <User
                            className="w-4 h-4"
                            style={{ color: "var(--accent)" }}
                          />
                          Perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={siteConfig.paths.myFavorites}
                          className="flex items-center gap-3 cursor-pointer hover:bg-accent/10"
                        >
                          <Heart
                            className="w-4 h-4"
                            style={{ color: "var(--accent)" }}
                          />
                          Mis Favoritos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={siteConfig.paths.vehicleList}
                          className="flex items-center gap-3 cursor-pointer hover:bg-accent/10"
                        >
                          <List
                            className="w-4 h-4"
                            style={{ color: "var(--accent)" }}
                          />
                          Ver Publicaciones
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator className="bg-glass-border" />
                          <DropdownMenuItem asChild>
                            <Link
                              href={siteConfig.paths.adminPanel}
                              className="flex items-center gap-3 cursor-pointer hover:bg-destructive/10"
                              style={{ color: "var(--destructive)" }}
                            >
                              <Shield className="w-4 h-4" />
                              AdminPanel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-glass-border" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-3 cursor-pointer hover:bg-destructive/10"
                      style={{ color: "var(--destructive)" }}
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ) : (
            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-accent/10"
              >
                <Link href={siteConfig.paths.login} aria-label="Iniciar sesión">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
            </motion.li>
          )}

          <li>
            <ThemeToggle />
          </li>
        </motion.ul>
      </nav>
    </>
  );
};

export default NavMenu;