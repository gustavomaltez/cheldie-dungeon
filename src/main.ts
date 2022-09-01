import { createWorld, TYPES } from 'newAbstraction';

// Temporary canvas setup ------------------------------------------------------

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Temporary input detection ---------------------------------------------------

const pressedKeys: Record<string, boolean> = {};

window.onkeyup = function (e) { pressedKeys[e.key] = false; };
window.onkeydown = function (e) { pressedKeys[e.key] = true; };

// World setup -----------------------------------------------------------------

const world = createWorld({});

// Components creation ---------------------------------------------------------

const position = world.component.create({
  x: TYPES.uint16,
  y: TYPES.uint16,
});

const velocity = world.component.create({
  x: TYPES.uint16,
  y: TYPES.uint16,
});

const size = world.component.create({
  width: TYPES.uint8,
  height: TYPES.uint8,
});

// Entities creation -----------------------------------------------------------

const player = world.entity.create();

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

world.entity.components.attach<Position>(player, position, { x: 2, y: 2 });
world.entity.components.attach<Velocity>(player, velocity, { x: 5, y: 5 });
world.entity.components.attach<Size>(player, size, { width: 10, height: 10 });

const inMapQuery = world.query.create(position, velocity, size);

const movementSystem = world.system.create((queries, components, dt) => {
  let zeroCount = 0;

  for (const entity of queries[inMapQuery]) {
    if (entity === 0) zeroCount++;
    if (zeroCount >= 2) break;

    const vComponents = components[velocity];
    const pComponents = components[position];
    const sComponents = components[size];

    pComponents.x[entity] = (pComponents.x[entity] as number) + (vComponents.x[entity] as number);
    pComponents.y[entity] = (pComponents.y[entity] as number) + (vComponents.y[entity] as number);

    // Check if entity touches the map boundaries
    if ((pComponents.x[entity] as number) + (sComponents.width[entity] as number) >= canvas.width) {
      pComponents.x[entity] = canvas.width - (sComponents.width[entity] as number);
      vComponents.x[entity] = -(vComponents.x[entity] as number);
    }
    else if ((pComponents.x[entity] as number) + (sComponents.width[entity] as number) <= 0) {
      pComponents.x[entity] = 0;
      vComponents.x[entity] = -(vComponents.x[entity] as number);
    }
    else if ((pComponents.y[entity] as number) + (sComponents.height[entity] as number) >= canvas.height) {
      pComponents.y[entity] = canvas.height - (sComponents.height[entity] as number);
      vComponents.y[entity] = -(vComponents.y[entity] as number);
    }
    else if ((pComponents.y[entity] as number) + (sComponents.height[entity] as number) <= 0) {
      pComponents.y[entity] = 0;
      vComponents.y[entity] = -(vComponents.y[entity] as number);
    }
  }
});

const drawingSystem = world.system.create((queries, components, dt) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let zeroCount = 0;

  for (const entity of queries[inMapQuery]) {
    if (entity === 0) zeroCount++;
    if (zeroCount >= 2) break;

    const pComponents = components[position];

    ctx.fillStyle = '#fff';
    ctx.fillRect(pComponents.x[entity] as number, pComponents.y[entity] as number, 20, 20);
  }
});


// Main loop ------------------------------------------------------------------

const loop = () => {
  world.executeSystems(1);
  requestAnimationFrame(loop);
};

loop();
world.log();
