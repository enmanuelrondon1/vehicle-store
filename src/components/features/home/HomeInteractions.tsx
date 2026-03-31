// src/components/features/home/HomeInteractions.tsx
"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginModal } from "./hero/LoginModal";
import { siteConfig } from "@/config/site";
import HeroSectionV2 from "./HeroSectionV2";

// ✅ Lazy load — framer-motion no bloquea el bundle inicial
const HeroCallToActionV2 = dynamic(
  () => import("./HeroCallToActionV2"),
  { ssr: false }
);

export default function HomeInteractions() {
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

  return (
    <>
      <section className="relative">
        <HeroSectionV2
          onSellClick={handleSellClick}
          onBrowseVehicles={handleBrowseVehicles}
        />
      </section>

      <section className="section-spacing">
        <HeroCallToActionV2 onSellClick={handleSellClick} />
      </section>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}