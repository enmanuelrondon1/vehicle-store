// src/components/features/home/FeaturedVehicles.tsx - CON ALEATORIOS
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import VehicleCard from "@/components/features/vehicles/common/VehicleCard";
import { Vehicle } from "@/types/types";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

const FeaturedVehicles = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [compareList, setCompareList] = useState<Set<string>>(new Set());

  // 🎲 Fetch vehículos ALEATORIOS
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // ⭐ CAMBIO: Añade ?random=true para obtener aleatorios
        const response = await fetch("/api/vehicles?limit=6&random=true");
        const data = await response.json();
        console.log("🚗 Vehículos recibidos:", data);
        if (data.vehicles) {
          setVehicles(data.vehicles);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Handlers
  const handleFavoriteToggle = useCallback((vehicleId: string, isNowFavorited: boolean) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (isNowFavorited) {
        newSet.add(vehicleId);
      } else {
        newSet.delete(vehicleId);
      }
      return newSet;
    });
  }, []);

  const handleToggleCompare = useCallback((vehicleId: string) => {
    setCompareList(prev => {
      const newSet = new Set(prev);
      if (newSet.has(vehicleId)) {
        newSet.delete(vehicleId);
      } else {
        if (newSet.size >= 3) {
          alert("Solo puedes comparar hasta 3 vehículos");
          return prev;
        }
        newSet.add(vehicleId);
      }
      return newSet;
    });
  }, []);

  if (loading) {
    return (
      <div className="container-wide">
        <div className="h-8 bg-muted rounded w-64 mx-auto mb-12 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-96 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) return null;

  return (
    <div className="container-wide">
      {/* 📝 TÍTULO PREMIUM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 card-glass">
          <Sparkles className="w-4 h-4 animate-pulse" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            Selección Aleatoria
          </span>
        </div>
        
        <h2 
          className="text-4xl sm:text-5xl font-heading font-extrabold mb-4"
          style={{ 
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Vehículos Destacados
        </h2>
        
        <p 
          className="text-lg max-w-2xl mx-auto"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Descubre diferentes vehículos en cada visita 🎲
        </p>
      </motion.div>

      {/* 🚗 GRID DE VEHÍCULOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {vehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <VehicleCard
              vehicle={vehicle}
              onToggleCompare={handleToggleCompare}
              isInCompareList={compareList.has(vehicle._id)}
              isFavorited={favorites.has(vehicle._id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </motion.div>
        ))}
      </div>

      {/* 🔗 CTA VER MÁS */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <Button
          onClick={() => router.push(siteConfig.paths.vehicleList)}
          size="lg"
          className="btn-accent text-lg py-6 px-10 font-bold group"
        >
          Ver Todos los Vehículos
          <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </div>
  );
};

export default FeaturedVehicles;