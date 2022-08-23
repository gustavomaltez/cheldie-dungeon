import { Logger } from '@engine/services';

export type DrawingEngineSettings = {
  logger: Logger;
};

export type CanvasInfo = {
  width: number;
  height: number;
};

export abstract class DrawingEngine {

  constructor(protected settings: DrawingEngineSettings) {
    this.settings = settings;
  }

  public abstract canvasInfo: CanvasInfo;
}