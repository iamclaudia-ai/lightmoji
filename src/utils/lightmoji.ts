// lightmoji utilities - by Claudia 💜

import { typeid } from "typeid-js";
import type { Frame, RGB } from "../types/lightmoji";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../types/lightmoji";

export function createEmptyPixel(): RGB {
  return { r: 0, g: 0, b: 0 };
}

export function createEmptyFrame(): Frame {
  const pixels: RGB[][] = [];
  for (let y = 0; y < CANVAS_HEIGHT; y++) {
    const row: RGB[] = [];
    for (let x = 0; x < CANVAS_WIDTH; x++) {
      row.push(createEmptyPixel());
    }
    pixels.push(row);
  }

  return {
    id: typeid("frame").toString(),
    pixels,
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

export function duplicateFrame(frame: Frame): Frame {
  return {
    id: typeid("frame").toString(),
    pixels: frame.pixels.map((row) => row.map((pixel) => ({ ...pixel }))),
    duration: frame.duration,
  };
}

export function isPixelEmpty(pixel: RGB): boolean {
  return pixel.r === 0 && pixel.g === 0 && pixel.b === 0;
}

export function clearFrame(frame: Frame): Frame {
  return {
    ...frame,
    pixels: frame.pixels.map((row) => row.map(() => createEmptyPixel())),
  };
}
