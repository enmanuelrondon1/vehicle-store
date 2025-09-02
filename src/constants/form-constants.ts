// // src/constants/form-constants.ts
// import { VehicleCategory } from "@/types/shared"

// export interface Bank {
//   name: string
//   url: string
// }

// export const banks: Bank[] = [
//   // Bancos Públicos
//   { name: "Banco de Venezuela", url: "https://www.bancodevenezuela.com" },
//   { name: "Banco del Tesoro", url: "https://www.bt.gob.ve" },
//   { name: "Banco Bicentenario del Pueblo", url: "https://www.bicentenariobu.com.ve" },
//   { name: "Banco de la Fuerza Armada Nacional Bolivariana (Banfanb)", url: "https://www.banfanb.com.ve" },
//   { name: "Banco Agrícola de Venezuela", url: "https://www.bav.com.ve" },

//   // Bancos Privados
//   { name: "Banesco", url: "https://www.banesco.com" },
//   { name: "Banco Mercantil", url: "https://www.mercantilbanco.com" },
//   { name: "BBVA Provincial", url: "https://www.provincial.com" },
//   { name: "Banco del Caribe (Bancaribe)", url: "https://www.bancaribe.com.ve" },
//   { name: "Banco Exterior", url: "https://www.bancoexterior.com" },
//   { name: "Banco Caroní", url: "https://www.bancocaroni.com.ve" },
//   { name: "Banco Sofitasa", url: "https://www.sofitasa.com" },
//   { name: "Banco Plaza", url: "https://www.bancoplaza.com" },
//   { name: "Banco Fondo Común (BFC)", url: "https://www.bfc.com.ve" },
//   { name: "100% Banco", url: "https://www.100banco.com" },
//   { name: "DelSur Banco Universal", url: "https://www.delsur.com.ve" },
//   { name: "Banco Activo", url: "https://www.bancoactivo.com" },
//   { name: "Bancamiga", url: "https://www.bancamiga.com" },
//   { name: "Banplus", url: "https://www.banplusonline.com" },
//   { name: "Banco Nacional de Crédito (BNC)", url: "https://www.bnc.com.ve" },

//   // Bancos Adicionales
//   { name: "Banco Venezolano de Crédito", url: "https://www.venezolano.com" },
//   { name: "Banco Internacional de Desarrollo", url: "https://www.bid.com.ve" },
// ];
// export const VENEZUELAN_STATES = [
//   "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
//   "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón",
//   "Guárico", "Lara", "Mérida", "Miranda", "Monagas", "Nueva Esparta",
//   "Portuguesa", "Sucre", "Táchira", "Trujillo", "Vargas", "Yaracuy", "Zulia"
// ].sort();

// export const phoneCodes = ["0412", "0424", "0414", "0426", "0416"]

// export const formSteps = [
//   { label: "Información Básica", icon: "🚗" },
//   { label: "Precio y Condición", icon: "💰" },
//   { label: "Especificaciones", icon: "⚙️" },
//   { label: "Contacto", icon: "👤" },
//   { label: "Características", icon: "⭐" },
//   { label: "Confirmación de Pago", icon: "💳" },
// ]

