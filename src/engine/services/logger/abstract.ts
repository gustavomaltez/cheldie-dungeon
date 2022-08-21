// Types -----------------------------------------------------------------------

export type LoggerSettings = {
  /**
   * The name of the service that is using the logger.
   */
  owner: string;
};

// Abstraction -----------------------------------------------------------------

/**
 * Represents a logger service.
 * 
 * All logger services **MUST** extend this class.
 */
export abstract class Logger {

  constructor(protected settings: LoggerSettings) { }

  /**
   * Logs a informative message.
   * 
   * @param message The message to be logged.
   * @param data Optional data to be logged.
   */
  public abstract info(message: string, data?: unknown): void;

  /**
   * Logs a warning message.
   * 
   * @param message The message to be logged.
   * @param data Optional data to be logged.
   */
  public abstract warn(message: string, data?: unknown): void;

  /**
   * Logs an error message.
   * 
   * @param message The message to be logged.
   * @param data Optional data to be logged.
   */
  public abstract error(message: string, data?: unknown): void;
}
