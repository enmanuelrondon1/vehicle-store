// src/components/features/vehicles/detail/sections/StarRating.tsx
"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  ratingCount?: number;
  onRating?: (rating: number) => void;
  isInteractive?: boolean;
  showRatingValue?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  ratingCount,
  onRating,
  isInteractive = false,
  showRatingValue = true,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = (rate: number, e: React.MouseEvent) => {
    // ✅ AGREGAR: Detener propagación del evento
    e.preventDefault();
    e.stopPropagation();
    
    if (onRating) {
      onRating(rate);
    }
  };

  const handleMouseEnter = (rate: number) => {
    if (isInteractive) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    // ✅ AGREGAR: Detener propagación en el contenedor también
    <div 
      className="flex items-center gap-2"
      onClick={(e) => {
        if (isInteractive) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div className="flex">
        {stars.map((star) => (
          <Star
            key={star}
            className={cn(
              "h-5 w-5",
              (hoverRating || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300",
              isInteractive && "cursor-pointer"
            )}
            onClick={(e) => handleRating(star, e)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
      {showRatingValue && (
        <p className="text-sm text-gray-600">
          {rating.toFixed(1)}
          {ratingCount !== undefined && ` (${ratingCount})`}
        </p>
      )}
    </div>
  );
};