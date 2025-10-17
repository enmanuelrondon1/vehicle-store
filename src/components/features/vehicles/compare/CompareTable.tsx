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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CompareTableProps {
  vehicles: Vehicle[];
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const formatMileage = (mileage: number) =>
  `${new Intl.NumberFormat("es-ES").format(mileage)} km`;

const featuresConfig = [
  {
    label: "Condición",
    value: (v: Vehicle) => VEHICLE_CONDITIONS_LABELS[v.condition],
  },
  { label: "Kilometraje", value: (v: Vehicle) => formatMileage(v.mileage) },
  { label: "Combustible", value: (v: Vehicle) => FUEL_TYPES_LABELS[v.fuelType] },
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
          <Badge key={feature} variant="secondary">
            {feature}
          </Badge>
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
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CompareTable: React.FC<CompareTableProps> = ({ vehicles }) => {
  return (
    <motion.div
      className="w-full overflow-x-auto"
      initial="hidden"
      animate="visible"
      variants={tableVariants}
    >
      <Table className="min-w-full border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 font-semibold bg-card w-1/4">
              Característica
            </TableHead>
            {vehicles.map((vehicle) => (
              <TableHead key={vehicle._id} className="text-center">
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="w-full h-32 relative mb-4">
                        <Image
                          src={vehicle.images[0] || "/placeholder.svg"}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                      <h3 className="font-bold text-lg">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.year}
                      </p>
                      <p className="font-semibold text-primary mt-2">
                        {formatPrice(vehicle.price)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {featuresConfig.map((feature) => (
            <TableRow key={feature.label}>
              <TableCell className="sticky left-0 z-10 font-semibold bg-card">
                {feature.label}
              </TableCell>
              {vehicles.map((vehicle) => (
                <TableCell key={vehicle._id} className="text-center">
                  <motion.div variants={itemVariants}>
                    {feature.value(vehicle)}
                  </motion.div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default CompareTable;