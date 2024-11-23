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
  private avatars: DummyWalker<Phaser.GameObjects.Image>[] = [];

  public preload(): void {
    this.load.image('background', '/assets/test-background.png');
    this.load.image('character', '/assets/necromant.png');
  }

  public create(): void {
    this.add.image(128, 128, 'background');

    this.avatars = range(avatarCount).map(() => {
      const sprite = this.add.image(128, 128, 'character');

      const avatar = new DummyWalker(sprite);
      avatar.position.x = Math.floor(Math.random() * 256);
      avatar.position.y = Math.floor(Math.random() * 256);

      return avatar;
    });
  }

  public update(_time: number, delta: number): void {
    // Run simulation
    this.avatars.forEach((avatar) => {
      avatar.update(delta / 1000);
      avatar.sprite.x = avatar.position.x | 0;
      avatar.sprite.y = avatar.position.y | 0;
      avatar.sprite.z = avatar.position.y;
    });

    fpsCounter.pushMillis(delta);

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
  transparent: true,
};

new Phaser.Game(config);
