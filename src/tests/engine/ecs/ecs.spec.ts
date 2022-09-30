import { createWorld, TYPES } from '@engine/ecs';

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

      it('Should throw an error when trying to delete an entity multiple times.', () => {
        const world = createWorld();
        const entity = world.entity.create();
        expect(() => {
          world.entity.delete(entity);
          world.entity.delete(entity);
        }).toThrow();
      });

      it('Should throw an error when trying to delete an entity that does not exist.', () => {
        const world = createWorld();
        expect(() => world.entity.delete(1)).toThrow();
      });
    });

    describe('Components Attachment', () => {
      it('Should allow to attach a component to an entity.', () => {
        const world = createWorld();
        const entity = world.entity.create();
        const component = world.component.create({ foo: TYPES.int8, bar: TYPES.int16 });
        expect(() => world.entity.components.attach(entity, component, { foo: 12, bar: 12 })).not.toThrow();
      });

      // it('Should throw an error when trying to attach a component with invalid data.', () => {
      //   const world = createWorld();
      //   const entity = world.entity.create();
      //   const component = world.component.create({ foo: TYPES.int8, bar: TYPES.int16 });
      //   expect(() => world.entity.components.attach(entity, component, { x: 12 })).toThrow();
      // });

      // ToDo: Check using queries / systems.
      it.todo('Should correctly attach a component from an entity.');
    });

    describe('Components Detachment', () => {
      it('Should allow to detach a component from an entity.', () => {
        const world = createWorld();
        const entity = world.entity.create();
        const component = world.component.create({ foo: TYPES.int8, bar: TYPES.int16 });
        world.entity.components.attach(entity, component, { foo: 12, bar: 12 });
        expect(() => world.entity.components.detach(entity, component)).not.toThrow();
      });

      // ToDo: Check using queries / systems.
      it.todo('Should correctly detach a component from an entity.');
    });
  });

  describe('Components', () => {
    describe('Creation', () => {
      it('Should allow to create a component.', () => {
        const world = createWorld();
        expect(() => {
          world.component.create({
            foo: TYPES.int8,
            bar: TYPES.int16,
          });
        }).not.toThrow();
      });

      it('Should correctly create a component.', () => {
        const world = createWorld();
        const component = world.component.create({
          foo: TYPES.int8,
          bar: TYPES.int16,
        });
        expect(component).toBeDefined();
      });

      it('Should return a numeric id associated to the just created component.', () => {
        const world = createWorld();
        const component = world.component.create({
          foo: TYPES.int8,
          bar: TYPES.int16,
        });
        expect(typeof component).toBe('number');
      });

      it('Should start the component id creation from 0.', () => {
        const world = createWorld();
        const component = world.component.create({
          foo: TYPES.int8,
          bar: TYPES.int16,
        });
        expect(component).toBe(0);
      });

      it('Should create sequential ids for created components.', () => {
        const world = createWorld();
        const component1 = world.component.create({
          foo: TYPES.int8,
          bar: TYPES.int16,
        });
        const component2 = world.component.create({
          foo: TYPES.int8,
          bar: TYPES.int16,
        });
        expect(component2).toBe(component1 + 1);
      });
    });

    describe('Properties data type.', () => {
      it.todo('Test all data types.');
    });
  });

  describe('Systems', () => {
    describe('Creation', () => {
      it('Should allow to create a system.', () => {
        const world = createWorld();
        expect(() => {
          world.system.create(jest.fn());
        }).not.toThrow();
      });

      it('Should correctly create a system.', () => {
        const world = createWorld();
        const system = world.system.create(jest.fn());
        expect(system).toBeDefined();
      });

      it('Should return a numeric id associated to the just created system.', () => {
        const world = createWorld();
        const system = world.system.create(jest.fn());
        expect(typeof system).toBe('number');
      });

      it('Should start the system id creation from 0.', () => {
        const world = createWorld();
        const system = world.system.create(jest.fn());
        expect(system).toBe(0);
      });

      it('Should create sequential ids for created systems.', () => {
        const world = createWorld();
        const system1 = world.system.create(jest.fn());
        const system2 = world.system.create(jest.fn());
        expect(system2).toBe(system1 + 1);
      });
    });

    describe('Deletion', () => {
      it('Should allow to delete a system.', () => {
        const world = createWorld();
        const system = world.system.create(jest.fn());
        expect(() => {
          world.system.delete(system);
        }).not.toThrow();
      });

      it('Should correctly delete a system.', () => {
        const world = createWorld();
        const system = world.system.create(jest.fn());
        world.system.delete(system);
        expect(() => {
          world.system.delete(system);
        }).toThrow();
      });

      it('Should throw an error when trying to delete a system multiple times.', () => {
        const world = createWorld();
        const system = world.system.create(jest.fn());
        expect(() => {
          world.system.delete(system);
          world.system.delete(system);
        }).toThrow();
      });

      it('Should throw an error when trying to delete a system that does not exist.', () => {
        const world = createWorld();
        expect(() => world.system.delete(1)).toThrow();
      });

      it('Should reuse a system id for the next created system once a system is deleted.', () => {
        const world = createWorld();
        const system1 = world.system.create(jest.fn());
        const system2 = world.system.create(jest.fn());
        expect(system2).toBe(system1 + 1);
        world.system.delete(system2);
        const system3 = world.system.create(jest.fn());
        expect(system3).toBe(system1 + 1);
      });
    });

    describe('Execution', () => {
      it.todo('Systems execution tests');
    });
  });


});