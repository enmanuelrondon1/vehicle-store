"use client";
import { createContext, useContext, useState } from "react";

export type Language = "en" | "es";

export interface Translation {
  greeting: string;
  catalog: string;
  about: string;
  financing: string;
  contact: string;
  store: string;
  storeProducts: string;
  storeCategories: string;
  storeOffers: string;
  signIn: string;
  favorites: string;
  heroSection: string;
  ourLocation: string;
  heroTitle: string;
  heroSubtitle: string;
  slogan: string;
  exploreNow: string;
  viewDetails: string;
  vehicles: string;
  support: string;
  satisfaction: string;
  globeDemo: string;
  viewLocations: string;
  trustBadge: string;
  instantDelivery: string;
  premiumService: string;
  ourLocations: string;
  findUs: string;
  getDirections: string;
  recentHighlights: string;
  seeAll: string;
  exploreVehicles: string;
  vehiclesByCategory: string;
  vehiclesByBrand: string;
  vehiclesByModel: string;
  vehiclesByYear: string;
  vehiclesByPrice: string;
  vehiclesByMileage: string;
  viewVehicleDetails: string;
  viewVehicleLocation: string;
  trustBadgeDescription: string;
  instantDeliveryDescription: string;
  premiumServiceDescription: string;
  getDirectionsDescription: string;
  seeAllHighlights: string;
  noHighlights: string;
  noResults: string;
  close: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  filters: string;
  clear: string;
  vehiclesFound: string;
  avgPrice: string;
  sortBy: string;
  page: string;
  showing: string;
  condition: string;
  fuelType: string;
  transmission: string;
  "price-asc": string;
  "price-desc": string;
  "year-desc": string;
  "mileage-asc": string;
  "rating-desc": string;
  removeFromFavorites: string;
  addToFavorites: string;
  allRightsReserved: string;
  quickPost: string;
  quickPostDesc: string;
  buyers: string;
  secure: string;
  bestPrice: string;
  statsSold: string;
  statsSoldLabel: string;
  statsUsers: string;
  statsUsersLabel: string;
  statsRating: string;
  statsRatingLabel: string;
  statsTime: string;
  statsTimeLabel: string;
  benefits: string;
  platformTag: string;
  description: string;
  sellVehicleTitle: string;
  sellButton: string;
  fastSelling: string;
  callToActionTitle: string;
  callToActionDesc: string;
  whyChooseTitle: string;
  whyChooseDesc: string;
  whyChooseDesc2: string;
  whyChooseDesc3: string;
  whyChooseDesc4: string;
  whyChooseDesc5: string;
  whyChooseDesc6: string;
  whyChooseDesc7: string;
  buyersDesc: string;
  secureDesc: string;
  getDirectionsDesc: string;
  bestPriceDesc: string;
}

