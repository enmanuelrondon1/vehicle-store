// src/components/shared/Navbar/Navbar.tsx
// ✅ OPTIMIZADO: Sin CLS por mounted state, sin animate-pulse siempre activo

"use client";
import React, { memo, useEffect, useRef, useState } from "react";
import NavMenu from "./NavMenu";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isReelsPage = pathname === "/reels";

  useEffect(() => {
    // ✅ Leer scroll inicial al montar (por si la página ya está scrolleada)
    setScrolled(window.scrollY > 10);

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    /*
      ✅ FIX CLS: Eliminado el estado `mounted` que causaba:
        - opacity-0 → opacity-100 al montar = layout shift visible
        - El Navbar tiene position:fixed, no afecta al layout del documento
        - Por tanto no hay riesgo de FOUC → se puede renderizar directamente visible

      ✅ role="banner" correcto para el header principal
    */
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 h-16 transition-all duration-300",
        scrolled
          ? "card-glass shadow-hard border-b border-border"
          : "bg-transparent"
      )}
      role="banner"
    >
      <nav
        className="container-wide h-full flex justify-between items-center py-2 md:py-0 px-4"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Center — Reels Button (desktop) */}
        <div className="hidden md:flex items-center">
          <Link href="/reels" passHref>
            <Button
              variant="ghost"
              className="gap-2 hover:bg-accent/10 transition-colors duration-200"
              aria-label="Vista Rápida — ver reels de vehículos"
              aria-current={isReelsPage ? "page" : undefined}
            >
              {/*
                ✅ FIX: animate-pulse eliminado del icono
                - animate-pulse corre SIEMPRE en background → consume CPU
                - Solo mostramos animación si estamos EN la página de reels
                  (indicador de página activa) o en hover
              */}
              <Play
                className={cn(
                  "w-5 h-5 fill-current transition-transform duration-200",
                  isReelsPage
                    ? "animate-pulse text-accent"
                    : "group-hover:scale-110"
                )}
                aria-hidden="true"
              />
              <span className="font-semibold">Vista Rápida</span>
            </Button>
          </Link>
        </div>

        {/* Right — Nav Menu */}
        <div className="flex items-center gap-2">
          {/* Reels button mobile */}
          <div className="md:hidden">
            <Link href="/reels" passHref>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/10 transition-colors duration-200"
                aria-label="Vista Rápida"
                aria-current={isReelsPage ? "page" : undefined}
              >
                <Play
                  className={cn(
                    "w-5 h-5 fill-current",
                    isReelsPage && "text-accent"
                  )}
                  aria-hidden="true"
                />
              </Button>
            </Link>
          </div>

          <NavMenu />
        </div>
      </nav>
    </header>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;