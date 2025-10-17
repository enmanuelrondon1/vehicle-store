"use client";
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
    { href: siteConfig.links.github, icon: <Github className="h-5 w-5" />, label: "GitHub" },
    { href: siteConfig.links.twitter, icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
    { href: siteConfig.links.facebook, icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
    { href: siteConfig.links.instagram, icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
];

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-padd-container py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href={siteConfig.paths.home} className="flex items-center gap-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-muted-foreground text-sm">
              {siteConfig.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">
            {footerSections.map((section) => (
              <div key={section.title}>
                <p className="font-semibold text-foreground">{section.title}</p>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
             <div>
                <p className="font-semibold text-foreground">Contacto</p>
                 <address className="mt-4 space-y-3 not-italic">
                   <a href="mailto:tech@1group.media" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                     <Mail className="h-5 w-5 flex-shrink-0" />
                     <span>tech@1group.media</span>
                   </a>
                   <a href="tel:+1234567890" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                     <Phone className="h-5 w-5 flex-shrink-0" />
                     <span>+1 (234) 567-890</span>
                   </a>
                 </address>
            </div>
          </div>

          <div className="lg:col-span-1">
            <p className="font-semibold text-foreground">Síguenos</p>
            <div className="mt-4 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <div className="mt-4 flex gap-4 sm:mt-0">
            <Link href={siteConfig.paths.privacy} className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;