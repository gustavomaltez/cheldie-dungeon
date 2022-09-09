import { Logger } from './abstract';
import { BrowserLogger } from './BrowserLogger';

type LoggerType = 'browser';

/**
 * Gets a logger by name.
 * 
 * @param type The type of logger to be used.
 * @returns A logger instance.
 */
export function getLogger(type: LoggerType): (new (settings: { owner: string }) => Logger) {
  if (type === 'browser') return BrowserLogger;
  throw new Error(`Unknown logger type: ${type}`);
}
