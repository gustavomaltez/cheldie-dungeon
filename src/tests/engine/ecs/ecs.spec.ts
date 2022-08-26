import { Component, Entity } from '@engine/ecs';

class TestEntity extends Entity { }
class TestComponent extends Component { }

describe('Entity Component System', () => {
  describe('Entity', () => {
    describe('Instantiation', () => {
      it('Should allow to create derived entities from the abstract entity class.', () => {
        class SomeEntity extends Entity { }
        const entity = new SomeEntity();
        expect(entity).toBeInstanceOf(Entity);
      });

      it('Should allow to instantiate an entity.', () => {
        const entity = new TestEntity();
        expect(entity).toBeDefined();
      });

      it('Should initialize the entity without components.', () => {
        const entity = new TestEntity();
        expect(entity.components).toEqual({});
      });
    });

    describe('Unique Identifier', () => {
      it('Should have a unique string identifier.', () => {
        const entity = new TestEntity();
        expect(typeof entity.id).toBe('string');
      });

      it('Should not create two consecutive instancies with the same id.', () => {
        const entity1 = new TestEntity();
        const entity2 = new TestEntity();
        expect(entity1.id).not.toBe(entity2.id);
      });
    });

    describe('Component management', () => {
      it('Should allow to attach a component to the entity.', () => {
        const entity = new TestEntity();
        const component = new TestComponent();
        expect(() => entity.addComponent(component)).not.toThrow();
      });

      it('Should correctly attach a component to the entity.', () => {
        const entity = new TestEntity();
        const component = new TestComponent();
        entity.addComponent(component);
        expect(entity.components[TestComponent.name]).toBe(component);
      });

      it('Should correctly add the amount of components attached to the entity.', () => {
        const entity = new TestEntity();
        entity.addComponent(new TestComponent());
        const componentCount = Object.keys(entity.components).length;
        expect(componentCount).toBe(1);
      });

      it('Should replace the previous component if a component with the same type is attached.', () => {
        const entity = new TestEntity();
        const component1 = new TestComponent();
        const component2 = new TestComponent();
        entity.addComponent(component1);
        entity.addComponent(component2);
        expect(entity.components[TestComponent.name]).toBe(component2);
      });

      it('Should allow to detaches a component from the entity.', () => {
        const entity = new TestEntity();
        const component = new TestComponent();
        entity.addComponent(component);
        expect(() => entity.removeComponent(TestComponent)).not.toThrow();
      });

      it('Should correctly detaches a component from the entity.', () => {
        const entity = new TestEntity();
        const component = new TestComponent();
        entity.addComponent(component);
        entity.removeComponent(TestComponent);
        expect(entity.components[TestComponent.constructor.name]).toBeUndefined();
      });

      it('Should allow to check whether an entity has a component attached to it.', () => {
        const entity = new TestEntity();
        const component = new TestComponent();
        entity.addComponent(component);
        expect(entity.hasComponent(TestComponent)).toBe(true);
      });

      it('Should allow to check whether an entity has a list of components attached to it.', () => {
        const entity = new TestEntity();
        class ComponentA extends Component { }
        class ComponentB extends Component { }
        entity.addComponent(new ComponentA());
        entity.addComponent(new ComponentB());
        expect(entity.hasComponents([ComponentA, ComponentB])).toBe(true);
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