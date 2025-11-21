// src/components/features/admin/VehicleEditForm/sectionsConfig.ts

import { Car, DollarSign, Wrench, Phone, Image } from "lucide-react";

export const sectionsConfig = [
  { 
    id: "basic", 
    label: "Información Básica", 
    icon: Car, 
    gradient: "from-primary to-accent",
    description: "Detalles principales del vehículo",
    fields: 8
  },
  { 
    id: "price", 
    label: "Precio y Financiación", 
    icon: DollarSign, 
    gradient: "from-success to-accent",
    description: "Configuración de precios y opciones de pago",
    fields: 6
  },
  { 
    id: "specs", 
    label: "Especificaciones Técnicas", 
    icon: Wrench, 
    gradient: "from-accent to-primary",
    description: "Detalles técnicos y mecánicos del vehículo",
    fields: 10
  },
  { 
    id: "contact", 
    label: "Información de Contacto", 
    icon: Phone, 
    gradient: "from-primary to-success",
    description: "Datos para que los clientes se comuniquen",
    fields: 5
  },
  { 
    id: "features", 
    label: "Características y Multimedia", 
    icon: Image, 
    gradient: "from-accent to-success",
    description: "Imágenes, características y documentación",
    fields: 12
  },
];