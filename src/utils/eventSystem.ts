import { Callback } from '@types';

import { getRandomId } from './getRandomId';

/**
 * Represents a id associated to a callback
 */
type CallbackId = string;

/**
 * A simple event listener. Holds an id and a callback.
 */
type Listener = Record<CallbackId, Callback>;

/**
 * Represents a event type.
 */
type EventType = string;

/**
 * A set of listeners. An object containing an 
 * key-value pair of event type and listener
 */
type Listeners = Record<EventType, Listener>;

export class EventSystem<Type extends string> {

  private listeners: Listeners = {};

  /**
   * Triggers an event.
   * This will execute all the callbacks associated to the event type.
   * 
   * @param type The event type to be triggered.
   */
  public trigger(type: Type): void {
    if (!this.listeners[type]) return;
    const listenersByType = this.listeners[type];
    const listenersIds = Object.keys(listenersByType);
    listenersIds.forEach((id) => listenersByType[id]());
  }

  /**
   * Registers a callback to an event type.
   * 
   * @param type The event type to be listened.
   * @param callback A callback to be executed when the event is triggered.
   * @returns A function to remove the listener.
   */
  public on(type: Type, callback: Callback): Callback {
    if (!this.listeners[type]) this.listeners[type] = {};
    const id = getRandomId();
    this.listeners[type][id] = callback;
    return () => delete this.listeners[type][id];
  }

  /**
   * Registers a callback to an event type that will be executed only once.
   * 
   * @param type The event type to be listened.
   * @param callback A callback to be executed when the event is triggered.
   */
  public once(type: Type, callback: Callback) {
    if (!this.listeners[type]) this.listeners[type] = {};
    const id = getRandomId();
    this.listeners[type][id] = () => {
      callback();
      delete this.listeners[type][id];
    };
  }
}