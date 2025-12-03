// lightmoji utilities - by Claudia 💜

import { typeid } from "typeid-js";
import type { Frame, Layer, RGB } from "../types/lightmoji";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../types/lightmoji";

export function createEmptyPixel(): RGB {
  return { r: 0, g: 0, b: 0 };
}

export function createEmptyPixelGrid(): RGB[][] {
  const pixels: RGB[][] = [];
  for (let y = 0; y < CANVAS_HEIGHT; y++) {
    const row: RGB[] = [];
    for (let x = 0; x < CANVAS_WIDTH; x++) {
      row.push(createEmptyPixel());
    }
    pixels.push(row);
  }
  return pixels;
}

export function createEmptyLayer(name = "Layer"): Layer {
  return {
    id: typeid("layer").toString(),
    name,
    visible: true,
    pixels: createEmptyPixelGrid(),
    offsetX: 0,
    offsetY: 0,
    opacity: 1.0,
  };
}

export function createEmptyFrame(): Frame {
  return {
    id: typeid("frame").toString(),
    layers: [createEmptyLayer("Background")],
    duration: 200, // 200ms default
  };
}

export function rgbToHex(rgb: RGB): string {
  const r = Math.max(0, Math.min(255, rgb.r));
  const g = Math.max(0, Math.min(255, rgb.g));
  const b = Math.max(0, Math.min(255, rgb.b));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function duplicateLayer(layer: Layer): Layer {
  return {
    id: typeid("layer").toString(),
    name: `${layer.name} Copy`,
    visible: layer.visible,
    pixels: layer.pixels.map((row) => row.map((pixel) => ({ ...pixel }))),
    offsetX: layer.offsetX,
    offsetY: layer.offsetY,
    opacity: layer.opacity,
  };
}

export function duplicateFrame(frame: Frame): Frame {
  return {
    id: typeid("frame").toString(),
    layers: frame.layers.map((layer) => duplicateLayer(layer)),
    duration: frame.duration,
  };
}

export function isPixelEmpty(pixel: RGB): boolean {
  return pixel.r === 0 && pixel.g === 0 && pixel.b === 0;
}

export function clearLayer(layer: Layer): Layer {
  return {
    ...layer,
    pixels: createEmptyPixelGrid(),
  };
}

export function clearFrame(frame: Frame): Frame {
  return {
    ...frame,
    layers: frame.layers.map((layer) => clearLayer(layer)),
  };
}

// Composite layers into a single pixel grid (for rendering/export)
export function compositeLayers(layers: Layer[]): RGB[][] {
  const result = createEmptyPixelGrid();

  // Render layers bottom-to-top (like Photoshop!)
  for (const layer of layers) {
    if (!layer.visible) continue;

    for (let y = 0; y < CANVAS_HEIGHT; y++) {
      for (let x = 0; x < CANVAS_WIDTH; x++) {
        const pixel = layer.pixels[y][x];

        // If pixel is not transparent (black), draw it at offset position
        if (!isPixelEmpty(pixel)) {
          const targetX = x + layer.offsetX;
          const targetY = y + layer.offsetY;

          // Only draw if target position is in bounds
          if (
            targetX >= 0 &&
            targetX < CANVAS_WIDTH &&
            targetY >= 0 &&
            targetY < CANVAS_HEIGHT
          ) {
            result[targetY][targetX] = { ...pixel };
          }
        }
      }
    }
  }

  return result;
}
