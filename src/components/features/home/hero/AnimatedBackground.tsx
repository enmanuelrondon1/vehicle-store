// src/components/features/home/hero/AnimatedBackground.tsx
import { motion } from "framer-motion";

export const AnimatedBackground = () => (
  <div className="absolute inset-0">
    {/* Gradiente base que cambia con el tema usando variables CSS */}
    <div className="absolute inset-0 bg-gradient-to-br 
      from-background/80 via-secondary/60 to-accent/40" />
    
    {/* Formas flotantes animadas con colores adaptativos al modo */}
    <motion.div
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br 
        from-primary/20 via-primary/10 to-accent/10 
        rounded-full blur-3xl"
    />
    
    <motion.div
      animate={{
        y: [0, 15, 0],
        x: [0, -15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      }}
      className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br 
        from-[var(--chart-3)]/20 via-[var(--chart-2)]/10 to-primary/10
        rounded-full blur-3xl"
    />

    {/* Elementos flotantes adicionales para modo light */}
    <motion.div
      animate={{
        y: [0, -25, 0],
        x: [0, 15, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      }}
      className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br 
        from-[var(--chart-5)]/20 via-[var(--destructive)]/10 to-[var(--chart-4)]/10
        rounded-full blur-2xl"
    />
  </div>
);