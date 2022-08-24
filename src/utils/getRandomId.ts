
/**
 * Generates a unique string of characters.
 */
export function getRandomId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}