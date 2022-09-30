import { Logger } from '@engine/services';

export type DrawingEngineSettings = {
  logger: Logger;
};

export type Size = {
  width: number;
  height: number;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Represents a drawing engine.
 * 
 * All drawing engines **MUST** extend this class.
 */
export abstract class DrawingEngine {

  protected isInitialized = false;

  constructor(protected settings: DrawingEngineSettings) {
    this.settings = settings;
  }

  /**
   * Async method to initialized the drawing engine.
   * - You **MUST** call this method before using the drawing engine.
   */
  public abstract initialize(): Promise<void>;

  /**
   * Changes the canvas width and height to the given value.
   * @param size New canvas size.
   */
  public abstract resize(size: Size): void;

  /**
   * Returns the current canvas dimensions.
   */
  public abstract get dimensions(): Size;

  /**
   * Clears canvas content (removes everything that is on canvas)
   */
  public abstract clear(): void;

  /**
   * Drawn a rectangle on canvas.
   * 
   * @param rect Rectangle size and position.
   * @param fillStyle Optional. Fill style to use when drawing the rectangle. 
   */
  public abstract drawRect(rect: Rect, fillStyle?: string): void;
}