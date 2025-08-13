"use client";
import React, { memo } from "react";
import { useLanguage } from "@/context/LanguajeContext";

// 1. Definir un tipo para los testimonios mejora la legibilidad y seguridad.
interface Testimonial {
  id: number;
  name: { es: string; en: string };
  review: { es: string; en: string };
  rating: number;
}

// 2. Mover los datos a una constante separada (o a su propio archivo data.ts)
const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: { es: "Juan Pérez", en: "John Perez" },
    review: {
      es: "Compré mi camioneta aquí y el proceso fue increíblemente fácil. ¡El equipo fue muy atento y profesional!",
      en: "I bought my truck here and the process was incredibly easy. The team was very attentive and professional!",
    },
    rating: 5,
  },
  {
    id: 2,
    name: { es: "María González", en: "Maria Gonzalez" },
    review: {
      es: "Gran variedad de motos para elegir. Encontré exactamente lo que buscaba a un precio razonable.",
      en: "Great variety of motorcycles to choose from. I found exactly what I was looking for at a reasonable price.",
    },
    rating: 4,
  },
  {
    id: 3,
    name: { es: "Carlos Ramírez", en: "Carlos Ramirez" },
    review: {
      es: "El servicio al cliente es excepcional. Me ayudaron a encontrar maquinaria pesada para mi negocio.",
      en: "The customer service is exceptional. They helped me find heavy machinery for my business.",
    },
    rating: 5,
  },
];

// 3. Crear un componente para las estrellas mejora la reutilización y la accesibilidad.
const StarRating = memo(({ rating, totalStars = 5 }: { rating: number; totalStars?: number }) => (
  <div className="flex" role="img" aria-label={`${rating} de ${totalStars} estrellas`}>
    {Array.from({ length: totalStars }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-orange-500" // Usar colores de Tailwind
            : "text-gray-300 dark:text-gray-600"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
));
StarRating.displayName = 'StarRating';

// 4. Crear un componente para la tarjeta de testimonio hace el código principal más limpio.
const TestimonialCard = memo(({ testimonial }: { testimonial: Testimonial }) => {
  const { language } = useLanguage();
  // Asumimos que language es 'es' o 'en'. Sería ideal asegurar esto en el contexto.
  const currentLanguage = (language === 'es' || language === 'en') ? language : 'es';
  
  const name = testimonial.name[currentLanguage];
  const review = testimonial.review[currentLanguage];

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
      <header className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-gray-50 font-bold" aria-hidden="true">
          {name[0]}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {name}
          </h3>
          <div className="mt-1">
            <StarRating rating={testimonial.rating} />
          </div>
        </div>
      </header>
      <blockquote className="text-gray-500 dark:text-gray-400 text-sm italic">
        {review}
      </blockquote>
    </article>
  );
});
TestimonialCard.displayName = 'TestimonialCard';

const TestimonialsSection = () => {
  const { translations } = useLanguage();

  return (
    // 5. Usar nombres de colores de Tailwind en lugar de valores hexadecimales para consistencia.
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 w-full py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          {translations?.testimonialsTitle || "Lo que dicen nuestros clientes"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {translations?.testimonialsSubtitle ||
            "Escucha las experiencias de quienes confiaron en nosotros"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonialsData.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
};

export default memo(TestimonialsSection);