// src/app/page.tsx - HOME PREMIUM 10/10
"use client";

import { useState, useCallback, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Componentes estáticos (carga inmediata)
import HeroSectionV2 from "@/components/features/home/HeroSectionV2";
import { LoginModal } from "@/components/features/home/hero/LoginModal";
import { siteConfig } from "@/config/site";

// Componentes dinámicos (lazy load)
const FeaturedVehicles = dynamic(
  () => import("@/components/features/home/FeaturedVehicles"),
  {
    loading: () => (
      <div className="section-spacing container-wide animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mx-auto mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    ),
  }
);

const HomeStatsV2 = dynamic(
  () => import("@/components/features/home/HomeStatsV2")
);
const HomeFeaturesV3 = dynamic(
  () => import("@/components/features/home/HomeFeaturesV3")
);
const TestimonialsSection = dynamic(
  () => import("@/components/features/home/TestimonialsSection")
);
const HeroCallToActionV2 = dynamic(
  () => import("@/components/features/home/HeroCallToActionV2")
);

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

  const handleBrowseVehicles = useCallback(() => {
    router.push(siteConfig.paths.vehicleList);
  }, [router]);

  const handleCloseLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* ✨ Efectos de fondo premium globales */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* 1️⃣ HERO SECTION - Carga inmediata */}
      <section className="relative">
        <HeroSectionV2
          onSellClick={handleSellClick}
          onBrowseVehicles={handleBrowseVehicles}
        />
      </section>

      {/* 2️⃣ VEHÍCULOS DESTACADOS - Lazy load con skeleton */}
      <Suspense fallback={null}>
        <section className="section-spacing">
          <FeaturedVehicles />
        </section>
      </Suspense>

      {/* 3️⃣ ESTADÍSTICAS ANIMADAS - Lazy load */}
      <Suspense fallback={null}>
        <section
          className="section-spacing relative"
          style={{ background: "var(--gradient-hero)" }}
        >
          <HomeStatsV2 />
        </section>
      </Suspense>

      {/* 4️⃣ FEATURES (Solo 3 principales) - Lazy load */}
      <Suspense fallback={null}>
        <section id="features" className="section-spacing">
          <HomeFeaturesV3 />
        </section>
      </Suspense>

      {/* 5️⃣ TESTIMONIOS CON CARRUSEL - Lazy load */}
      <Suspense fallback={null}>
        <section className="section-spacing">
          <TestimonialsSection />
        </section>
      </Suspense>

      {/* 6️⃣ CTA FINAL (UNO SOLO) - Lazy load */}
      <Suspense fallback={null}>
        <section className="section-spacing">
          <HeroCallToActionV2 onSellClick={handleSellClick} />
        </section>
      </Suspense>

      {/* 🔐 MODAL DE LOGIN */}
      <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} />
    </main>
  );
}
