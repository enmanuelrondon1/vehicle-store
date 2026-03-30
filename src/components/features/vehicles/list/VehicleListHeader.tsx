// src/components/features/vehicles/list/VehicleListHeader.tsx
// ✅ OPTIMIZADO: eliminados todos los repeat:Infinity de framer-motion.
//    Tenía 5 motion.div con animate repeat:Infinity corriendo simultáneamente:
//    - 2 círculos decorativos (scale+opacity loop)
//    - 1 ícono Search (scale+opacity loop)
//    - 1 contador vehicleCount (spring — este se mantiene, ocurre UNA vez)
//    - 3 puntos pulsantes (scale loop con delay)
//    - 1 ícono Car (rotate loop)
//    Reemplazados por CSS animate-pulse, animate-ping y CSS keyframes.

"use client";
import { motion } from "framer-motion";
import { Search, Car, Sparkles, Shield, TrendingUp } from "lucide-react";

interface VehicleListHeaderProps {
  vehicleCount: number;
}

const VehicleListHeader: React.FC<VehicleListHeaderProps> = ({ vehicleCount }) => {
  return (
    <div className="relative text-center overflow-hidden">
      <div className="absolute inset-0 opacity-50 -z-10" style={{ background: "var(--gradient-hero)" }} />

      {/* ✅ Círculos decorativos → animate-pulse CSS */}
      <div
        className="absolute top-10 right-10 w-20 h-20 rounded-full opacity-20 animate-pulse"
        style={{ backgroundColor: "var(--accent)" }}
      />
      <div
        className="absolute bottom-10 left-10 w-16 h-16 rounded-full opacity-20 animate-pulse"
        style={{ backgroundColor: "var(--primary)", animationDelay: "1s" }}
      />

      {/* Contenedor principal */}
      <div className="card-glass p-8 md:p-12 rounded-2xl relative overflow-hidden shadow-hard animate-fade-in">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: "var(--accent-20)" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: "var(--primary-20)" }} />

        {/* ✅ Línea superior → CSS transition en lugar de motion scaleX */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: "var(--gradient-accent)" }}
        />

        <div className="relative z-10">
          {/* Título */}
          <h1
            className="responsive-heading font-heading font-bold text-center mb-6 animate-fade-in"
            style={{ animationDelay: "100ms", animationFillMode: "both" }}
          >
            <span className="block text-gradient-primary mb-2">Encuentra tu</span>
            <span className="block text-gradient">Vehículo Perfecto</span>
          </h1>

          {/* Subtítulo dinámico */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            <div className="relative flex items-center gap-2">
              <Search className="w-6 h-6" />
              {/* ✅ animate-ping CSS en lugar de motion scale+opacity repeat:Infinity */}
              <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: "var(--accent-10)" }} />
            </div>

            <span>Explorando</span>

            {/* ✅ Contador — motion.div con spring ocurre UNA vez, es seguro mantenerlo */}
            <motion.span
              key={vehicleCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="font-bold text-foreground px-3 py-1 rounded-lg card-glass border border-primary/20"
            >
              {vehicleCount}
            </motion.span>

            <span>vehículos</span>

            {/* ✅ Ícono Car → CSS hover rotate en lugar de motion rotate repeat:Infinity */}
            <Car
              className="w-6 h-6 transition-transform duration-300 hover:rotate-12"
              style={{ color: "var(--accent)" }}
            />
          </div>

          {/* ✅ 3 puntos pulsantes → animate-bounce CSS con delay */}
          <div
            className="flex justify-center mt-6 gap-2 animate-fade-in"
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  backgroundColor: "var(--accent)",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "var(--gradient-primary)" }} />
      </div>

      {/* Badges */}
      <div
        className="mt-6 flex flex-wrap justify-center gap-3 animate-fade-in"
        style={{ animationDelay: "400ms", animationFillMode: "both" }}
      >
        <div className="badge-premium flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Plataforma verificada</span>
        </div>
        <div className="badge-accent flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>Mejores precios</span>
        </div>
      </div>

      <div
        className="mt-4 flex justify-center animate-fade-in"
        style={{ animationDelay: "500ms", animationFillMode: "both" }}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <span>Actualizado en tiempo real</span>
        </div>
      </div>
    </div>
  );
};

export default VehicleListHeader;