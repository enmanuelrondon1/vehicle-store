// src/components/features/vehicles/list/VehicleListHeader.tsx
"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card"; // CAMBIO: Importa Card
import { Search } from "lucide-react"; // CAMBIO: Un icono para dar más contexto

// CAMBIO: Acepta una prop para el conteo de vehículos
interface VehicleListHeaderProps {
  vehicleCount: number;
}

const VehicleListHeader: React.FC<VehicleListHeaderProps> = ({ vehicleCount }) => {
  return (
    <div className="text-center">
      {/* 
        CAMBIO: Usamos el componente Card para consistencia.
        Añadimos una transición y un efecto hover sutil.
      */}
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="overflow-hidden shadow-xl border-border card-hover">
          <CardContent className="flex items-center flex-col justify-center px-6 py-8 w-full h-full">
            {/* El título se mantiene igual, está genial */}
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              Encuentra tu Vehículo Perfecto
            </motion.h1>
          </CardContent>
        </Card>
      </motion.div>

      {/* 
        CAMBIO: Subtítulo dinámico y más informativo.
        Usa un flex para alinear el icono y el texto.
      */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        Explorando <span className="font-bold text-foreground">{vehicleCount}</span> vehículos
      </motion.p>
    </div>
  );
};

export default VehicleListHeader;