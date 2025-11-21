// src/components/shared/Navbar/Logo.tsx (versión mejorada)
import React from "react";
import { motion } from "framer-motion";
import { Car } from "lucide-react";

const Logo = () => {
  return (
    <a href="/" className="group relative flex items-center" aria-label="Ir a la página principal">
      <motion.div
        className="relative flex items-center gap-3"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {/* Contenedor del icono con tu sistema de diseño */}
        <motion.div
          className="relative p-3 rounded-xl overflow-hidden glow-effect"
          style={{
            background: 'var(--gradient-accent)',
            boxShadow: '0 8px 24px var(--accent-20)'
          }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3 }}
        >
          {/* Reflejo superior mejorado */}
          <div 
            className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl opacity-30"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)'
            }}
          />
          
          {/* Destello animado más sutil */}
          <motion.div
            className="absolute inset-0 skew-x-12 opacity-20"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)'
            }}
            animate={{
              x: ["-200%", "200%"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
          
          {/* Icono del carro */}
          <Car 
            className="w-6 h-6 relative z-10 drop-shadow-lg" 
            style={{ color: 'var(--accent-foreground)' }}
            strokeWidth={2.5} 
          />
        </motion.div>
        
        {/* Texto del logo con tus variables */}
        <div className="flex items-baseline gap-0">
          {/* Número "1" destacado */}
          <motion.span 
            className="font-heading font-black text-4xl bg-clip-text text-transparent"
            style={{
              background: 'var(--gradient-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            whileHover={{ 
              scale: 1.1,
              textShadow: '0 0 10px var(--accent-20)'
            }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            1
          </motion.span>
          
          {/* "Auto" en bold */}
          <span 
            className="font-heading font-bold text-3xl tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Auto
          </span>
          
          {/* ".market" más sutil */}
          <span 
            className="font-heading font-medium text-3xl tracking-tight"
            style={{ color: 'var(--muted-foreground)' }}
          >
            .market
          </span>
        </div>
        
        {/* Línea decorativa inferior con tus variables */}
        <motion.div
          className="absolute -bottom-1 left-0 h-0.5 rounded-full"
          style={{
            background: 'linear-gradient(to right, transparent, var(--accent), transparent)'
          }}
          initial={{ width: 0, opacity: 0 }}
          whileHover={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </motion.div>
    </a>
  );
};

export default Logo;