'use client';
import React, { useState } from 'react';
import { Car, Truck, Wrench, Bike, Phone, Mail, MapPin, Eye, Heart } from 'lucide-react';
import Image from 'next/image';

// Interfaces TypeScript (same as provided)
interface VehicleItem {
  id: string;
  category: {
    es: string;
    en: string;
  };
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  color: {
    es: string;
    en: string;
  };
  engine: {
    es: string;
    en: string;
  };
  transmission: {
    es: string;
    en: string;
  };
  condition: {
    es: string;
    en: string;
  };
  location: string;
  features: {
    es: string[];
    en: string[];
  };
  fuelType: {
    es: string;
    en: string;
  };
  doors: number;
  seats: number;
  dimensions: {
    largo: number;
    ancho: number;
    alto: number;
  };
  weight: number;
  loadCapacity?: number;
  images?: string[];
  sellerContact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  postedDate: string;
  disponibilidad?: {
    es?: string;
    en?: string;
  };
  warranty: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
}

interface VehicleShowcaseProps {
  items: VehicleItem[];
  language?: 'es' | 'en';
}

const VehicleShowcase: React.FC<VehicleShowcaseProps> = ({ items = [], language = 'es' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Formatear kilometraje
  const formatMileage = (mileage?: number) => {
    return new Intl.NumberFormat('es-MX').format(mileage ?? 0);
  };

  // Categorías únicas con safeguard
  const categories = [
    ...new Set(
      items && items.length > 0
        ? items
            .map(item => item.category?.[language])
            .filter(Boolean)
        : []
    ),
  ];

  // Agrupar items por categoría con safeguard
  const groupedItems = items && items.length > 0
    ? items.reduce((acc, item) => {
        const category = item.category?.[language] || 'Sin categoría';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      }, {} as Record<string, VehicleItem[]>)
    : {};

  // Filtrar items según categoría seleccionada con safeguard
  const filteredItems = items && items.length > 0
    ? selectedCategory === 'all'
      ? items
      : items.filter(item => item.category?.[language] === selectedCategory)
    : [];

  // Iconos por categoría
  const getCategoryIcon = (category: string) => {
    switch ((category || '').toLowerCase()) {
      case 'vehículos':
      case 'vehicles':
        return <Car className="w-5 h-5" />;
      case 'motos':
      case 'motorcycles':
        return <Bike className="w-5 h-5" />;
      case 'camiones':
      case 'trucks':
        return <Truck className="w-5 h-5" />;
      case 'maquinaria pesada':
      case 'heavy machinery':
        return <Wrench className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  // Toggle favoritos
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  // Color del badge de disponibilidad
  const getAvailabilityColor = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'disponible':
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reservado':
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'vendido':
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Marketplace de Vehículos
        </h1>
        <p className="text-gray-600 text-lg">
          Encuentra el vehículo perfecto para ti
        </p>
      </div>

      {/* Filtros por categoría */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            Todos ({items.length})
          </button>
          {categories.map((category, idx) => (
            <button
              key={category || `cat-${idx}`}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 capitalize ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              {getCategoryIcon(category)}
              {category} ({groupedItems[category]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Grid de vehículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Imagen */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
              {item.images && item.images.length > 0 ? (
                <Image
                  src={item.images[0]}
                  alt={`${item.brand} ${item.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getCategoryIcon(item.category?.[language] || '')}
                </div>
              )}

              {/* Badge de disponibilidad */}
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(item.disponibilidad?.[language])}`}>
                {item.disponibilidad?.[language] || ''}
              </div>

              {/* Botón de favorito */}
              <button
                onClick={() => toggleFavorite(item.id)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                type="button"
              >
                <Heart
                  className={`w-4 h-4 ${favorites.has(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-5">
              {/* Título y precio */}
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {item.brand} {item.model}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.year}
                  </span>
                </div>
              </div>

              {/* Detalles principales */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {item.location}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <span>{formatMileage(item.mileage)} km</span>
                  <span>{item.fuelType?.[language] || ''}</span>
                  <span>{item.condition?.[language] || ''}</span>
                  <span>{item.transmission?.[language] || ''}</span>
                </div>
              </div>

              {/* Features principales (máximo 3) */}
              {item.features?.[language]?.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {item.features?.[language]?.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {item.features?.[language]?.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{item.features?.[language]?.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Contacto */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.sellerContact?.name || ''}</span>
                  <div className="flex gap-2">
                    <a
                      href={item.sellerContact?.phone ? `tel:${item.sellerContact.phone}` : '#'}
                      className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                    </a>
                    <a
                      href={item.sellerContact?.email ? `mailto:${item.sellerContact.email}` : '#'}
                      className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Car className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No se encontraron vehículos
          </h3>
          <p className="text-gray-600">
            Intenta con una categoría diferente
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleShowcase;