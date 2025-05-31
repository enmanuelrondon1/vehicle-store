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
        /* Fondo sólido con borde superior de gradiente */
        .footer-background {
          background: ${isDarkMode ? "#111827" : "#F9FAFB"};
          position: relative;
          border-top: 3px solid transparent;
          border-image: linear-gradient(90deg, #F97316, #E5E7EB) 1;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
        }
        
        /* Animación suave para elementos */
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Estilo para los enlaces */
        .footer-link {
          color: ${isDarkMode ? "#D1D5DB" : "#374151"};
          position: relative;
          transition: color 0.3s ease, transform 0.3s ease;
        }
        
        .footer-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: #F97316;
          transition: width 0.3s ease;
        }
        
        .footer-link:hover::after {
          width: 100%;
        }
        
        .footer-link:hover {
          color: #F97316;
          transform: translateX(5px);
        }
        
        /* Estilo para los íconos de redes sociales */
        .social-icon {
          color: ${isDarkMode ? "#D1D5DB" : "#374151"};
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          color: #F97316;
          transform: scale(1.2);
        }
        
        /* Estilo para el nombre de la empresa en el footer */
        .company-name-footer {
          font-family: 'Dancing Script', cursive;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          letter-spacing: 1.5px;
          background: linear-gradient(45deg, #F97316, #E5E7EB);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 6s ease-in-out infinite;
          text-shadow: 0 0 10px rgba(249, 115, 22, 0.2);
        }
        
        .dark .company-name-footer {
          background: linear-gradient(45deg, #F97316, #D1D5DB);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 10px rgba(249, 115, 22, 0.2);
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Responsividad */
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .footer-container {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
      
      <footer className="footer-background text-[#374151] dark:text-[#D1D5DB] py-6 mt-8 fade-in relative">
        <div className="footer-container container mx-auto px-4">
          <div className="footer-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sección de Navegación */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{translations.exploreVehicles || "Explorar Vehículos"}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/catalog" className="footer-link">
                    {translations.catalog || "Catálogo"}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="footer-link">
                    {translations.contact || "Contacto"}
                  </Link>
                </li>
                <li>
                  <Link href="/favorites" className="footer-link">
                    {translations.favorites || "Favoritos"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sección de Contacto */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{translations.contact || "Contacto"}</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:support@vehiclestore.com" className="footer-link">
                    support@vehiclestore.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+1234567890" className="footer-link">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="footer-link">
                    123 Vehicle Lane, Auto City, AC 12345
                  </span>
                </li>
              </ul>
            </div>

            {/* Sección de Redes Sociales */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{translations.findUs || "Encuéntranos"}</h3>
              <div className="flex space-x-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="my-6 border-t border-[#E5E7EB] dark:border-[#374151]"></div>

          {/* Copyright */}
          <div className="text-center">
            <span className="company-name-footer">VehicleStore</span>
            <p className="text-xs text-[#9CA3AF] dark:text-[#9CA3AF] mt-1">
              © {new Date().getFullYear()} VehicleStore. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;