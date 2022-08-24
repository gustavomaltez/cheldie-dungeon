import { getRandomHexColor } from '@utils';

describe('Random Hex Color Utility Function', () => {

  it('should return a string.', () => {
    expect(typeof getRandomHexColor('testing')).toBe('string');
  });

  it('Should return an hexadecimal string.', () => {
    expect(getRandomHexColor('testing')).toMatch(/^[0-9A-F]{6}$/i);
  });

  it('Should return an string whit 6 characters.', () => {
    expect(getRandomHexColor('testing').length).toBe(6);
  });
});