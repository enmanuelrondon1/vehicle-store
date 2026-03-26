// src/components/shared/Navbar/Logo.tsx
import React from "react";
import { Car } from "lucide-react";

const Logo = () => {
  return (
    <a
      href="/"
      className="group relative flex items-center"
      aria-label="Ir a la página principal"
    >
      <div className="relative flex items-center gap-3 transition-transform duration-200 group-hover:scale-[1.02] active:scale-[0.98]">

        {/* Icono */}
        <div
          className="relative p-3 rounded-xl overflow-hidden glow-effect transition-transform duration-300 group-hover:-translate-y-0.5"
          style={{
            background: "var(--gradient-accent)",
            boxShadow: "0 8px 24px var(--accent-20)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl opacity-30"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 skew-x-12 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)",
            }}
          />
          <Car
            className="w-6 h-6 relative z-10 drop-shadow-lg"
            style={{ color: "var(--accent-foreground)" }}
            strokeWidth={2.5}
          />
        </div>

        {/* Texto */}
        <div className="flex items-baseline gap-0">
          <span
            className="font-heading font-black text-4xl"
            style={{
              background: "var(--gradient-accent)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            1
          </span>
          <span
            className="font-heading font-bold text-3xl tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Auto
          </span>
          <span
            className="font-heading font-medium text-3xl tracking-tight"
            style={{ color: "var(--muted-foreground)" }}
          >
            .market
          </span>
        </div>

        {/* Línea decorativa */}
        <div
          className="absolute -bottom-1 left-0 h-0.5 rounded-full w-0 group-hover:w-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{
            background: "linear-gradient(to right, transparent, var(--accent), transparent)",
          }}
        />
      </div>
    </a>
  );
};

export default Logo;