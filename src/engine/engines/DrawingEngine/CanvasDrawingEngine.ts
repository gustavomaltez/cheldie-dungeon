import { DrawingEngine, DrawingEngineSettings, Rect, Size } from './abstract';

/**
 * A canvas drawing engine implementation that uses the HTML5 canvas element.
 */
export class CanvasDrawingEngine extends DrawingEngine {

  private _canvas: HTMLCanvasElement | null = null;

  constructor(settings: DrawingEngineSettings) {
    super(settings);

    // Methods binding to avoid losing the context -----------------------------
    this.initialize = this.initialize.bind(this);
    this.resize = this.resize.bind(this);
    this.clear = this.clear.bind(this);
    this.drawRect = this.drawRect.bind(this);
  }

  // Initialization ------------------------------------------------------------

  public initialize(): Promise<void> {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = 0;
    newCanvas.height = 0;
    const root = document.getElementById('root');
    if (!root) throw new Error('Root element not found');
    root.appendChild(newCanvas);
    this._canvas = newCanvas;
    this.isInitialized = true;
    return Promise.resolve();
  }

  // Size ----------------------------------------------------------------------

  public resize(size: Size): void {
    if (!this.canvas) throw new Error('Canvas not initialized');
    this.canvas.width = size.width;
    this.canvas.height = size.height;
  }

  public get dimensions(): Size {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    };
  }

  // Drawing -------------------------------------------------------------------

  public clear(): void {
    if (!this.canvas) throw new Error('Canvas not initialized');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to get canvas context');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public drawRect(rect: Rect, fillStyle?: string): void {
    if (fillStyle) this.getCanvasContext().fillStyle = fillStyle;
    this.getCanvasContext().fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  // Helpers -------------------------------------------------------------------

  private get canvas(): HTMLCanvasElement {
    if (!this._canvas) throw new Error('Unable to retrieve canvas. Call `canvasEngine.initialize()` first.');
    return this._canvas;
  }

  private getCanvasContext(): CanvasRenderingContext2D {
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Unable to get canvas context');
    return context;
  }
}