const translations: Record<Language, Translation> = {
  en: {
    greeting: "Hello",
    catalog: "Catalog",
    about: "About",
    financing: "Financing",
    contact: "Contact",
    store: "Store",
    storeProducts: "Products",
    storeCategories: "Categories",
    storeOffers: "Offers",
    signIn: "Sign In",
    favorites: "Favorites",
    heroSection: "Welcome to Our Store",
    ourLocation: "Our Location",
    heroTitle: "Find Your Perfect Vehicle",
    heroSubtitle: "Explore our extensive selection of vehicles",
    slogan: "Exclusive offers today!",
    exploreNow: "Explore Now",
    viewDetails: "View Details",
    vehicles: "vehicles",
    support: "Support",
    satisfaction: "Satisfaction",
    globeDemo: "Find Us Here",
    viewLocations: "View Locations",
    trustBadge: "Trust Badge",
    instantDelivery: "Instant Delivery",
    premiumService: "Premium Service",
    ourLocations: "Our Locations",
    findUs: "Find Us",
    getDirections: "Get Directions",
    recentHighlights: "Recent Highlights",
    seeAll: "See All",
    exploreVehicles: "Explore Vehicles...",
    vehiclesByCategory: "Vehicles by Category",
    vehiclesByBrand: "Vehicles by Brand",
    vehiclesByModel: "Vehicles by Model",
    vehiclesByYear: "Vehicles by Year",
    vehiclesByPrice: "Vehicles by Price",
    vehiclesByMileage: "Vehicles by Mileage",
    viewVehicleDetails: "View Vehicle Details",
    viewVehicleLocation: "View Vehicle Location",
    trustBadgeDescription: "Our vehicles come with a trust badge for quality assurance.",
    instantDeliveryDescription: "Enjoy instant delivery on selected vehicles.",
    premiumServiceDescription: "Experience our premium service for a hassle-free purchase.",
    getDirectionsDescription: "Get directions to your preferred vehicle location.",
    seeAllHighlights: "See All Highlights",
    noHighlights: "No highlights found",
    noResults: "No results found",
    close: "Close",
    testimonialsTitle: "What Our Customers Say",
    testimonialsSubtitle: "Hear the experiences of those who trusted us",
    filters: "Filters",
    clear: "Clear",
    vehiclesFound: "vehicles found",
    avgPrice: "Average Price",
    sortBy: "Sort by",
    page: "Page",
    showing: "Showing",
    condition: "Condition",
    fuelType: "Fuel Type",
    transmission: "Transmission",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    "year-desc": "Year: Newest",
    "mileage-asc": "Mileage: Low",
    "rating-desc": "Best Rated",
    removeFromFavorites: "Remove from Favorites",
    addToFavorites: "Add to Favorites",
    allRightsReserved: "All rights reserved.",
    quickPost: "Quick Posting",
    quickPostDesc: "Upload your ad in less than 5 minutes with our optimized system.",
    buyers: "Thousands of Buyers",
    secure: "Secure Transactions",
    bestPrice: "Best Price",
    statsSold: "50K+",
    statsSoldLabel: "Vehicles Sold",
    statsUsers: "25K+",
    statsUsersLabel: "Active Users",
    statsRating: "4.8★",
    statsRatingLabel: "Rating",
    statsTime: "48h",
    statsTimeLabel: "Average Time",
    benefits: "Benefits",
    platformTag: "Platform #1 in Vehicle Sales",
    description: "The most reliable platform to sell your car or motorcycle. We connect buyers and sellers securely and efficiently.",
    sellVehicleTitle: "Sell Your Vehicle",
    sellButton: "Sell My Vehicle",
    fastSelling: "Fast",
    callToActionTitle: "🚀 Start Selling Today!",
    callToActionDesc: "Thousands of buyers are waiting. Post your ad now and sell faster.",
    whyChooseTitle: "Why Choose Our Platform?",
    whyChooseDesc: "We offer a wide selection of vehicles, competitive prices, and exceptional customer service.",
    whyChooseDesc2: "Our team is dedicated to helping you find the right vehicle that fits your needs and budget.",
    whyChooseDesc3: "We provide transparent pricing and detailed vehicle information to ensure you make an informed decision.",
    whyChooseDesc4: "Our financing options are flexible and designed to suit your financial situation.",
    whyChooseDesc5: "We offer a hassle-free buying experience with quick and easy transactions.",
    whyChooseDesc6: "Our customer support team is available to assist you at every step of the way.",
    whyChooseDesc7: "Join our community of satisfied customers who have found their dream vehicles with us.",
    buyersDesc: "Connect with an active audience looking for their next vehicle.",
    secureDesc: "Trusted platform with user verification and 24/7 support.",
    getDirectionsDesc: "Get directions to your preferred vehicle location easily.",
    bestPriceDesc: "Valuation tools to get the best price for your vehicle.",
  },
  es: {
    greeting: "Hola",
    catalog: "Catálogo",
    about: "Acerca de",
    financing: "Financiamiento",
    contact: "Contacto",
    store: "Tienda",
    storeProducts: "Productos",
    storeCategories: "Categorías",
    storeOffers: "Ofertas",
    signIn: "Iniciar Sesión",
    favorites: "Favoritos",
    heroSection: "Bienvenido a Nuestra Tienda",
    ourLocation: "Nuestra Ubicación",
    heroTitle: "Encuentra Tu Vehículo Perfecto",
    heroSubtitle: "Explora nuestra extensa selección de vehículos",
    slogan: "¡Ofertas exclusivas hoy!",
    exploreNow: "Explora Ahora",
    viewDetails: "Ver Detalles",
    vehicles: "vehículos",
    support: "Soporte",
    satisfaction: "Satisfacción",
    globeDemo: "Encuéntranos Aquí",
    viewLocations: "Ver Ubicaciones",
    trustBadge: "Insignia de Confianza",
    instantDelivery: "Entrega Instantánea",
    premiumService: "Servicio Premium",
    ourLocations: "Nuestras Ubicaciones",
    findUs: "Encuéntranos",
    getDirections: "Obtener Direcciones",
    recentHighlights: "Destacados Recientes",
    seeAll: "Ver Todos",
    exploreVehicles: "Explorar Vehículos...",
    vehiclesByCategory: "Vehículos por Categoría",
    vehiclesByBrand: "Vehículos por Marca",
    vehiclesByModel: "Vehículos por Modelo",
    vehiclesByYear: "Vehículos por Año",
    vehiclesByPrice: "Vehículos por Precio",
    vehiclesByMileage: "Vehículos por Kilometraje",
    viewVehicleDetails: "Ver Detalles del Vehículo",
    viewVehicleLocation: "Ver Ubicación del Vehículo",
    trustBadgeDescription: "Nuestros vehículos vienen con una insignia de confianza para garantizar calidad.",
    instantDeliveryDescription: "Disfruta de entrega instantánea en vehículos seleccionados.",
    premiumServiceDescription: "Experimenta nuestro servicio premium para una compra sin complicaciones.",
    getDirectionsDescription: "Obtén direcciones a tu ubicación de vehículo preferida.",
    seeAllHighlights: "Ver Todos los Destacados",
    noHighlights: "No se encontraron destacados",
    noResults: "No se encontraron resultados",
    close: "Cerrar",
    testimonialsTitle: "Lo que Dicen Nuestros Clientes",
    testimonialsSubtitle: "Escucha las experiencias de quienes confiaron en nosotros",
    filters: "Filtros",
    clear: "Limpiar",
    vehiclesFound: "vehículos encontrados",
    avgPrice: "Precio Promedio",
    sortBy: "Ordenar por",
    page: "Página",
    showing: "Mostrando",
    condition: "Condición",
    fuelType: "Tipo de Combustible",
    transmission: "Transmisión",
    "price-asc": "Precio: Menor a Mayor",
    "price-desc": "Precio: Mayor a Menor",
    "year-desc": "Año: Más Recientes",
    "mileage-asc": "Kilometraje: Menor",
    "rating-desc": "Mejor Calificados",
    removeFromFavorites: "Quitar de Favoritos",
    addToFavorites: "Agregar a Favoritos",
    allRightsReserved: "Todos los derechos reservados.",
    quickPost: "Publicación Rápida",
    quickPostDesc: "Sube tu anuncio en menos de 5 minutos con nuestro sistema optimizado.",
    buyers: "Miles de Compradores",
    secure: "Transacciones Seguras",
    bestPrice: "Mejor Precio",
    statsSold: "50K+",
    statsSoldLabel: "Vehículos Vendidos",
    statsUsers: "25K+",
    statsUsersLabel: "Usuarios Activos",
    statsRating: "4.8★",
    statsRatingLabel: "Calificación",
    statsTime: "48h",
    statsTimeLabel: "Tiempo Promedio",
    benefits: "Beneficios",
    platformTag: "Plataforma #1 en Venta de Vehículos",
    description: "La plataforma más confiable para vender tu auto o moto. Conectamos compradores y vendedores de manera segura y eficiente.",
    sellVehicleTitle: "Vende tu Vehículo",
    sellButton: "Vender mi Vehículo",
    fastSelling: "Rápida",
    callToActionTitle: "🚀 ¡Empieza a vender hoy mismo!",
    callToActionDesc: "Miles de compradores están esperando. Publica tu anuncio ahora y vende más rápido.",
    whyChooseTitle: "¿Por qué elegir nuestra plataforma?",
    whyChooseDesc: "Ofrecemos una amplia selección de vehículos, precios competitivos y un servicio al cliente excepcional.",
    whyChooseDesc2: "Nuestro equipo está dedicado a ayudarte a encontrar el vehículo adecuado que se ajuste a tus necesidades y presupuesto.",
    whyChooseDesc3: "Proporcionamos precios transparentes e información detallada sobre los vehículos para que tomes una decisión informada.",
    whyChooseDesc4: "Nuestras opciones de financiamiento son flexibles y diseñadas para adaptarse a tu situación financiera.",
    whyChooseDesc5: "Ofrecemos una experiencia de compra sin complicaciones con transacciones rápidas y fáciles.",
    whyChooseDesc6: "Nuestro equipo de soporte al cliente está disponible para asistirte en cada paso del camino.",
    whyChooseDesc7: "Únete a nuestra comunidad de clientes satisfechos que han encontrado sus vehículos soñados con nosotros.",
    buyersDesc: "Conecta con una audiencia activa buscando su próximo vehículo.",
    secureDesc: "Plataforma confiable con verificación de usuarios y soporte 24/7.",
    getDirectionsDesc: "Obtén direcciones fácilmente a la ubicación de tu vehículo preferido.",
    bestPriceDesc: "Herramientas de valuación para obtener el mejor precio por tu vehículo.",
  },
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("es");

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, translations: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage debe usarse dentro de un LanguageProvider");
  }
  return context;
};