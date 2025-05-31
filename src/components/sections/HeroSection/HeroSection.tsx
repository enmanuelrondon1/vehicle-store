"use client";
import React, { useState, useEffect } from "react";
import ContentSection from "./ContentSection";
import { useLanguage } from "@/context/LanguajeContext";
import GlobeSection from "@/components/sections/GlobeSection/GlobeSection";

const HeroSection = () => {
  const { translations } = useLanguage();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(64);

  useEffect(() => {
    const navbar = document.querySelector("header.navbar-gradient");
    if (navbar) {
      const height = navbar.getBoundingClientRect().height;
      setNavbarHeight(height);
    }

    const handleResize = () => {
      if (navbar) {
        setNavbarHeight(navbar.getBoundingClientRect().height);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="mx-auto m-2 max-w-[1440px] px-6 lg:px-12 relative min-h-[650px] w-full overflow-hidden bg-gradient-to-b from-[#F9FAFB] to-[#E5E7EB] dark:from-[#111827] dark:to-[#1F2937] transition-colors duration-300"
      style={{ paddingTop: `${navbarHeight}px` }}
    >
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#1E3A8A] rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F97316] rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#E5E7EB] dark:bg-[#1F2937] rounded-full blur-3xl"></div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between h-full py-12">
        <GlobeSection setIsMapOpen={setIsMapOpen} />
        <ContentSection />
      </div>

      {/* Modal para el Mapa */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#1F2937] rounded-lg p-4 w-full max-w-2xl relative shadow-lg">
            <button
              onClick={() => setIsMapOpen(false)}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              aria-label={translations?.close || "Close"}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB] mb-4">
              {translations?.ourLocation || "Nuestra Ubicación"}
            </h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019192602513!2d-122.4194155846812!3d37.77492977975966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808f4e3d6b0f%3A0x6e9b9e7e7f1d4e0f!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1697041234567!5m2!1sen!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={translations?.ourLocation || "Our Location"}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;