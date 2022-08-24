import { EventSystem } from '@utils';

describe('Event System', () => {
  it('Should return a valid event system instance.', () => {
    const eventSystem = new EventSystem();
    expect(eventSystem).toBeDefined();
  });

  it('Should the instance returned should be an instance of EventSystem.', () => {
    const eventSystem = new EventSystem();
    expect(eventSystem instanceof EventSystem).toBeTruthy();
  });

  it('Should allow to trigger a predefined event.', () => {
    const eventSystem = new EventSystem<'foo' | 'bar'>();
    expect(() => eventSystem.trigger('foo')).not.toThrow();
  });

  it('Should execute the callback associated to the event triggered', () => {
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

  it('Should allow to unregister a callback.', () => {
    const eventSystem = new EventSystem<'foo' | 'bar'>();
    const callback = jest.fn();
    const unregister = eventSystem.on('foo', callback);
    expect(() => unregister()).not.toThrow();
  });

  it('Should not execute the callback of a unregistered event listener.', () => {
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
});