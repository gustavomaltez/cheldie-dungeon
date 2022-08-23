import { Logger, LoggerSettings } from './abstract';
import { BrowserLogger } from './BrowserLogger';

export { Logger };

type LoggerType = 'browser';

/**
 * Gets a logger instance by name.
 * 
 * @param settings The settings to be injected into the logger.
 * @param type The type of logger to be used.
 * @returns A logger instance.
 */
export function getLogger(settings: LoggerSettings, type: LoggerType): Logger {
  if (type === 'browser') return new BrowserLogger(settings);
  throw new Error(`Logger type "${type}" does not exist.`);
}