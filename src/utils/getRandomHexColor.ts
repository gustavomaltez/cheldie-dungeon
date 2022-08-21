/**
 * Generates a hexadecimal color from the given string.
 * 
 * @param input A string to seed the hexadecimal color.
 * @returns A hexadecimal color generated from the input.
 */
export function getRandomHexColor(input: string) {
  const splittedInput = input.split('');
  const asciiInput = splittedInput.map(value => value.charCodeAt(0));

  const generatedSeed = asciiInput.reduce((seed, charCode) => {
    // Step 1: Generates a random number from the seed
    // This is important to avoid return the same color for words with the same
    // letters. 1000 is a random number, you can change it to whatever you want.
    const seedHash = Math.sqrt(seed * 1000);

    // Step 2: Increase the charCode value by powering the charcode by 10
    const charHash = Math.pow(charCode, 10); // Pow because we want to increase the value

    // Step 3: Sum the seedHash and the charHash
    return seed + seedHash + charHash;
  }, 0);

  const hexadecimalSeed = generatedSeed.toString(16);
  const hexadecimalColor = hexadecimalSeed.slice(0, 6).padStart(6, 'f');
  return hexadecimalColor;
}
