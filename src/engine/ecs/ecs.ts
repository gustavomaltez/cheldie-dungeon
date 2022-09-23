import { createBitMask, createIdSystem, getFlagOnMask, setFlagOnMask } from '@utils';

// Defaults --------------------------------------------------------------------

const MAX_ENTITIES_COUNT = 10000;

// Types -----------------------------------------------------------------------

type ComponentArrayConstructor = Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor | BigInt64ArrayConstructor | BigUint64ArrayConstructor;
type ComponentArrayData = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

type ComponentDefinition = Record<string, ComponentArrayConstructor>;
type ComponentData = Record<string, ComponentArrayData>;


/**
 * Represents a system.
 * 
 * - A system is a special function that is called before each render.
 * - You can create a system by calling `world.system.create`.
 * TODO: Finish this doc.
 */
type System = (
  /**
   * Represents a hash map of all existing queries in the world, and which components they contain.
   * e.g: { drawable: [position, velocity, size, color] }
   * e.g: { 0: [2, 7, 3, 9] }
   * - Keep in mind that everything (components, queries, entities) are 
   * identified by their numeric id, that's why you should store your queries, 
   * components, entities in variables to have a better readability.
   */
  queries: Record<number, Uint16Array>,

  /**
   * Represents a hash map of all existing components in the world, and its data.
   * e.g: { position: { x: [0, 0], y: [0,0] } }
   * - It can be used to access the data of a specific entity's component.
   * - Let's say you want to access the position of the entity with id 0.
   * - You can do it like this: components[position].x[0] and components[position].y[0]
   * - The syntax is pretty simple: components[componentId].componentProperty[entityId]
   */
  components: Record<number, ComponentData>,

  /**
   * Represents the time elapsed since the last render.
   */
  dt: number
) => void;

/**
 * Represents all possible settings for a world.
 */
type WorldSettings = {
  /**
   * The maximum number of entities that can be created in the world.
   * @default 10000
   * 
   * - Keep this number as low as possible to reduce memory usage.
   * - Make sure this number will not be too low that you will run out of entities,
   * and too high that you will allocate unnecessary memory.
   * - The maximum number of entities is limited by the maximum number of bits 
   * in a unsigned 16-bit integer (65535). See: .
   */
  maxEntitiesCount?: number;
};

// Implementation --------------------------------------------------------------

export function createWorld(settings?: WorldSettings) {

  // Settings ------------------------------------------------------------------

  // ToDo: add logic to validate settings
  const maxEntitiesCount = settings?.maxEntitiesCount ?? MAX_ENTITIES_COUNT;

  // Internal World State ------------------------------------------------------

  const queries: Record<number, Uint16Array> = {};
  const systems: Record<number, System> = {};
  const components: Record<number, ComponentData> = {};

  // Id system -----------------------------------------------------------------

  const queryIdSystem = createIdSystem();
  const componentIdSystem = createIdSystem();
  const entityIdSystem = createIdSystem(1);
  const systemIdSystem = createIdSystem();

  // Entity --------------------------------------------------------------------

  function createEntity(): number {
    return entityIdSystem.create();
  }

  function deleteEntity(id: number): void {
    entityIdSystem.delete(id);
    // ToDo: Delete all components of the entity
  }

  /**
   * Attaches a component to an entity.
   * - Keep in mind that you can only have a single component of each type 
   * associated to an entity. If you try to attach multiple components of the 
   * same type to an entity the previous attached component data will be 
   * overwritten by the new component data.
   * 
   * @param entityId The id of the entity to have te component attached to.
   * @param componentId The id of the component to attach to this entity.
   * @param componentData The initial component data.
   */
  function attachComponent<Data extends Record<string, any>>(
    entityId: number,
    componentId: number,
    componentData: Data
  ): void {

    const { bitmask } = components[componentId];
    setFlagOnMask(bitmask as Uint8Array, entityId, true);

    try {
      Object.keys(components[componentId]);
      for (const key in componentData) {
        const array = components[componentId][key];
        const value = componentData[key];
        array[entityId] = value;
      }
    } catch (error) {
      const componentKeys = Object.keys(components[componentId]);
      const dataKeys = Object.keys(componentData);
      const unique = dataKeys.filter(key => componentKeys.indexOf(key) === -1);
      console.error(`Error: Unable to set component data. Component with id '${componentId}' has no property '${unique.join(', ')}'`);
    }
  }

  /**
   * Detaches a component from the entity
   * - Note: This will not clear the component data. It's not needed to clear the
   * component data at this moment because the memory allocated will not be released.
   * Once you attach the same component to this entity the data will be overwritten.
   * 
   * @param entityId The id of the entity to detach the component.
   * @param componentId The id of the component to detach.
   */
  function detachComponent(entityId: number, componentId: number) {
    const component = components[componentId];
    const { bitmask } = component;
    setFlagOnMask(bitmask as Uint8Array, entityId, false);
  }

  // Component -----------------------------------------------------------------

  function createComponent(data: ComponentDefinition): number {
    const componentId = componentIdSystem.create();
    components[componentId] = {};

    // Create bitmask to track which entities have the component
    const bitmask = createBitMask(maxEntitiesCount);
    components[componentId].bitmask = bitmask;

    // Create properties arrays
    for (const key in data) {
      const ArrayType = data[key];
      const array = new (ArrayType as any)(maxEntitiesCount);
      components[componentId][key] = array;
    }

    return componentId;
  }

  // Query ---------------------------------------------------------------------

  function createQuery(...queryableComponents: number[]): number {
    const queryId = queryIdSystem.create();
    queries[queryId] = new Uint16Array(maxEntitiesCount);

    let currentQueryIndex = 0;

    for (let id = 0; id < entityIdSystem.getAliveIdCount(); id++) {
      let shouldInclude = true;

      for (const componentId of queryableComponents) {
        const { bitmask } = components[componentId];

        if (!getFlagOnMask(bitmask as Uint8Array, id)) {
          shouldInclude = false;
          break;
        }
      }

      /**
       * WARNING: A query may contain a entity id id zero, so, before validating
       * the end of the id, we need to check if query[n] and query[n + 1] are both 0
       */
      if (shouldInclude) queries[queryId][currentQueryIndex++] = id;
    }

    return queryId;
  }

  function deleteQuery(queryId: number): void {
    queryIdSystem.delete(queryId);
    delete queries[queryId];
  }

  // System --------------------------------------------------------------------

  function createSystem(system: System): number {
    const systemId = systemIdSystem.create();
    systems[systemId] = system;
    return systemId;
  }

  function deleteSystem(systemId: number): void {
    systemIdSystem.delete(systemId);
  }

  // Utility -------------------------------------------------------------------

  function log() {
    console.log({
      components,
      queries
    });
  }

  // ToDo: Remove this later, this is a temporary solution
  function executeSystems(dt: number) {
    for (const systemId in systems) {
      const system = systems[systemId];
      system(queries, components, dt);
    }
  }

  // API -----------------------------------------------------------------------

  return {
    entity: {
      create: createEntity,
      delete: deleteEntity,
      components: {
        attach: attachComponent,
        detach: detachComponent
      }
    },
    component: {
      create: createComponent,
    },
    system: {
      create: createSystem,
      delete: deleteSystem
    },
    query: {
      create: createQuery,
      delete: deleteQuery,
    },
    log,
    executeSystems
  };
}