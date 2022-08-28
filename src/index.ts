import { getRandomId } from '@utils';

export { };

type Constructor<Data> = new (data: Data) => Data;
type GetComponent = <Component extends Constructor<any>>(component: Component) => InstanceType<Component>;

class Query {
  private isEmpty = true;
  public results: Record<string, GetComponent> = {};
  constructor(
    public readonly query: Constructor<unknown>[],
    private readonly world: World,
  ) { }

  // Returns an array of entities that have all the components specified in the query.
  public execute() {
    const entitiesKeys = Object.keys(this.world.entities);
    const queryableComponents = this.query.map(component => this.world.components[component.prototype.name]);
    const components = Object.values(queryableComponents);

    for (const entityKey of entitiesKeys) {
      if (components.every(component => component[entityKey] !== undefined))
        this.results[entityKey] = this.world.entities[entityKey];
    }

    if (!this.isEmpty) this.isEmpty = Object.keys(this.results).length === 0;
  }

  refresh(entityId: string): void {
    console.log('refresh', entityId);
    if (this.isEmpty) return this.execute();
    if (this.results[entityId] === undefined) return; // No need to refresh if the entity is not in the query results.

    // Remove the entity from the query results if it doesn't have all the components specified in the query.
    if (this.query.some(component => this.world.components[component.name][entityId] === undefined))
      delete this.results[entityId];
  }
}


export abstract class System {

  protected abstract readonly queries: Record<string, Query>;

  constructor(
    protected readonly world: World,
  ) { }

  abstract update(dt: number): void;
}



export class World {
  /**
   * Hashmap of components.
   * - Key: component name
   * - Value: hashmap of entities with the component attached to them.
   * - Example:
   * 
   * {
   *  {
   *   Health: {
   *      entityA: Health,
   *      entityJ: Health,
   *      entityN: Health,
   *   },
   *   Position: {
   *    entityX: Position,
   *    entityA: Position,
   *    entityP: Position,
   *    entityL: Position,
   *   },
   * }
   */
  components: Record<string, Record<string, object>> = {};
  entities: Record<string, GetComponent> = {};
  systems: Record<string, System> = {};
  queries: { [key: string]: Query; } = {};

  constructor() {
    // Methods binding
    this.createEntity = this.createEntity.bind(this);
    this.removeEntity = this.removeEntity.bind(this);
    this.createComponent = this.createComponent.bind(this);
    // this.removeComponent = this.removeComponent.bind(this);
    this.createQuery = this.createQuery.bind(this);
  }
  // Entity

  public createEntity() {
    const entityId = getRandomId();

    this.entities[entityId] = <Component extends Constructor<any>>(_component: Component) => {
      const component = this.components[_component.prototype.name][entityId];
      if (component === undefined) throw new Error(`Entity ${entityId} does not have component ${name}`);
      return component as InstanceType<Component>;
    };

    return {
      id: entityId,
      addComponent: (component: InstanceType<any>) => {
        const componentName = component.constructor.prototype.name;
        if (this.components[componentName] === undefined) this.components[componentName] = {};
        this.components[componentName][entityId] = component;

        for (const queryId in this.queries) {
          const query = this.queries[queryId];
          query.refresh(entityId);
        }
      },
      removeComponent: (name: string) => {
        // ToDo: add logic to check if component is attached to the entity.
        delete this.components[name][entityId];

        for (const queryId in this.queries) {
          const query = this.queries[queryId];
          query.refresh(entityId);
        }
      }
    };
  }

  public removeEntity(entity: string): void {
    // Remove all components associated with the entity.
    for (const component in this.components) {
      const entities = this.components[component];
      delete entities[entity];
    }
  }

  // Component

  public createComponent<Data extends object>(): Constructor<Data> {
    const id = getRandomId();
    this.components[id] = {};

    class Component<Properties extends object> {

      constructor(properties: Properties) {
        Object.assign(this, properties);
      }
    }

    const constructor = Component as Constructor<Data>;
    constructor.prototype.name = id;

    return constructor;
  }

  // Queries

  public createQuery(components: Constructor<any>[]): Query {
    const queryId = components.sort((a, b) => {
      if (a.prototype.name < b.prototype.name) return -1;
      if (a.prototype.name > b.prototype.name) return 1;
      return 0;
    }).map(component => component.prototype.name).join('/');
    if (this.queries[queryId] === undefined) this.queries[queryId] = new Query(components, this);
    return this.queries[queryId];
  }

  public removeQuery(queryId: string) {
    delete this.queries[queryId];
  }

  // Systems

  public addSystem(_System: new (world: World) => System) {
    this.systems[_System.prototype.constructor.name] = new _System(this);
  }

  public removeSystem(system: System) {
    delete this.systems[system.constructor.name];
  }
}


