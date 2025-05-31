// src/components/sections/Catalog/VehicleCard.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Vehicle {
  id: string;
  category: { es: string; en: string };
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: { es: string; en: string };
  engine: { es: string; en: string };
  transmission: { es: string; en: string };
  fuelType: { es: string; en: string };
  condition: { es: string; en: string };
  description: { es: string; en: string };
  images: string[];
  location: string;
  disponibilidad: { es: string; en: string };
  rating?: number;
  loadCapacity?: number;
  isFavorite?: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onToggleFavorite: (id: string) => void;
  onVehicleClick: (id: string) => void;
  isFavorite: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onToggleFavorite, onVehicleClick, isFavorite }) => {
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onVehicleClick(vehicle.id)} // Navegación al hacer clic en cualquier parte de la tarjeta
    >
      <CardContent className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="sm"
              variant={isFavorite ? "default" : "secondary"}
              className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation(); // Evita que el clic en el botón de favoritos dispare la navegación
                onToggleFavorite(vehicle.id);
              }}
            >
              <svg
                className={`h-4 w-4 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </Button>
            <Badge className="bg-white/95 text-black text-xs">{vehicle.disponibilidad.es}</Badge>
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-3 w-3 ${i < (vehicle.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.417 8.285L12 18.877l-7.416 3.899 1.417-8.285-6.001-5.822 8.332-1.151z" />
                </svg>
              ))}
              <span className="ml-1">{vehicle.rating || 0}/5</span>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg leading-tight hover:text-blue-600 transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>
            <Badge variant="outline" className="text-xs ml-2">
              {vehicle.year}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {vehicle.location}
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
              {vehicle.mileage.toLocaleString()} km
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM3 9h14V7H3v2zm16-4v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2zm-2 0H5v12h12V5z" />
              </svg>
              {vehicle.fuelType.es}
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.5 3h-17C3.224 3 3 3.224 3 3.5v17c0 .276.224.5.5.5h17c.276 0 .5-.224.5-.5v-17c0-.276-.224-.5-.5-.5zM4 19V5h16v14H4z" />
              </svg>
              {vehicle.transmission.es}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                ${vehicle.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{vehicle.condition.es}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()} // Evita que el clic en el botón de teléfono dispare la navegación
              >
                <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // Evita que el clic en "Ver más" dispare otro evento de navegación
                  onVehicleClick(vehicle.id);
                }}
              >
                Ver más
              </Button>
            </div>
          </div>
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;