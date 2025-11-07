// src/components/shared/animation/AnimatedContainer.tsx
import { motion } from "framer-motion";

// Variantes para la animación de entrada escalonada
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Retraso entre cada hijo
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring", // Una animación con un rebote suave
      stiffness: 100,
    },
  },
};

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ children, className }) => (
  <motion.div
    className={className}
    variants={containerVariants}
    initial="hidden"
    animate="show"
    key="list" // La 'key' es crucial para que la animación se reinicie al filtrar
  >
    {children}
  </motion.div>
);

export const AnimatedItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div variants={itemVariants} className={className}>
    {children}
  </motion.div>
);