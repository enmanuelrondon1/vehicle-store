// src/components/features/home/HeroSectionV2.tsx - HERO CON BÚSQUEDA
"use client";
import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import { Car, Search, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedBackground } from "./hero/AnimatedBackground";
import { useRouter } from "next/navigation";

interface HeroSectionV2Props {
  onSellClick: () => void;
  onBrowseVehicles: () => void;
}

const HeroSectionV2: React.FC<HeroSectionV2Props> = ({ onSellClick, onBrowseVehicles }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/vehicleList?search=${encodeURIComponent(searchQuery)}`);
    } else {
      onBrowseVehicles();
    }
  };

  return (
    <section className="relative w-full min-h-[90vh] flex items-center" style={{ background: 'var(--gradient-hero)' }}>
      <AnimatedBackground />
      
      <div className="relative z-10 container-wide py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* 🏆 BADGE PREMIUM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold border backdrop-blur-sm card-glass group cursor-default">
              <motion.div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: 'var(--success)' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Shield className="w-4 h-4 mr-2" style={{ color: 'var(--accent)' }} />
              <span className="text-gradient">El marketplace más seguro de Latinoamérica</span>
              <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* 📝 TÍTULO PRINCIPAL */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-heading font-extrabold leading-tight mb-6"
          >
            <span style={{ color: 'var(--foreground)' }}>Compra y Vende</span>
            <br />
            <motion.span 
              className="block"
              style={{ 
                background: 'var(--gradient-accent)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px var(--accent-20)'
              }}
            >
              Vehículos de Confianza
            </motion.span>
          </motion.h1>

          {/* 💬 SUBTÍTULO */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Verificación 100% digital</span>
            {" "}• Sin comisiones ocultas • Soporte 24/7
          </motion.p>

          {/* 🔍 BARRA DE BÚSQUEDA PREMIUM */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto card-glass p-2 rounded-2xl shadow-hard">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Busca por marca, modelo o año..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-premium pl-12 h-14 text-lg border-0 focus:ring-2"
                  style={{ backgroundColor: 'var(--background)' }}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="btn-accent h-14 px-8 text-lg font-bold group"
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.form>

          {/* 🎯 CTAs PRINCIPALES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={onSellClick}
              size="lg"
              className="btn-primary text-lg py-7 px-10 font-bold group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)'
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />
              <Car className="w-6 h-6 mr-3" />
              Vender mi Vehículo
            </Button>

            <Button
              onClick={onBrowseVehicles}
              variant="outline"
              size="lg"
              className="text-lg py-7 px-10 font-bold border-2 group"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            >
              Ver Catálogo Completo
              <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* 📊 TRUST INDICATORS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 flex flex-wrap justify-center gap-8 text-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
              <span>50K+ Vehículos vendidos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
              <span>25K+ Usuarios activos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
              <span>4.8★ Valoración</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default memo(HeroSectionV2);