import { useEffect, useRef } from "react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
  size: number;
  hemisphere: "left" | "right";
}

export default function BrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const size = 385;
    canvas.width = size;
    canvas.height = size;

    const center = size / 2;

    // 1. Generate 3D Neural Nodes shaped as Left & Right brain hemispheres
    const nodes: Node3D[] = [];
    const nodeCount = 140;

    for (let i = 0; i < nodeCount; i++) {
      // Golden spiral distribution for spherical layout
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      // Base radius of brain shape
      const r = 95;

      // standard spherical coordinates
      let x = r * Math.sin(phi) * Math.cos(theta);
      let y = r * Math.sin(phi) * Math.sin(theta);
      let z = r * Math.cos(phi);

      // Determine hemisphere
      const hemisphere = x >= 0 ? "right" : "left";

      // 3D Brain Shaping transformations:
      // A. Flatten slightly on the sides (X width), add separation gap between left and right hemispheres
      x *= 0.82;
      const separation = hemisphere === "right" ? 8 : -8;
      x += separation;

      // B. Elongate Front-to-Back (Y axis) and lift top/back lobes slightly
      y *= 1.15;
      if (z > 0) {
        z *= 1.1; // enlarge temporal/parietal regions
      }

      // C. Mathematical folds (gyri/sulci) using harmonic wave coordinates
      const foldFrequency = 6.5;
      const foldStrength = 13;
      const wave = Math.sin(phi * foldFrequency) * Math.cos(theta * foldFrequency);
      
      const rAdjusted = 1 + (wave * foldStrength) / r;
      x *= rAdjusted;
      y *= rAdjusted;
      z *= rAdjusted;

      // Set elegant technical colors (cyan for left, indigo/purple for right)
      const color = hemisphere === "left" ? "rgba(6, 182, 212, 1)" : "rgba(139, 92, 246, 1)";
      const particleSize = 1.5 + Math.random() * 2;

      nodes.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        color,
        size: particleSize,
        hemisphere,
      });
    }

    // Capture mouse coordinates for subtle rotating orbit parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - center;
      const y = e.clientY - rect.top - center;
      // Normalize values to a small orbit range
      mouseRef.current = { x: x * 0.0012, y: y * 0.0012 };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Initial angles for continuous automatic 3D rotation
    let angleX = 0.01;
    let angleY = 0.015;
    let angleZ = 0.005;

    // 3D Rotation function around X, Y, Z axes
    const rotate = (
      node: Node3D,
      ax: number,
      ay: number,
      az: number
    ): { x: number; y: number; z: number } => {
      // Rotate X
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      let y1 = node.y * cosX - node.z * sinX;
      let z1 = node.y * sinX + node.z * cosX;

      // Rotate Y
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      let x2 = node.x * cosY + z1 * sinY;
      let z2 = -node.x * sinY + z1 * cosY;

      // Rotate Z
      const cosZ = Math.cos(az);
      const sinZ = Math.sin(az);
      let x3 = x2 * cosZ - y1 * sinZ;
      let y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // 1. Render ambient backing neural glow (grows/pulses)
      const pulse = 1 + 0.07 * Math.sin(Date.now() * 0.0025);
      const coreGrad = ctx.createRadialGradient(center, center, 2 * pulse, center, center, 140 * pulse);
      coreGrad.addColorStop(0, "rgba(6, 182, 212, 0.08)");
      coreGrad.addColorStop(0.5, "rgba(139, 92, 246, 0.05)");
      coreGrad.addColorStop(1, "rgba(2, 8, 23, 0)");
      ctx.beginPath();
      ctx.arc(center, center, 150 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Slow passive rotation increments
      angleX += 0.0018;
      angleY += 0.0028;
      angleZ += 0.001;

      // Factor in mouse parallax coordinate offsets
      const finalAngleX = angleX + mouseRef.current.y;
      const finalAngleY = angleY + mouseRef.current.x;

      // Project all nodes from 3D space to 2D screen coordinates
      const projectedNodes = nodes.map(node => {
        const rotated = rotate(node, finalAngleX, finalAngleY, angleZ);

        // Focal length for perspective projection
        const focalLength = 260;
        const scale = focalLength / (focalLength + rotated.z);

        // Center on canvas with scale-applied coordinates
        const projX = center + rotated.x * scale;
        const projY = center + rotated.y * scale;

        return {
          ...node,
          x: projX,
          y: projY,
          z: rotated.z, // Keep depth for sorting and size factor
          scale,
        };
      });

      // Sort projected nodes back-to-front (depth buffer) so rendering layers are mathematically perfect
      projectedNodes.sort((a, b) => b.z - a.z);

      // 2. Draw connections (synapses) in 3D
      // Only draw connections if distance is close, and fade line opacity based on depth (Z)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedNodes.length; i++) {
        const nodeA = projectedNodes[i];
        let connectionCount = 0;

        for (let j = i + 1; j < projectedNodes.length; j++) {
          const nodeB = projectedNodes[j];

          // Check original 3D distance between nodes to keep logical connection stable
          const dx = nodeA.baseX - nodeB.baseX;
          const dy = nodeA.baseY - nodeB.baseY;
          const dz = nodeA.baseZ - nodeB.baseZ;
          const dist3D = Math.hypot(dx, dy, dz);

          // Connect points that are close and in the same hemisphere (or major inter-hemisphere bridge nodes)
          const isBridge = Math.abs(nodeA.baseX) < 18 && Math.abs(nodeB.baseX) < 18 && dist3D < 35;
          const isLobeLink = nodeA.hemisphere === nodeB.hemisphere && dist3D < 28;

          if ((isLobeLink || isBridge) && connectionCount < 3) {
            connectionCount++;
            
            // Fade out connections at back depths
            const alpha = Math.max(0.04, Math.min(0.25, (100 - nodeA.z) / 200));
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            
            // Left is cyan, Right is purple, bridges are gradient or mixed blue
            if (isBridge) {
              ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            } else {
              ctx.strokeStyle = nodeA.hemisphere === "left" 
                ? `rgba(6, 182, 212, ${alpha})`
                : `rgba(139, 92, 246, ${alpha})`;
            }
            ctx.stroke();
          }
        }
      }

      // 3. Draw individual 3D particle nodes (size scales dynamically with Z-depth coordinate)
      for (const node of projectedNodes) {
        // Base depth opacity
        const depthAlpha = Math.max(0.15, Math.min(1, (110 - node.z) / 180));
        const colorWithAlpha = node.color.replace("1)", `${depthAlpha})`);

        // Size adapts with camera perspective scale
        const scaledSize = Math.max(1, node.size * node.scale);

        ctx.beginPath();
        ctx.arc(node.x, node.y, scaledSize, 0, Math.PI * 2);
        ctx.fillStyle = colorWithAlpha;
        ctx.fill();

        // Extra glow overlay for front-facing nodes
        if (node.z < -40) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, scaledSize * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = node.hemisphere === "left" 
            ? `rgba(6, 182, 212, ${depthAlpha * 0.15})`
            : `rgba(139, 92, 246, ${depthAlpha * 0.15})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-[385px] h-[385px]">
      <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-3xl animate-pulse" />
      <canvas ref={canvasRef} className="relative z-10 w-[385px] h-[385px] cursor-grab active:cursor-grabbing" />
    </div>
  );
}
