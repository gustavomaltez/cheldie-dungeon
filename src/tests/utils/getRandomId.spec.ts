import { getRandomId } from '@utils';

describe('Random Id Generation', () => {
  it('Should return a string.', () => {
    expect(typeof getRandomId()).toBe('string');
  });

  it('Should not return two equals ids after consecutive calls.', () => {
    const idA = getRandomId();
    const idB = getRandomId();
    expect(idA !== idB).toBeTruthy(); //ToDo: refactor this
  });

  it('Should return ids with always the same length.', () => {
    const idA = getRandomId();
    const idB = getRandomId();
    expect(idA.length === idB.length).toBeTruthy();
  });
});