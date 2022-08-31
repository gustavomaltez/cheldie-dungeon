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
    }
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

  if (!settings.maxEntitiesCount) settings.maxEntitiesCount = MAX_ENTITIES_COUNT;

  // Internal World State ------------------------------------------------------

  const queries: Record<number, Uint8Array> = {};
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

  function attachComponent<Data extends Record<string, any>>(
    entityId: number,
    componentId: number,
    componentData: Data
  ): void {

    for (const key in componentData) {
      const array = components[componentId][key];
      const value = componentData[key];
      array[entityId] = value;
    }
  }
  // Component -----------------------------------------------------------------

  function createComponent(data: ComponentDefinition): number {
    const componentId = componentIdSystem.create();
    components[componentId] = {};

    // Create properties arrays
    for (const key in data) {
      const ArrayType = data[key];
      const array = new (ArrayType as any)(settings.maxEntitiesCount);
      components[componentId][key] = array;
    }

    return componentId;
  }

  function deleteComponent(id: number): void {
    componentIdSystem.delete(id);
    delete components[id];
    // ToDo: Refresh all queries that use this component
  }

  // Query ---------------------------------------------------------------------

  // API -----------------------------------------------------------------------

  // Temp ----------------------------------------------------------------------

  const log = () => {
    console.log({
      components,
      queries
    });
  };

  return {
    createEntity,
    deleteEntity,
    createComponent,
    deleteComponent,
    log,
    attachComponent
  };
}