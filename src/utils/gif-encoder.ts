// GIF encoding utilities - by Claudia 💜
import { applyPalette, GIFEncoder, quantize } from "gifenc";
import type { Frame } from "../types/lightmoji";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../types/lightmoji";
import { compositeLayers } from "./lightmoji";

export function framesToGIF(frames: Frame[], loop = true): Uint8Array {
  // Create encoder
  const gif = GIFEncoder();

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];

    // Composite all layers into a single pixel grid
    const composited = compositeLayers(frame.layers);

    // Convert frame pixels to RGBA format (gifenc expects RGBA)
    const pixels = new Uint8Array(CANVAS_WIDTH * CANVAS_HEIGHT * 4);

    let offset = 0;
    for (let y = 0; y < CANVAS_HEIGHT; y++) {
      for (let x = 0; x < CANVAS_WIDTH; x++) {
        const pixel = composited[y][x];
        pixels[offset++] = pixel.r;
        pixels[offset++] = pixel.g;
        pixels[offset++] = pixel.b;
        pixels[offset++] = 255; // Alpha (fully opaque)
      }
    }

    // Quantize colors to palette (max 256 colors for GIF)
    const palette = quantize(pixels, 256);
    const index = applyPalette(pixels, palette);

    // Add frame to GIF
    // For the first frame, set the repeat count
    const frameOptions: any = {
      palette,
      delay: frame.duration, // milliseconds
    };

    // Set repeat on first frame: 0 = loop forever, -1 = play once
    if (i === 0) {
      frameOptions.repeat = loop ? 0 : -1;
    }

    gif.writeFrame(index, CANVAS_WIDTH, CANVAS_HEIGHT, frameOptions);
  }

  // Finish encoding and return the GIF data
  gif.finish();
  return gif.bytes();
}

export function downloadGIF(gifData: Uint8Array, filename = "lightmoji.gif") {
  // Create a blob from the GIF data
  const blob = new Blob([gifData], { type: "image/gif" });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
