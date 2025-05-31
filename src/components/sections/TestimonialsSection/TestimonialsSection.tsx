"use client";
import React from "react";
import { useLanguage, LanguageContextType,  } from "@/context/LanguajeContext";

// Datos de ejemplo para testimonios
const testimonials = [
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

const TestimonialsSection = () => {
  const { language, translations } = useLanguage() as LanguageContextType;

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 w-full py-12 bg-[#F9FAFB] dark:bg-[#111827] transition-colors duration-300">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-[#111827] dark:text-[#F9FAFB]">
          {translations?.testimonialsTitle || "Lo que dicen nuestros clientes"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {translations?.testimonialsSubtitle ||
            "Escucha las experiencias de quienes confiaron en nosotros"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white dark:bg-[#1F2937] rounded-lg shadow-lg p-6 border border-[#E5E7EB] dark:border-[#374151] hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center text-[#F9FAFB] font-bold">
                {testimonial.name.es[0]}
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">
                  {language === "es" ? testimonial.name.es : testimonial.name.en}
                </h3>
                <div className="flex mt-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <svg
                      key={index}
                      className={`w-4 h-4 ${
                        index < testimonial.rating
                          ? "text-[#F97316]"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {language === "es" ? testimonial.review.es : testimonial.review.en}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;