// src/components/features/home/Testimonials.tsx
"use client";

import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
// import Marquee from "@/components/magicui/marquee";
import {  Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Ana Pérez",
    role: "Compradora Verificada",
    body: "El proceso de compra fue increíblemente fácil y transparente. Encontré el coche de mis sueños a un precio justo. ¡Totalmente recomendado!",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Carlos Gómez",
    role: "Vendedor Particular",
    body: "Pude vender mi moto en menos de una semana. La plataforma es muy intuitiva y el equipo de soporte me ayudó en todo momento.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "Lucía Fernández",
    role: "Gerente de Flotilla",
    body: "Adquirimos varias unidades para nuestra empresa. La gestión fue profesional y eficiente. Sin duda, nuestra mejor opción para renovar la flotilla.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Javier Rodríguez",
    role: "Entusiasta de Clásicos",
    body: "Encontré una joya de coche clásico que llevaba años buscando. La comunidad y la calidad de los anuncios son inmejorables.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Sofía Morales",
    role: "Primera Compradora",
    body: "Como mi primera vez comprando un auto, estaba nerviosa. El equipo me guió y me sentí segura en cada paso. ¡Gracias!",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "Miguel Torres",
    role: "Vendedor de Camionetas",
    body: "La visibilidad que obtuve para mi camioneta fue asombrosa. Recibí ofertas serias en cuestión de días. Excelente servicio.",
    img: "https://avatar.vercel.sh/james",
  },
];

const TestimonialCard = ({
  img,
  name,
  role,
  body,
}: {
  img: string;
  name: string;
  role: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-80 cursor-pointer overflow-hidden rounded-xl border p-6",
        // light styles
        "border-gray-200/[.5] bg-gray-50/[.1] hover:bg-gray-50/[.3]",
        // dark styles
        "dark:border-gray-800/[.5] dark:bg-gray-900/[.1] dark:hover:bg-gray-900/[.3]"
      )}
    >
      <div className="flex flex-row items-center gap-4">
        <Image
          className="rounded-full"
          width="48"
          height="48"
          alt={name}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{role}</p>
        </div>
      </div>
      <Quote className="w-8 h-8 text-primary/20 dark:text-primary/30 absolute top-4 right-4" />
      <blockquote className="mt-4 text-sm text-muted-foreground">
        {body}
      </blockquote>
    </figure>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 sm:py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Opiniones reales de personas que han confiado en nosotros para
            comprar y vender sus vehículos.
          </p>
        </div>
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-background py-10">
          <Marquee pauseOnHover className="[--duration:40s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:40s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
