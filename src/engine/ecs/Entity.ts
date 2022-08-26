import { getRandomId } from '@utils';

import { Component } from './Component';

export abstract class Entity {
  public readonly id: string;
  private _components: Record<string, Component> = {};

  constructor() {
    this.id = getRandomId();
  }

  public getComponent<ComponentType extends Component>(component: new () => ComponentType): ComponentType {
    const _component = this._components[component.prototype.constructor.name];
    if (!_component) throw new Error(`Entity ${this.id} has no component ${component.constructor.name}`);
    return _component as ComponentType;
  }

  public get components(): Record<string, Component> {
    return this._components;
  }

  public addComponent(component: Component): void {
    component.entity = this;
    this._components[component.constructor.name] = component;
  }

  public removeComponent(component: Component): void {
    delete this._components[component.constructor.name];
  }
}