// export const CATEGORY_DATA = {
//   [VehicleCategory.CAR]: {
//     subcategories: ["Sedán", "Hatchback", "Coupé", "Convertible", "Familiar"],
//     brands: [
//       "Toyota",
//       "Chevrolet",
//       "Ford",
//       "Mazda",
//       "Hyundai",
//       "Chery",
//       "Geely",
//       "BYD",
//       "Changan",
//       "Volkswagen",
//       "Nissan",
//       "Honda",
//     ],
//     colors: [
//       "Blanco",
//       "Negro",
//       "Plata",
//       "Gris",
//       "Azul",
//       "Rojo",
//       "Verde",
//       "Amarillo",
//       "Naranja",
//       "Marrón",
//     ],
//   },
//   [VehicleCategory.SUV]: {
//     subcategories: ["Compacto", "Mediano", "Grande", "Crossover", "Pickup"],
//     brands: [
//       "Toyota",
//       "Ford",
//       "Chevrolet",
//       "Jeep",
//       "Mazda",
//       "Hyundai",
//       "Great Wall",
//       "Chery",
//       "Changan",
//       "BAIC",
//       "Kia",
//       "Mitsubishi",
//     ],
//     colors: ["Blanco", "Negro", "Plata", "Gris", "Azul", "Rojo", "Verde"],
//   },
//   [VehicleCategory.TRUCK]: {
//     subcategories: ["Liviano", "Mediano", "Pesado", "Volteo", "Plataforma"],
//     brands: [
//       "Ford",
//       "Chevrolet",
//       "JAC",
//       "Foton",
//       "Dongfeng",
//       "Isuzu",
//       "Hino",
//       "Mercedes-Benz",
//       "Volvo",
//       "Freightliner",
//     ],
//     colors: ["Blanco", "Negro", "Azul", "Rojo", "Amarillo", "Naranja"],
//   },
//   [VehicleCategory.MOTORCYCLE]: {
//     // Subcategorías más descriptivas para el mercado venezolano
//     subcategories: [
//       "Calle/Urbana",
//       "Scooter",
//       "Enduro/Trail",
//       "Deportiva",
//       "Trabajo/Utilitaria",
//       "Cruiser",
//     ],
//     // Tu lista de marcas investigada, ¡excelente!
//     brands: [
//       "Bera",
//       "Yamaha",
//       "Honda",
//       "Suzuki",
//       "Bajaj",
//       "TVS",
//       "Kawasaki",
//       "Otra", // Añadimos la opción para especificar
//     ],
//     colors: ["Negro", "Rojo", "Azul", "Blanco", "Amarillo", "Verde", "Naranja"],
//   },
//   [VehicleCategory.BUS]: {
//     subcategories: [
//       "Urbano",
//       "Interurbano",
//       "Escolar",
//       "Turístico",
//       "Ejecutivo",
//     ],
//     brands: ["Mercedes-Benz", "Volvo", "Scania", "Iveco", "Hino", "Yutong"],
//     colors: ["Blanco", "Azul", "Amarillo", "Verde", "Rojo"],
//   },
//   [VehicleCategory.VAN]: {
//     subcategories: ["Pasajeros", "Carga", "Mixta", "Ejecutiva"],
//     brands: ["Ford", "Chevrolet", "Hyundai", "Kia", "Renault", "Peugeot"],
//     colors: ["Blanco", "Negro", "Plata", "Gris", "Azul"],
//   },
// };


// TODO: Actualiznado el componente 
// src/constants/form-constants.ts
// src/constants/form-constants.ts
import { VehicleCategory } from "@/types/shared";

// ===============================
// INTERFACES
// ===============================

export interface Bank {
  name: string;
  url: string;
}

export interface FeatureCategory {
  iconName: string;
  color: string;
  features: string[];
}

export interface FormStep {
  label: string;
  iconName: string; // Cambiado a string para evitar JSX en constantes
  description: string;
}

export interface CategoryData {
  subcategories: string[];
  brands: string[];
}

// ===============================
// BANCOS VENEZOLANOS
// ===============================

