import { Entity } from '@engine/ecs';

class TestEntity extends Entity { }

describe('Entity Component System', () => {
  describe('Entity', () => {
    describe('Instantiation', () => {
      it('Should allow to create derived entities from the abstract entity class', () => {
        class SomeEntity extends Entity { }
        const entity = new SomeEntity();
        expect(entity).toBeInstanceOf(Entity);
      });

      it('Should allow to instantiate an entity', () => {
        const entity = new TestEntity();
        expect(entity).toBeDefined();
      });
    });

    describe('Unique identifier', () => {
      it('Should have a unique string identifier.', () => {
        const entity = new TestEntity();
        expect(typeof entity.id).toBe('string');
      });

      it('Should not create two consecutive instancies with the same id', () => {
        const entity1 = new TestEntity();
        const entity2 = new TestEntity();
        expect(entity1.id).not.toBe(entity2.id);
      });
    });
  });

  describe('Component', () => {
    it.todo('todo');
  });

  describe('System', () => {
    it.todo('todo');
  });

  describe('World', () => {
    it.todo('todo');
  });
});