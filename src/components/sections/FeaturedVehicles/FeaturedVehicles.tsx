"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import vehicleData from "@/data/vehicles.json";
import { useLanguage } from "@/context/LanguajeContext";
import { useFavorites } from "@/context/FavoritesContext";
import Link from "next/link";
import Image from "next/image";

const FeaturedVehicles = () => {
  const { translations } = useLanguage();
  const { favorites, toggleFavorite } = useFavorites();

  const vehiclesByCategory = [
    vehicleData.items.find((item) => item.category?.es === "vehículos"),
    vehicleData.items.find((item) => item.category?.es === "motos"),
    vehicleData.items.find((item) => item.category?.es === "camiones"),
    vehicleData.items.find((item) => item.category?.es === "maquinaria pesada"),
  ].filter((item) => item !== undefined);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused || vehiclesByCategory.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === vehiclesByCategory.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [vehiclesByCategory.length, isPaused]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? vehiclesByCategory.length - 1 : prevIndex - 1
    );
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === vehiclesByCategory.length - 1 ? 0 : prevIndex + 1
    );
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const handleToggleFavorite = (vehicleId: string) => {
    toggleFavorite(vehicleId);
  };

  return (
    <section className="max-padd-container relative rounded-lg mt-8 bg-[#F9FAFB] dark:bg-[#111827] transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#111827] dark:text-[#F9FAFB]">
          {translations?.recentHighlights || "The most recent Highlights"}
        </h2>
        <Link
          href="/vehicles"
          className="text-[#1E3A8A] hover:underline dark:text-[#F97316] dark:hover:text-[#F97316]"
        >
          {translations?.seeAll || "See all"}
        </Link>
      </div>

      <div className="relative overflow-hidden">
        <div className="block md:hidden overflow-hidden">
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {vehiclesByCategory.map((vehicle) => (
              <Link
                key={vehicle!.id}
                href={`/vehicle/details/${vehicle!.id}`}
                className="min-w-full block"
              >
                <div className="bg-white dark:bg-[#1F2937] rounded-lg shadow-lg overflow-hidden border border-[#E5E7EB] dark:border-[#374151] hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <Image
                      src={vehicle!.images[0].trimEnd()}
                      alt={`${vehicle!.brand} ${vehicle!.model}`}
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleFavorite(vehicle!.id);
                      }}
                      className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-[#F97316] dark:hover:text-[#F97316]"
                      aria-label={
                        favorites.has(vehicle!.id)
                          ? translations?.removeFromFavorites || "Remove from favorites"
                          : translations?.addToFavorites || "Add to favorites"
                      }
                    >
                      <FaHeart
                        size={20}
                        color={favorites.has(vehicle!.id) ? "#F97316" : ""}
                      />
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">
                      {vehicle!.year} {vehicle!.brand} {vehicle!.model}
                    </h3>
                    <p className="text-[#F97316] font-bold mt-1 dark:text-[#F97316]">
                      ${vehicle!.price.toLocaleString("es-MX")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {vehicle!.mileage
                        ? `${vehicle!.mileage.toLocaleString()} mi`
                        : "0 km"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrev}
              className="p-2 bg-[#E5E7EB] dark:bg-[#374151] rounded-full hover:bg-[#D1D5DB] dark:hover:bg-[#4B5563] transition-colors"
              aria-label="Previous vehicle"
            >
              <FaArrowLeft className="text-[#111827] dark:text-[#F9FAFB]" />
            </button>
            <div className="flex justify-center flex-grow">
              {vehiclesByCategory.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === activeIndex
                      ? "bg-[#1E3A8A]"
                      : "bg-[#E5E7EB] dark:bg-[#1F2937] hover:bg-[#D1D5DB] dark:hover:bg-[#374151]"
                  }`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to vehicle ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-2 bg-[#E5E7EB] dark:bg-[#374151] rounded-full hover:bg-[#D1D5DB] dark:hover:bg-[#4B5563] transition-colors"
              aria-label="Next vehicle"
            >
              <FaArrowRight className="text-[#111827] dark:text-[#F9FAFB]" />
            </button>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehiclesByCategory.map((vehicle) => (
            <Link
              key={vehicle!.id}
              href={`/vehicle/${vehicle!.id}`}
              className="block"
            >
              <div className="bg-white dark:bg-[#1F2937] rounded-lg shadow-lg overflow-hidden border border-[#E5E7EB] dark:border-[#374151] hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={vehicle!.images[0].trimEnd()}
                    alt={`${vehicle!.brand} ${vehicle!.model}`}
                    width={400}
                    height={160}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleFavorite(vehicle!.id);
                    }}
                    className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-[#F97316] dark:hover:text-[#F97316]"
                    aria-label={
                      favorites.has(vehicle!.id)
                        ? translations?.removeFromFavorites || "Remove from favorites"
                        : translations?.addToFavorites || "Add to favorites"
                    }
                  >
                    <FaHeart
                      size={20}
                      color={favorites.has(vehicle!.id) ? "#F97316" : ""}
                    />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">
                    {vehicle!.year} {vehicle!.brand} {vehicle!.model}
                  </h3>
                  <p className="text-[#F97316] font-bold mt-1 dark:text-[#F97316]">
                    ${vehicle!.price.toLocaleString("es-MX")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {vehicle!.mileage
                      ? `${vehicle!.mileage.toLocaleString()} mi`
                      : "0 km"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;