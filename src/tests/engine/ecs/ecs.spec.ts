import { createWorld } from '@engine/ecs';

describe('Entity Component System', () => {
  describe('World Creation', () => {
    it('Should allow to create a world.', () => {
      expect(createWorld).not.toThrow();
    });

    it('Should correctly create a world.', () => {
      const world = createWorld();
      expect(world).toBeDefined();
    });

    it.todo('Custom settings');

    it('Should allow to create multiple worlds.', () => {
      expect(() => {
        createWorld();
        createWorld();
      }).not.toThrow();
    });

    it.todo('Multiple worlds should not share the same storage');
  });

  describe('Entities', () => {
    describe('Creation', () => {
      it('Should allow to create an entity', () => {
        const world = createWorld();
        expect(() => world.entity.create()).not.toThrow();
      });

      it('Should correctly create an entity.', () => {
        const world = createWorld();
        const entity = world.entity.create();
        expect(entity).toBeDefined();
      });

      it('Should return a numeric id associated to the just created entity.', () => {
        const world = createWorld();
        const entity = world.entity.create();
        expect(typeof entity).toBe('number');
      });

      it('Should start the entity id creation from 1.', () => {
        const world = createWorld();
        const entity = world.entity.create();
        expect(entity).toBe(1);
      });

      it('Should create sequential ids for created entities.', () => {
        const world = createWorld();
        const entity1 = world.entity.create();
        const entity2 = world.entity.create();
        expect(entity2).toBe(entity1 + 1);
      });

      it('Should reuse an entity id for the next created entity once a entity is deleted.', () => {
        const world = createWorld();

        const entity1 = world.entity.create();
        const entity2 = world.entity.create();
        expect(entity2).toBe(entity1 + 1);

        world.entity.delete(entity2);
        const entity3 = world.entity.create();
        expect(entity3).toBe(entity1 + 1);
      });
    });

    // ToDo: read the tests and fix logic on id system for invalid entity deletion
    describe('Deletion', () => {
      it('Should allow to delete an entity.', () => {
        const world = createWorld();
        const entity = world.entity.create();
        expect(() => world.entity.delete(entity)).not.toThrow();
      });

      it('Should correctly delete an entity.', () => {
        const world = createWorld();
        const entity = world.entity.create();
        world.entity.delete(entity);
        expect(world.entity.create()).toBe(entity);
      });

      it('Should not throw an error when trying to delete an entity multiple times.', () => {
        const world = createWorld();
        const entity = world.entity.create();
        expect(() => {
          world.entity.delete(entity);
          world.entity.delete(entity);
        }).not.toThrow();
      });

      it('Should throw an error when trying to delete an entity that does not exist.', () => {
        const world = createWorld();
        expect(() => world.entity.delete(1)).toThrow();
      });

    });
  });
});