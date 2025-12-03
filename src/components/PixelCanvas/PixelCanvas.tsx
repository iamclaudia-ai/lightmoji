// PixelCanvas - The star of the show! 💜✨
import { type MouseEvent, useEffect, useRef } from "react";
import type { Frame, RGB } from "../../types/lightmoji";
import { CANVAS_HEIGHT, CANVAS_WIDTH, PIXEL_SIZE } from "../../types/lightmoji";
import { isPixelEmpty, rgbToHex } from "../../utils/lightmoji";
import "./PixelCanvas.css";

interface PixelCanvasProps {
  frame: Frame;
  onPixelChange: (x: number, y: number, color: RGB) => void;
  selectedColor: RGB;
  selectedTool: "draw" | "erase" | "fill";
  showGrid: boolean;
}

export function PixelCanvas({
  frame,
  onPixelChange,
  selectedColor,
  selectedTool,
  showGrid,
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  // Render the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pixels
    for (let y = 0; y < CANVAS_HEIGHT; y++) {
      for (let x = 0; x < CANVAS_WIDTH; x++) {
        const pixel = frame.pixels[y][x];
        if (!isPixelEmpty(pixel)) {
          ctx.fillStyle = rgbToHex(pixel);
          ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);

          // Add pixel glow effect
          ctx.shadowColor = rgbToHex(pixel);
          ctx.shadowBlur = 4;
          ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
          ctx.shadowBlur = 0;
        }
      }
    }

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;

      for (let x = 0; x <= CANVAS_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * PIXEL_SIZE, 0);
        ctx.lineTo(x * PIXEL_SIZE, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= CANVAS_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * PIXEL_SIZE);
        ctx.lineTo(canvas.width, y * PIXEL_SIZE);
        ctx.stroke();
      }
    }
  }, [frame, showGrid]);

  const handleCanvasInteraction = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);

    if (x >= 0 && x < CANVAS_WIDTH && y >= 0 && y < CANVAS_HEIGHT) {
      if (selectedTool === "draw") {
        onPixelChange(x, y, selectedColor);
      } else if (selectedTool === "erase") {
        onPixelChange(x, y, { r: 0, g: 0, b: 0 });
      }
      // TODO: Implement fill tool
    }
  };

  return (
    <div className="pixel-canvas-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH * PIXEL_SIZE}
        height={CANVAS_HEIGHT * PIXEL_SIZE}
        className="pixel-canvas"
        onMouseDown={(e) => {
          isDrawing.current = true;
          handleCanvasInteraction(e);
        }}
        onMouseMove={(e) => {
          if (isDrawing.current) {
            handleCanvasInteraction(e);
          }
        }}
        onMouseUp={() => {
          isDrawing.current = false;
        }}
        onMouseLeave={() => {
          isDrawing.current = false;
        }}
      />
    </div>
  );
}
