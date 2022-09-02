/**
 * Creates a new array of bytes with the approximated amount of bits
 * - 1 Byte equals to 8 bits.
 * - If you call this function with 10 bits, it will create a Uint8Array of 2
 * bytes, because 10 bits needs at least 2 bytes do be stored.
 * 
 * @param amountOfBits Amount of bits to store in the array.
 * @returns Uint8Array with the amount of bytes needed to store the bits.
 */
export function createBitMask(amountOfBits: number): Uint8Array {
  const bytes = Math.ceil(amountOfBits / 8);
  const array = new Uint8Array(bytes);
  return array;
}

/**
 * Sets a bit to 0 or 1 in the bitmask.
 * @param mask Bitmask to set the bit in.
 * @param bit Position of the bit to check.
 * @param value Value to set the bit to.
 */
export function setFlagOnMask(mask: Uint8Array, bit: number, value: boolean): void {
  const byte = Math.floor(bit / 8);
  const bitInByte = bit % 8;
  const maskByte = mask[byte];
  if (value)
    mask[byte] = maskByte | (1 << bitInByte);
  else
    mask[byte] = maskByte & ~(1 << bitInByte);
}

/**
 * Returns the value of a bit in the bitmask.
 * 
 * @param mask Bitmask to check the bit in.
 * @param bit Position of the bit to check.
 * @returns Whether the bit is set to 1 or not.
 */
export function getFlagOnMask(mask: Uint8Array, bit: number): boolean {
  const byte = Math.floor(bit / 8);
  const bitInByte = bit % 8;
  const maskByte = mask[byte];
  return (maskByte & (1 << bitInByte)) !== 0;
}