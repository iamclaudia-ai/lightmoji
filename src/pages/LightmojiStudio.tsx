// lightmoji Studio - Where the magic happens! ✨💜
import { useEffect, useState } from "react";
import { PixelCanvas } from "../components/PixelCanvas/PixelCanvas";
import type { Frame, RGB, Tool } from "../types/lightmoji";
import {
  clearFrame,
  createEmptyFrame,
  duplicateFrame,
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
        return JSON.parse(stored);
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

  const currentFrame = frames[currentFrameIndex];

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

  const handlePixelChange = (x: number, y: number, color: RGB) => {
    const newFrames = [...frames];
    const newPixels = newFrames[currentFrameIndex].pixels.map(
      (row, rowIndex) =>
        rowIndex === y
          ? row.map((pixel, colIndex) =>
              colIndex === x ? { ...color } : pixel,
            )
          : row,
    );
    newFrames[currentFrameIndex] = {
      ...newFrames[currentFrameIndex],
      pixels: newPixels,
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
          <button className="export-btn" type="button">
            <span className="btn-icon">✨</span>
            Export GIF
          </button>
        </div>
      </header>

      <div className="studio-workspace">
        <div className="canvas-area">
          <PixelCanvas
            frame={currentFrame}
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
