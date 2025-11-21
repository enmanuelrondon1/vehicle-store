// src/components/shared/layout/Footer.tsx
import React from "react";
import Link from "next/link";
import { Mail, Phone, Github, Twitter, Facebook, Instagram, MapPin, Shield, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/shared/Icons";

const footerSections = [
  {
    title: "Explorar",
    links: [
      { href: siteConfig.paths.catalog, label: "Catálogo" },
      { href: siteConfig.paths.features, label: "Características" },
      { href: siteConfig.paths.testimonials, label: "Testimonios" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { href: siteConfig.paths.contact, label: "Contacto" },
      { href: siteConfig.paths.faq, label: "FAQ" },
      { href: siteConfig.paths.terms, label: "Términos de Servicio" },
    ],
  },
];

const socialLinks = [
  {
    href: siteConfig.links.github,
    icon: <Github className="h-5 w-5" />,
    label: "GitHub",
  },
  {
    href: siteConfig.links.twitter,
    icon: <Twitter className="h-5 w-5" />,
    label: "Twitter",
  },
  {
    href: siteConfig.links.facebook,
    icon: <Facebook className="h-5 w-5" />,
    label: "Facebook",
  },
  {
    href: siteConfig.links.instagram,
    icon: <Instagram className="h-5 w-5" />,
    label: "Instagram",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      data-aos="fade-up"
      data-aos-duration="1000"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, var(--background), var(--muted-10))'
      }}
    >
      {/* Fondo decorativo */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 0%, var(--primary-5) 0%, transparent 50%)'
        }}
      />

      <div className="container-wide relative z-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Columna 1: Logo y Descripción */}
          <div className="lg:col-span-1">
            <Link
              href={siteConfig.paths.home}
              className="flex items-center gap-3 mb-6 group"
            >
              <div className="relative">
                <Icons.logo 
                  className="h-12 w-12 transition-all duration-300 group-hover:scale-110" 
                  style={{ color: 'var(--primary)' }}
                />
                {/* Efecto de brillo */}
                <div 
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, var(--accent-10) 0%, transparent 70%)'
                  }}
                />
              </div>
              <span 
                className="font-heading font-bold text-2xl transition-colors duration-300 group-hover:text-accent"
                style={{ color: 'var(--foreground)' }}
              >
                {siteConfig.name}
              </span>
            </Link>
            <p 
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {siteConfig.description}
            </p>

            {/* Badges de confianza */}
            <div className="flex gap-2 mt-4">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--success-10)', color: 'var(--success)' }}>
                <Shield className="w-3 h-3" />
                Seguro
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--accent-10)', color: 'var(--accent)' }}>
                <Heart className="w-3 h-3" />
                Confiable
              </div>
            </div>
          </div>

          {/* Columna 2: Enlaces de Exploración y Soporte */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <p 
                  className="font-heading font-semibold mb-4"
                  style={{ color: 'var(--foreground)' }}
                >
                  {section.title}
                </p>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm transition-all duration-200 hover:translate-x-1 group"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        <span 
                          className="w-0 h-0.5 transition-all duration-300 group-hover:w-4"
                          style={{ backgroundColor: 'var(--accent)' }}
                        />
                        <span className="group-hover:text-accent transition-colors duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Columna 3: Contacto y Redes Sociales */}
          <div className="lg:col-span-1 space-y-8">
            {/* Sección de Contacto */}
            <div>
              <p 
                className="font-heading font-semibold mb-4 flex items-center gap-2"
                style={{ color: 'var(--foreground)' }}
              >
                <MapPin className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                Contacto
              </p>
              <address className="space-y-3 not-italic">
                <a
                  href="mailto:tech@1group.media"
                  className="flex items-center gap-3 text-sm transition-all duration-200 hover:translate-x-1 group"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <span className="group-hover:text-accent transition-colors duration-200">
                    tech@1group.media
                  </span>
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-3 text-sm transition-all duration-200 hover:translate-x-1 group"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <span className="group-hover:text-accent transition-colors duration-200">
                    +1 (234) 567-890
                  </span>
                </a>
              </address>
            </div>

            {/* Sección de Redes Sociales */}
            <div>
              <p 
                className="font-heading font-semibold mb-4"
                style={{ color: 'var(--foreground)' }}
              >
                Síguenos
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: 'var(--muted-10)',
                      border: '1px solid var(--border)',
                      color: 'var(--muted-foreground)'
                    }}
                  >
                    {/* Efecto de fondo en hover */}
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        backgroundColor: 'var(--accent-10)',
                        borderColor: 'var(--accent-20)'
                      }}
                    />
                    
                    {/* Efecto shimmer */}
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shimmer 2s infinite'
                      }}
                    />
                    
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-accent">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior: Copyright y Política de Privacidad */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p 
              className="text-sm"
              style={{ color: 'var(--muted-foreground)' }}
            >
              © {currentYear} {siteConfig.name}. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <Link
                href={siteConfig.paths.privacy}
                className="text-sm transition-colors duration-200 hover:text-accent"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Política de Privacidad
              </Link>
              <Link
                href={siteConfig.paths.terms}
                className="text-sm transition-colors duration-200 hover:text-accent"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Términos de Servicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;