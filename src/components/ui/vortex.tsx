//src/components/ui/vortex.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { createNoise3D } from "simplex-noise";

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
}

// ✅ SOLUCIÓN: Definir una interfaz para la partícula
interface IParticle {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  pz: number;
  radius: number;
  speed: number;
  hue: number;
  init: () => void;
  update: (tick: number) => void;
}

const VortexComponent: React.FC<VortexProps> = (props) => {
  const {
    children,
    className,
    containerClassName,
    particleCount = 700,
    rangeY = 100,
    baseHue = 220,
    baseSpeed = 0.0,
    rangeSpeed = 1.5,
    baseRadius = 1,
    rangeRadius = 2,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlePool = useRef<IParticle[]>([]); // ✅ SOLUCIÓN: Usar la interfaz para el tipado
  const particleCountRef = useRef(particleCount);
  const baseHueRef = useRef(baseHue);
  const baseSpeedRef = useRef(baseSpeed);
  const rangeSpeedRef = useRef(rangeSpeed);
  const baseRadiusRef = useRef(baseRadius);
  const rangeRadiusRef = useRef(rangeRadius);
  const rangeYRef = useRef(rangeY);

  useEffect(() => {
    particleCountRef.current = particleCount;
    baseHueRef.current = baseHue;
    baseSpeedRef.current = baseSpeed;
    rangeSpeedRef.current = rangeSpeed;
    baseRadiusRef.current = baseRadius;
    rangeRadiusRef.current = rangeRadius;
    rangeYRef.current = rangeY;
  }, [
    particleCount,
    baseHue,
    baseSpeed,
    rangeSpeed,
    baseRadius,
    rangeRadius,
    rangeY,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const noise3D = createNoise3D();

    class Particle implements IParticle {
      x: number;
      y: number;
      z: number;
      px: number;
      py: number;
      pz: number;
      radius: number;
      speed: number;
      hue: number;

      constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.px = 0;
        this.py = 0;
        this.pz = 0;
        this.radius = 0;
        this.speed = 0;
        this.hue = 0;
        this.init();
      }

      init() {
        this.x = (Math.random() - 0.5) * window.innerWidth;
        this.y = (Math.random() - 0.5) * window.innerHeight;
        this.z = Math.random() * 500;
        this.px = this.x;
        this.py = this.y;
        this.pz = this.z;
        this.radius =
          baseRadiusRef.current + Math.random() * rangeRadiusRef.current;
        this.speed =
          baseSpeedRef.current + Math.random() * rangeSpeedRef.current;
        this.hue = baseHueRef.current + Math.random() * 100;
      }

      update(tick: number) {
        const { x, y, z } = this;
        const noise =
          noise3D(x * 0.002, y * 0.002, tick * 0.0005) * rangeYRef.current;
        this.y -= this.speed;
        this.z -= this.speed;
        if (this.y < -window.innerHeight / 2) {
          this.init();
          this.y = window.innerHeight / 2;
        }
        if (this.z < -250) {
          this.init();
          this.z = 250;
        }
        this.px = x + Math.cos(tick * 0.01 + z) * 50;
        this.py = y + noise;
        this.pz = z;
      }
    }

    const resize = (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D
    ) => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      ctx.translate(innerWidth / 2, innerHeight / 2);
    };

    const setup = (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D
    ) => {
      resize(canvas, ctx);
      particlePool.current = Array.from(
        { length: particleCountRef.current },
        () => new Particle()
      );
    };

    const render = (
      ctx: CanvasRenderingContext2D,
      tick: number,
      particles: Particle[]
    ) => {
      ctx.clearRect(
        -window.innerWidth / 2,
        -window.innerHeight / 2,
        window.innerWidth,
        window.innerHeight
      );
      ctx.save();
      particles.forEach((p) => {
        p.update(tick);
        const { px, py, pz, radius, hue } = p;
        const scale = Math.max(0, 250 - pz) / 250;
        ctx.beginPath();
        ctx.arc(px, py, radius * scale, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.fill();
      });
      ctx.restore();
    };

    setup(canvas, ctx);
    let tick = 0;
    let animationFrameId: number;
    const animate = () => {
      tick++;
      render(ctx, tick, particlePool.current);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => resize(canvas, ctx);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={cn("relative", containerClassName)}>
      <canvas
        ref={canvasRef}
        className="absolute h-full w-full bg-transparent"
      />
      <div ref={containerRef} className={cn("relative", className)}>
        {children}
      </div>
    </div>
  );
};

export const Vortex = React.memo(VortexComponent);