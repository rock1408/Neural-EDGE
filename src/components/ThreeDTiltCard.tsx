import React, { useRef, useState } from "react";

interface ThreeDTiltCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function ThreeDTiltCard({ children, className = "", id }: ThreeDTiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position inside element
    const y = e.clientY - rect.top;  // y position inside element

    // Normalize coordinates from -0.5 to 0.5
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.top - 0.5; // Wait, relative to height, let's divide by rect.height
    const normHeightX = x / rect.width - 0.5;
    const normHeightY = y / rect.height - 0.5;

    // Calculate rotation angles (max 12 degrees)
    const tiltX = -normHeightY * 12;
    const tiltY = normHeightX * 12;

    setRotateX(tiltX);
    setRotateY(tiltY);

    // Calculate glare position in percent
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-200 ease-out ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      }}
    >
      {/* Glare overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-inherit z-50 transition-opacity duration-300"
        style={{
          borderRadius: "inherit",
          opacity: isHovered ? 0.25 : 0,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`,
        }}
      />
      
      {/* Dynamic shadows */}
      <div
        className="absolute inset-0 -z-10 rounded-inherit transition-shadow duration-300 pointer-events-none"
        style={{
          borderRadius: "inherit",
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(6, 182, 212, 0.25)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      />

      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
