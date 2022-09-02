import { createWorld, TYPES } from '@engine/ecs';

// Temporary canvas setup ------------------------------------------------------

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
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

const color = world.component.create({
  r: TYPES.uint8,
  g: TYPES.uint8,
  b: TYPES.uint8,
});

// Entities creation -----------------------------------------------------------

const player = world.entity.create();

world.entity.components.attach(player, position, { x: 250, y: 40 });
world.entity.components.attach(player, velocity, { x: 5, y: 2 });
world.entity.components.attach(player, size, { width: 20, height: 20 });
world.entity.components.attach(player, color, { r: 255, g: 255, b: 255 });

for (let i = 0; i < 20; i++) {
  const entity = world.entity.create();

  world.entity.components.attach(entity, position, { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight });
  world.entity.components.attach(entity, velocity, { x: Math.random() * 5, y: Math.random() * 5 });
  const sizeValue = Math.random() * 10 + 1;
  world.entity.components.attach(entity, size, { width: sizeValue, height: sizeValue });
  world.entity.components.attach(entity, color, { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 });
}

const inMapQuery = world.query.create(position, velocity, size, color);

world.system.create((queries, components, dt) => {

  for (const id of queries[inMapQuery]) {
    if (id === 0) return;

    const { x: velocityX, y: velocityY } = components[velocity];
    const { x: positionX, y: positionY } = components[position];
    const { width, height } = components[size];

    // If component is outside the right boundary
    if (positionX[id] + width[id] >= canvas.width)
      velocityX[id] = velocityX[id] * -1;
    //If component is outside the left boundary
    if (positionX[id] <= 0)
      velocityX[id] = velocityX[id] * -1;
    // If component is outside the bottom boundary
    if (positionY[id] + height[id] >= canvas.height)
      velocityY[id] = velocityY[id] * -1;
    // If component is outside the top boundary
    if (positionY[id] <= 0)
      velocityY[id] = velocityY[id] * -1;

    positionX[id] = positionX[id] + velocityX[id];
    positionY[id] = positionY[id] + velocityY[id];
  }
});

world.system.create((queries, components, dt) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#292a2d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const id of queries[inMapQuery]) {
    if (id === 0) return;

    const { x, y } = components[position];
    const { width, height } = components[size];
    const { r, g, b } = components[color];

    ctx.fillStyle = `rgb(${r[id]}, ${g[id]}, ${b[id]})`;
    ctx.fillRect(x[id], y[id], width[id], height[id]);
  }
});

let startTime, endTime;

world.system.create((queries, components, dt) => {

  startTime = performance.now();
  for (const id of queries[inMapQuery]) {
    if (id === 0) return console.log(performance.now() - startTime);

    const { x: velocityX, y: velocityY } = components[velocity];
    const { x: positionX, y: positionY } = components[position];
    const { width, height } = components[size];

    for (const id2 of queries[inMapQuery]) {
      if (id2 === 0) break;
      if (id === id2) continue;

      const { x: positionX2, y: positionY2 } = components[position];
      const { width: width2, height: height2 } = components[size];

      if (positionX[id] < positionX2[id2] + width2[id2] &&
        positionX[id] + width[id] > positionX2[id2] &&
        positionY[id] < positionY2[id2] + height2[id2] &&
        positionY[id] + height[id] > positionY2[id2]) {
        velocityX[id] = velocityX[id] * -1;
        velocityY[id] = velocityY[id] * -1;
      }
    }
  }
});

// Main loop ------------------------------------------------------------------

const loop = () => {
  world.executeSystems(1);
  requestAnimationFrame(loop);
};

loop();
world.log();
