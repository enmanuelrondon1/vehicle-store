// src/app/layout.tsx (versión corregida)
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/shared/layout/ClientLayout";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AosInitializer } from "@/components/shared/AosInitializer";

export const metadata: Metadata = {
  title: "1Auto.market | Vende tu vehículo de forma rápida y segura",
  description: "El marketplace premium para comprar y vender autos, motos, camiones y maquinaria pesada. Inspección 360° y proceso de venta simplificado.",
  keywords: [
    "autos",
    "motos",
    "camiones",
    "maquinaria pesada",
    "venta de vehículos",
    "1AutoMarket",
    "comprar autos",
    "vender autos",
    "marketplace de vehículos"
  ],
  openGraph: {
    title: "1Auto.market | Vende tu vehículo de forma rápida y segura",
    description: "El marketplace premium para comprar y vender autos, motos, camiones y maquinaria pesada. Inspección 360° y proceso de venta simplificado.",
    url: "https://1auto.market",
    siteName: "1Auto.market",
    images: [
      {
        url: "https://res.cloudinary.com/dcdawwvx2/image/upload/v1761340312/Generated_Image_October_24__2025_-_8_50AM-removebg-preview_1_c1gldv.png",
        width: 1200,
        height: 630,
        alt: "1Auto.market - Venta de vehículos",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "1Auto.market | Vende tu vehículo de forma rápida y segura",
    description: "El marketplace premium para comprar y vender autos, motos, camiones y maquinaria pesada. Inspección 360° y proceso de venta simplificado.",
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
    { media: "(prefers-color-scheme: light)", color: "oklch(0.2 0.08 240)" }, // Usando variables OKLCH
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.7 0.3 250)" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Preload de fuentes para mejor rendimiento */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Poppins:wght@600;700;800&display=swap" as="style" />
        
        {/* Meta tags adicionales para SEO */}
        <meta name="author" content="1Auto.market" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Script para prevenir parpadeo de tema */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const finalTheme = theme || systemTheme;
                  if (finalTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        
        {/* Preconexión a dominios externos para mejorar rendimiento */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      
      <body 
        className="font-sans antialiased min-h-screen bg-background text-foreground transition-colors duration-300"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>
            {/* Inicializador de AOS con efectos mejorados */}
            <AosInitializer /> 
            {/* ELIMINADO: La etiqueta main duplicada */}
            {children}
            <Toaster
              richColors
              theme="system"
              toastOptions={{
                classNames: {
                  toast: "group toast group-[.toaster]:card-glass group-[.toaster]:text-card-foreground group-[.toaster]:border-glass-border group-[.toaster]:shadow-glass",
                  title: "font-heading font-semibold",
                  description: "group-[.toast]:text-muted-foreground",
                  actionButton:
                    "group-[.toast]:btn-primary group-[.toast]:text-primary-foreground",
                  cancelButton:
                    "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                  success: "group-[.toast]:border-success/20 group-[.toast]:text-success",
                  error: "group-[.toast]:border-destructive/20 group-[.toast]:text-destructive",
                },
              }}
            />
          </ClientLayout>
        </ThemeProvider>
        
        {/* Efecto de fondo animado sutil */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>
      </body>
    </html>
  );
}