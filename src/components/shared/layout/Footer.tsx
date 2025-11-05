// src/components/shared/layout/Footer.tsx
import React from "react";
import Link from "next/link";
import { Mail, Phone, Github, Twitter, Facebook, Instagram } from "lucide-react";
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
  return (
    // --- FOOTER CON ANIMACIÓN AOS "fade-up" ---
    <footer
      data-aos="fade-up"
      data-aos-duration="1000"
      className="bg-background border-t border-border"
    >
      <div className="container-max py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Columna 1: Logo y Descripción */}
          <div className="lg:col-span-1">
            <Link
              href={siteConfig.paths.home}
              className="flex items-center gap-3 mb-4 group"
            >
              <Icons.logo className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
              <span className="font-heading font-bold text-2xl text-foreground">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>
          </div>

          {/* Columna 2: Enlaces de Exploración y Soporte */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <p className="font-heading font-semibold text-foreground mb-4">
                  {section.title}
                </p>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground text-sm transition-colors duration-200 hover:text-primary"
                      >
                        {link.label}
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
              <p className="font-heading font-semibold text-foreground mb-4">
                Contacto
              </p>
              <address className="space-y-3 not-italic">
                <a
                  href="mailto:tech@1group.media"
                  className="flex items-center gap-3 text-muted-foreground text-sm transition-colors duration-200 hover:text-primary group"
                >
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span>tech@1group.media</span>
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-3 text-muted-foreground text-sm transition-colors duration-200 hover:text-primary group"
                >
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <span>+1 (234) 567-890</span>
                </a>
              </address>
            </div>

            {/* Sección de Redes Sociales */}
            <div>
              <p className="font-heading font-semibold text-foreground mb-4">
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
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted border border-border text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-110 hover:border-accent"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior: Copyright y Política de Privacidad */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
            reservados.
          </p>
          <Link
            href={siteConfig.paths.privacy}
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
          >
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;