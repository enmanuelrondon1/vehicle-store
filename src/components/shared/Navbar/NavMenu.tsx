// src/components/shared/Navbar/NavMenu.tsx
"use client";
import React, { memo, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  Menu, X, Phone, LogOut, ChevronDown,
  User, Shield, Heart, List,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguajeContext";
import AnimatedPostButton from "./AnimatedPostButton";
import UserInfo from "./UserInfo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const NavItem = memo(({ item, onClick, isMobile = false }: {
  item: { label: string; href: string; icon: React.ReactNode; requiresAdmin?: boolean };
  onClick?: () => void;
  isMobile?: boolean;
}) => (
  <li>
    <Link
      href={item.href}
      className={cn(
        "relative overflow-hidden group",
        buttonVariants({ variant: "ghost" }),
        isMobile ? "w-full justify-start gap-3 text-lg py-6" : "gap-2",
        item.requiresAdmin && "hover:bg-destructive/10 hover:text-destructive"
      )}
      onClick={onClick}
      style={{ color: item.requiresAdmin ? "var(--destructive)" : "inherit" }}
    >
      {/* Subrayado animado desktop */}
      {!isMobile && (
        <span
          className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
          style={{ backgroundColor: "var(--accent)" }}
        />
      )}
      <span className="transition-transform duration-200 group-hover:-rotate-6" style={{ color: "var(--accent)" }}>
        {item.icon}
      </span>
      <span>{item.label}</span>
    </Link>
  </li>
));

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

  const navItems = useMemo(() => [
    {
      label: translations.contact,
      href: siteConfig.paths.contact,
      icon: <Phone className="w-5 h-5" />,
    },
    ...(isAdmin ? [{
      label: "AdminPanel",
      href: siteConfig.paths.adminPanel,
      icon: <Shield className="w-5 h-5" />,
      requiresAdmin: true,
    }] : []),
  ], [translations.contact, isAdmin]);

  return (
    <>
      {/* Menú Móvil */}
      <div className="sm:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menú" className="card-glass hover:bg-accent/10">
              <div className="transition-all duration-200">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 card-glass">
            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>

            <div className="p-6 border-b border-glass-border" style={{ background: "var(--gradient-hero)" }}>
              <h2 className="text-2xl font-heading font-bold text-gradient">Menú</h2>
              <p className="text-sm mt-1 text-muted-foreground">Navega y publica tus anuncios fácilmente.</p>
            </div>

            <div className="p-4 border-b border-glass-border">
              <AnimatedPostButton isMobile={true} onClick={() => setIsMenuOpen(false)} />
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <NavItem key={item.label} item={item} onClick={() => setIsMenuOpen(false)} isMobile={true} />
                ))}
              </ul>
            </nav>

            <div className="mt-auto p-4 border-t border-glass-border space-y-3">
              {status === "authenticated" && userInfo ? (
                <div className="space-y-2">
                  <UserInfo user={userInfo} isMobile={true} />
                  <DropdownMenuSeparator className="bg-glass-border" />
                  <NavItem item={{ label: "Perfil", href: siteConfig.paths.profile, icon: <User className="w-5 h-5" /> }} onClick={() => setIsMenuOpen(false)} isMobile />
                  <NavItem item={{ label: "Mis Favoritos", href: siteConfig.paths.myFavorites, icon: <Heart className="w-5 h-5" /> }} onClick={() => setIsMenuOpen(false)} isMobile />
                  <NavItem item={{ label: "Ver Publicaciones", href: siteConfig.paths.vehicleList, icon: <List className="w-5 h-5" /> }} onClick={() => setIsMenuOpen(false)} isMobile />
                  {isAdmin && (
                    <NavItem item={{ label: "AdminPanel", href: siteConfig.paths.adminPanel, icon: <Shield className="w-5 h-5" />, requiresAdmin: true }} onClick={() => setIsMenuOpen(false)} isMobile />
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Button className="btn-primary w-full" asChild>
                  <Link href={siteConfig.paths.login} onClick={() => setIsMenuOpen(false)}>
                    <User className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Link>
                </Button>
              )}
              <div className="flex justify-center pt-2">
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Menú Escritorio */}
      <nav className="hidden sm:flex items-center">
        <ul className="flex space-x-2 items-center animate-in slide-in-from-right-4 duration-500">
          <li><AnimatedPostButton /></li>

          {navItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}

          {status === "authenticated" && userInfo ? (
            <li>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-auto p-2 hover:bg-accent/10">
                    <UserInfo user={userInfo} />
                    <ChevronDown className="w-4 h-4 ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 card-glass" align="end" sideOffset={8}>
                  <DropdownMenuLabel className="font-heading font-bold text-gradient">Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-glass-border" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href={siteConfig.paths.profile} className="flex items-center gap-3 cursor-pointer hover:bg-accent/10">
                        <Shield className="w-4 h-4" style={{ color: "var(--accent)" }} />
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={siteConfig.paths.myFavorites} className="flex items-center gap-3 cursor-pointer hover:bg-accent/10">
                        <Heart className="w-4 h-4" style={{ color: "var(--accent)" }} />
                        Mis Favoritos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={siteConfig.paths.vehicleList} className="flex items-center gap-3 cursor-pointer hover:bg-accent/10">
                        <List className="w-4 h-4" style={{ color: "var(--accent)" }} />
                        Ver Publicaciones
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator className="bg-glass-border" />
                        <DropdownMenuItem asChild>
                          <Link href={siteConfig.paths.adminPanel} className="flex items-center gap-3 cursor-pointer hover:bg-destructive/10" style={{ color: "var(--destructive)" }}>
                            <Shield className="w-4 h-4" />
                            AdminPanel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-glass-border" />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-3 cursor-pointer hover:bg-destructive/10" style={{ color: "var(--destructive)" }}>
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ) : (
            <li>
              <Button variant="ghost" size="icon" asChild className="hover:bg-accent/10 hover:scale-110 transition-transform duration-200">
                <Link href={siteConfig.paths.login} aria-label="Iniciar sesión">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
            </li>
          )}

          <li><ThemeToggle /></li>
        </ul>
      </nav>
    </>
  );
};

export default NavMenu;