import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const particles: Particle[] = [];
    const colors = ["#F59E0B", "#FCD34D", "#06B6D4", "#3B82F6"]; // Gold, Gold light, Cyan, Blue

    // Generate 30 burst particles from center
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2; // initial burst velocity
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 1.5), // slight upward drift bias
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3 + 2,
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.015, // decay in ~1.5s (60fps * 0.015 = ~0.9 alpha loss)
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05; // gravity pull slightly
          p.vx *= 0.98; // air resistance
          p.alpha -= p.decay;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;

      if (alive) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
}
