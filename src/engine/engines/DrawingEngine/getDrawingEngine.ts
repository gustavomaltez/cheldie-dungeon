import { DrawingEngineSettings } from './abstract';
import { CanvasDrawingEngine } from './CanvasDrawingEngine';

type DrawingEngineType = 'canvas';

/**
 * Gets a drawing engine by name.
 * 
 * @param type The type of drawing engine to be used.
 * @returns A drawing engine instance.
 */
export function getDrawingEngine(type: DrawingEngineType): (new (settings: DrawingEngineSettings) => CanvasDrawingEngine) {
  if (type === 'canvas') return CanvasDrawingEngine;
  throw new Error(`Unknown drawing engine type: ${type}`);
}
