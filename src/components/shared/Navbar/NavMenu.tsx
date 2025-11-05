//src/components/shared/Navbar/NavMenu.tsx
"use client";

import React, { useCallback, useMemo, useState } from "react";
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

// Tipos e Interfaces
interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  requiresAdmin?: boolean;
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
  const { translations } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const isAdmin = useMemo(() => {
    return status === "authenticated" && userInfo?.role === "admin";
  }, [status, userInfo]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: siteConfig.paths.home, redirect: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, []);

  const navItems: NavItem[] = useMemo(
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

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      {/* --- Menú Móvil (Sheet) --- */}
      <div className="sm:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleMenu}
              aria-label="Abrir menú de navegación"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X /> : <Menu />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-6 flex flex-col">
            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Menú</h2>
              <p
                id="menu-description"
                className="text-sm mt-2 text-muted-foreground"
              >
                Navega y publica tus anuncios fácilmente.
              </p>
            </div>
            <div className="mb-6">
              <AnimatedPostButton isMobile={true} onClick={handleCloseMenu} />
            </div>
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
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start gap-3 text-lg",
                        item.requiresAdmin &&
                          "text-destructive hover:text-destructive-foreground focus:text-destructive-foreground"
                      )}
                      onClick={handleCloseMenu}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto space-y-4 pt-6 border-t">
              {status === "authenticated" && userInfo ? (
                <div className="flex flex-col space-y-2">
                  <UserInfo user={userInfo} isMobile={true} />
                  <DropdownMenuSeparator />
                  <Link
                    href={siteConfig.paths.profile}
                    onClick={handleCloseMenu}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start gap-2"
                    )}
                  >
                    <User className="w-4 h-4" /> Perfil
                  </Link>
                  <Link
                    href={siteConfig.paths.myFavorites}
                    onClick={handleCloseMenu}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start gap-2"
                    )}
                  >
                    <Heart className="w-4 h-4" /> Mis Favoritos
                  </Link>
                  <Link
                    href={siteConfig.paths.vehicleList}
                    onClick={handleCloseMenu}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start gap-2"
                    )}
                  >
                    <List className="w-4 h-4" /> Ver Publicaciones
                  </Link>
                  {isAdmin && (
                    <Link
                      href={siteConfig.paths.adminPanel}
                      onClick={handleCloseMenu}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start gap-2 text-destructive"
                      )}
                    >
                      <Shield className="w-4 h-4" /> AdminPanel
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      handleSignOut();
                      handleCloseMenu();
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Button variant="default" className="w-full" asChild>
                  <Link
                    href={siteConfig.paths.login}
                    onClick={handleCloseMenu}
                    className="flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {translations.signIn}
                  </Link>
                </Button>
              )}
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* --- Menú de Escritorio --- */}
      <nav
        className="hidden sm:flex items-center"
        role="navigation"
        aria-label="Navegación principal"
      >
        <ul className="flex space-x-2 items-center">
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
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  item.requiresAdmin &&
                    "text-destructive hover:text-destructive-foreground focus:text-destructive-foreground"
                )}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            </motion.li>
          ))}
          {status === "authenticated" && userInfo ? (
            <li className="relative">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full h-auto p-2 flex items-center"
                    aria-label="Abrir menú de mi cuenta"
                    aria-expanded="false" // shadcn/ui maneja este atributo, pero es bueno saberlo
                  >
                    <UserInfo user={userInfo} />
                    <ChevronDown className="w-4 h-4 ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="end"
                  sideOffset={8}
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
                      <DropdownMenuItem asChild>
                        <Link
                          href={siteConfig.paths.profile}
                          className="flex items-center w-full cursor-pointer"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={siteConfig.paths.myFavorites}
                          className="flex items-center w-full cursor-pointer"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Mis Favoritos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={siteConfig.paths.vehicleList}
                          className="flex items-center w-full cursor-pointer"
                        >
                          <List className="w-4 h-4 mr-2" />
                          Ver Publicaciones
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href={siteConfig.paths.adminPanel}
                              className="flex items-center w-full text-destructive cursor-pointer"
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              AdminPanel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
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
              <Button variant="ghost" size="icon" asChild>
                <Link href={siteConfig.paths.login} aria-label="Iniciar sesión">
                  <User />
                </Link>
              </Button>
            </li>
          )}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavMenu;
