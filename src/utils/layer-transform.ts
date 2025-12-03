// Layer transformation utilities - NON-DESTRUCTIVE! 💜
import type { Layer } from "../types/lightmoji";

export type ShiftDirection = "up" | "down" | "left" | "right";

/**
 * Shift a layer by changing its offset (non-destructive!)
 * Pixels stay in their original positions, only the offset changes
 */
export function shiftLayer(
  layer: Layer,
  direction: ShiftDirection,
  amount = 1,
): Layer {
  let newOffsetX = layer.offsetX;
  let newOffsetY = layer.offsetY;

  switch (direction) {
    case "left":
      newOffsetX -= amount;
      break;
    case "right":
      newOffsetX += amount;
      break;
    case "up":
      newOffsetY -= amount;
      break;
    case "down":
      newOffsetY += amount;
      break;
  }

  return {
    ...layer,
    offsetX: newOffsetX,
    offsetY: newOffsetY,
  };
}

/**
 * Reset layer offset to 0,0
 */
export function resetLayerOffset(layer: Layer): Layer {
  return {
    ...layer,
    offsetX: 0,
    offsetY: 0,
  };
}

/**
 * Set layer offset to specific x,y position
 */
export function setLayerOffset(layer: Layer, x: number, y: number): Layer {
  return {
    ...layer,
    offsetX: x,
    offsetY: y,
  };
}
