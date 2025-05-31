"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguajeContext";
import vehicles from "@/data/vehicles.json";
import { useFavorites } from "@/context/FavoritesContext";
import RelatedVehicles from "@/components/sections/RelatedVehicles/RelatedVehicles";
import { Heart } from "lucide-react";
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
  condition: { es: string; en: string };
  location: string;
  features: { es: string[]; en: string[] };
  fuelType: { es: string; en: string };
  doors: number;
  seats: number;
  dimensions: {
    largo: number;
    ancho: number;
    alto: number;
  };
  weight: number;
  loadCapacity?: number;
  images: string[];
  sellerContact: {
    name: string;
    phone: string;
    email: string;
  };
  postedDate: string;
  disponibilidad: { es: string; en: string };
  warranty: { es: string; en: string };
  description: { es: string; en: string };
}

interface VehicleDetailProps {
  onBack?: () => void;
}

const VehicleDetail: React.FC<VehicleDetailProps> = ({ onBack }) => {
  const { id } = useParams();
  const router = useRouter();
  const { language, translations } = useLanguage();
  const { favorites, setFavorites } = useFavorites();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const vehicleId = Array.isArray(id) ? id[0] : id;

  const vehicle = useMemo(() => {
    if (!vehicleId) return null;
    return (vehicles as { items: Vehicle[] }).items.find((v) => v.id === vehicleId);
  }, [vehicleId]);

  // Mover toggleFavorite al inicio para evitar el uso condicional
  const toggleFavorite = useCallback(() => {
    if (!vehicle) return; // Evitar errores si vehicle no está definido
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(vehicle.id)) {
        newFavorites.delete(vehicle.id);
      } else {
        newFavorites.add(vehicle.id);
      }
      return newFavorites;
    });
  }, [vehicle, setFavorites]);

  const isFavorite = vehicle ? favorites.has(vehicle.id) : false;

  if (!vehicle) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {language === "es" ? "Vehículo no encontrado" : "Vehicle not found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === "es"
              ? "El vehículo que buscas no existe o ha sido eliminado."
              : "The vehicle you are looking for does not exist or has been removed."}
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              {language === "es" ? "Volver al catálogo" : "Back to catalog"}
            </button>
          )}
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === "es" ? "es-MX" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getAvailabilityColor = (availability: string) => {
    const availabilityLower = availability.toLowerCase();
    if (availabilityLower.includes("disponible") || availabilityLower.includes("available")) {
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    } else if (availabilityLower.includes("reservado") || availabilityLower.includes("reserved")) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    } else if (availabilityLower.includes("vendido") || availabilityLower.includes("sold")) {
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === "es" ? "Volver" : "Back"}
          </button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {vehicle.brand} {vehicle.model} {vehicle.year}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{vehicle.category[language]}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <Image
              src={vehicle.images[selectedImageIndex] || "/placeholder-vehicle.jpg"}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-vehicle.jpg";
              }}
            />
          </div>

          {vehicle.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-blue-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${vehicle.brand} ${vehicle.model} ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-vehicle.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatPrice(vehicle.price)}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(vehicle.disponibilidad[language])}`}>
              {vehicle.disponibilidad[language]}
            </span>
            <button
              onClick={toggleFavorite}
              className="ml-4 p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              aria-label={language === "es" ? "Agregar a favoritos" : "Add to favorites"}
            >
              <Heart
                className={`w-6 h-6 ${isFavorite ? "fill-red-500 stroke-red-500" : "stroke-current"}`}
              />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
              {language === "es" ? "Descripción" : "Description"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{vehicle.description[language]}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === "es" ? "Kilometraje" : "Mileage"}
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {vehicle.mileage.toLocaleString()} km
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {translations.condition}
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {vehicle.condition[language]}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {translations.fuelType}
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {vehicle.fuelType[language]}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {translations.transmission}
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {vehicle.transmission[language]}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowContact(!showContact)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-semibold"
          >
            {language === "es"
              ? showContact
                ? "Ocultar contacto"
                : "Mostrar contacto del vendedor"
              : showContact
              ? "Hide contact"
              : "Show seller contact"}
          </button>

          {showContact && (
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                {language === "es" ? "Información del vendedor" : "Seller information"}
              </h4>
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>{language === "es" ? "Nombre:" : "Name:"}</strong> {vehicle.sellerContact.name}
                </p>
                <p>
                  <strong>{language === "es" ? "Teléfono:" : "Phone:"}</strong> {vehicle.sellerContact.phone}
                </p>
                <p>
                  <strong>Email:</strong> {vehicle.sellerContact.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          {language === "es" ? "Especificaciones completas" : "Complete specifications"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              {language === "es" ? "Información básica" : "Basic information"}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Marca:" : "Brand:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Modelo:" : "Model:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Año:" : "Year:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Color:" : "Color:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.color[language]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Ubicación:" : "Location:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.location}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              {language === "es" ? "Especificaciones técnicas" : "Technical specifications"}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Motor:" : "Engine:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.engine[language]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Puertas:" : "Doors:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.doors || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Asientos:" : "Seats:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.seats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Peso:" : "Weight:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.weight.toLocaleString()} kg</span>
              </div>
              {vehicle.loadCapacity && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Cap. carga:" : "Load capacity:"}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.loadCapacity.toLocaleString()} kg</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              {language === "es" ? "Dimensiones y garantía" : "Dimensions and warranty"}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Largo:" : "Length:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.dimensions.largo} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Ancho:" : "Width:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.dimensions.ancho} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Alto:" : "Height:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.dimensions.alto} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Garantía:" : "Warranty:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.warranty[language]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{language === "es" ? "Publicado:" : "Posted:"}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{formatDate(vehicle.postedDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {vehicle.features[language].length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              {language === "es" ? "Características" : "Features"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {vehicle.features[language].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <RelatedVehicles
              currentVehicle={vehicle}
              allVehicles={(vehicles as { items: Vehicle[] }).items}
              onVehicleClick={(vehicleId) => {
                router.push(`/vehicle/${vehicleId}`);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetail;