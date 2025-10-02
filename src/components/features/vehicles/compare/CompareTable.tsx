//src/components/features/vehicles/compare/CompareTable.tsx
"use client";

import { Vehicle } from "@/types/types";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
} from "@/types/shared";

interface CompareTableProps {
  vehicles: Vehicle[];
  isDarkMode: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const formatMileage = (mileage: number) =>
  new Intl.NumberFormat("es-ES").format(mileage);

const CompareTable: React.FC<CompareTableProps> = ({
  vehicles,
  isDarkMode,
}) => {
  const features = [
    { label: "Precio", value: (v: Vehicle) => formatPrice(v.price) },
    { label: "Marca", value: (v: Vehicle) => v.brand },
    { label: "Modelo", value: (v: Vehicle) => v.model },
    { label: "Año", value: (v: Vehicle) => v.year },
    {
      label: "Condición",
      value: (v: Vehicle) => VEHICLE_CONDITIONS_LABELS[v.condition],
    },
    { label: "Kilometraje", value: (v: Vehicle) => `${formatMileage(v.mileage)} km` },
    {
      label: "Combustible",
      value: (v: Vehicle) => FUEL_TYPES_LABELS[v.fuelType],
    },
    {
      label: "Transmisión",
      value: (v: Vehicle) => TRANSMISSION_TYPES_LABELS[v.transmission],
    },
    { label: "Ubicación", value: (v: Vehicle) => v.location },
    {
      label: "Características",
      value: (v: Vehicle) => (
        <div className="flex flex-wrap gap-2 justify-center">
          {v.features.map((feature) => (
            <span
              key={feature}
              className={`px-2 py-1 rounded-full text-xs ${
                isDarkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {feature}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="overflow-x-auto"
      initial="hidden"
      animate="visible"
      variants={tableVariants}
    >
      <table
        className={`min-w-full border-collapse ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <thead>
          <motion.tr variants={rowVariants}>
            <th
              className={`p-4 font-bold text-left ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              Característica
            </th>
            {vehicles.map((vehicle) => (
              <th
                key={vehicle._id}
                className={`p-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                <div className="w-48 h-32 relative mx-auto">
                  <Image
                    src={vehicle.images[0] || "/placeholder.svg"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </th>
            ))}
          </motion.tr>
        </thead>
        <motion.tbody variants={tableVariants}>
          {features.map((feature) => (
            <motion.tr
              key={feature.label}
              className={`border-t ${
                isDarkMode ? "border-gray-700" : "border-gray-300"
              }`}
              variants={rowVariants}
            >
              <td
                className={`p-4 font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {feature.label}
              </td>
              {vehicles.map((vehicle) => (
                <td key={vehicle._id} className="p-4 text-center">
                  {feature.value(vehicle)}
                </td>
              ))}
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </motion.div>
  );
};

export default CompareTable;