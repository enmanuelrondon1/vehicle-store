// src/components/features/vehicles/compare/CompareMobileView.tsx
"use client";

import { Vehicle } from "@/types/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { featuresConfig, formatPrice } from "./compare-config";
import { Separator } from "@/components/ui/separator";

interface CompareMobileViewProps {
  vehicles: (Vehicle & { averageRating?: number; ratingCount?: number })[];
  highlightDifferences: boolean;
  favoritedVehicles: Set<string>;
  isLoadingFavorite: Map<string, boolean>;
  onFavoriteToggle: (e: React.MouseEvent, vehicleId: string) => void;
  userRatings: Map<string, number | null>;
  hoverRatings: Map<string, number | null>;
  vehicleRatings: Map<string, { average: number; count: number }>;
  isSubmittingRating: Map<string, boolean>;
  onSetRating: (vehicleId: string, rating: number) => void;
  onHoverRating: (vehicleId: string, rating: number | null) => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CompareMobileView: React.FC<CompareMobileViewProps> = ({
  vehicles,
  highlightDifferences,
  favoritedVehicles,
  isLoadingFavorite,
  onFavoriteToggle,
  userRatings,
  hoverRatings,
  vehicleRatings,
  isSubmittingRating,
  onSetRating,
  onHoverRating,
}) => {
  if (vehicles.length === 0) return null;

  const vehicle1 = vehicles[0];
  const vehicle2 = vehicles.length > 1 ? vehicles[1] : null;

  const currentFeatures = featuresConfig(
    userRatings,
    hoverRatings,
    vehicleRatings,
    onHoverRating,
    onSetRating
  ).filter(f => f.label !== "Acciones");

  const getBestValue = (featureLabel: string, v1: Vehicle, v2: Vehicle | null) => {
    if (!v2) return null;
    
    switch (featureLabel) {
      case "Precio":
        return v1.price < v2.price ? 0 : (v2.price < v1.price ? 1 : null);
      case "Kilometraje":
        return v1.mileage < v2.mileage ? 0 : (v2.mileage < v1.mileage ? 1 : null);
      case "Año":
        return v1.year > v2.year ? 0 : (v2.year > v1.year ? 1 : null);
      case "Valoración":
        const rating1 = vehicleRatings.get(v1._id)?.average ?? 0;
        const rating2 = vehicleRatings.get(v2._id)?.average ?? 0;
        return rating1 > rating2 ? 0 : (rating2 > rating1 ? 1 : null);
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="w-full space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      {/* Vehicle Headers */}
      <div className="grid grid-cols-2 gap-4">
        {[vehicle1, vehicle2].map((vehicle, index) =>
          vehicle ? (
            <motion.div key={vehicle._id} variants={itemVariants}>
              <Card className="overflow-hidden h-full flex flex-col">
                <CardContent className="p-3 flex flex-col flex-grow">
                  <div className="relative w-full aspect-video mb-3 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={vehicle.images[0] || "/placeholder.svg"}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-end flex-grow space-y-1">
                    <h3 className="font-bold text-base font-heading text-gradient-primary leading-tight">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-xs text-muted-foreground">{vehicle.year}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-primary text-base">
                        {formatPrice(vehicle.price)}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={(e) => onFavoriteToggle(e, vehicle._id)}
                        disabled={isLoadingFavorite.get(vehicle._id)}
                      >
                        <Heart
                          className={cn(
                            "h-5 w-5 transition-colors",
                            favoritedVehicles.has(vehicle._id)
                              ? "text-red-500 fill-red-500"
                              : "text-muted-foreground"
                          )}
                        />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div key={`placeholder-${index}`} />
          )
        )}
      </div>

      <Separator />

      {/* Features Comparison */}
      <motion.div variants={itemVariants} className="space-y-3">
        {currentFeatures.map((feature) => {
          const bestIndex = vehicle2 ? getBestValue(feature.label, vehicle1, vehicle2) : null;
          const value1 = feature.value(vehicle1, 0, bestIndex === 0);
          const value2 = vehicle2 ? feature.value(vehicle2, 1, bestIndex === 1) : <span className="text-muted-foreground/50">--</span>;
          
          const isDifferent = highlightDifferences && vehicle2 && JSON.stringify(value1) !== JSON.stringify(value2);

          if (highlightDifferences && !isDifferent) {
            return null;
          }

          return (
            <div
              key={feature.label}
              className={cn(
                "p-3 rounded-lg",
                isDifferent ? "bg-primary/5" : "bg-muted/20"
              )}
            >
              <div className="flex items-center justify-center mb-3 text-center">
                {feature.icon && <div className="mr-2">{feature.icon}</div>}
                <h4 className="text-sm font-semibold">{feature.label}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="flex flex-col items-center justify-center text-center">{value1}</div>
                <div className="flex flex-col items-center justify-center text-center">{value2}</div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default CompareMobileView;