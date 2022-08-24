import { EventSystem } from '@utils';

describe('Event System', () => {

  describe('Instantiation', () => {
    it('Should return a valid event system instance.', () => {
      const eventSystem = new EventSystem();
      expect(eventSystem).toBeDefined();
    });

    it('Should the instance returned should be an instance of EventSystem.', () => {
      const eventSystem = new EventSystem();
      expect(eventSystem instanceof EventSystem).toBeTruthy();
    });
  });

  describe('Event Triggering', () => {
    it('Should allow to trigger a predefined event.', () => {
      const eventSystem = new EventSystem<'foo' | 'bar'>();
      expect(() => eventSystem.trigger('foo')).not.toThrow();
    });

    it('Should execute the callback associated to the event triggered.', () => {
      const eventSystem = new EventSystem<'foo' | 'bar'>();
      const callback = jest.fn();
      eventSystem.on('foo', callback);
      eventSystem.trigger('foo');
      expect(callback).toHaveBeenCalled();
    });

    it('Should execute the callback only one time if the event was triggered only one time.', () => {
      const eventSystem = new EventSystem<'foo' | 'bar'>();
      const callback = jest.fn();
      eventSystem.on('foo', callback);
      eventSystem.trigger('foo');
      expect(callback).toBeCalledTimes(1);
    });
  });

  describe('Event Unregistration', () => {
    it('Should allow to unregister a callback.', () => {
      const eventSystem = new EventSystem<'foo' | 'bar'>();
      const callback = jest.fn();
      const unregister = eventSystem.on('foo', callback);
      expect(() => unregister()).not.toThrow();
    });

    it('Should not execute the callback that was previously unregistered.', () => {
      const eventSystem = new EventSystem<'foo' | 'bar'>();
      const callback = jest.fn();
      const unregister = eventSystem.on('foo', callback);
      unregister();
      eventSystem.trigger('foo');
      expect(callback).not.toBeCalled();
    });

    it('Should not unregister the callbacks associated with other events.', () => {
      const eventSystem = new EventSystem<'foo' | 'bar'>();
      const fooCallback = jest.fn();
      const barCallback = jest.fn();
      const unregisterFoo = eventSystem.on('foo', fooCallback);
      eventSystem.on('bar', barCallback);
      unregisterFoo();
      eventSystem.trigger('foo');
      eventSystem.trigger('bar');
      expect(barCallback).toBeCalledTimes(1);
    });

    it('Should unregister only the callback associated to the unregistered listener.', () => {
      const eventSystem = new EventSystem<'test'>();
      const callbackA = jest.fn();
      const callbackB = jest.fn();
      const unregisterCallbackA = eventSystem.on('test', callbackA);
      unregisterCallbackA();
      eventSystem.on('test', callbackB);
      eventSystem.trigger('test');
      expect(callbackB).toBeCalledTimes(1);
    });
  });

  describe('Call Order', () => {
    it('Should execute the callbacks following the creation order.', () => {
      const eventSystem = new EventSystem<'test'>();
      const callOrder: string[] = [];

      eventSystem.on('test', () => callOrder.push('t'));
      eventSystem.on('test', () => callOrder.push('e'));
      eventSystem.on('test', () => callOrder.push('s'));
      eventSystem.on('test', () => callOrder.push('t'));
      eventSystem.trigger('test');

      expect(callOrder.join('')).toBe('test');
    });
  });

  describe('Single Execution Callbacks', () => {
    it('Should allow to create a event listener that will be executed only once.', () => {
      const eventSystem = new EventSystem<'test'>();
      expect(() => eventSystem.once('test', jest.fn())).not.toThrow();
    });

    it('Should execute only one time a callback registered with the once method.', () => {
      const eventSystem = new EventSystem<'test'>();
      const callback = jest.fn();
      eventSystem.once('test', callback);
      eventSystem.trigger('test');
      eventSystem.trigger('test');
      expect(callback).toBeCalledTimes(1);
    });
  });
});