/**
 * Creates a simple numeric id system.
 * 
 * @returns Set of functions to create and delete ids
 */
export function createIdSystem(startingId = 0) {
  const availableIds: number[] = [];

  let nextId = startingId;

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