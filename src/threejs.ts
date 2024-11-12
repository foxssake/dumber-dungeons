import * as three from 'three';
import DummyWalker, { vec2 } from './dummy-walker';
import FPSCounter, { type milliseconds } from './fps-counter';

const PIx2 = Math.PI * 2;

function radians(degrees: number): number {
  return (degrees / 180) * Math.PI;
}

function range(n: number): Array<number> {
  return [...new Array<number>(n)].map((_, i) => i);
}

// Init three.js / Setup rendering
const renderer = new three.WebGLRenderer({
  alpha: true, // Transparent background
});

renderer.setSize(512, 512, false);
renderer.domElement.style.display = '';

document.body.appendChild(renderer.domElement);

const fpsCounter = new FPSCounter(128);

// Load resources

const textureLoader = new three.TextureLoader();

const necromantTexture = await textureLoader.loadAsync('/assets/necromant.png');
const rockTexture = await textureLoader.loadAsync('/assets/rock-tile.png');

necromantTexture.magFilter = three.NearestFilter;
necromantTexture.colorSpace = three.SRGBColorSpace;

rockTexture.magFilter = three.NearestFilter;
rockTexture.minFilter = three.NearestMipmapLinearFilter;
rockTexture.colorSpace = three.SRGBColorSpace;

// Setup scene
const scene = new three.Scene();
const camera = new three.PerspectiveCamera();

const floorSize = 12;
const floorMaterial = new three.MeshBasicMaterial({
  color: 'white',
  map: rockTexture,
});
const floorGeometry = new three.BoxGeometry(1, 1, 1);

const floorObjects = range(floorSize * floorSize).map((i) => {
  const x = i % floorSize;
  const y = (i - x) / floorSize;

  const floorObject = new three.Mesh(floorGeometry, floorMaterial);
  floorObject.position.x = x - floorSize / 2;
  floorObject.position.y = -1;
  floorObject.position.z = y - floorSize / 2;

  return floorObject;
});

floorObjects.forEach(floorObject => scene.add(floorObject));

const spriteMaterial = new three.SpriteMaterial({
  map: necromantTexture,
});

const avatarCount = parseInt(
  new URLSearchParams(location.search).get('count') ?? '128'
);
const avatars = range(avatarCount).map(() => {
  const sprite = new three.Sprite(spriteMaterial);
  sprite.center.y = 0;

  const avatar = new DummyWalker(sprite);
  avatar.moveSpeed = 2;
  avatar.accelSpeed = avatar.moveSpeed * 4;
  avatar.target = new vec2(0, 0);
  avatar.targetRange = floorSize * 0.75;
  avatar.position = new vec2(
    ((1 - 2 * Math.random()) / 2) * floorSize,
    ((1 - 2 * Math.random()) / 2) * floorSize
  );

  scene.add(sprite);

  return avatar;
});

// Run scene
let lastUpdate: milliseconds = -1;
renderer.setAnimationLoop((timeMs) => {
  // Calculate frame delta
  if (lastUpdate < 0) {
    lastUpdate = timeMs;
  }

  const dt = (timeMs - lastUpdate) / 1000;
  lastUpdate = timeMs;

  // Move camera
  const yaw = radians(45 + Math.sin((timeMs / 12000) * PIx2) * 15);
  const pitch = radians(30);
  const distance = floorSize * 2;

  camera.position.set(
    Math.cos(yaw) * Math.cos(pitch) * distance,
    Math.sin(pitch) * distance,
    Math.sin(yaw) * Math.cos(pitch) * distance
  );

  camera.lookAt(0, 0, 0);

  // Update avatars
  avatars.forEach((avatar) => {
    avatar.update(dt);

    avatar.sprite.position.x = avatar.position.x;
    avatar.sprite.position.z = avatar.position.y;
  });

  // Render
  renderer.render(scene, camera);

  // Update FPS counter
  fpsCounter.pushMillis(dt * 1000);

  const counterDiv = document.querySelector('#fps');
  if (counterDiv) counterDiv.innerHTML = `FPS: ${  fpsCounter.averageFps | 0}`;
});
