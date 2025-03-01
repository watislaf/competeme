import type React from "react";

import { useEffect, useRef } from "react";

interface FireworksProps {
  isActive: boolean;
}

export const Fireworks: React.FC<FireworksProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor(x: number, y: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * size + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = color;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Firework {
      x: number;
      y: number;
      particles: Particle[];
      timer: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.timer = 0;
        this.createParticles();
      }

      createParticles() {
        const particleCount = 50;
        const colors = ["#EB5250", "#EBD060", "#9AEB60", "#99EAEB"];

        for (let i = 0; i < particleCount; i++) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push(new Particle(this.x, this.y, 3, color));
        }
      }

      update() {
        this.timer++;
        this.particles.forEach((particle) => {
          particle.update();
        });

        this.particles = this.particles.filter(
          (particle) => particle.size > 0.2,
        );
      }

      draw() {
        this.particles.forEach((particle) => {
          particle.draw();
        });
      }

      isFinished() {
        return this.particles.length === 0;
      }
    }

    const fireworks: Firework[] = [];

    const createInitialFireworks = () => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          fireworks.push(
            new Firework(
              centerX + (Math.random() * 200 - 100),
              centerY + (Math.random() * 100 - 50),
            ),
          );
        }, i * 300);
      }
    };

    createInitialFireworks();

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();

        if (Math.random() < 0.03 && fireworks.length < 10) {
          const rect = canvas.getBoundingClientRect();
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          fireworks.push(
            new Firework(
              centerX + (Math.random() * 300 - 150),
              centerY + (Math.random() * 200 - 100),
            ),
          );
        }

        if (firework.isFinished()) {
          fireworks.splice(index, 1);
        }
      });

      if (fireworks.length === 0 && Date.now() - startTime > 3000) {
        cancelAnimationFrame(animationId);
        return;
      }

      animationId = requestAnimationFrame(animate);
    };

    const startTime = Date.now();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
};
