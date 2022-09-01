import { createWorld, TYPES } from 'newAbstraction';

// Temporary canvas setup ------------------------------------------------------

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 4;
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
  x: TYPES.uint8,
  y: TYPES.uint8,
});

const velocity = world.component.create({
  x: TYPES.uint8,
  y: TYPES.uint8,
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

world.entity.components.attach<Position>(player, position, { x: 2, y: 2 });
world.entity.components.attach<Velocity>(player, velocity, { x: 0, y: 0 });

world.query.create(position, velocity);
world.log();
