"use client";
import React from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from "react-icons/bs";
import { FaCar, FaMotorcycle, FaTruck } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import { useLanguage } from "@/context/LanguajeContext";

interface CustomArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const ContentSection = () => {
  const { translations } = useLanguage();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    className: "rounded-lg shadow-xl",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  function NextArrow(props: CustomArrowProps) {
    const {  style, onClick } = props;
    return (
      <BsArrowRightCircleFill
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-blue-500 hover:text-blue-600 cursor-pointer opacity-70 hover:opacity-100 transition-all duration-300"
        style={{ ...style, display: "block" }}
        onClick={onClick}
        size={32}
      />
    );
  }

  function PrevArrow(props: CustomArrowProps) {
    const {  style, onClick } = props;
    return (
      <BsArrowLeftCircleFill
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-blue-500 hover:text-blue-600 cursor-pointer opacity-70 hover:opacity-100 transition-all duration-300"
        style={{ ...style, display: "block" }}
        onClick={onClick}
        size={32}
      />
    );
  }

  const vehicles = [
    {
      image:
        "https://res.cloudinary.com/dcdawwvx2/image/upload/v1746892454/eca0af32-73fb-4f48-b370-05c2b2136e40_s0lgjp.png",
      alt: "Luxury Car",
      icon: <FaCar className="text-white text-xl" />,
      label: "Autos de Lujo",
    },
    {
      image:
        "https://res.cloudinary.com/dcdawwvx2/image/upload/v1746892171/256a3cfa-5285-4dc1-be95-8d0f0bef298d_rdu1ja.png",
      alt: "Motorcycle",
      icon: <FaMotorcycle className="text-white text-xl" />,
      label: "Motocicletas",
    },
    {
      image:
        "https://res.cloudinary.com/dcdawwvx2/image/upload/v1746892454/063bb5e7-d6d0-4203-984c-dc75e0d7d0af_opcpui.png",
      alt: "SUV",
      icon: <FaTruck className="text-white text-xl" />,
      label: "SUVs",
    },
  ];

  return (
    <div className="w-full lg:w-3/5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left z-10">
      <BlurFade delay={0.2}>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          {translations.heroTitle || "Encuentra tu vehículo ideal"}
        </h1>
      </BlurFade>
      <BlurFade delay={0.4}>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4">
          {translations.heroSubtitle ||
            "Explora nuestra amplia selección de autos, motos y SUVs"}
        </p>
      </BlurFade>
      <BlurFade delay={0.5}>
        <TypeAnimation
          sequence={[
            translations.slogan || "¡Ofertas exclusivas hoy!",
            2000,
            "¡Encuentra descuentos únicos!",
            2000,
            "¡Tu vehículo ideal te espera!",
            2000,
          ]}
          wrapper="p"
          repeat={Infinity}
          className="text-md font-semibold text-blue-600 dark:text-blue-400 mb-6"
        />
      </BlurFade>
      <BlurFade delay={0.6}>
        <Link
          href="/catalog"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-lg shadow-lg hover:shadow-xl flex items-center gap-2 group"
          aria-label={translations.exploreNow || "Explora Ahora"}
        >
          {translations.exploreNow || "Explora Ahora"}
          <BsArrowRightCircleFill className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </BlurFade>

      <div className="mt-8 w-full max-w-2xl">
        <Slider {...sliderSettings}>
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              className="relative h-[250px] bg-gradient-to-r from-gray-900/90 to-gray-800/90 rounded-lg overflow-hidden border border-gray-700 shadow-2xl"
            >
              <Image
                src={vehicle.image}
                alt={vehicle.alt}
                layout="fill"
                objectFit="cover"
                className="rounded-lg mix-blend-overlay hover:mix-blend-normal transition-all duration-500"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                {vehicle.icon}
                <span className="text-white text-sm font-medium">
                  {vehicle.label}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <Link
                  href="/catalog"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <span>{translations.viewDetails || "Ver detalles"}</span>
                  <BsArrowRightCircleFill />
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full mt-8">
        <div className="flex flex-col items-center lg:items-start">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            500+
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {translations.vehicles || "Vehículos"}
          </p>
        </div>
        <div className="flex flex-col items-center lg:items-start">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            24/7
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {translations.support || "Soporte"}
          </p>
        </div>
        <div className="flex flex-col items-center lg:items-start">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            100%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {translations.satisfaction || "Satisfacción"}
          </p>
        </div>
      </div>

    
    </div>
  );
};

export default ContentSection;
