import { getLogger, Logger } from '@engine/services';

describe('Get Logger', () => {
  it('Should allow to get a logger by name.', () => {
    const logger = getLogger('browser');
    expect(logger).toBeDefined();
  });

  it('Should throw an error if the logger type is invalid.', () => {
    expect(() => getLogger('unknown' as any)).toThrowError();
  });

  it('Should return a logger instance.', () => {
    const logger = getLogger('browser');
    expect(new logger({ owner: 'test' })).toBeDefined();
  });

  it('Should return a valid logger instance.', () => {
    const BrowserLogger = getLogger('browser');
    expect(new BrowserLogger({ owner: 'test' })).toBeInstanceOf(Logger);
  });
});