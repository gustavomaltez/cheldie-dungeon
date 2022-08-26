
/**
 * Generates a unique string of characters.
 */
export function getRandomId(): string {
  const start = (Date.now() * Math.random() * 1000).toString(36);
  const end = (Math.random() * 10000).toString(36);
  return (start + end).slice(0, 20);
}