//src/app/page.tsx
"use client";
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/features/home/HeroSection";
import HomeFeatures from "@/components/features/home/HomeFeatures";
import HomeStats from "@/components/features/home/HomeStats";
// import Testimonials from "@/components/features/home/Testimonials";
import { HeroCallToAction } from "@/components/features/home/hero/HeroCallToAction";
import { LoginModal } from "@/components/features/home/hero/LoginModal";
import { siteConfig } from "@/config/site"; // <-- 1. Importa la configuración

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSellClick = useCallback(() => {
    if (status === "authenticated") {
      // 2. Usa la ruta desde siteConfig
      router.push(siteConfig.paths.publishAd);
    } else if (status === "unauthenticated") {
      setShowLoginModal(true);
    }
  }, [status, router]);

  const handleSecondaryButtonClick = useCallback(() => {
    if (status === "authenticated") {
      // 3. Usa también la ruta para la lista de vehículos
      router.push(siteConfig.paths.vehicleList);
    } else {
      document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [status, router]);

  const handleCloseLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  return (
    <main>
      <HeroSection
        onSellClick={handleSellClick}
        onSecondaryButtonClick={handleSecondaryButtonClick}
      />
      <div id="features">
        <HomeFeatures />
      </div>
      <HomeStats />
      {/* <Testimonials /> */}
      <HeroCallToAction onSellClick={handleSellClick} />
      <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} />
    </main>
  );
}