import Phaser from 'phaser';
import DummyWalker from './dummy-walker';
import FPSCounter from './fps-counter';

function range(n: number): Array<number> {
  return [...new Array<number>(n)].map((_, i) => i);
}

const fpsCounter = new FPSCounter(128);

const avatarCount = parseInt(
  new URLSearchParams(location.search).get('count') ?? '128'
);

class Example extends Phaser.Scene {
  private avatars: DummyWalker<Phaser.Types.Physics.Arcade.ImageWithDynamicBody>[] =
    [];

  public preload(): void {
    this.load.image('background', '/assets/test-background.png');
    this.load.image('character', '/assets/necromant.png');
  }

  public create(): void {
    this.add.image(128, 128, 'background');

    this.avatars = range(avatarCount).map(() => {
      const sprite = this.physics.add.image(128, 128, 'character');

      const avatar = new DummyWalker(sprite);
      avatar.position.x = Math.floor(Math.random() * 256);
      avatar.position.y = Math.floor(Math.random() * 256);

      return avatar;
    });
  }

  public update(time: number, delta: number): void {
    // Run simulation
    this.avatars.forEach((avatar) => {
      avatar.update(delta / 1000);
      avatar.sprite.x = avatar.position.x | 0;
      avatar.sprite.y = avatar.position.y | 0;
      avatar.sprite.z = avatar.position.y;
    });
    // console.log(time);
    /*
      phaser.js:80317 1524.8
      phaser.js:80317 1541.4
      phaser.js:80317 1558.1
      phaser.js:80317 1574.7
      phaser.js:80317 1591.4
      phaser.js:80317 1608.1
      phaser.js:80317 1624.8
      phaser.js:80317 1641.5
      phaser.js:80317 1658.1
      phaser.js:80317 1674.8
      phaser.js:80317 1691.4
      phaser.js:80317 1708.1
    */
    // Update FPS counter
    // TODO: time is ms since start, so in theory we don't need manipulate it
    // but the FPS counter always writes 0 :( // no the performance is better than that :D
    fpsCounter.pushMillis(time);

    const counterDiv = document.querySelector('#fps');
    if (counterDiv) counterDiv.innerHTML = `FPS: ${fpsCounter.averageFps | 0}`;
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: 'red',
  width: 256,
  height: 256,
  scene: Example,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
};

new Phaser.Game(config);
