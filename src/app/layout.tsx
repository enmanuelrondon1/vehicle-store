// src/app/layout.tsx
// ✅ OPTIMIZADO: next/font en lugar de @import externo, sin AOS, sin meta duplicado
// ✅ OPTIMIZADO v2: blur decorativo movido a page.tsx — no aplica en todas las rutas

import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/shared/layout/ClientLayout";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "900"],
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
  weight: ["600", "700", "800"],
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://1auto.market"
  ),
  title: {
    default: "1Auto.market | Vende tu vehículo de forma rápida y segura",
    template: "%s | 1Auto.market",
  },
  description:
    "El marketplace premium para comprar y vender autos, motos, camiones y maquinaria pesada. Inspección 360° y proceso de venta simplificado.",
  keywords: [
    "autos",
    "motos",
    "camiones",
    "maquinaria pesada",
    "venta de vehículos",
    "1AutoMarket",
    "comprar autos",
    "vender autos",
    "marketplace de vehículos",
  ],
  authors: [{ name: "1Auto.market", url: "https://1auto.market" }],
  creator: "1Auto.market",
  openGraph: {
    title: "1Auto.market | Vende tu vehículo de forma rápida y segura",
    description:
      "El marketplace premium para comprar y vender autos, motos, camiones y maquinaria pesada.",
    url: "https://1auto.market",
    siteName: "1Auto.market",
    images: [
      {
        url: "https://res.cloudinary.com/dcdawwvx2/image/upload/v1761340312/Generated_Image_October_24__2025_-_8_50AM-removebg-preview_1_c1gldv.png",
        width: 1200,
        height: 630,
        alt: "1Auto.market - Compra y venta de vehículos",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "1Auto.market | Vende tu vehículo de forma rápida y segura",
    description:
      "El marketplace premium para comprar y vender autos, motos, camiones y maquinaria pesada.",
    images: [
      "https://res.cloudinary.com/dcdawwvx2/image/upload/v1761340312/Generated_Image_October_24__2025_-_8_50AM-removebg-preview_1_c1gldv.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo/favicon.svg", type: "image/svg+xml" },
      { url: "/logo/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/logo/apple-touch-icon.png",
    shortcut: "/logo/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a2744" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1117" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme'),s=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if((t||s)==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>

      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>
            {children}
            <Toaster
              richColors
              theme="system"
              toastOptions={{
                classNames: {
                  toast:
                    "group toast group-[.toaster]:card-glass group-[.toaster]:text-card-foreground group-[.toaster]:border-glass-border group-[.toaster]:shadow-glass",
                  title: "font-heading font-semibold",
                  description: "group-[.toast]:text-muted-foreground",
                  actionButton:
                    "group-[.toast]:btn-primary group-[.toast]:text-primary-foreground",
                  cancelButton:
                    "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                  success:
                    "group-[.toast]:border-success/20 group-[.toast]:text-success",
                  error:
                    "group-[.toast]:border-destructive/20 group-[.toast]:text-destructive",
                },
              }}
            />
          </ClientLayout>
        </ThemeProvider>

        {/*
          ✅ ELIMINADO el bloque de blur decorativo que estaba aquí.

          RAZÓN: Los dos divs con blur-3xl + animate-pulse-glow se renderizaban
          en TODAS las rutas (vehicleList, vehicle/[id], profile, admin, etc.)
          generando:
            - Capas GPU activas en páginas donde no se necesitan
            - animate-pulse-glow corriendo en background en cada ruta
            - ~2ms de paint extra por ruta

          SOLUCIÓN: Pégalos en src/app/page.tsx dentro del return, justo antes
          del <HeroSectionV2 /> o como primer hijo del fragment:

          // En src/app/page.tsx — dentro del return, fuera de cualquier section:
          <div
            className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"
              style={{ willChange: "auto" }}
            />
            <div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-glow"
              style={{ animationDelay: "1s", willChange: "auto" }}
            />
          </div>
        */}
      </body>
    </html>
  );
}