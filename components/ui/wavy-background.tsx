"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill = "white",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noise = createNoise3D();
  const [isSafari, setIsSafari] = useState(false);

  let ctx: CanvasRenderingContext2D | null = null;
  let w = 0;
  let h = 0;
  let nt = 0;
  let animationId: number;

  const getSpeed = () => (speed === "fast" ? 0.002 : 0.001);

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const resizeCanvas = () => {
    if (!canvasRef.current) return;
    ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    w = canvasRef.current.width = window.innerWidth;
    h = canvasRef.current.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
  };

  const drawWave = (n: number) => {
    nt += getSpeed();
    for (let i = 0; i < n; i++) {
      ctx!.beginPath();
      ctx!.lineWidth = waveWidth || 50;
      ctx!.strokeStyle = waveColors[i % waveColors.length];
      for (let x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx!.lineTo(x, y + h * 0.5);
      }
      ctx!.globalAlpha = waveOpacity;
      ctx!.stroke();
      ctx!.closePath();
    }
  };

  const render = () => {
    if (!ctx) return;
    ctx.globalAlpha = 1; // Ensure solid background
    ctx.fillStyle = backgroundFill!;
    ctx.fillRect(0, 0, w, h); // Clear background with solid fill

    drawWave(5); // Then draw semi-transparent waves

    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative sm:h-screen flex flex-col items-center justify-center overflow-hidden",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        style={isSafari ? { filter: `blur(${blur}px)` } : {}}
      />
      <div className={cn("relative z-10 w-full", className)} {...props}>
        {children}
      </div>
    </div>
  );
};

