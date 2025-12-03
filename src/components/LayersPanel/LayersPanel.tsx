// LayersPanel - Like Photoshop! 💜✨
import type { Layer } from "../../types/lightmoji";
import type { ShiftDirection } from "../../utils/layer-transform";
import "./LayersPanel.css";

interface LayersPanelProps {
  layers: Layer[];
  activeLayerId: string;
  onSelectLayer: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  onDuplicateLayer: (layerId: string) => void;
  onShiftLayer: (layerId: string, direction: ShiftDirection) => void;
  onAddLayer: () => void;
}

export function LayersPanel({
  layers,
  activeLayerId,
  onSelectLayer,
  onToggleVisibility,
  onDeleteLayer,
  onDuplicateLayer,
  onShiftLayer,
  onAddLayer,
}: LayersPanelProps) {
  return (
    <div className="layers-panel">
      <h3 className="panel-title">Layers</h3>

      <div className="layers-list">
        {/* Render layers top-to-bottom (reversed for display) */}
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            className={`layer-item ${layer.id === activeLayerId ? "active" : ""}`}
          >
            <button
              type="button"
              className="layer-visibility"
              onClick={() => onToggleVisibility(layer.id)}
              title={layer.visible ? "Hide layer" : "Show layer"}
            >
              {layer.visible ? "👁️" : "🚫"}
            </button>

            <button
              type="button"
              className="layer-content"
              onClick={() => onSelectLayer(layer.id)}
            >
              <span className="layer-name">{layer.name}</span>
            </button>

            {/* Shift controls - only show for active layer */}
            {layer.id === activeLayerId && (
              <div className="layer-shift-controls">
                <button
                  type="button"
                  className="shift-btn"
                  onClick={() => onShiftLayer(layer.id, "up")}
                  title="Shift up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="shift-btn"
                  onClick={() => onShiftLayer(layer.id, "down")}
                  title="Shift down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="shift-btn"
                  onClick={() => onShiftLayer(layer.id, "left")}
                  title="Shift left"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="shift-btn"
                  onClick={() => onShiftLayer(layer.id, "right")}
                  title="Shift right"
                >
                  →
                </button>
              </div>
            )}

            <div className="layer-actions">
              <button
                type="button"
                className="layer-action-btn"
                onClick={() => onDuplicateLayer(layer.id)}
                title="Duplicate layer"
              >
                📋
              </button>
              <button
                type="button"
                className="layer-action-btn"
                onClick={() => onDeleteLayer(layer.id)}
                title="Delete layer"
                disabled={layers.length === 1}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="add-layer-btn" onClick={onAddLayer}>
        <span className="btn-icon">+</span>
        Add Layer
      </button>
    </div>
  );
}
