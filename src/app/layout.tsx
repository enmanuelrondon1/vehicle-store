// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/shared/layout/ClientLayout";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AosInitializer } from "@/components/shared/AosInitializer"; // <-- 1. IMPÓRTA EL COMPONENTE

export const metadata: Metadata = {
  title: "VehicleStore",
  description: "Venta de autos, motos, camiones y maquinaria pesada",
  keywords: [
    "autos",
    "motos",
    "camiones",
    "maquinaria pesada",
    "venta de vehículos",
    "VehicleStore",
  ],
  openGraph: {
    title: "VehicleStore",
    description:
      "Encuentra los mejores autos, motos, camiones y maquinaria pesada en venta",
    url: "https://vehiclestore.com", // Reemplaza con tu URL real
    images: [
      {
        url: "https://res.cloudinary.com/dcdawwvx2/image/upload/v1748639235/car-svgrepo-com_xysrtp.svg",
        width: 1200,
        height: 630,
        alt: "VehicleStore - Venta de vehículos",
      },
    ],
  },
  // --- SECCIÓN RESTAURADA: TUS ICONOS ---
  icons: {
    icon: [
      { url: "/logo/favicon.svg", type: "image/svg+xml" },
      { url: "/logo/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/logo/apple-touch-icon.png",
    shortcut: "/logo/favicon.ico",
  },
};

// --- MEJORA MANTENIDA: themeColor dinámico ---
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "hsl(240 100% 47%)" }, // Tu --primary en modo claro
    { media: "(prefers-color-scheme: dark)", color: "hsl(250 100% 60%)" },  // Tu --primary en modo oscuro
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans font-heading antialiased min-h-screen bg-background text-foreground transition-colors duration-300 pt-20">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>
            {/* --- MEJORA MANTENIDA: Inicializador de AOS --- */}
            <AosInitializer /> 
            {children}
            <Toaster
              richColors
              theme="system"
              toastOptions={{
                classNames: {
                  toast: "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                  title: "font-heading font-semibold",
                  description: "group-[.toast]:text-muted-foreground",
                  actionButton:
                    "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                  cancelButton:
                    "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
              }}
            />
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}