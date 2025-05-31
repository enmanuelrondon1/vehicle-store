"use client";
import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaSearchLocation,
  FaCar,
  FaMotorcycle,
  FaTruck,
} from "react-icons/fa";
import { GlobeDemo } from "./GlobeDemo";

interface GlobeSectionProps {
  setIsMapOpen: (value: boolean) => void;
}

const GlobeSection = ({ setIsMapOpen }: GlobeSectionProps) => {
  const [isMapHover, setIsMapHover] = useState(false);

  return (
    <div className="w-full lg:w-2/5 h-[400px] relative flex items-center justify-center mb-8 lg:mb-0
                    pt-16 sm:pt-20 md:pt-16 lg:pt-0">
      {/* Texto posicionado SOBRE el globo - responsivo */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4 z-20 
                      sm:top-0 md:top-0 lg:top-0">
        <div
          className="text-center px-3 py-2 mx-auto max-w-xs
                     sm:px-4 sm:py-3 sm:max-w-sm
                     md:px-6 md:py-4 md:max-w-md"
          style={{
            background: "linear-gradient(90deg, rgba(249, 115, 22, 0.1), rgba(30, 58, 138, 0.1))",
            borderRadius: "8px",
            color: "#111827", // Color base para modo claro
          }}
        >
          <h2 className="text-sm font-semibold dark:text-[#F9FAFB]
                         sm:text-base 
                         md:text-lg">
            ¡Bienvenido a VehicleStore!
          </h2>
          <p className="text-xs dark:text-[#D1D5DB] mt-1
                        sm:text-sm 
                        md:text-sm">
            Encuentra el vehículo de tus sueños hoy mismo.
          </p>
        </div>
      </div>

     <div className="relative w-full max-w-[400px] h-full max-h-[400px] p-2 sm:p-4 mb-16 lg:mb-0">
        <GlobeDemo />

        {/* Íconos alrededor del globo */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3">
          <div className="bg-green-500 p-2 rounded-full shadow-lg">
            <FaSearchLocation className="text-white text-xl" />
          </div>
        </div>
        <div className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2">
          <div className="bg-purple-500 p-2 rounded-full shadow-lg">
            <FaCar className="text-white text-xl" />
          </div>
        </div>
        <div className="absolute top-1/2 left-0 transform -translate-x-1/3 -translate-y-1/2">
          <div className="bg-red-500 p-2 rounded-full shadow-lg">
            <FaMotorcycle className="text-white text-xl" />
          </div>
        </div>
        <div className="absolute bottom-1/4 right-0 transform translate-x-1/3 translate-y-1/4">
          <div className="bg-orange-500 p-2 rounded-full shadow-lg">
            <FaTruck className="text-white text-xl" />
          </div>
        </div>

        {/* Marcador de ubicación con hover y clic */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:text-red-600 cursor-pointer transition-all duration-300 scale-100 hover:scale-125"
          onMouseEnter={() => setIsMapHover(true)}
          onMouseLeave={() => setIsMapHover(false)}
          onClick={() => setIsMapOpen(true)}
        >
          <FaMapMarkerAlt size={40} />
          {isMapHover && (
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-64 h-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019192602513!2d-122.4194155846812!3d37.77492977975966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808f4e3d6b0f%3A0x6e9b9e7e7f1d4e0f!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1697041234567!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          )}
        </div>

        {/* Texto explicativo debajo del globo */}
       
      </div>
    </div>
  );
};

export default GlobeSection;