export const banks: Bank[] = [
  // Bancos Públicos
  { name: "Banco de Venezuela", url: "https://www.bancodevenezuela.com" },
  { name: "Banco del Tesoro", url: "https://www.bt.gob.ve" },
  { name: "Banco Bicentenario del Pueblo", url: "https://www.bicentenariobu.com.ve" },
  { name: "Banco de la Fuerza Armada Nacional Bolivariana (Banfanb)", url: "https://www.banfanb.com.ve" },
  { name: "Banco Agrícola de Venezuela", url: "https://www.bav.com.ve" },

  // Bancos Privados
  { name: "Banesco", url: "https://www.banesco.com" },
  { name: "Banco Mercantil", url: "https://www.mercantilbanco.com" },
  { name: "BBVA Provincial", url: "https://www.provincial.com" },
  { name: "Banco del Caribe (Bancaribe)", url: "https://www.bancaribe.com.ve" },
  { name: "Banco Exterior", url: "https://www.bancoexterior.com" },
  { name: "Banco Caroní", url: "https://www.bancocaroni.com.ve" },
  { name: "Banco Sofitasa", url: "https://www.sofitasa.com" },
  { name: "Banco Plaza", url: "https://www.bancoplaza.com" },
  { name: "Banco Fondo Común (BFC)", url: "https://www.bfc.com.ve" },
  { name: "100% Banco", url: "https://www.100banco.com" },
  { name: "DelSur Banco Universal", url: "https://www.delsur.com.ve" },
  { name: "Banco Activo", url: "https://www.bancoactivo.com" },
  { name: "Bancamiga", url: "https://www.bancamiga.com" },
  { name: "Banplus", url: "https://www.banplusonline.com" },
  { name: "Banco Nacional de Crédito (BNC)", url: "https://www.bnc.com.ve" },
  { name: "Banco Venezolano de Crédito", url: "https://www.venezolano.com" },
  { name: "Banco Internacional de Desarrollo", url: "https://www.bid.com.ve" },
];

// ===============================
// DATOS GEOGRÁFICOS Y CONTACTO
// ===============================

export const VENEZUELAN_STATES = [
  "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
  "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón",
  "Guárico", "Lara", "Mérida", "Miranda", "Monagas", "Nueva Esparta",
  "Portuguesa", "Sucre", "Táchira", "Trujillo", "Vargas", "Yaracuy", "Zulia"
].sort();

export const phoneCodes = ["0412", "0424", "0414", "0426", "0416"];

// ===============================
// PASOS DEL FORMULARIO
// ===============================

export const formSteps: FormStep[] = [
  {
    label: "Información Básica",
    iconName: "Car",
    description: "Datos principales del vehículo"
  },
  {
    label: "Detalles",
    iconName: "FileText",
    description: "Especificaciones técnicas"
  },
  {
    label: "Fotografías",
    iconName: "Camera",
    description: "Imágenes del vehículo"
  },
  {
    label: "Precio",
    iconName: "DollarSign",
    description: "Información comercial"
  },
  {
    label: "Ubicación",
    iconName: "MapPin",
    description: "Datos de contacto"
  },
  {
    label: "Revisión",
    iconName: "CheckCircle",
    description: "Confirmación final"
  }
];

// ===============================
// CATEGORÍAS DE VEHÍCULOS
// ===============================

