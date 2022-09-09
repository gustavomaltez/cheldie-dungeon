import { createIdSystem } from '@utils';

describe('Id System', () => {
  it('Should allow to create a numeric id.', () => {
    const idSystem = createIdSystem();
    const id = idSystem.create();
    expect(typeof id).toBe('number');
  });

  it('Should allow to define a starting id.', () => {
    const idSystem = createIdSystem(10);
    const id = idSystem.create();
    expect(id).toBe(10);
  });

  it('Should return a sequential id.', () => {
    const idSystem = createIdSystem();
    const id1 = idSystem.create();
    const id2 = idSystem.create();
    expect(id2).toBe(id1 + 1);
  });

  it('Should allow to delete an id.', () => {
    const idSystem = createIdSystem();
    const id1 = idSystem.create();
    expect(() => idSystem.delete(id1)).not.toThrow();
  });

  it('Should allow to reuse deleted ids.', () => {
    const idSystem = createIdSystem();
    const id1 = idSystem.create();
    idSystem.delete(id1);
    const id2 = idSystem.create();
    expect(id2).toBe(id1);
  });

  it('Should correctly count alive ids.', () => {
    const idSystem = createIdSystem();
    idSystem.create();
    expect(idSystem.getAliveIdCount()).toBe(1);
  });

  it('Should start the alive id count at 0.', () => {
    const idSystem = createIdSystem();
    expect(idSystem.getAliveIdCount()).toBe(0);
  });

  it('Should correctly return the alive id count after deleting ids.', () => {
    const idSystem = createIdSystem();
    idSystem.create();
    idSystem.create();
    idSystem.delete(1);
    expect(idSystem.getAliveIdCount()).toBe(1);
  });

  it('Should correctly return the alive id count after reusing deleted ids.', () => {
    const idSystem = createIdSystem();
    idSystem.create();
    idSystem.create();
    idSystem.delete(1);
    idSystem.create();
    expect(idSystem.getAliveIdCount()).toBe(2);
  });

  it('Should create individual id systems.', () => {
    const idSystem1 = createIdSystem();
    const idSystem2 = createIdSystem();
    const id1 = idSystem1.create();
    const id2 = idSystem2.create();
    console.log(id1, id2);
    expect(id1).toBe(0);
    expect(id2).toBe(0);
  });

  it('Should create individual id systems with different starting ids.', () => {
    const idSystem1 = createIdSystem(10);
    const idSystem2 = createIdSystem(20);
    const id1 = idSystem1.create();
    const id2 = idSystem2.create();
    expect(id1).toBe(10);
    expect(id2).toBe(20);
  });

  it('Should by default start the id at 0.', () => {
    const idSystem = createIdSystem();
    const id = idSystem.create();
    expect(id).toBe(0);
  });
});