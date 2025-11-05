// src/app/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/features/home/HeroSection";
import HomeFeatures from "@/components/features/home/HomeFeatures";
import HomeStats from "@/components/features/home/HomeStats";
import { HeroCallToAction } from "@/components/features/home/hero/HeroCallToAction";
import { LoginModal } from "@/components/features/home/hero/LoginModal";
import { siteConfig } from "@/config/site";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSellClick = useCallback(() => {
    if (status === "authenticated") {
      router.push(siteConfig.paths.publishAd);
    } else if (status === "unauthenticated") {
      setShowLoginModal(true);
    }
  }, [status, router]);

  const handleSecondaryButtonClick = useCallback(() => {
    if (status === "authenticated") {
      router.push(siteConfig.paths.vehicleList);
    } else {
      document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [status, router]);

  const handleCloseLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  return (
    // 1. CONTENEDOR PRINCIPAL CON CLASES DE UTILIDAD
    <main className="min-h-screen bg-background text-foreground">
      {/* 2. SECCIÓN HERO CON ANIMACIÓN "fade-down" */}
      <section data-aos="fade-down" data-aos-duration="1000">
        <HeroSection
          onSellClick={handleSellClick}
          onSecondaryButtonClick={handleSecondaryButtonClick}
        />
      </section>

      {/* 3. SECCIÓN DE CARACTERÍSTICAS CON ANIMACIÓN "fade-up" */}
      <section id="features" className="section-padding" data-aos="fade-up" data-aos-delay="100">
        <HomeFeatures />
      </section>

      {/* 4. SECCIÓN DE ESTADÍSTICAS CON ANIMACIÓN "zoom-in" */}
      <section className="section-padding bg-muted/30" data-aos="zoom-in" data-aos-delay="200">
        <HomeStats />
      </section>

      {/* 5. SECCIÓN DE LLAMADA A LA ACCIÓN CON ANIMACIÓN "fade-up" */}
      <section className="section-padding" data-aos="fade-up" data-aos-delay="300">
        <HeroCallToAction onSellClick={handleSellClick} />
      </section>

      {/* 6. MODAL DE LOGIN (sin animación AOS, no es necesario) */}
      <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} />
    </main>
  );
}