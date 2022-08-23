import { CanvasInfo, DrawingEngine, DrawingEngineSettings } from './abstract';

export class CanvasDrawingEngine extends DrawingEngine {
  public canvasInfo: CanvasInfo;

  constructor(settings: DrawingEngineSettings) {
    super(settings);
    this.canvasInfo = {
      width: 0,
      height: 0,
    };
  }
}