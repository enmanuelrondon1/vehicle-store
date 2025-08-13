"use client";
import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import { useLanguage } from "@/context/LanguajeContext";

const Footer = () => {
  const { isDarkMode } = useDarkMode();
  const { translations } = useLanguage();

  return (
    <>
      <style jsx global>{`
        /* Aplicando regla 60-30-10 de branding */
        .footer-background {
          /* 60% - Color primario como base */
          background: ${isDarkMode 
            ? "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" 
            : "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)"
          };
          border-top: 3px solid #F97316; /* Color de acento (10%) */
          position: relative;
          overflow: hidden;
        }

        .footer-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          /* 30% - Color secundario en overlay sutil */
          background: ${isDarkMode 
            ? "radial-gradient(ellipse at top, rgba(249, 115, 22, 0.03) 0%, transparent 50%)"
            : "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.02) 0%, transparent 50%)"
          };
          pointer-events: none;
        }

        .footer-content {
          position: relative;
          z-index: 1;
        }

        .footer-section-title {
          color: ${isDarkMode ? "#F8FAFC" : "#0F172A"}; /* 60% - Color primario */
          font-weight: 600;
          font-size: 1.125rem;
          margin-bottom: 1rem;
          position: relative;
        }

        .footer-section-title::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 2rem;
          height: 2px;
          background: #F97316; /* 10% - Color de acento */
          border-radius: 1px;
        }

        .footer-link {
          color: ${isDarkMode ? "#CBD5E1" : "#475569"}; /* 30% - Color secundario */
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.875rem;
          line-height: 1.5;
          display: inline-block;
          position: relative;
        }

        .footer-link:hover {
          color: #F97316; /* 10% - Color de acento en hover */
          transform: translateX(4px);
        }

        .footer-link:focus {
          outline: 2px solid #F97316;
          outline-offset: 2px;
          border-radius: 2px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: background-color 0.3s ease;
        }

        .contact-item:hover {
          background: ${isDarkMode 
            ? "rgba(249, 115, 22, 0.05)" 
            : "rgba(59, 130, 246, 0.03)"
          };
        }

        .contact-icon {
          color: #F97316; /* 10% - Color de acento */
          flex-shrink: 0;
          width: 1.125rem;
          height: 1.125rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          background: ${isDarkMode ? "#334155" : "#E2E8F0"}; /* 30% - Color secundario */
          color: ${isDarkMode ? "#CBD5E1" : "#475569"};
          border-radius: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .social-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .social-link:hover {
          background: #F97316; /* 10% - Color de acento */
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
        }

        .social-link:hover::before {
          left: 100%;
        }

        .social-link:focus {
          outline: 2px solid #F97316;
          outline-offset: 2px;
        }

        .company-branding {
          text-align: center;
          padding: 2rem 0 1rem;
          border-top: 1px solid ${isDarkMode ? "#334155" : "#E2E8F0"};
          margin-top: 2rem;
          position: relative;
        }

        .company-name-footer {
          font-family: 'Dancing Script', cursive;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          letter-spacing: 2px;
          color: #F97316; /* 10% - Color de acento para el logo */
          margin-bottom: 0.5rem;
          display: inline-block;
          position: relative;
        }

        .company-name-footer::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #F97316, transparent);
        }

        .copyright-text {
          color: ${isDarkMode ? "#94A3B8" : "#64748B"}; /* 30% - Color secundario */
          font-size: 0.75rem;
          margin-top: 0.5rem;
          opacity: 0.8;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .social-links {
            justify-content: center;
          }
          
          .footer-section-title {
            text-align: center;
          }
          
          .footer-section-title::after {
            left: 50%;
            transform: translateX(-50%);
          }
        }

        @media (max-width: 480px) {
          .contact-item {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          
          .social-link {
            width: 2.25rem;
            height: 2.25rem;
          }
        }

        /* Mejoras de accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          .footer-link,
          .social-link,
          .contact-item {
            transition: none;
          }
        }

        /* Optimización para impresión */
        @media print {
          .footer-background {
            background: white !important;
            border-top: 2px solid #000;
          }
          
          .social-links,
          .footer-link[href^="tel:"],
          .footer-link[href^="mailto:"] {
            display: none;
          }
        }
      `}</style>
      
      <footer className="footer-background py-8 mt-auto max-padd-container">
        <div className="footer-content container mx-auto px-4">
          <div className="footer-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Sección de Navegación */}
            <nav aria-label="Footer navigation">
              <h3 className="footer-section-title">
                {translations.exploreVehicles || "Explorar Vehículos"}
              </h3>
              <ul className="space-y-3" role="list">
                <li>
                  <Link 
                    href="/catalog" 
                    className="footer-link"
                    aria-label="Ver catálogo de vehículos"
                  >
                    {translations.catalog || "Catálogo"}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="footer-link"
                    aria-label="Página de contacto"
                  >
                    {translations.contact || "Contacto"}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="footer-link"
                    aria-label="Acerca de nosotros"
                  >
                    {translations.about || "Acerca de"}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Sección de Contacto */}
            <div>
              <h3 className="footer-section-title">
                {translations.contact || "Contacto"}
              </h3>
              <address className="not-italic">
                <div className="contact-item">
                  <Mail className="contact-icon" aria-hidden="true" />
                  <a 
                    href="mailto:tech@1group.media" 
                    className="footer-link"
                    aria-label="Enviar correo electrónico"
                  >
                    tech@1group.media
                  </a>
                </div>
                <div className="contact-item">
                  <Phone className="contact-icon" aria-hidden="true" />
                  <a 
                    href="tel:+1234567890" 
                    className="footer-link"
                    aria-label="Llamar por teléfono"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" aria-hidden="true" />
                  <span className="footer-link">
                    123 Vehicle Lane, Auto City, AC 12345
                  </span>
                </div>
              </address>
            </div>

            {/* Sección de Redes Sociales */}
            <div>
              <h3 className="footer-section-title">
                {translations.findUs || "Encuéntranos"}
              </h3>
              <nav aria-label="Social media links">
                <div className="social-links">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link"
                    aria-label="Visitar nuestra página de Facebook"
                  >
                    <Facebook size={18} aria-hidden="true" />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link"
                    aria-label="Seguir en Twitter"
                  >
                    <Twitter size={18} aria-hidden="true" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link"
                    aria-label="Ver en Instagram"
                  >
                    <Instagram size={18} aria-hidden="true" />
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link"
                    aria-label="Ver código en GitHub"
                  >
                    <Github size={18} aria-hidden="true" />
                  </a>
                </div>
              </nav>
            </div>
          </div>

          {/* Branding y Copyright */}
          <div className="company-branding">
            <h2 className="company-name-footer">1AutoMarket</h2>
            <p className="copyright-text">
              © {new Date().getFullYear()} 1AutoMarket. {translations.allRightsReserved || "Todos los derechos reservados."}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;