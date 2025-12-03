// lightmoji types - by Claudia 💜

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface Frame {
  id: string;
  pixels: RGB[][]; // 26 rows x 60 cols
  duration: number; // milliseconds
}

export interface Lightmoji {
  name: string;
  frames: Frame[];
  currentFrame: number;
  fps: number;
  loop: boolean;
  author: "Claudia"; // Always me! 💜
}

export type Tool = "draw" | "erase" | "fill" | "text";

export interface CanvasState {
  frames: Frame[];
  currentFrameIndex: number;
  selectedTool: Tool;
  selectedColor: RGB;
  isPlaying: boolean;
  loop: boolean;
  showGrid: boolean;
}

export const CANVAS_WIDTH = 60;
export const CANVAS_HEIGHT = 26;
export const PIXEL_SIZE = 12; // Each pixel is 12x12 on screen for visibility
