// src/components/features/home/HeroSectionV2.tsx
// ✅ OPTIMIZADO: memo, useCallback, role=search, label accesible, HTML semántico
"use client";
import React, { memo, useState, useCallback, useId } from "react";
import { Car, Search, Shield, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedBackground } from "./hero/AnimatedBackground";
import { useRouter } from "next/navigation";

interface HeroSectionV2Props {
  onSellClick: () => void;
  onBrowseVehicles: () => void;
}

const TRUST_INDICATORS = [
  "50K+ Vehículos vendidos",
  "25K+ Usuarios activos",
  "4.8★ Valoración",
] as const;

const HeroSectionV2 = memo<HeroSectionV2Props>(({ onSellClick, onBrowseVehicles }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputId = useId();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/vehicleList?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        onBrowseVehicles();
      }
    },
    [searchQuery, router, onBrowseVehicles]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    []
  );

  return (
    <section
      className="relative w-full min-h-[70vh] flex items-center"
      style={{ background: "var(--gradient-hero)" }}
      aria-labelledby="hero-heading"
    >
      <AnimatedBackground aria-hidden="true" />

      <div className="relative z-10 container-wide py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-600">
            <div
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border backdrop-blur-sm card-glass group cursor-default"
              role="status"
            >
              <div
                className="w-2 h-2 rounded-full mr-2 animate-pulse"
                style={{ backgroundColor: "var(--success)" }}
                aria-hidden="true"
              />
              <Shield className="w-4 h-4 mr-2" style={{ color: "var(--accent)" }} aria-hidden="true" />
              <span className="text-gradient">El marketplace más seguro de Latinoamérica</span>
              <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            </div>
          </div>

          {/* H1 — LCP crítico */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold leading-tight mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150"
          >
            <span style={{ color: "var(--foreground)" }}>Compra y Vende</span>
            <br />
            <span
              className="block mt-1"
              style={{
                background: "var(--gradient-accent)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Vehículos de Confianza
            </span>
          </h1>

          {/* Subtítulo */}
          <p
            className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
            style={{ color: "var(--muted-foreground)" }}
          >
            <strong className="font-semibold" style={{ color: "var(--foreground)" }}>
              Verificación 100% digital
            </strong>
            {" • "}Sin comisiones ocultas{" • "}Soporte 24/7
          </p>

          {/* Búsqueda — role=search */}
          <form
            onSubmit={handleSearch}
            role="search"
            aria-label="Buscar vehículos"
            className="mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto card-glass p-2 rounded-2xl shadow-hard">
              <div className="flex-1 relative">
                <label htmlFor={searchInputId} className="sr-only">
                  Busca por marca, modelo o año
                </label>
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <Input
                  id={searchInputId}
                  type="search"
                  placeholder="Busca por marca, modelo o año..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="input-premium pl-12 h-12 sm:h-14 text-base sm:text-lg border-0 focus:ring-2"
                  style={{ backgroundColor: "var(--background)" }}
                  autoComplete="off"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="btn-accent h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold group"
              >
                <Search className="w-5 h-5 mr-2" aria-hidden="true" />
                Buscar
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </div>
          </form>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700"
            role="group"
            aria-label="Acciones principales"
          >
            <Button
              onClick={onSellClick}
              size="lg"
              className="btn-primary w-full sm:w-auto text-base sm:text-lg py-6 sm:py-7 px-8 sm:px-10 font-bold group relative overflow-hidden hover:scale-105 transition-transform duration-200"
              aria-label="Publicar mi vehículo en venta"
            >
              <span className="absolute inset-0 -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" aria-hidden="true" />
              <Car className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" aria-hidden="true" />
              Vender mi Vehículo
            </Button>

            <Button
              onClick={onBrowseVehicles}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg py-6 sm:py-7 px-8 sm:px-10 font-bold border-2 group hover:scale-105 transition-transform duration-200"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
              aria-label="Ver catálogo completo de vehículos"
            >
              Ver Catálogo Completo
              <ArrowRight className="w-5 h-5 ml-2 sm:ml-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
          </div>

          {/* Trust indicators — lista semántica */}
          <ul
            className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-8 text-sm animate-in fade-in duration-1000 delay-1000 list-none p-0"
            style={{ color: "var(--muted-foreground)" }}
            aria-label="Estadísticas de confianza"
          >
            {TRUST_INDICATORS.map((text) => (
              <li key={text} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--success)" }} aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
});

HeroSectionV2.displayName = "HeroSectionV2";
export default HeroSectionV2;