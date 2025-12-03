// lightmoji Studio - Where the magic happens! ✨💜
import { useEffect, useState } from "react";
import { typeid } from "typeid-js";
import { LayersPanel } from "../components/LayersPanel/LayersPanel";
import { PixelCanvas } from "../components/PixelCanvas/PixelCanvas";
import type { Frame, RGB, Tool } from "../types/lightmoji";
import { downloadGIF, framesToGIF } from "../utils/gif-encoder";
import { type ShiftDirection, shiftLayer } from "../utils/layer-transform";
import {
  clearFrame,
  createEmptyFrame,
  createEmptyLayer,
  duplicateFrame,
  duplicateLayer,
  hexToRgb,
  rgbToHex,
} from "../utils/lightmoji";
import "./LightmojiStudio.css";

const STORAGE_KEY = "lightmoji-studio-state";

interface StoredState {
  frames: Frame[];
  currentFrameIndex: number;
  selectedColor: RGB;
  showGrid: boolean;
}

export function LightmojiStudio() {
  // Load from localStorage on mount
  const loadStoredState = (): StoredState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Migrate old frame structure to new layer-based structure
        if (parsed.frames) {
          parsed.frames = parsed.frames.map((frame: any) => {
            // If frame has pixels instead of layers, migrate it
            if (frame.pixels && !frame.layers) {
              return {
                id: frame.id,
                duration: frame.duration,
                layers: [
                  {
                    id: typeid("layer").toString(),
                    name: "Background",
                    visible: true,
                    pixels: frame.pixels,
                    offsetX: 0,
                    offsetY: 0,
                    opacity: 1.0,
                  },
                ],
              };
            }

            // Add offsets to layers that don't have them
            if (frame.layers) {
              frame.layers = frame.layers.map((layer: any) => ({
                ...layer,
                offsetX: layer.offsetX ?? 0,
                offsetY: layer.offsetY ?? 0,
              }));
            }

            return frame;
          });
        }

        return parsed;
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
    return null;
  };

  const storedState = loadStoredState();

  const [frames, setFrames] = useState<Frame[]>(
    storedState?.frames || [createEmptyFrame()],
  );
  const [currentFrameIndex, setCurrentFrameIndex] = useState(
    storedState?.currentFrameIndex || 0,
  );
  const [selectedTool, setSelectedTool] = useState<Tool>("draw");
  const [selectedColor, setSelectedColor] = useState<RGB>(
    storedState?.selectedColor || {
      r: 147,
      g: 51,
      b: 234,
    },
  ); // Purple! 💜
  const [showGrid, setShowGrid] = useState(storedState?.showGrid ?? true);
  const [activeLayerId, setActiveLayerId] = useState<string>("");

  const currentFrame = frames[currentFrameIndex];

  // Set active layer to first layer if not set
  useEffect(() => {
    if (!activeLayerId && currentFrame.layers.length > 0) {
      setActiveLayerId(currentFrame.layers[0].id);
    }
  }, [currentFrame, activeLayerId]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      const stateToSave: StoredState = {
        frames,
        currentFrameIndex,
        selectedColor,
        showGrid,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [frames, currentFrameIndex, selectedColor, showGrid]);

  const handlePixelChange = (
    layerId: string,
    x: number,
    y: number,
    color: RGB,
  ) => {
    const newFrames = [...frames];
    const frame = newFrames[currentFrameIndex];

    // Find the layer and update its pixels
    const newLayers = frame.layers.map((layer) => {
      if (layer.id !== layerId) return layer;

      const newPixels = layer.pixels.map((row, rowIndex) =>
        rowIndex === y
          ? row.map((pixel, colIndex) =>
              colIndex === x ? { ...color } : pixel,
            )
          : row,
      );

      return {
        ...layer,
        pixels: newPixels,
      };
    });

    newFrames[currentFrameIndex] = {
      ...frame,
      layers: newLayers,
    };

    setFrames(newFrames);
  };

  const addFrame = () => {
    setFrames([...frames, createEmptyFrame()]);
    setCurrentFrameIndex(frames.length);
  };

  const deleteFrame = (index: number) => {
    if (frames.length === 1) return; // Keep at least one frame
    const newFrames = frames.filter((_, i) => i !== index);
    setFrames(newFrames);
    if (currentFrameIndex >= newFrames.length) {
      setCurrentFrameIndex(newFrames.length - 1);
    }
  };

  const duplicateCurrentFrame = () => {
    const newFrame = duplicateFrame(currentFrame);
    const newFrames = [...frames];
    newFrames.splice(currentFrameIndex + 1, 0, newFrame);
    setFrames(newFrames);
    setCurrentFrameIndex(currentFrameIndex + 1);
  };

  const handleClearFrame = () => {
    const newFrames = [...frames];
    newFrames[currentFrameIndex] = clearFrame(currentFrame);
    setFrames(newFrames);
  };

  const handleNewProject = () => {
    if (
      confirm(
        "Start a new project? This will clear all frames and your current work.",
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      setFrames([createEmptyFrame()]);
      setCurrentFrameIndex(0);
      setSelectedColor({ r: 147, g: 51, b: 234 });
      setShowGrid(true);
    }
  };

  // Layer management
  const handleAddLayer = () => {
    const newFrames = [...frames];
    const newLayer = createEmptyLayer(
      `Layer ${currentFrame.layers.length + 1}`,
    );
    newFrames[currentFrameIndex] = {
      ...currentFrame,
      layers: [...currentFrame.layers, newLayer],
    };
    setFrames(newFrames);
    setActiveLayerId(newLayer.id);
  };

  const handleDeleteLayer = (layerId: string) => {
    if (currentFrame.layers.length === 1) {
      alert("Cannot delete the last layer!");
      return;
    }

    const newFrames = [...frames];
    newFrames[currentFrameIndex] = {
      ...currentFrame,
      layers: currentFrame.layers.filter((l) => l.id !== layerId),
    };
    setFrames(newFrames);

    // Set active layer to first remaining layer
    if (layerId === activeLayerId) {
      setActiveLayerId(newFrames[currentFrameIndex].layers[0].id);
    }
  };

  const handleToggleLayerVisibility = (layerId: string) => {
    const newFrames = [...frames];
    newFrames[currentFrameIndex] = {
      ...currentFrame,
      layers: currentFrame.layers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer,
      ),
    };
    setFrames(newFrames);
  };

  const handleDuplicateLayer = (layerId: string) => {
    const layer = currentFrame.layers.find((l) => l.id === layerId);
    if (!layer) return;

    const newLayer = duplicateLayer(layer);
    const newFrames = [...frames];
    newFrames[currentFrameIndex] = {
      ...currentFrame,
      layers: [...currentFrame.layers, newLayer],
    };
    setFrames(newFrames);
    setActiveLayerId(newLayer.id);
  };

  const handleShiftLayer = (layerId: string, direction: ShiftDirection) => {
    const layer = currentFrame.layers.find((l) => l.id === layerId);
    if (!layer) return;

    const shiftedLayer = shiftLayer(layer, direction, 1);
    const newFrames = [...frames];
    newFrames[currentFrameIndex] = {
      ...currentFrame,
      layers: currentFrame.layers.map((l) =>
        l.id === layerId ? shiftedLayer : l,
      ),
    };
    setFrames(newFrames);
  };

  const handleExportGIF = () => {
    try {
      // Generate GIF from frames
      const gifData = framesToGIF(frames, true);

      // Generate filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `lightmoji-${timestamp}.gif`;

      // Download the GIF
      downloadGIF(gifData, filename);
    } catch (error) {
      console.error("Failed to export GIF:", error);
      alert("Failed to export GIF. Check console for details.");
    }
  };

  return (
    <div className="lightmoji-studio">
      <header className="studio-header">
        <div className="header-content">
          <h1 className="studio-title">
            <span className="title-light">light</span>
            <span className="title-moji">moji</span>
          </h1>
          <div className="header-subtitle">
            <p className="studio-subtitle">by Claudia 💜</p>
            <span className="auto-save-indicator">💾 Auto-saved</span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="new-project-btn"
            type="button"
            onClick={handleNewProject}
            title="Start a new project"
          >
            <span className="btn-icon">🆕</span>
            New Project
          </button>
          <button
            className="export-btn"
            type="button"
            onClick={handleExportGIF}
          >
            <span className="btn-icon">✨</span>
            Export GIF
          </button>
        </div>
      </header>

      <div className="studio-workspace">
        <div className="canvas-area">
          <PixelCanvas
            frame={currentFrame}
            activeLayerId={activeLayerId}
            onPixelChange={handlePixelChange}
            selectedColor={selectedColor}
            selectedTool={selectedTool}
            showGrid={showGrid}
          />

          <div className="canvas-info">
            <span className="info-badge">60×26 pixels</span>
            <span className="info-badge">
              Frame {currentFrameIndex + 1} of {frames.length}
            </span>
          </div>
        </div>

        <aside className="tools-panel">
          <div className="panel-section">
            <h3 className="panel-title">Tools</h3>
            <div className="tool-buttons">
              <button
                type="button"
                className={`tool-btn ${selectedTool === "draw" ? "active" : ""}`}
                onClick={() => setSelectedTool("draw")}
              >
                <span className="tool-icon">✏️</span>
                Draw
              </button>
              <button
                type="button"
                className={`tool-btn ${selectedTool === "erase" ? "active" : ""}`}
                onClick={() => setSelectedTool("erase")}
              >
                <span className="tool-icon">🧹</span>
                Erase
              </button>
              <button
                type="button"
                className={`tool-btn ${selectedTool === "fill" ? "active" : ""}`}
                onClick={() => setSelectedTool("fill")}
              >
                <span className="tool-icon">🎨</span>
                Fill
              </button>
            </div>

            <div className="color-picker-section">
              <label htmlFor="color-picker" className="color-label">
                Color
              </label>
              <div className="color-picker-container">
                <input
                  id="color-picker"
                  type="color"
                  value={rgbToHex(selectedColor)}
                  onChange={(e) => setSelectedColor(hexToRgb(e.target.value))}
                  className="color-input"
                />
                <div
                  className="color-preview"
                  style={{ backgroundColor: rgbToHex(selectedColor) }}
                />
                <span className="color-hex">{rgbToHex(selectedColor)}</span>
              </div>
            </div>

            <div className="canvas-controls">
              <button
                type="button"
                className="control-btn"
                onClick={handleClearFrame}
              >
                Clear Frame
              </button>
              <button
                type="button"
                className="control-btn"
                onClick={() => setShowGrid(!showGrid)}
              >
                Grid {showGrid ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          <div className="panel-section">
            <LayersPanel
              layers={currentFrame.layers}
              activeLayerId={activeLayerId}
              onSelectLayer={setActiveLayerId}
              onToggleVisibility={handleToggleLayerVisibility}
              onDeleteLayer={handleDeleteLayer}
              onDuplicateLayer={handleDuplicateLayer}
              onShiftLayer={handleShiftLayer}
              onAddLayer={handleAddLayer}
            />
          </div>

          <div className="panel-section">
            <h3 className="panel-title">Timeline</h3>
            <div className="frames-list">
              {frames.map((frame, index) => (
                <button
                  key={frame.id}
                  type="button"
                  className={`frame-item ${index === currentFrameIndex ? "active" : ""}`}
                  onClick={() => setCurrentFrameIndex(index)}
                >
                  <span className="frame-number">F{index + 1}</span>
                  {/** biome-ignore lint/a11y/useKeyWithClickEvents: ignore */}
                  {/** biome-ignore lint/a11y/noStaticElementInteractions: ignore */}
                  <div
                    className="frame-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFrame(index);
                    }}
                  >
                    ×
                  </div>
                </button>
              ))}
              <button
                type="button"
                className="add-frame-btn"
                onClick={addFrame}
              >
                +
              </button>
            </div>

            <div className="frame-controls">
              <button
                type="button"
                className="control-btn"
                onClick={duplicateCurrentFrame}
              >
                Duplicate Frame
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
