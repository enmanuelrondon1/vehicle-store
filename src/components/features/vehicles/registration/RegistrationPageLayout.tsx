// src/components/features/vehicles/registration/RegistrationPageLayout.tsx
import { ReactNode } from "react";
import { Car, Zap, Star, CheckCircle2, Shield } from "lucide-react";

interface RegistrationPageLayoutProps {
  children: ReactNode;
}

export function RegistrationPageLayout({ children }: RegistrationPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* PREMIUM HEADER */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl transform -skew-y-1"></div>
          <div className="relative text-center py-8 px-6 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg mb-6">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">
              <span className="text-foreground">Publica tu </span>
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-sm">
                Vehículo
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Conecta con miles de compradores potenciales a través de nuestra plataforma premium
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="animate-slide-up">{children}</div>

        {/* ENHANCED SECURITY BADGE */}
        <div className="mt-12 text-center animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 rounded-full border border-border/50 bg-card shadow-md text-muted-foreground transition-all hover:shadow-lg hover:-translate-y-0.5 card-hover">
            <div className="w-2 h-2 bg-success rounded-full mr-3 animate-pulse"></div>
            <Shield className="w-4 h-4 mr-2 text-success" />
            <p className="text-sm font-medium">Tus datos están encriptados y protegidos</p>
          </div>
        </div>

        {/* PREMIUM FEATURES SECTION */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <div className="card-glass p-6 card-hover text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Publicación Rápida</h3>
            <p className="text-sm text-muted-foreground">Tu vehículo estará visible en menos de 24 horas tras la verificación</p>
          </div>

          <div className="card-glass p-6 card-hover text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Alcance Premium</h3>
            <p className="text-sm text-muted-foreground">Tu anuncio será destacado y visto por miles de compradores potenciales</p>
          </div>

          <div className="card-glass p-6 card-hover text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-4">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Resultados Garantizados</h3>
            <p className="text-sm text-muted-foreground">El 90% de nuestros usuarios venden su vehículo en menos de 30 días</p>
          </div>
        </div>
      </div>
    </div>
  );
}