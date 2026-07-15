import { useEffect, useRef } from "react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
}

export default function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 1. Generate 3D nodes inside a coordinate box:
    // X: -width/2 to width/2
    // Y: -height/2 to height/2
    // Z: -300 to 300
    const nodeCount = 95;
    const nodes: Node3D[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        vz: (Math.random() - 0.5) * 0.15,
        size: 1.2 + Math.random() * 2.2,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Scale coordinates from -0.5 to 0.5 relative to screen center
      targetMouseRef.current = {
        x: (e.clientX / width - 0.5) * 0.45,
        y: (e.clientY / height - 0.5) * 0.45,
      };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Initial camera rotation variables
    let angleY = 0;
    let angleX = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate current mouse rotation angles toward targets (damping)
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      // Base camera angles rotating very slowly + mouse influence
      angleY += 0.0003;
      const finalAngleY = angleY + mouseRef.current.x;
      const finalAngleX = angleX + mouseRef.current.y;

      const cosY = Math.cos(finalAngleY);
      const sinY = Math.sin(finalAngleY);
      const cosX = Math.cos(finalAngleX);
      const sinX = Math.sin(finalAngleX);

      const centerX = width / 2;
      const centerY = height / 2;
      const focalLength = 350;

      // Apply drift velocity and project each point in 3D
      const projectedNodes = nodes.map(node => {
        // Drift movement
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Wrap around boundary box
        const maxW = width * 0.85;
        const maxH = height * 0.85;
        if (Math.abs(node.x) > maxW) node.vx *= -1;
        if (Math.abs(node.y) > maxH) node.vy *= -1;
        if (Math.abs(node.z) > 350) node.vz *= -1;

        // 3D rotation math (Y rotation then X rotation)
        // Y rotate
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.x * sinY + node.z * cosY;

        // X rotate
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        // Perspective Projection calculation
        const scale = focalLength / (focalLength + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        return {
          x: projX,
          y: projY,
          z: z2,
          scale,
          size: node.size,
        };
      });

      // Sort nodes back-to-front by depth (Z coord)
      projectedNodes.sort((a, b) => b.z - a.z);

      // Draw connections in 3D
      ctx.lineWidth = 0.55;
      for (let i = 0; i < projectedNodes.length; i++) {
        const nodeA = projectedNodes[i];
        
        // Skip rendering connections if too deep/distant from camera plane
        if (nodeA.z > 250) continue;

        let connections = 0;
        for (let j = i + 1; j < projectedNodes.length; j++) {
          if (connections >= 2) break; // Limit lines per node to keep UI clean and elegant

          const nodeB = projectedNodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.hypot(dx, dy);

          // Connect nodes that are close on screen
          if (dist < 140) {
            connections++;
            // Opacity based on distance and average z-depth (the further back, the dimmer)
            const distAlpha = (140 - dist) / 140;
            const depthAlpha = Math.max(0.02, Math.min(0.2, (250 - (nodeA.z + nodeB.z) / 2) / 500));
            const alpha = distAlpha * depthAlpha;

            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`; // Glowing cyan neural connections
            ctx.stroke();
          }
        }
      }

      // Draw 3D projected nodes
      for (const node of projectedNodes) {
        // Render node only if it falls inside screen bounds (with padding)
        if (node.x < -50 || node.x > width + 50 || node.y < -50 || node.y > height + 50) continue;

        // Node opacity based on depth
        const alpha = Math.max(0.1, Math.min(0.75, (250 - node.z) / 450));
        const finalSize = Math.max(0.4, node.size * node.scale);

        ctx.beginPath();
        ctx.arc(node.x, node.y, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`; // Deep blue-cyan particles
        ctx.fill();

        // Subtle bloom on the closest nodes
        if (node.z < -100) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, finalSize * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha * 0.12})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 bg-[#020817]"
      id="neural-network-canvas"
    />
  );
}
