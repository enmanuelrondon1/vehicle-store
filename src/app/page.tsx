// src/app/page.tsx
// ✅ OPTIMIZADO: SEO completo, JSON-LD, accesibilidad, performance
import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import HomeInteractions from "@/components/features/home/HomeInteractions";
import FeaturedVehicles from "@/components/features/home/FeaturedVehicles";
import { getApprovedVehicles } from "@/lib/vehicles";
import type { Vehicle } from "@/types/types";

export const metadata: Metadata = {
  title: "1Auto.market — Compra y Vende Vehículos de Confianza en Latinoamérica",
  description:
    "El marketplace de vehículos más seguro de Latinoamérica. Verificación 100% digital, sin comisiones ocultas, soporte 24/7. Más de 50K vehículos vendidos.",
  keywords: [
    "compra vehículos",
    "vende autos",
    "marketplace autos latinoamerica",
    "carros usados",
    "vehículos verificados",
    "1auto market",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_LA",
    url: "https://1auto.market",
    siteName: "1Auto.market",
    title: "1Auto.market — Compra y Vende Vehículos de Confianza",
    description:
      "El marketplace de vehículos más seguro de Latinoamérica. Verificación 100% digital, sin comisiones ocultas.",
    images: [
      {
        url: "https://res.cloudinary.com/dcdawwvx2/image/upload/v1761340312/Generated_Image_October_24__2025_-_8_50AM-removebg-preview_1_c1gldv.png",
        width: 1200,
        height: 630,
        alt: "1Auto.market — Compra y Vende Vehículos de Confianza",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://1auto.market/#website",
      url: "https://1auto.market",
      name: "1Auto.market",
      description: "El marketplace de vehículos más seguro de Latinoamérica",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://1auto.market/vehicleList?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "es",
    },
    {
      "@type": "Organization",
      "@id": "https://1auto.market/#organization",
      name: "1Auto.market",
      url: "https://1auto.market",
      logo: {
        "@type": "ImageObject",
        url: "https://1auto.market/logo/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
      },
    },
    {
      "@type": "AutoDealer",
      "@id": "https://1auto.market/#autoDealer",
      name: "1Auto.market",
      url: "https://1auto.market",
      description: "Marketplace de vehículos verificados en Latinoamérica",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "2300",
        bestRating: "5",
        worstRating: "1",
      },
    },
  ],
};

/* ============================================
   ⚡ Skeletons
   ============================================ */
const SkeletonGrid4 = () => (
  <div className="section-spacing" aria-hidden="true">
    <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
);

const SkeletonGrid3 = () => (
  <div className="section-spacing" aria-hidden="true">
    <div className="container-wide grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
);

const SkeletonBlock = ({ height = "h-64" }: { height?: string }) => (
  <div className="section-spacing" aria-hidden="true">
    <div
      className={`container-wide ${height} bg-muted rounded-xl animate-pulse`}
    />
  </div>
);

/* ============================================
   ⚡ Dynamic imports
   
   ✅ FIX HYDRATION: se eliminó ssr:false de estos 3 componentes.
   
   Ninguno usa window/document/APIs del browser en el render inicial
   (framer-motion con whileInView es seguro en SSR — solo activa
   animaciones en el cliente después del hydration).
   
   ssr:false causaba que el servidor enviara HTML sin estos componentes
   y el cliente los encontrara, generando el hydration mismatch.
   
   El código splitting (lazy load) se mantiene igual — solo
   cambia que ahora el servidor también pre-renderiza el HTML.
============================================ */
const HomeStatsV2 = dynamic(
  () => import("@/components/features/home/HomeStatsV2"),
  { loading: () => <SkeletonGrid4 /> }
  // ✅ sin ssr:false — framer-motion whileInView es SSR-safe
);

const HomeFeaturesV3 = dynamic(
  () => import("@/components/features/home/HomeFeaturesV3"),
  { loading: () => <SkeletonGrid3 /> }
  // ✅ sin ssr:false
);

const TestimonialsSection = dynamic(
  () => import("@/components/features/home/TestimonialsSection"),
  { loading: () => <SkeletonBlock height="h-96" /> }
  // ✅ sin ssr:false
);

/* ============================================
   📦 Data fetching
   ============================================ */
async function getFeaturedVehicles(): Promise<Vehicle[]> {
  try {
    const all = await getApprovedVehicles();
    return all.slice(0, 6);
  } catch {
    return [];
  }
}

/* ============================================
   🏠 HOME PAGE
   ============================================ */
export default async function Home() {
  const featuredVehicles = await getFeaturedVehicles();

  return (
    <>
      {/* 🔍 JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main
        id="main-content"
        className="min-h-screen bg-background text-foreground relative overflow-hidden"
      >
        {/* Background decorativo — solo en Home */}
        <div
          className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"
            style={{ willChange: "auto" }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: "1s", willChange: "auto" }}
          />
        </div>

        {/* Hero */}
        <HomeInteractions />

        {/* Vehículos destacados — above the fold, no lazy */}
        <section
          id="featured-vehicles"
          className="section-spacing"
          aria-labelledby="featured-vehicles-heading"
        >
          <FeaturedVehicles vehicles={featuredVehicles} />
        </section>

        {/* Stats — lazy */}
        <Suspense fallback={<SkeletonGrid4 />}>
          <section
            className="section-spacing section-lazy relative"
            style={{ background: "var(--gradient-hero)" }}
            aria-label="Estadísticas de la plataforma"
          >
            <HomeStatsV2 />
          </section>
        </Suspense>

        {/* Features — lazy */}
        <Suspense fallback={<SkeletonGrid3 />}>
          <section
            id="features"
            className="section-lazy"
            aria-labelledby="features-heading"
          >
            <HomeFeaturesV3 />
          </section>
        </Suspense>

        {/* Testimonios — lazy */}
        <Suspense fallback={<SkeletonBlock height="h-96" />}>
          <section
            className="pt-8 section-lazy"
            aria-label="Testimonios de clientes"
          >
            <TestimonialsSection />
          </section>
        </Suspense>
      </main>
    </>
  );
}