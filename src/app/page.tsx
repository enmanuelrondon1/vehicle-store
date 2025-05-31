"use client";

import BrandSlider from "@/components/sections/BrandSlider/BrandSlider";
import FeaturedVehicles from "@/components/sections/FeaturedVehicles/FeaturedVehicles";
import TestimonialsSection from "@/components/sections/TestimonialsSection/TestimonialsSection";
import HeroSection from "@/components/sections/HeroSection/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BrandSlider />
      <FeaturedVehicles />
      <TestimonialsSection />
    </main>
  );
}
