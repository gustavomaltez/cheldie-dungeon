import { getRandomId } from '@utils';

import { Entity } from './Entity';
import { System } from './System';

export class World {
  public readonly id: string;
  private _entities: Record<string, Entity> = {};
  private _systems: Record<string, System> = {};

  constructor() {
    this.id = getRandomId();
  }

  // Entities ------------------------------------------------------------------

  public get entities(): Record<string, Entity> {
    return this._entities;
  }

  public addEntity(entity: Entity): void {
    this._entities[entity.id] = entity;
  }

  public removeEntity(entity: Entity): void {
    delete this._entities[entity.id];
  }

  // Systems -------------------------------------------------------------------

  public get systems(): Record<string, System> {
    return this._systems;
  }

  public addSystem(system: System): void {
    system.world = this;
    this._systems[system.constructor.name] = system;
  }

  public removeSystem(system: System): void {
    delete this._systems[system.constructor.name];
  }
}