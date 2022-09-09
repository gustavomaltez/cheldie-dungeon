import { createBitMask, getFlagOnMask, setFlagOnMask } from '@utils';

describe('Bitmasks', () => {
  describe('Creation', () => {
    it('Should create a bitmask as a Uint8Array.', () => {
      const mask = createBitMask(10);
      expect(mask).toBeInstanceOf(Uint8Array);
    });

    it('Should create a bitmask with the correct amount of bytes.', () => {
      const mask = createBitMask(10);
      expect(mask.length).toBe(2);
    });
  });

  describe('Flags', () => {

    describe('Initial Values', () => {
      it('Should have all flags set to false.', () => {
        const mask = createBitMask(10);
        for (let i = 0; i < 10; i++) {
          expect(getFlagOnMask(mask, i)).toBe(false);
        }
      });
    });

    describe('Setting', () => {
      it('Should allow to set a flag value.', () => {
        const mask = createBitMask(10);
        expect(() => setFlagOnMask(mask, 0, true)).not.toThrow();
      });

      it('Should correctly set a flag value to true.', () => {
        const mask = createBitMask(10);
        setFlagOnMask(mask, 0, true);
        expect((mask[0] & (1 << 0))).toBe(1);
      });

      it('Should correctly set a flag value to false.', () => {
        const mask = createBitMask(10);
        setFlagOnMask(mask, 0, false);
        expect((mask[0] & (1 << 0))).toBe(0);
      });
    });

    describe('Getting', () => {
      it('Should allow to get the value of a flag.', () => {
        const mask = createBitMask(10);
        setFlagOnMask(mask, 0, true);
        expect(() => getFlagOnMask(mask, 0)).not.toThrow();
      });

      it('Should correctly get the value of a flag.', () => {
        const mask = createBitMask(10);
        setFlagOnMask(mask, 0, true);
        const value = getFlagOnMask(mask, 0);
        expect(value).toBe(true);
      });
    });

    describe('Values out of bounds', () => {
      it('Should not throw an error when getting a flag that is out of bounds.', () => {
        const mask = createBitMask(10);
        expect(() => getFlagOnMask(mask, 10)).not.toThrow();
      });

      it('Should return false when getting a flag that is out of bounds.', () => {
        const mask = createBitMask(10);
        const value = getFlagOnMask(mask, 10);
        expect(value).toBe(false);
      });
    });
  });
});