// src/components/shared/Navbar/components/LanguageSelector.tsx
"use client";

import React, { useCallback, useMemo } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguajeContext";

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

  const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Language;
    if (value in LANGUAGES) {
      setLanguage(value);
    }
  }, [setLanguage]);

  const containerClasses = isMobile
    ? "relative flex items-center gap-2 rounded-xl p-3 border border-border bg-background/50"
    : "relative flex items-center gap-2 px-3 py-2 bg-transparent hover:bg-white/20 rounded-full transition-colors";
  
  const iconClasses = isMobile ? "text-muted-foreground" : "text-primary-foreground";
  
  const selectClasses = isMobile
    ? "w-full bg-transparent outline-none text-foreground border-none font-medium appearance-none"
    : "bg-transparent text-primary-foreground outline-none text-sm border-none font-medium appearance-none cursor-pointer";

  const arrowClasses = isMobile ? "text-muted-foreground" : "text-primary-foreground";

  const languageOptions = useMemo(() =>
    Object.values(LANGUAGES).map(lang => (
      <option
        key={lang.value}
        value={lang.value}
        className="bg-popover text-popover-foreground"
      >
        {lang.label}
      </option>
    )), []
  );

  return (
    <div className={containerClasses}>
      <Globe
        className={`w-5 h-5 ${iconClasses}`}
        aria-hidden="true"
      />
      <select
        value={language}
        onChange={handleLanguageChange}
        className={selectClasses}
        aria-label="Seleccionar idioma"
      >
        {languageOptions}
      </select>
      <ChevronDown 
        className={`w-4 h-4 ${arrowClasses} absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none`}
      />
    </div>
  );
};

LanguageSelector.displayName = "LanguageSelector";
export default LanguageSelector;