export const CATEGORY_DATA: Record<VehicleCategory, CategoryData> = {
  [VehicleCategory.CAR]: {
    subcategories: [
      "Sedán",
      "Hatchback", 
      "Coupé",
      "Convertible",
      "Station Wagon",
      "Compacto",
      "Deportivo"
    ],
    brands: [
      "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Volkswagen",
      "Hyundai", "Kia", "Mazda", "Mitsubishi", "Renault", "Peugeot",
      "Fiat", "BMW", "Mercedes-Benz", "Audi", "Chery", "Geely",
      "BYD", "Changan", "Otra"
    ]
  },
  
  [VehicleCategory.MOTORCYCLE]: {
    subcategories: [
      "Scooter", "Deportiva", "Cruiser", "Touring", "Off-Road/Enduro",
      "Naked/Street", "Adventure", "Trabajo/Delivery", "Calle/Urbana"
    ],
    brands: [
      "Yamaha", "Honda", "Suzuki", "Kawasaki", "Bajaj", "TVS", "Hero",
      "KTM", "Ducati", "BMW", "Harley-Davidson", "Empire Keeway",
      "Skygo", "Lifan", "AKT", "Bera", "Otra"
    ]
  },

  [VehicleCategory.TRUCK]: {
    subcategories: [
      "Pickup", "Camión Liviano", "Camión Mediano", "Camión Pesado",
      "Volqueta", "Grúa", "Furgón", "Refrigerado", "Volteo", "Plataforma"
    ],
    brands: [
      "Toyota", "Ford", "Chevrolet", "Isuzu", "Mitsubishi", "Hino",
      "Freightliner", "Volvo", "Scania", "Mercedes-Benz", "Mack",
      "Kenworth", "JAC", "Foton", "Dongfeng", "Otra"
    ]
  },

  [VehicleCategory.SUV]: {
    subcategories: [
      "SUV Compacto", "SUV Mediano", "SUV Grande", "Crossover",
      "Pick-up SUV", "SUV Deportivo", "SUV de Lujo"
    ],
    brands: [
      "Toyota", "Ford", "Honda", "Chevrolet", "Nissan", "Hyundai", "Kia",
      "Mazda", "Mitsubishi", "Subaru", "Jeep", "Land Rover", "BMW",
      "Mercedes-Benz", "Audi", "Volvo", "Great Wall", "Chery", "Changan",
      "BAIC", "Otra"
    ]
  },

  [VehicleCategory.BUS]: {
    subcategories: [
      "Microbús", "Bus Urbano", "Bus Intermunicipal", "Bus Turístico",
      "Bus Escolar", "Bus Articulado", "Bus Ejecutivo", "Interurbano"
    ],
    brands: [
      "Mercedes-Benz", "Volvo", "Scania", "Isuzu", "Hino", "MAN", "Iveco",
      "Blue Bird", "Marcopolo", "Busscar", "Agrale", "Yutong", "Otra"
    ]
  },

  [VehicleCategory.VAN]: {
    subcategories: [
      "Van de Pasajeros", "Van de Carga", "Van Mixta", "Minivan",
      "Panel Van", "Van Refrigerada", "Ejecutiva"
    ],
    brands: [
      "Toyota", "Ford", "Chevrolet", "Nissan", "Hyundai", "Kia", "Isuzu",
      "Mercedes-Benz", "Iveco", "Peugeot", "Renault", "Fiat", "Otra"
    ]
  }
};

// ===============================
// CARACTERÍSTICAS DE VEHÍCULOS
// ===============================

// Características BASE que aplican a todos los vehículos
const BASE_FEATURES = {
  Básico: {
    iconName: "Car",
    color: "text-blue-600",
    features: [
      "Aire Acondicionado",
      "Radio AM/FM",
      "Alarma",
      "Seriales Intactos",
    ],
  },
  Seguridad: {
    iconName: "Shield",
    color: "text-green-600", 
    features: [
      "Cinturones de Seguridad",
      "Luces Antiniebla",
    ],
  },
};

