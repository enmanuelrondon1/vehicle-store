// src/components/shared/animation/AnimatedContainer.tsx
import React from "react";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Usamos animate-in de Tailwind + CSS custom para replicar el stagger
export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ children, className }) => (
  <div
    className={`animate-in fade-in duration-500 ${className ?? ""}`}
    // La key la maneja el padre — este componente solo provee la animación de entrada
  >
    {children}
  </div>
);

export const AnimatedItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={`animate-in fade-in slide-in-from-bottom-3 duration-300 ${className ?? ""}`}>
    {children}
  </div>
);