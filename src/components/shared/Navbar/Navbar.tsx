"use client";
import React from "react";
import Link from "next/link";
import NavMenu from "./NavMenu";
import Image from "next/image";

export const Navbar = () => {
  return (
    <>
      <style jsx global>{`
        /* Importar fuente caligráfica */
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap");

        /* Gradiente animado para el fondo */
        .navbar-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          overflow: hidden;
          height: 80px; /* Fixed height to prevent navbar from growing */
          display: flex;
          align-items: center;
        }

        .navbar-gradient::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        /* Modo oscuro para el navbar */
        .dark .navbar-gradient {
          background: linear-gradient(
            135deg,
            #1a1a2e 0%,
            #16213e 50%,
            #0f3460 100%
          );
        }

        /* Estilo mejorado para el nombre de la empresa */
        .company-name {
          font-family: "Dancing Script", cursive;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          letter-spacing: 1.5px;
          background: linear-gradient(
            45deg,
            #ff6b6b,
            #4ecdc4,
            #45b7d1,
            #96ceb4
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 4s ease-in-out infinite;
          text-shadow: 0 0 30px rgba(255, 107, 107, 0.3);
          transition: all 0.3s ease;
          position: relative;
          display: inline-block;
        }

        .company-name::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          transition: width 0.3s ease;
        }

        .company-name:hover::after {
          width: 100%;
        }

        .company-name:hover {
          transform: translateY(-2px);
          text-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }

        .company-name img {
          object-fit: contain;
          max-height: 100%;
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        /* Modo oscuro para el nombre */
        .dark .company-name {
          background: linear-gradient(
            45deg,
            #64ffda,
            #7c4dff,
            #ff4081,
            #ffeb3b
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px rgba(100, 255, 218, 0.3);
        }

        .dark .company-name:hover {
          text-shadow: 0 5px 15px rgba(100, 255, 218, 0.4);
        }

        /* Efecto de cristal esmerilado */
        .glass-effect {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        /* Animación suave para elementos */
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Efecto hover para el contenedor */
        .navbar-container {
          transition: all 0.3s ease;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .navbar-container:hover {
          transform: translateY(-1px);
        }

        /* Responsive design mejorado */
        @media (max-width: 640px) {
          .company-name {
            font-size: 2.2rem;
            letter-spacing: 1px;
          }
          .navbar-container {
            padding: 1rem 0.5rem; /* Reducir padding en pantallas pequeñas */
          }
        }

        /* Efectos de partículas flotantes */
        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: float 6s infinite ease-in-out;
        }

        .particle:nth-child(1) {
          left: 10%;
          animation-delay: 0s;
        }
        .particle:nth-child(2) {
          left: 20%;
          animation-delay: 1s;
        }
        .particle:nth-child(3) {
          left: 30%;
          animation-delay: 2s;
        }
        .particle:nth-child(4) {
          left: 40%;
          animation-delay: 3s;
        }
        .particle:nth-child(5) {
          left: 50%;
          animation-delay: 4s;
        }
        .particle:nth-child(6) {
          left: 60%;
          animation-delay: 5s;
        }
        .particle:nth-child(7) {
          left: 70%;
          animation-delay: 0.5s;
        }
        .particle:nth-child(8) {
          left: 80%;
          animation-delay: 1.5s;
        }
        .particle:nth-child(9) {
          left: 90%;
          animation-delay: 2.5s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        .dark .particle {
          background: rgba(100, 255, 218, 0.4);
        }
      `}</style>

      <header className="navbar-gradient glass-effect text-white p-4 z-50 shadow-2xl fade-in">
        {/* Partículas flotantes */}
        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="max-padd-container -mb-4 container mx-auto flex justify-between items-center relative z-10 navbar-container">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">
              <Link href="/" className="company-name">
                <Image
                  src="https://res.cloudinary.com/dcdawwvx2/image/upload/v1748899696/image-removebg-preview_1_yq8jh8.png"
                  alt="logo"
                  width={120}
                  height={120}
                  style={{ objectFit: "contain", maxHeight: "100%" }}
                />
              </Link>
            </h1>
          </div>
          <NavMenu />
        </div>
      </header>
    </>
  );
};

export default Navbar;