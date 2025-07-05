"use client";
import React, { memo, useCallback } from "react";
import Link from "next/link";
import NavMenu from "./NavMenu";
import Image from "next/image";
import { useDarkMode } from "@/context/DarkModeContext";

// Componente optimizado para el logo
const CompanyLogo = memo(() => {
  
  return (
    <Link 
      href="/" 
      className="group relative flex items-center transition-transform duration-300 hover:scale-105"
      aria-label="Ir a la página principal"
    >
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src="https://res.cloudinary.com/dcdawwvx2/image/upload/f_auto,q_auto:eco/v1748899696/image-removebg-preview_1_yq8jh8.png"
          alt="Logo de la empresa - Plataforma de venta de vehículos"
          width={80}
          height={80}
          priority
          className="object-contain transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 60px, 80px"
        />
        
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-full group-hover:translate-x-full" />
      </div>
    </Link>
  );
});

CompanyLogo.displayName = 'CompanyLogo';

export const Navbar = memo(() => {
  const { isDarkMode } = useDarkMode();

  // Memoizar clases CSS para evitar recálculos
  const navbarClasses = useCallback(() => {
    const baseClasses = "fixed top-0 left-0 w-full z-50 transition-all duration-300 shadow-lg backdrop-blur-sm";
    
    if (isDarkMode) {
      // MODO OSCURO - Regla 60-30-10
      return `${baseClasses} bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-b border-slate-700/50`;
    } else {
      // MODO CLARO - Regla 60-30-10
      return `${baseClasses} bg-gradient-to-r from-blue-600/95 via-blue-700/95 to-blue-800/95 border-b border-blue-500/20`;
    }
  }, [isDarkMode]);

  const containerClasses = useCallback(() => {
    return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center";
  }, []);

  return (
    <header 
      className={navbarClasses()}
      role="banner"
    >
      <nav 
        className={containerClasses()}
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Logo Section - 60% del espacio visual */}
        <div className="flex items-center flex-shrink-0">
          <CompanyLogo />
        </div>

        {/* Navigation Menu - 30% del espacio visual */}
        <div className="flex items-center">
          <NavMenu />
        </div>
      </nav>

      {/* Esquema de colores optimizado con CSS-in-JS para mejor rendimiento */}
      <style jsx>{`
        /* Optimizaciones para Lighthouse */
        header {
          contain: layout style paint;
          will-change: transform;
        }

        /* Preload de gradientes para mejor rendimiento */
        .navbar-gradient-dark {
          background: linear-gradient(135deg, 
            rgb(15, 23, 42) 0%,     /* 60% - Color primario oscuro */
            rgb(30, 41, 59) 50%,    /* 30% - Color secundario */
            rgb(51, 65, 85) 100%    /* 10% - Color de acento */
          );
        }

        .navbar-gradient-light {
          background: linear-gradient(135deg, 
            rgb(37, 99, 235) 0%,    /* 60% - Color primario claro */
            rgb(29, 78, 216) 50%,   /* 30% - Color secundario */
            rgb(59, 130, 246) 100%  /* 10% - Color de acento */
          );
        }

        /* Optimización de fuentes */
        @media (max-width: 640px) {
          nav {
            height: 4rem; /* 64px */
          }
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
          outline: 2px solid ${isDarkMode ? '#f97316' : '#ea580c'};
          outline-offset: 2px;
          border-radius: 8px;
        }

        /* Optimización de scroll */
        @supports (backdrop-filter: blur(12px)) {
          header {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
        }
      `}</style>
    </header>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;