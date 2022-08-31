import { createWorld, TYPES } from 'newAbstraction';

import { System, World } from '.';

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

const world = new World();

// Components creation ---------------------------------------------------------

const Position = world.createComponent<{ x: number; y: number; }>();
const Velocity = world.createComponent<{ x: number; y: number; }>();
const Size = world.createComponent<{ width: number; height: number; }>();
const Color = world.createComponent<{ hex: string; }>();
const PlayerControlled = world.createComponent();
const RenderInfo = world.createComponent<{ fps: number; }>();

// Queries creation ------------------------------------------------------------

const queries = {
  renderable: world.createQuery([Position, Size, Color]),
  input: world.createQuery([PlayerControlled]),
  velocity: world.createQuery([Position, Velocity, Size]),
  collision: world.createQuery([Position, Size, Velocity]),
  renderInfo: world.createQuery([RenderInfo]),
};

// Utility functions -----------------------------------------------------------

function spawnEnemy(): void {
  const enemy = world.createEntity();

  // Random position
  const positionX = Math.floor(Math.random() * canvas.width);
  const positionY = Math.floor(Math.random() * canvas.height);

  // Random size
  const size = Math.floor(Math.random() * 10) + 2;

  // Random color
  const hex = '#' + Math.floor(Math.random() * 16777215).toString(16);

  enemy.addComponent([
    new Position({ x: positionX, y: positionY }),
    new Velocity({ x: Math.random() * 10 - 5, y: Math.random() * 10 - 5 }),
    new Size({ width: size, height: size }),
    new Color({ hex }),
  ]);
}

// Systems ---------------------------------------------------------------------

class DrawingSystem extends System {
  update(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    queries.renderable.runForEach((getComponent) => {
      const position = getComponent(Position);
      const size = getComponent(Size);
      const color = getComponent(Color);
      ctx.fillStyle = color.hex;
      ctx.fillRect(position.x, position.y, size.width, size.height);
    });
  }
}

let enemyCount = 0;

class VelocitySystem extends System {
  protected queries = {
    ...queries
  };

  update(): void {
    queries.velocity.runForEach((getComponent) => {
      const position = getComponent(Position);
      const velocity = getComponent(Velocity);
      const size = getComponent(Size);
      position.x += velocity.x;
      position.y += velocity.y;

      if (position.x < 0) {
        position.x = 0;
        velocity.x = velocity.x * -1;
      }
      else if (position.x + size.width > canvas.width) {
        position.x = canvas.width - size.width;
        velocity.x = velocity.x * -1;
      }
      else if (position.y < 0) {
        position.y = 0;
        velocity.y = velocity.y * -1;
      }
      else if (position.y + size.height > canvas.height) {
        position.y = canvas.height - size.height;
        velocity.y = velocity.y * -1;
      }
    }
    );
  }
}

class UserInputSystem extends System {
  protected queries = {
    ...queries
  };

  update(): void {
    queries.input.runForEach(getComponent => {
      const velocity = getComponent(Velocity);
      if (pressedKeys['w']) {
        spawnEnemy();
        enemyCount++;
      }
      if (pressedKeys['ArrowUp'] && velocity.y > -5) velocity.y -= 1;
      else if (pressedKeys['ArrowDown'] && velocity.y < 5) velocity.y += 1;
      else if (pressedKeys['ArrowLeft'] && velocity.x > -5) velocity.x -= 1;
      else if (pressedKeys['ArrowRight'] && velocity.x < 5) velocity.x += 1;
    }
    );
  }
}

class CollisionSystem extends System {
  update(): void {
    queries.collision.runForEach(getComponent => {
      const velocity = getComponent(Velocity);
      const position = getComponent(Position);
      const size = getComponent(Size);

      queries.collision.runForEach(getComponent => {
        if (getComponent(Position) === position) return;
        const position2 = getComponent(Position);
        const size2 = getComponent(Size);
        if (position.x < position2.x + size2.width && position.x + size.width > position2.x && position.y < position2.y + size2.height && position.y + size.height > position2.y) {
          velocity.x = velocity.x * -1;
          velocity.y = velocity.y * -1;
        }
      });
    });
  }
}

let lastCalledTime = Date.now();
let fps = 0;
let delta = 0;
class RenderInfoSystem extends System {
  update(): void {
    if (!lastCalledTime) {
      lastCalledTime = Date.now();
      fps = 0;
      return;
    }
    delta = (Date.now() - lastCalledTime) / 1000;
    lastCalledTime = Date.now();
    fps = 1 / delta;

    queries.renderInfo.runForEach(getComponent => {
      ctx.fillStyle = '#ffffff';
      ctx.font = '30px Arial';
      ctx.fillText(`FPS: ${fps.toFixed(0)}`, 10, 30);
      ctx.fillText(`Enemies: ${enemyCount}`, 10, 60);
    });
  }
}

world.addSystem(UserInputSystem);
world.addSystem(CollisionSystem);
world.addSystem(VelocitySystem);
world.addSystem(DrawingSystem);
world.addSystem(RenderInfoSystem);

// Entities Creation
const player = world.createEntity();

player.addComponent([
  new Position({ x: 100, y: 100 }),
  new Velocity({ x: 1, y: 1 }),
  new Color({ hex: '#00ff00' }),
  new Size({ width: 10, height: 10 }),
  new PlayerControlled({}),
]);

const informative = world.createEntity();
informative.addComponent([
  new RenderInfo({ fps: 60 }),
]);

for (let i = 0; i < 20; i++) {
  spawnEnemy();
  enemyCount++;
}

console.log(world);

const update = (deltaTime: number) => {
  const systemsKeys = Object.keys(world.systems);

  for (const systemKey of systemsKeys) {
    const system = world.systems[systemKey];
    system.update(deltaTime);
  }

  requestAnimationFrame(update);
};

update(0);


const myWorld = createWorld({});
const myEntity = myWorld.createEntity();

const position = myWorld.createComponent({
  x: TYPES.uint8,
  y: TYPES.uint8,
});

const velocity = myWorld.createComponent({
  x: TYPES.uint8,
  y: TYPES.uint8,
});

myWorld.log();

interface Position {
  x: number;
  y: number;
  h: number;
}

interface Velocity {
  x: number;
  y: number;
}

console.log(myEntity, position);
myWorld.attachComponent<Position>(myEntity, position, { x: 2, y: 2, h: 2 });
myWorld.attachComponent<Velocity>(myEntity, velocity, { x: 0, y: 0 });