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
    // Gets the list of ids of all entities
    const entitiesKeys = Object.keys(this.world.entities);


    for (const entityKey of entitiesKeys) {
      let shouldAdd = true;
      for (const component of this.query) {
        if (this.world.components[component.prototype.name][entityKey] === undefined)
          shouldAdd = false;
      }

      if (shouldAdd) this.results[entityKey] = this.world.entities[entityKey];
    }

    if (this.isEmpty) this.isEmpty = Object.keys(this.results).length === 0;
  }

  refresh(entityId: string): void {
    // console.trace(`Refreshing query for entity ${entityId}`);
    if (this.isEmpty) return this.execute();

    let shouldAdd = true;
    for (const component of this.query) {
      if (this.world.components[component.prototype.name][entityId] === undefined)
        shouldAdd = false;
    }

    if (shouldAdd) this.results[entityId] = this.world.entities[entityId];
    else delete this.results[entityId];
  }

  runForEach(callback: (entity: GetComponent) => void): void {
    for (const entity of Object.values(this.results)) {
      callback(entity);
    }
  }
}


export abstract class System {

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

    // Function to get the component of a given type.
    this.entities[entityId] = <Component extends Constructor<any>>(_component: Component) => {
      const component = this.components[_component.prototype.name][entityId];
      if (component === undefined) throw new Error(`Entity ${entityId} does not have component ${name}`);
      return component as InstanceType<Component>;
    };

    return {
      id: entityId,
      addComponent: (data: InstanceType<any> | InstanceType<any>[]) => {
        const components = Array.isArray(data) ? data : [data];

        for (const component of components) {
          const id = component.constructor.prototype.name;
          this.components[id][entityId] = component;
        }

        const componentsToRefresh = components.map(component => component.constructor.prototype.name);


        for (const queryId in this.queries) {
          const query = this.queries[queryId];

          for (const component of query.query) {
            if (componentsToRefresh.includes(component.prototype.name)) {
              query.refresh(entityId);
              break;
            }
          }
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


