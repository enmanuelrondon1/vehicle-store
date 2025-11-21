// src/components/features/admin/VehicleEditForm/FormLayout.tsx

import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface FormLayoutProps {
  children: ReactNode;
  scrollProgress: number;
  header: ReactNode;
  footer: ReactNode;
}

export function FormLayout({ children, scrollProgress, header, footer }: FormLayoutProps) {
  return (
    <div className="container-wide py-12 animate-fade-in">
      {/* ========================================
          🎨 PREMIUM PROGRESS BAR
          ======================================== */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted/30 backdrop-blur-sm z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary via-accent to-success transition-all duration-300 ease-out shadow-glow"
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>

      {/* ========================================
          ✨ ANIMATED BACKGROUND EFFECTS
          ======================================== */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* ========================================
          📝 MAIN FORM CONTAINER
          ======================================== */}
      <div className="space-y-8">
        <div className="relative p-1 animate-scale-in">
          {/* Premium Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 rounded-2xl blur-2xl animate-pulse-glow opacity-60"></div>
          
          <Card className="card-premium relative overflow-hidden shadow-2xl">
            {/* Hero Gradient Overlay */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

            {header}
            
            <CardContent className="p-8 lg:p-12 space-y-16">
              {children}
            </CardContent>

            {footer}
          </Card>
        </div>
      </div>
    </div>
  );
}