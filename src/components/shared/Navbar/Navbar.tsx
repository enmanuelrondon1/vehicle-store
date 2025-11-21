// src/components/shared/Navbar/Navbar.tsx (CORREGIDO)
"use client";

import React, { memo, useEffect, useState } from "react";
import NavMenu from "./NavMenu";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

export const Navbar = memo(() => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const navbarClasses = cn(
    "fixed top-0 left-0 w-full z-50 h-16 transition-all duration-300", // <-- ¡AGREGAMOS h-16!
    scrolled 
      ? "card-glass shadow-hard border-b border-border"
      : "bg-transparent"
  );

  const containerClasses = "container-wide h-full flex justify-between items-center py-2 md:py-0";

  return (
    <header className={navbarClasses} role="banner">
      <motion.nav
        className={containerClasses}
        role="navigation"
        aria-label="Navegación principal"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex items-center">
          <NavMenu />
        </div>
      </motion.nav>
    </header>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;