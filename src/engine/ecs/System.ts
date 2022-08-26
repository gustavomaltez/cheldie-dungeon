import { World } from './World';

export abstract class System {
  private _world: World | null = null;

  abstract update(deltaTime: number): void;

  public get world(): World {
    if (!this._world) throw new Error('System has no world');
    return this._world;
  }

  public set world(world: World) {
    this._world = world;
  }
}