// Características específicas por tipo de vehículo
const VEHICLE_SPECIFIC_FEATURES = {
  [VehicleCategory.CAR]: {
    Básico: {
      iconName: "Car",
      color: "text-blue-600",
      features: [
        ...BASE_FEATURES.Básico.features,
        "Vidrios Eléctricos", 
        "Dirección Hidráulica",
        "Caucho de Repuesto",
        "Llave de Repuesto",
      ],
    },
    Comodidad: {
      iconName: "Users",
      color: "text-purple-600",
      features: [
        "Tapicería de Cuero", "Asientos de Tela", "Volante Ajustable",
        "Espejos Eléctricos", "Vidrios Polarizados", "Techo Solar",
        "Bluetooth", "Sistema de Sonido Premium", "Arranque por Botón",
        "Asientos Calefaccionados", "Control de Crucero", "GPS Integrado",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        ...BASE_FEATURES.Seguridad.features,
        "Frenos ABS", "Airbags Frontales", "Airbags Laterales", 
        "Frenos de Disco", "Cámara de Reversa", "Sensores de Estacionamiento",
        "Control de Estabilidad", "Blindaje",
      ],
    },
    Tecnología: {
      iconName: "Zap",
      color: "text-indigo-600",
      features: [
        "Android Auto", "Apple CarPlay", "Cargador Inalámbrico",
        "Pantalla Táctil", "Sistema de Navegación", "Conectividad WiFi",
      ],
    },
  },

  [VehicleCategory.MOTORCYCLE]: {
    Básico: {
      iconName: "Navigation",
      color: "text-orange-600",
      features: [
        "Arranque Eléctrico", "Arranque a Patada", "Luces LED",
        "Odómetro Digital", "Indicador de Combustible", "Seriales Intactos",
        "Llaves de Repuesto",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        "Frenos de Disco Delanteros", "Frenos de Disco Traseros", 
        "Sistema ABS", "Alarma", "Candado de Disco", "Espejos Retrovisores",
        "Luces Intermitentes",
      ],
    },
    Comodidad: {
      iconName: "Users",
      color: "text-purple-600",
      features: [
        "Asiento para Pasajero", "Parrilla Trasera", "Protector de Motor",
        "Protector de Tanque", "Puños Ergonómicos", "Windshield/Parabrisas",
      ],
    },
    Accesorios: {
      iconName: "Package",
      color: "text-cyan-600",
      features: [
        "Baúl/Maleta", "Alforjas Laterales", "Soporte para Celular",
        "Cargador USB", "Kit de Herramientas", "Funda/Cobertor",
      ],
    },
  },

  [VehicleCategory.TRUCK]: {
    Básico: {
      iconName: "Truck",
      color: "text-gray-600",
      features: [
        ...BASE_FEATURES.Básico.features,
        "Dirección Hidráulica", "Vidrios Eléctricos", "Caucho de Repuesto",
        "Herramientas Básicas",
      ],
    },
    Comercial: {
      iconName: "Package",
      color: "text-orange-600",
      features: [
        "Capacidad de Carga (especificar kg)", "Ganchos de Remolque",
        "Compartimento de Carga", "Carrocería de Estacas", "Carrocería Cerrada",
        "Sistema Hidráulico", "Grúa Incorporada", "Rampa de Carga",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        ...BASE_FEATURES.Seguridad.features,
        "Frenos ABS", "Frenos de Aire", "Airbags", "Luces de Emergencia",
        "Reflectores de Seguridad", "Sistema de Monitoreo",
      ],
    },
    Operación: {
      iconName: "Wrench",
      color: "text-red-600",
      features: [
        "Transmisión Manual", "Transmisión Automática", "Diferencial Bloqueado",
        "Tracción 4x4", "Compresor de Aire", "Toma de Fuerza (PTO)",
      ],
    },
  },

  [VehicleCategory.SUV]: {
    Básico: {
      iconName: "Car",
      color: "text-blue-600",
      features: [
        ...BASE_FEATURES.Básico.features,
        "Vidrios Eléctricos", "Dirección Hidráulica", 
        "Caucho de Repuesto", "Llantas de Aleación",
      ],
    },
    Comodidad: {
      iconName: "Users",
      color: "text-purple-600",
      features: [
        "Tapicería de Cuero", "Asientos de Tela", "Tercera Fila de Asientos",
        "Asientos Plegables", "Volante Ajustable", "Espejos Eléctricos",
        "Vidrios Polarizados", "Techo Solar/Panorámico", "Bluetooth",
        "Sistema de Sonido Premium", "Arranque por Botón", "Control de Clima Dual",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        ...BASE_FEATURES.Seguridad.features,
        "Frenos ABS", "Airbags Frontales", "Airbags Laterales", "Airbags de Cortina",
        "Frenos de Disco", "Cámara de Reversa", "Sensores de Estacionamiento",
        "Control de Estabilidad", "Control de Tracción", "Barras de Protección",
      ],
    },
    "Tracción y Terreno": {
      iconName: "Navigation",
      color: "text-emerald-600",
      features: [
        "Tracción 4x4", "Tracción 4x2", "Diferencial Bloqueado",
        "Control de Descenso", "Modos de Manejo", "Protectores de Bajos",
        "Ganchos de Remolque",
      ],
    },
  },

  [VehicleCategory.BUS]: {
    Básico: {
      iconName: "Users",
      color: "text-blue-600",
      features: [
        "Aire Acondicionado", "Sistema de Audio", "Puertas Automáticas",
        "Escalones Antideslizantes", "Ventanas Panorámicas", "Asientos Reclinables",
      ],
    },
    Pasajeros: {
      iconName: "Users",
      color: "text-purple-600",
      features: [
        "Capacidad de Pasajeros (especificar)", "Asientos Acolchados",
        "Portaequipajes", "Baño Incorporado", "TV/Entretenimiento",
        "WiFi para Pasajeros", "Cortinas", "Iluminación LED Interior",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        ...BASE_FEATURES.Seguridad.features,
        "Frenos ABS", "Salidas de Emergencia", "Extintor de Incendios",
        "Botiquín de Primeros Auxilios", "Cámara de Reversa", "GPS de Rastreo",
        "Sistema de Comunicación",
      ],
    },
    Operación: {
      iconName: "Wrench",
      color: "text-red-600",
      features: [
        "Transmisión Manual", "Transmisión Automática", 
        "Sistema Hidráulico", "Suspensión Neumática", "Motor Trasero",
        "Motor Delantero",
      ],
    },
  },

  [VehicleCategory.VAN]: {
    Básico: {
      iconName: "Package",
      color: "text-gray-600",
      features: [
        ...BASE_FEATURES.Básico.features,
        "Vidrios Eléctricos", "Dirección Hidráulica", "Caucho de Repuesto",
      ],
    },
    Configuración: {
      iconName: "Users",
      color: "text-purple-600",
      features: [
        "Configuración de Pasajeros", "Configuración de Carga", "Configuración Mixta",
        "Asientos Removibles", "Divisor de Carga", "Ventanas Laterales",
        "Puertas Corredizas", "Puerta Trasera Doble",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        ...BASE_FEATURES.Seguridad.features,
        "Frenos ABS", "Airbags Frontales", "Frenos de Disco", "Cámara de Reversa",
        "Sensores de Estacionamiento", "Sistema de Alarma",
      ],
    },
    Carga: {
      iconName: "Package",
      color: "text-orange-600",
      features: [
        "Capacidad de Carga (especificar kg)", "Anclajes de Carga",
        "Piso Antideslizante", "Iluminación de Carga", "Ganchos de Amarre",
        "Rampa de Acceso",
      ],
    },
  },
};

