// src/components/sections/VehicleList/VehicleCard.tsx
"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Share2,
  Copy, // Reemplazo de Compare
  Car,
  Fuel,
  Calendar,
  MapPin,
  Settings2,
  Eye,
  Star,
} from "lucide-react";
import { Vehicle, VehicleCondition, WarrantyType } from "@/types/types";
import {  ApprovalStatus } from "@/types/types";
import {
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
} from "@/types/shared";

const STATUS_MAP = {
  [ApprovalStatus.PENDING]: "Pendiente",
  [ApprovalStatus.APPROVED]: "Aprobado",
  [ApprovalStatus.REJECTED]: "Rechazado",
} as const;

const WARRANTY_MAP = {
  [WarrantyType.NO_WARRANTY]: "Sin garantía",
  [WarrantyType.DEALER_WARRANTY]: "Garantía del concesionario",
  [WarrantyType.MANUFACTURER_WARRANTY]: "Garantía del fabricante",
  [WarrantyType.EXTENDED_WARRANTY]: "Garantía extendida",
} as const;

const VehicleCard = ({
  vehicle,
  isDarkMode,
  viewMode,
  onToggleCompare,
  isInCompareList,
}: {
  vehicle: Vehicle;
  isDarkMode: boolean;
  viewMode: "grid" | "list";
  onToggleCompare: (vehicleId: string) => void;
  isInCompareList: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat("es-ES").format(mileage);

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.model}`,
        text: `Mira este ${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        url: `/vehicle/${vehicle._id}`,
      });
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare(vehicle._id);
  };

  const translatedCondition = translateValue(vehicle.condition, VEHICLE_CONDITIONS_LABELS);
  const translatedFuelType = translateValue(vehicle.fuelType, FUEL_TYPES_LABELS);
  const translatedTransmission = translateValue(vehicle.transmission, TRANSMISSION_TYPES_LABELS);
  const translatedStatus = translateValue(vehicle.status, STATUS_MAP);

  if (viewMode === "list") {
    return (
      <div
        className={`${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
            : "bg-white/50 border-gray-200 hover:bg-white"
        } transition-all duration-300 hover:shadow-xl backdrop-blur-sm group cursor-pointer rounded-lg border relative`}
        onClick={() => window.open(`/vehicle/${vehicle._id}`, "_self")}
      >
        {vehicle.isFeatured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
            <Star className="w-3 h-3 inline mr-1" />
            Destacado
          </div>
        )}
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-80 h-48 md:h-40 overflow-hidden rounded-l-lg">
            {isImageLoading && (
              <div
                className={`absolute inset-0 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } animate-pulse flex items-center justify-center`}
              >
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <Image
              src={
                imageError || !vehicle.images[0]
                  ? "/placeholder.svg?height=200&width=300"
                  : vehicle.images[0]
              }
              alt={`${vehicle.brand} ${vehicle.model}`}
              width={320}
              height={200}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              priority={false}
            />
            {vehicle.condition === VehicleCondition.NEW && (
              <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Nuevo
              </span>
            )}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                onClick={handleCompare}
                className={`w-8 h-8 p-0 rounded-full ${
                  isInCompareList
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "bg-gray-900/70 hover:bg-gray-800 text-gray-300"
                    : "bg-white/70 hover:bg-white text-gray-600"
                } backdrop-blur-sm transition-colors`}
                title="Comparar"
              >
                <Copy className="w-4 h-4" /> {/* Reemplazo de Compare */}
              </button>
              <button
                onClick={handleFavorite}
                className={`w-8 h-8 p-0 rounded-full ${
                  isDarkMode
                    ? "bg-gray-900/70 hover:bg-gray-800"
                    : "bg-white/70 hover:bg-white"
                } backdrop-blur-sm`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorited
                      ? "fill-red-500 text-red-500"
                      : isDarkMode
                      ? "text-gray-300"
                      : "text-gray-600"
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className={`w-8 h-8 p-0 rounded-full ${
                  isDarkMode
                    ? "bg-gray-900/70 hover:bg-gray-800"
                    : "bg-white/70 hover:bg-white"
                } backdrop-blur-sm`}
              >
                <Share2
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  } group-hover:text-blue-500 transition-colors`}
                >
                  {`${vehicle.brand} ${vehicle.model}`}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{vehicle.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    <span>{formatMileage(vehicle.mileage)} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{vehicle.location}</span>
                  </div>
                  {vehicle.views && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{vehicle.views} vistas</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(vehicle.price)}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col">
                <span
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } text-xs`}
                >
                  Condición
                </span>
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {translatedCondition}
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } text-xs`}
                >
                  Transmisión
                </span>
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {translatedTransmission}
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } text-xs`}
                >
                  Combustible
                </span>
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {translatedFuelType}
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } text-xs`}
                >
                  Estado
                </span>
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {translatedStatus}
                </span>
              </div>
            </div>
            {vehicle.features.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.slice(0, 3).map((feature: string) => (
                    <span
                      key={feature}
                      className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {vehicle.features.length > 3 && (
                    <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                      +{vehicle.features.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
            {vehicle.warranty && WARRANTY_MAP[vehicle.warranty] && (
              <div className="mt-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {WARRANTY_MAP[vehicle.warranty]}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
          : "bg-white/50 border-gray-200 hover:bg-white"
      } transition-all duration-300 hover:shadow-xl hover:-translate-y-2 backdrop-blur-sm group cursor-pointer overflow-hidden rounded-lg border relative`}
      onClick={() => window.open(`/vehicle/${vehicle._id}`, "_self")}
    >
      {vehicle.isFeatured && (
        <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          <Star className="w-3 h-3 inline mr-1" />
          Destacado
        </div>
      )}
      <div className="relative w-full h-56 overflow-hidden">
        {isImageLoading && (
          <div
            className={`absolute inset-0 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            } animate-pulse flex items-center justify-center`}
          >
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={
            imageError || !vehicle.images[0]
              ? "/placeholder.svg?height=200&width=300"
              : vehicle.images[0]
          }
          alt={`${vehicle.brand} ${vehicle.model}`}
          width={300}
          height={224}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {vehicle.condition === VehicleCondition.NEW && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">
            Nuevo
          </span>
        )}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleCompare}
            className={`w-9 h-9 p-0 rounded-full ${
              isInCompareList
                ? "bg-blue-600 text-white"
                : isDarkMode
                ? "bg-gray-900/70 hover:bg-gray-800 text-gray-300"
                : "bg-white/70 hover:bg-white text-gray-600"
            } backdrop-blur-sm shadow-lg transition-colors`}
            title="Comparar"
          >
            <Copy className="w-4 h-4" /> {/* Reemplazo de Compare */}
          </button>
          <button
            onClick={handleFavorite}
            className={`w-9 h-9 p-0 rounded-full ${
              isDarkMode
                ? "bg-gray-900/70 hover:bg-gray-800"
                : "bg-white/70 hover:bg-white"
            } backdrop-blur-sm shadow-lg`}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited
                  ? "fill-red-500 text-red-500"
                  : isDarkMode
                  ? "text-gray-300"
                  : "text-gray-600"
              }`}
            />
          </button>
          <button
            onClick={handleShare}
            className={`w-9 h-9 p-0 rounded-full ${
              isDarkMode
                ? "bg-gray-900/70 hover:bg-gray-800"
                : "bg-white/70 hover:bg-white"
            } backdrop-blur-sm shadow-lg`}
          >
            <Share2
              className={`w-4 h-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            />
          </button>
        </div>
      </div>
      <div className="p-6">
        <h3
          className={`text-xl font-bold mb-3 ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          } group-hover:text-blue-500 transition-colors line-clamp-1`}
        >
          {`${vehicle.brand} ${vehicle.model} (${vehicle.year})`}
        </h3>
        <p className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {formatPrice(vehicle.price)}
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <span
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Kilometraje:
              </span>
            </div>
            <span
              className={`font-semibold ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {formatMileage(vehicle.mileage)} km
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <span
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Transmisión:
              </span>
            </div>
            <span
              className={`font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {translatedTransmission}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fuel
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <span
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Combustible:
              </span>
            </div>
            <span
              className={`font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {translatedFuelType}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <span
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Ubicación:
              </span>
            </div>
            <span
              className={`font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {vehicle.location}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <span
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Estado:
              </span>
            </div>
            <span
              className={`font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {translatedStatus}
            </span>
          </div>
        </div>
        {vehicle.features.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {vehicle.features.slice(0, 3).map((feature: string) => (
                <span
                  key={feature}
                  className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
              {vehicle.features.length > 3 && (
                <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                  +{vehicle.features.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        {vehicle.warranty && WARRANTY_MAP[vehicle.warranty] && (
          <div className="mt-3">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {WARRANTY_MAP[vehicle.warranty]}
            </span>
          </div>
        )}
      </div>
      <div className="p-6 pt-0">
        <button
          className="w-full p-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`/vehicle/${vehicle._id}`, "_self");
          }}
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

const translateValue = (value: string, map: Record<string, string>): string => {
  return map[value] || value;
};

export default VehicleCard;