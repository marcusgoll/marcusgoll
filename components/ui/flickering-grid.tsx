'use client';

import { useEffect, useRef, useState } from 'react';

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maskGradient?: boolean;
}

export default function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(0, 0, 0)',
  width,
  height,
  className,
  maskGradient = false,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set dimensions from props or window size
    const w = width || (typeof window !== 'undefined' ? window.innerWidth : 0);
    const h = height || (typeof window !== 'undefined' ? window.innerHeight : 0);
    setDimensions({ width: w, height: h });
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cols = Math.floor(dimensions.width / (squareSize + gridGap));
    const rows = Math.floor(dimensions.height / (squareSize + gridGap));

    const squares: { x: number; y: number; opacity: number }[] = [];

    // Create grid squares
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        squares.push({
          x: i * (squareSize + gridGap),
          y: j * (squareSize + gridGap),
          opacity: Math.random() * 0.5,
        });
      }
    }

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      squares.forEach((square) => {
        // Random flicker
        if (Math.random() < flickerChance) {
          square.opacity = Math.random() * 0.5;
        }

        ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', `, ${square.opacity})`);
        ctx.fillRect(square.x, square.y, squareSize, squareSize);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [dimensions, squareSize, gridGap, flickerChance, color]);

  return (
    <div className={`relative ${className || ''}`}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="pointer-events-none"
      />
      {maskGradient && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, transparent 20%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 80%, black 100%)',
          }}
        />
      )}
    </div>
  );
}
