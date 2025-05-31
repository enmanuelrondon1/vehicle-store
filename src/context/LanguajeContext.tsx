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
    ourLocations: "Our Location",
    findUs: "Find Us",
    getDirections: "Get Directions",
    recentHighlights: "Recent Highlights",
    seeAll: "See All",
    exploreVehicles: "Explore vehicles...",
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
    seeAllHighlights: "See all highlights",
    noHighlights: "No highlights found",
    noResults: "No results found",
    close: "Close",
    testimonialsTitle: "What Our Customers Say",
    testimonialsSubtitle: "Hear the experiences of those who trusted us",
    filters: "Filters",
    clear: "Clear",
    vehiclesFound: "vehicles found",
    avgPrice: "Average price",
    sortBy: "Sort by",
    page: "Page",
    showing: "Showing",
    condition: "Condition",
    fuelType: "Fuel type",
    transmission: "Transmission",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    "year-desc": "Year: Newest",
    "mileage-asc": "Mileage: Low",
    "rating-desc": "Best Rated",
    removeFromFavorites: "Remove from favorites",
    addToFavorites: "Add to favorites",
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
    signIn: "Iniciar sesión",
    favorites: "Favoritos",
    heroSection: "Bienvenido a Nuestra Tienda",
    ourLocation: "Nuestra Ubicación",
    heroTitle: "Encuentra Tu Vehículo Perfecto",
    heroSubtitle: "Explora Nuestra Selección de Vehículos",
    slogan: "¡Ofertas Exclusivas Hoy!",
    exploreNow: "Explora Ahora",
    viewDetails: "Ver Detalles",
    vehicles: "vehículos",
    support: "Soporte",
    satisfaction: "Satisfacción",
    globeDemo: "Ubicanos Aqui",
    viewLocations: "Ver Ubicaciones",
    trustBadge: "Insignia de Confianza",
    instantDelivery: "Entrega Instantánea",
    premiumService: "Servicio Premium",
    ourLocations: "Nuestras Ubicaciones",
    findUs: "Encuéntranos en cualquiera de nuestras sedes",
    getDirections: "Obtener Direcciones",
    recentHighlights: "Destacados Recientes",
    seeAll: "Ver Todos",
    exploreVehicles: "Explorar vehículos...",
    vehiclesByCategory: "Vehículos por Categoría",
    vehiclesByBrand: "Vehículos por Marca",
    vehiclesByModel: "Vehículos por Modelo",
    vehiclesByYear: "Vehículos por Año",
    vehiclesByPrice: "Vehículos por Precio",
    vehiclesByMileage: "Vehículos por Kilómetros",
    viewVehicleDetails: "Ver Detalles del Vehículo",
    viewVehicleLocation: "Ver Ubicación del Vehículo",
    trustBadgeDescription: "Nuestros vehículos vienen con una insignia de confianza para la garantía de calidad.",
    instantDeliveryDescription: "Disfruta de la entrega instantánea en los vehículos seleccionados.",
    premiumServiceDescription: "Experimente nuestro servicio premium para una compra sin molestias.",
    getDirectionsDescription: "Obtenga las instrucciones para su ubicación preferida del vehículo.",
    seeAllHighlights: "Ver todos los destacados",
    noHighlights: "No se encontraron destacados",
    noResults: "No se encontraron resultados",
    close: "Cerrar",
    testimonialsTitle: "Lo que dicen nuestros clientes",
    testimonialsSubtitle: "Escucha las experiencias de quienes confiaron en nosotros",
    filters: "Filtros",
    clear: "Limpiar",
    vehiclesFound: "vehículos encontrados",
    avgPrice: "Precio promedio",
    sortBy: "Ordenar por",
    page: "Página",
    showing: "Mostrando",
    condition: "Condición",
    fuelType: "Tipo de combustible",
    transmission: "Transmisión",
    "price-asc": "Precio: Menor a Mayor",
    "price-desc": "Precio: Mayor a Menor",
    "year-desc": "Año: Más Recientes",
    "mileage-asc": "Kilometraje: Menor",
    "rating-desc": "Mejor Calificados",
    removeFromFavorites: "Quitar de favoritos",
    addToFavorites: "Agregar a favoritos",
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