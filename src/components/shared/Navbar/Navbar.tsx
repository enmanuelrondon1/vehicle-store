// src/components/shared/Navbar/Navbar.tsx
"use client";
import React, { memo } from "react";
import Link from "next/link";
import NavMenu from "./NavMenu";
import Image from "next/image";

// Componente optimizado para el logo
const CompanyLogo = memo(() => {
  const lightLogo =
    "https://res.cloudinary.com/dcdawwvx2/image/upload/v1761340312/Generated_Image_October_24__2025_-_8_50AM-removebg-preview_1_c1gldv.png";
  const darkLogo =
    "https://res.cloudinary.com/dcdawwvx2/image/upload/v1761339670/dreamina-2025-10-24-7495-puedes_cambiarle_el_fondo_a_un_color_neg...-removebg-preview_bd8fc4.png";

  return (
    <Link
      href="/"
      className="group flex items-center"
      aria-label="Ir a la página principal"
    >
      <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-110">
        {/* Logo para modo claro (visible por defecto) */}
        <div className="dark:hidden">
          <Image
            src={lightLogo}
            alt="Logo de VehicleStore"
            width={120}
            height={40}
            priority
            sizes="120px"
          />
        </div>
        {/* Logo para modo oscuro (oculto por defecto, visible en modo dark) */}
        <div className="hidden dark:block">
          <Image
            src={darkLogo}
            alt="Logo de VehicleStore"
            width={120}
            height={40}
            priority
            sizes="120px"
          />
        </div>

        {/* Efecto de brillo en hover, usando el color primario del tema */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-full group-hover:translate-x-full" />
      </div>
    </Link>
  );
});

CompanyLogo.displayName = "CompanyLogo";

export const Navbar = memo(() => {
  // Clases semánticas que usan la paleta de globals.css
  const navbarClasses =
    "fixed top-0 left-0 w-full z-50 transition-colors duration-300 bg-background/80 backdrop-blur-sm border-b border-border text-foreground";

  const containerClasses =
    "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center";

  return (
    <header className={navbarClasses} role="banner">
      <nav
        className={containerClasses}
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Logo Section */}
        <div className="flex items-center flex-shrink-0">
          <CompanyLogo />
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center">
          <NavMenu />
          {/* <ThemeToggle /> Añadir el botón de cambio de tema */}
        </div>
      </nav>

      {/* El bloque <style jsx> puede permanecer para otras optimizaciones, pero los gradientes ya no son necesarios aquí. */}
      <style jsx>{`
        /* Optimizaciones para Lighthouse */
        header {
          contain: layout style paint;
          will-change: transform;
        }

        /* Mejoras de accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus visible para accesibilidad */
        a:focus-visible {
          outline: 2px solid var(--ring); /* Usamos la variable --ring para consistencia */
          outline-offset: 2px;
          border-radius: 8px;
        }
      `}</style>
    </header>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
