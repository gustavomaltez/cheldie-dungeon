import { nanoid } from 'nanoid';

/**
 * Generates a unique string of characters.
 */
export function getRandomId(): string {
  return nanoid();
}