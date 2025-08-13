// src/constants/form-constants.ts
import { VehicleCategory } from "@/types/shared"

export interface Bank {
  name: string
  url: string
}

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

  // Bancos Adicionales
  { name: "Banco Venezolano de Crédito", url: "https://www.venezolano.com" },
  { name: "Banco Internacional de Desarrollo", url: "https://www.bid.com.ve" },
];
export const VENEZUELAN_STATES = [
  "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
  "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón",
  "Guárico", "Lara", "Mérida", "Miranda", "Monagas", "Nueva Esparta",
  "Portuguesa", "Sucre", "Táchira", "Trujillo", "Vargas", "Yaracuy", "Zulia"
].sort();

export const phoneCodes = ["0412", "0424", "0414", "0426", "0416"]

export const formSteps = [
  { label: "Información Básica", icon: "🚗" },
  { label: "Precio y Condición", icon: "💰" },
  { label: "Especificaciones", icon: "⚙️" },
  { label: "Contacto", icon: "👤" },
  { label: "Características", icon: "⭐" },
  { label: "Confirmación de Pago", icon: "💳" },
]

export const CATEGORY_DATA = {
  [VehicleCategory.CAR]: {
    subcategories: ["Sedán", "Hatchback", "Coupé", "Convertible", "Familiar"],
    brands: [
      "Toyota",
      "Chevrolet",
      "Ford",
      "Mazda",
      "Hyundai",
      "Chery",
      "Geely",
      "BYD",
      "Changan",
      "Volkswagen",
      "Nissan",
      "Honda",
    ],
    colors: [
      "Blanco",
      "Negro",
      "Plata",
      "Gris",
      "Azul",
      "Rojo",
      "Verde",
      "Amarillo",
      "Naranja",
      "Marrón",
    ],
  },
  [VehicleCategory.SUV]: {
    subcategories: ["Compacto", "Mediano", "Grande", "Crossover", "Pickup"],
    brands: [
      "Toyota",
      "Ford",
      "Chevrolet",
      "Jeep",
      "Mazda",
      "Hyundai",
      "Great Wall",
      "Chery",
      "Changan",
      "BAIC",
      "Kia",
      "Mitsubishi",
    ],
    colors: ["Blanco", "Negro", "Plata", "Gris", "Azul", "Rojo", "Verde"],
  },
  [VehicleCategory.TRUCK]: {
    subcategories: ["Liviano", "Mediano", "Pesado", "Volteo", "Plataforma"],
    brands: [
      "Ford",
      "Chevrolet",
      "JAC",
      "Foton",
      "Dongfeng",
      "Isuzu",
      "Hino",
      "Mercedes-Benz",
      "Volvo",
      "Freightliner",
    ],
    colors: ["Blanco", "Negro", "Azul", "Rojo", "Amarillo", "Naranja"],
  },
  [VehicleCategory.MOTORCYCLE]: {
    // Subcategorías más descriptivas para el mercado venezolano
    subcategories: [
      "Calle/Urbana",
      "Scooter",
      "Enduro/Trail",
      "Deportiva",
      "Trabajo/Utilitaria",
      "Cruiser",
    ],
    // Tu lista de marcas investigada, ¡excelente!
    brands: [
      "Bera",
      "Yamaha",
      "Honda",
      "Suzuki",
      "Bajaj",
      "TVS",
      "Kawasaki",
      "Otra", // Añadimos la opción para especificar
    ],
    colors: ["Negro", "Rojo", "Azul", "Blanco", "Amarillo", "Verde", "Naranja"],
  },
  [VehicleCategory.BUS]: {
    subcategories: [
      "Urbano",
      "Interurbano",
      "Escolar",
      "Turístico",
      "Ejecutivo",
    ],
    brands: ["Mercedes-Benz", "Volvo", "Scania", "Iveco", "Hino", "Yutong"],
    colors: ["Blanco", "Azul", "Amarillo", "Verde", "Rojo"],
  },
  [VehicleCategory.VAN]: {
    subcategories: ["Pasajeros", "Carga", "Mixta", "Ejecutiva"],
    brands: ["Ford", "Chevrolet", "Hyundai", "Kia", "Renault", "Peugeot"],
    colors: ["Blanco", "Negro", "Plata", "Gris", "Azul"],
  },
};