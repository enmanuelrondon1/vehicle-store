// src/components/features/vehicles/detail/sections/SimilarVehicles.tsx
// ✅ OPTIMIZADO: eliminados motion.div whileHover y whileHover/whileTap en icono.
//    Las tarjetas usaban whileHover={{ y:-5 }} — eso registra un listener JS
//    por cada tarjeta visible. Reemplazado por CSS hover:-translate-y-1.

"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, DollarSign, Gauge, Car } from "lucide-react";
import type { VehicleDataFrontend } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ CSS hover en lugar de whileHover={{ y: -5 }}
const VehicleCard: React.FC<{
  vehicle: VehicleDataFrontend;
  index: number;
}> = ({ vehicle, index }) => (
  <div
    className="animate-fade-in hover:-translate-y-1 transition-transform duration-200"
    style={{ animationDelay: `${Math.min(index * 80, 300)}ms`, animationFillMode: "both" }}
  >
    <Link href={`/vehicle/${vehicle._id}`} className="block group">
      <div className="overflow-hidden rounded-xl card-premium card-hover h-full flex flex-col bg-card/50 backdrop-blur-sm border border-border">
        <div className="relative w-full aspect-video">
          <Image
            src={vehicle.images[0] || "/placeholder.svg"}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 flex-grow flex-col">
          <h3 className="text-lg font-bold truncate text-foreground">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-sm text-muted-foreground">{vehicle.year}</p>
          <div className="mt-4 flex-grow space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-success" />
              <span className="text-foreground font-semibold">{vehicle.price.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-primary" />
              <span className="text-foreground">{vehicle.mileage.toLocaleString()} km</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-end">
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline group-hover:text-primary/80 transition-colors">
              Ver más
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-xl card-premium h-full flex flex-col p-4">
    <div className="relative w-full aspect-video">
      <Skeleton className="w-full h-full rounded-t-lg" />
    </div>
    <div className="p-4 flex-grow flex-col space-y-3">
      <Skeleton className="h-5 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </div>
    </div>
  </div>
);

const SimilarVehiclesComponent: React.FC<{
  vehicles: VehicleDataFrontend[];
  isLoading: boolean;
}> = ({ vehicles, isLoading }) => {
  if (!isLoading && vehicles.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-12 py-8 bg-gradient-to-b from-background to-background/95 rounded-xl"
    >
      <Card className="card-premium shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            {/* ✅ whileHover/whileTap → CSS hover:scale hover:rotate */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center glow-effect hover:scale-110 hover:rotate-6 active:scale-95 transition-all duration-200"
              style={{ background: "var(--gradient-accent)" }}
            >
              <Car className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Vehículos Similares</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Basado en tu búsqueda y preferencias</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : vehicles.map((vehicle, index) => (
                  <VehicleCard key={vehicle._id} vehicle={vehicle} index={index} />
                ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const SimilarVehicles = React.memo(SimilarVehiclesComponent);