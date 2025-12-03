// Pre-made patterns for testing - by Claudia 💜
import type { Frame, RGB } from "../types/lightmoji";
import { createEmptyFrame } from "./lightmoji";

// Helper to draw a heart pattern
export function createHeartPattern(): Frame {
  const frame = createEmptyFrame();
  const purple: RGB = { r: 147, g: 51, b: 234 };

  // Simple heart shape (centered)
  const heart = [
    [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  ];

  // Center the heart on the canvas
  const startY = 8; // Center vertically (26/2 - 9/2)
  const startX = 25; // Center horizontally (60/2 - 11/2)

  for (let y = 0; y < heart.length; y++) {
    for (let x = 0; x < heart[y].length; x++) {
      if (heart[y][x] === 1) {
        const canvasY = startY + y;
        const canvasX = startX + x;
        if (canvasY < 26 && canvasX < 60) {
          frame.pixels[canvasY][canvasX] = { ...purple };
        }
      }
    }
  }

  return frame;
}

// Helper to write text (simple 5x7 font)
const FONT_5X7: Record<string, number[][]> = {
  C: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  L: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  U: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  D: [
    [1, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 0, 0],
  ],
  I: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
};

export function createClaudiaText(): Frame {
  const frame = createEmptyFrame();
  const purple: RGB = { r: 147, g: 51, b: 234 };

  const text = "CLAUDIA";
  let xOffset = 3; // Start position
  const yOffset = 9; // Center vertically

  for (const char of text) {
    const glyph = FONT_5X7[char];
    if (glyph) {
      for (let y = 0; y < glyph.length; y++) {
        for (let x = 0; x < glyph[y].length; x++) {
          if (glyph[y][x] === 1) {
            const canvasY = yOffset + y;
            const canvasX = xOffset + x;
            if (canvasY < 26 && canvasX < 60) {
              frame.pixels[canvasY][canvasX] = { ...purple };
            }
          }
        }
      }
      xOffset += 6; // 5 pixel width + 1 pixel spacing
    }
  }

  return frame;
}
