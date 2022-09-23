import { getLogger } from '@engine/services';

describe('Browser Logger', () => {
  describe('Instantiation', () => {
    it('Should allow to get a BrowserLogger constructor using getLogger.', () => {
      const BrowserLogger = getLogger('browser');
      expect(BrowserLogger).toBeDefined();
    });

    it('Should allow to instantiate a BrowserLogger.', () => {
      const BrowserLogger = getLogger('browser');
      expect(new BrowserLogger({ owner: 'test' })).toBeDefined();
    });
  });

  describe('Methods', () => {
    it('Should allow to log a message without data.', () => {
      const BrowserLogger = getLogger('browser');
      const logger = new BrowserLogger({ owner: 'test' });
      expect(() => logger.info('test')).not.toThrowError();
    });

    it('Should allow to log a message with data.', () => {
      const BrowserLogger = getLogger('browser');
      const logger = new BrowserLogger({ owner: 'test' });
      expect(() => logger.info('test', { foo: 'bar' })).not.toThrowError();
    });

    it('Should allow to log a warning without data.', () => {
      const BrowserLogger = getLogger('browser');
      const logger = new BrowserLogger({ owner: 'test' });
      expect(() => logger.warn('test')).not.toThrowError();
    });

    it('Should allow to log a warning with data.', () => {
      const BrowserLogger = getLogger('browser');
      const logger = new BrowserLogger({ owner: 'test' });
      expect(() => logger.warn('test', { foo: 'bar' })).not.toThrowError();
    });

    it('Should allow to log an error without data.', () => {
      const BrowserLogger = getLogger('browser');
      const logger = new BrowserLogger({ owner: 'test' });
      expect(() => logger.error('test')).not.toThrowError();
    });

    it('Should allow to log an error with data.', () => {
      const BrowserLogger = getLogger('browser');
      const logger = new BrowserLogger({ owner: 'test' });
      expect(() => logger.error('test', { foo: 'bar' })).not.toThrowError();
    });
  });

  describe('Console Data Logging', () => {
    describe('Message Only', () => {
      it('Should log data to the console.', () => {
        const BrowserLogger = getLogger('browser');
        const logger = new BrowserLogger({ owner: 'JestOwner' });
        const spy = jest.spyOn(console, 'log');
        logger.info('JestInfo');
        const firstParam = spy.mock.calls[0][0];
        expect(firstParam.includes('JestInfo')).toBeTruthy();
        expect(firstParam.includes('JestOwner')).toBeTruthy();
      });

      it('Should log warnings to the console.', () => {
        const BrowserLogger = getLogger('browser');
        const logger = new BrowserLogger({ owner: 'JestOwner' });
        const spy = jest.spyOn(console, 'log');
        logger.warn('JestWarn');
        const firstParam = spy.mock.calls[0][0];
        expect(firstParam.includes('JestWarn')).toBeTruthy();
        expect(firstParam.includes('JestOwner')).toBeTruthy();
      });

      it('Should log errors to the console.', () => {
        const BrowserLogger = getLogger('browser');
        const logger = new BrowserLogger({ owner: 'JestOwner' });
        const spy = jest.spyOn(console, 'log');
        logger.error('JestError');
        const firstParam = spy.mock.calls[0][0];
        expect(firstParam.includes('JestError')).toBeTruthy();
        expect(firstParam.includes('JestOwner')).toBeTruthy();
      });
    });

    describe('Message With Data', () => {
      it('Should log info data to the console.', () => {
        const BrowserLogger = getLogger('browser');
        const logger = new BrowserLogger({ owner: 'JestOwner' });
        const spy = jest.spyOn(console, 'log');
        const dataToLog = { foo: 'bar', test: true };
        const stringifiedDataToLog = JSON.stringify(dataToLog);
        logger.info('JestInfo', dataToLog);
        const params = spy.mock.calls[0];
        const includesData = params.some(data => JSON.stringify(data) === stringifiedDataToLog);
        expect(includesData).toBe(true);
      });

      it('Should log warning data to the console.', () => {
        const BrowserLogger = getLogger('browser');
        const logger = new BrowserLogger({ owner: 'JestOwner' });
        const spy = jest.spyOn(console, 'log');
        const dataToLog = { foo: 'bar', test: true };
        const stringifiedDataToLog = JSON.stringify(dataToLog);
        logger.warn('JestWarn', dataToLog);
        const params = spy.mock.calls[0];
        const includesData = params.some(data => JSON.stringify(data) === stringifiedDataToLog);
        expect(includesData).toBe(true);
      });

      it('Should log error data to the console.', () => {
        const BrowserLogger = getLogger('browser');
        const logger = new BrowserLogger({ owner: 'JestOwner' });
        const spy = jest.spyOn(console, 'log');
        const dataToLog = { foo: 'bar', test: true };
        const stringifiedDataToLog = JSON.stringify(dataToLog);
        logger.error('JestError', dataToLog);
        const params = spy.mock.calls[0];
        const includesData = params.some(data => JSON.stringify(data) === stringifiedDataToLog);
        expect(includesData).toBe(true);
      });
    });
  });
});