// ===============================
// FUNCIONES UTILITARIAS
// ===============================

// Función para obtener características según el tipo de vehículo
export const getAvailableFeatures = (category: VehicleCategory): Record<string, FeatureCategory> => {
  return VEHICLE_SPECIFIC_FEATURES[category] || {};
};

// Función para obtener todas las características disponibles (para admin/debugging)
export const getAllFeatures = (): string[] => {
  const allFeatures: string[] = [];
  
  Object.values(VEHICLE_SPECIFIC_FEATURES).forEach(vehicleFeatures => {
    Object.values(vehicleFeatures).forEach(category => {
      allFeatures.push(...category.features);
    });
  });
  
  return [...new Set(allFeatures)].sort();
};

// Función para validar si una característica es válida para un tipo de vehículo
export const isFeatureValidForCategory = (feature: string, category: VehicleCategory): boolean => {
  const categoryFeatures = getAvailableFeatures(category);
  
  return Object.values(categoryFeatures).some(featureCategory =>
    featureCategory.features.includes(feature)
  );
};

// Función para migrar características existentes al cambiar de categoría
export const migrateFeatures = (
  currentFeatures: string[],
  fromCategory: VehicleCategory,
  toCategory: VehicleCategory
): string[] => {
  if (fromCategory === toCategory) return currentFeatures;
  
  return currentFeatures.filter(feature => 
    isFeatureValidForCategory(feature, toCategory)
  );
};