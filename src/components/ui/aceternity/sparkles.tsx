import { useEffect, useRef, useState } from "react";
import { cn } from "../../../utils/cn";

export const SparklesCore = ({
  background,
  minSize,
  maxSize,
  particleDensity,
  particleColor,
  className,
}: {
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  className?: string;
}) => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
      initParticles();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initParticles = () => {
    const particleCount = particleDensity || 50;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * ((maxSize || 2) - (minSize || 0.5)) + (minSize || 0.5),
      });
    }

    setParticles(particles);
  };

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      if (context.current && canvasRef.current) {
        context.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        particles.forEach((particle) => {
          if (context.current) {
            context.current.beginPath();
            context.current.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
            context.current.fillStyle = particleColor || "#FFFFFF";
            context.current.fill();

            // Update particle position
            particle.x += (Math.random() - 0.5) * 0.5;
            particle.y += (Math.random() - 0.5) * 0.5;

            // Wrap particles around screen
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            if (particle.y > window.innerHeight) particle.y = 0;
          }
        });

        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [particles, particleColor, minSize, maxSize]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0", className)}
      style={{ background: background || "transparent" }}
    />
  );
};
