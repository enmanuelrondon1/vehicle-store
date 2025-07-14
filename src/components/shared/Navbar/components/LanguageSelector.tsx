// src/components/shared/Navbar/components/LanguageSelector.tsx
"use client";

import React, { useCallback, useMemo } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguajeContext";
import { useDarkMode } from "@/context/DarkModeContext";

type Language = "es" | "en";

interface LanguageSelectorProps {
  isMobile?: boolean;
}

const LANGUAGES: Record<Language, { value: Language; label: string }> = {
  es: { value: "es", label: "Español" },
  en: { value: "en", label: "English" },
};

const LanguageSelector = ({ isMobile = false }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();
  const { isDarkMode } = useDarkMode();

  const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Language;
    if (value in LANGUAGES) {
      setLanguage(value);
    }
  }, [setLanguage]);

  const styles = useMemo(() => {
    const baseContainer = "flex items-center gap-2 rounded-xl transition-all duration-200";
    return {
      container: isMobile
        ? `${baseContainer} p-3 border ${isDarkMode ? "border-gray-600 bg-gray-800/50" : "border-gray-300 bg-white/50"}`
        : `${baseContainer} px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/15`,
      icon: isMobile
        ? (isDarkMode ? "text-gray-300" : "text-gray-600")
        : "text-white",
      select: isMobile
        ? `flex-1 bg-transparent outline-none text-gray-900 border-none p-1 font-medium`
        : `bg-transparent text-white outline-none text-sm border-none p-1 font-medium min-w-[100px]`,
      // 🔥 MODIFICACIÓN: Aumenté el padding vertical de py-2 a py-3 para más separación
      option: `${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-900 hover:bg-gray-100"} py-3 px-2`,
      arrow: isMobile
        ? (isDarkMode ? "text-gray-300" : "text-gray-600")
        : "text-white",
    };
  }, [isMobile, isDarkMode]);

  const languageOptions = useMemo(() =>
    Object.values(LANGUAGES).map(lang => (
      <option
        key={lang.value}
        value={lang.value}
        className={styles.option}
      >
        {lang.label}
      </option>
    )), [styles.option]
  );

  return (
    <div className={styles.container}>
      <Globe
        className={`w-4 h-4 ${styles.icon}`}
        aria-hidden="true"
      />
      <select
        value={language}
        onChange={handleLanguageChange}
        className={styles.select}
        aria-label="Seleccionar idioma"
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          backgroundImage: "none",
        }}
      >
        {languageOptions}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg
          className={`w-4 h-4 ${styles.arrow} transition-transform duration-200`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

LanguageSelector.displayName = "LanguageSelector";
export default LanguageSelector;