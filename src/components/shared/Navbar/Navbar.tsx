// src/components/shared/Navbar/Navbar.tsx 
"use client";

import React, { memo, useEffect, useState } from "react";
import NavMenu from "./NavMenu";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    "fixed top-0 left-0 w-full z-50 h-16 transition-all duration-300",
    scrolled 
      ? "card-glass shadow-hard border-b border-border"
      : "bg-transparent"
  );

  const containerClasses = "container-wide h-full flex justify-between items-center py-2 md:py-0 px-4";

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
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Center - Reels Button (visible on larger screens) */}
        <div className="hidden md:flex items-center">
          <Link href="/reels" passHref>
            <Button 
              variant="ghost" 
              className="gap-2 hover:bg-accent/50 transition-all duration-300"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Play className="w-5 h-5 fill-current" />
              </motion.div>
              <span className="font-semibold">Vista Rápida</span>
            </Button>
          </Link>
        </div>

        {/* Right - Nav Menu */}
        <div className="flex items-center gap-2">
          {/* Mobile Reels Button */}
          <div className="md:hidden">
            <Link href="/reels" passHref>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-accent/50"
              >
                <Play className="w-5 h-5 fill-current" />
              </Button>
            </Link>
          </div>
          
          <NavMenu />
        </div>
      </motion.nav>
    </header>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;