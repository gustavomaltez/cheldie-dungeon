import { createWorld, TYPES } from 'newAbstraction';

// Temporary canvas setup ------------------------------------------------------

const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 250;
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
  x: TYPES.int16,
  y: TYPES.int16,
});

const velocity = world.component.create({
  x: TYPES.int16,
  y: TYPES.int16,
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

world.entity.components.attach<Position>(player, position, { x: 250, y: 40 });
world.entity.components.attach<Velocity>(player, velocity, { x: 5, y: 2 });
world.entity.components.attach<Size>(player, size, { width: 20, height: 20 });

const inMapQuery = world.query.create(position, velocity, size);

const movementSystem = world.system.create((queries, components, dt) => {
  let zeroCount = 0;

  for (const id of queries[inMapQuery]) {
    if (id === 0) zeroCount++;
    if (zeroCount >= 2) break;

    const vComponents = components[velocity];
    const pComponents = components[position];
    const sComponents = components[size];

    // If component is outside the right boundary
    if (pComponents.x[id] + sComponents.width[id] >= canvas.width)
      vComponents.x[id] = vComponents.x[id] * -1;

    //If component is outside the left boundary
    else if (pComponents.x[id] <= 0)
      vComponents.x[id] = vComponents.x[id] * -1;


    // If component is outside the bottom boundary
    else if (pComponents.y[id] + sComponents.height[id] >= canvas.height)
      vComponents.y[id] = vComponents.y[id] * -1;


    // If component is outside the top boundary
    else if (pComponents.y[id] <= 0)
      vComponents.y[id] = vComponents.y[id] * -1;

    pComponents.x[id] = pComponents.x[id] + vComponents.x[id];
    pComponents.y[id] = pComponents.y[id] + vComponents.y[id];
  }
});

const drawingSystem = world.system.create((queries, components, dt) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let zeroCount = 0;

  for (const id of queries[inMapQuery]) {
    if (id === 0) zeroCount++;
    if (zeroCount >= 2) break;

    const pComponents = components[position];
    const sComponents = components[size];

    ctx.fillStyle = '#fff';

    ctx.fillRect(pComponents.x[id], pComponents.y[id], sComponents.width[id], sComponents.height[id]);
  }
});


// Main loop ------------------------------------------------------------------

const loop = () => {
  world.executeSystems(1);
  requestAnimationFrame(loop);
};

loop();


world.log();
