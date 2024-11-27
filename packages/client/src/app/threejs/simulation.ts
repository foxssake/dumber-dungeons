import * as three from 'three';
import DummyWalker from './dummy-walker';
import FPSCounter, { type milliseconds } from './fps-counter';
import { vec2 } from './vec2';

const PIx2 = Math.PI * 2;

function radians(degrees: number): number {
  return (degrees / 180) * Math.PI;
}

function range(n: number): Array<number> {
  return [...new Array<number>(n)].map((_, i) => i);
}

export class ThreeJSPrototype {
  private camera!: three.Camera;
  private avatars: Array<DummyWalker<three.Sprite>> = [];
  private renderer!: three.WebGLRenderer;
  private scene!: three.Scene;
  private fpsCounter!: FPSCounter;

  private lastUpdate = -1;
  private floorSize = 12;

  public async run(canvas: HTMLCanvasElement | null, fpsCounter: FPSCounter) {
    if (canvas == null) {
      return;
    }

    // Init three.js / Setup rendering
    this.renderer = new three.WebGLRenderer({
      alpha: true, // Transparent background
      canvas,
    });

    this.renderer.setSize(512, 512, false);
    this.renderer.domElement.style.display = '';

    this.fpsCounter = fpsCounter;

    // Load resources
    const textureLoader = new three.TextureLoader();

    const necromantTexture = await textureLoader.loadAsync(
      '/assets/necromant.png'
    );
    const rockTexture = await textureLoader.loadAsync('/assets/rock-tile.png');

    necromantTexture.magFilter = three.NearestFilter;
    necromantTexture.colorSpace = three.SRGBColorSpace;
    necromantTexture.premultiplyAlpha = true;

    rockTexture.magFilter = three.NearestFilter;
    rockTexture.minFilter = three.NearestMipmapLinearFilter;
    rockTexture.colorSpace = three.SRGBColorSpace;

    // Setup scene
    this.scene = new three.Scene();
    this.camera = new three.PerspectiveCamera();

    const floorMaterial = new three.MeshBasicMaterial({
      color: 'white',
      map: rockTexture,
    });
    const floorGeometry = new three.BoxGeometry(1, 1, 1);

    const floorObjects = range(this.floorSize * this.floorSize).map((i) => {
      const x = i % this.floorSize;
      const y = (i - x) / this.floorSize;

      const floorObject = new three.Mesh(floorGeometry, floorMaterial);
      floorObject.position.x = x - this.floorSize / 2;
      floorObject.position.y = -1;
      floorObject.position.z = y - this.floorSize / 2;

      return floorObject;
    });

    floorObjects.forEach((floorObject) => this.scene.add(floorObject));

    const spriteMaterial = new three.SpriteMaterial({
      map: necromantTexture,
    });

    const avatarCount = parseInt(
      new URLSearchParams(location.search).get('count') ?? '128'
    );
    this.avatars = range(avatarCount).map(() => {
      const sprite = new three.Sprite(spriteMaterial);
      sprite.center.y = 0;

      const avatar = new DummyWalker(sprite);
      avatar.moveSpeed = 2;
      avatar.accelSpeed = avatar.moveSpeed * 4;
      avatar.target = new vec2(0, 0);
      avatar.targetRange = this.floorSize * 0.75;
      avatar.position = new vec2(
        ((1 - 2 * Math.random()) / 2) * this.floorSize,
        ((1 - 2 * Math.random()) / 2) * this.floorSize
      );

      this.scene.add(sprite);

      return avatar;
    });

    // Run scene
    this.lastUpdate = -1;
    this.renderer.setAnimationLoop(time => this.update(time));
  }

  private update(time: milliseconds) {
    // Calculate frame delta
    if (this.lastUpdate < 0) {
      this.lastUpdate = time;
    }

    const dt = (time - this.lastUpdate) / 1000;
    this.lastUpdate = time;

    // Move camera
    const yaw = radians(45 + Math.sin((time / 12000) * PIx2) * 15);
    const pitch = radians(30);
    const distance = this.floorSize * 2;

    this.camera.position.set(
      Math.cos(yaw) * Math.cos(pitch) * distance,
      Math.sin(pitch) * distance,
      Math.sin(yaw) * Math.cos(pitch) * distance
    );

    this.camera.lookAt(0, 0, 0);

    // Update avatars
    this.avatars.forEach((avatar) => {
      avatar.update(dt);

      avatar.sprite.position.x = avatar.position.x;
      avatar.sprite.position.z = avatar.position.y;
    });

    // Render
    this.renderer.render(this.scene, this.camera);

    // Update FPS counter
    this.fpsCounter.pushMillis(dt * 1000);
  }
}
