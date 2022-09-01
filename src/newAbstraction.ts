/* eslint-disable @typescript-eslint/no-empty-function */
export { };

// Utility functions -----------------------------------------------------------

/**
 * Creates a new array of bytes with the approximated amount of bits
 * - 1 Byte equals to 8 bits.
 * - If you call this function with 10 bits, it will create a Uint8Array of 2
 * bytes, because 10 bits needs at least 2 bytes do be stored.
 * 
 * @param amountOfBits Amount of bits to store in the array.
 * @returns Uint8Array with the amount of bytes needed to store the bits.
 */
export function createBitMask(amountOfBits: number): Uint8Array {
  const bytes = Math.ceil(amountOfBits / 8);
  const array = new Uint8Array(bytes);
  return array;
}

/**
 * Sets a bit to 0 or 1 in the bitmask.
 * @param mask Bitmask to set the bit in.
 * @param bit Position of the bit to check.
 * @param value Value to set the bit to.
 */
export function setFlagOnMask(mask: Uint8Array, bit: number, value: boolean): void {
  const byte = Math.floor(bit / 8);
  const bitInByte = bit % 8;
  const maskByte = mask[byte];
  if (value)
    mask[byte] = maskByte | (1 << bitInByte);
  else
    mask[byte] = maskByte & ~(1 << bitInByte);
}

/**
 * Returns the value of a bit in the bitmask.
 * 
 * @param mask Bitmask to check the bit in.
 * @param bit Position of the bit to check.
 * @returns Whether the bit is set to 1 or not.
 */
export function getFlagOnMask(mask: Uint8Array, bit: number): boolean {
  const byte = Math.floor(bit / 8);
  const bitInByte = bit % 8;
  const maskByte = mask[byte];
  return (maskByte & (1 << bitInByte)) !== 0;
}

/**
 * Creates a simple numeric id system.
 * 
 * @returns Set of functions to create and delete ids
 */
export function createIdSystem() {
  const availableIds: number[] = [];

  let nextId = 0;

  return {
    /**
     * Returns a new numeric id.
     */
    create() {
      if (availableIds.length > 0)
        return availableIds.pop() as number;
      else
        return nextId++;
    },
    /**
     * Deletes an id. (Be aware that this id can be used again)
     */
    delete(id: number) {
      availableIds.push(id);
    },
    getAliveIdCount() {
      return nextId - availableIds.length;
    },
  };
}

// Implementation --------------------------------------------------------------

/**
 * Available types to be used as components properties.
 */
export const TYPES = {
  boolean: Int8Array,
  char: Int8Array,
  int8: Int8Array,
  uint8: Uint8Array,
  int16: Int16Array,
  uint16: Uint16Array,
  int32: Int32Array,
  uint32: Uint32Array,
  float32: Float32Array,
  float64: Float64Array,
  int64: BigInt64Array,
  uint64: BigUint64Array,
};

const MAX_ENTITIES_COUNT = 10000;
type ComponentArrayConstructor = Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor | BigInt64ArrayConstructor | BigUint64ArrayConstructor;
type ComponentArrayData = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;

type ComponentDefinition = Record<string, ComponentArrayConstructor>;
type ComponentData = Record<string, ComponentArrayData>;

type WorldSettings = {
  maxEntitiesCount?: number;
};
export function createWorld(settings: WorldSettings) {
  // Settings ------------------------------------------------------------------

  const {
    maxEntitiesCount = MAX_ENTITIES_COUNT
  } = settings;

  // Internal World State ------------------------------------------------------

  const queries: Record<number, Uint16Array> = {};
  const components: Record<number, ComponentData> = {};

  // Id system -----------------------------------------------------------------

  const queryIdSystem = createIdSystem();
  const componentIdSystem = createIdSystem();
  const entityIdSystem = createIdSystem();

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
    setFlagOnMask(bitmask as Uint8Array, componentId, false);
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

  // API -----------------------------------------------------------------------

  // Utility -------------------------------------------------------------------

  function log() {
    console.log({
      components,
      queries
    });
  }

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
    // system: {
    //   create: () => { },
    //   delete: () => { },
    // },
    query: {
      create: createQuery,
      delete: deleteQuery,
    },
    log
  };
}