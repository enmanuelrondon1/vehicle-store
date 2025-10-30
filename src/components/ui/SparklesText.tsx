// src/components/ui/SparklesText.tsx
"use client";

import * as React from 'react';
import { motion } from 'framer-motion';

// Helper function to generate a random number in a given range
const random = (min: number, max: number): number => Math.random() * (max - min) + min;

interface Sparkle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  animationDuration: number;
}

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: { first: string; second: string };
  sparkleCount?: number;
}

const Sparkle: React.FC<{ sparkle: Sparkle }> = ({ sparkle }) => {
  return (
    <motion.svg
      className="absolute pointer-events-none z-10"
      style={{
        left: `${sparkle.x}%`,
        top: `${sparkle.y}%`,
      }}
      width={sparkle.size}
      height={sparkle.size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.5, rotate: Math.random() * 360 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: sparkle.animationDuration,
        ease: 'easeInOut',
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
    >
      <path
        d="M120 80L100 0 80 80 0 100l80 20 20 80 20-80 80-20-80-20z"
        fill={sparkle.color}
      />
    </motion.svg>
  );
};

export const SparklesText: React.FC<SparklesTextProps> = ({
  children,
  className,
  colors = { first: 'hsl(var(--primary))', second: 'hsl(var(--accent))' },
  sparkleCount = 15,
}) => {
  const [sparkles, setSparkles] = React.useState<Sparkle[]>([]);

  React.useEffect(() => {
    const generateSparkle = (): Sparkle => ({
      id: `sparkle-${Math.random()}`,
      x: random(0, 100),
      y: random(0, 100),
      color: Math.random() > 0.5 ? colors.first : colors.second,
      size: random(10, 20),
      animationDuration: random(1.5, 2.5),
    });

    const newSparkles = Array.from({ length: sparkleCount }, generateSparkle);
    setSparkles(newSparkles);
  }, [colors.first, colors.second, sparkleCount]);

  return (
    <span className={`relative inline-block ${className || ''}`}>
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} sparkle={sparkle} />
      ))}
      <span className="relative z-20">{children}</span>
    </span>
  );
};