import * as PIXI from 'pixi.js'
import FPSCounter from './fps-counter'
import DummyWalker from './dummy-walker'

function range(n: number): Array<number> {
  return [...new Array(n)].map((_, i) => i)
}

// Init
const app = new PIXI.Application()
await app.init({ width: 256, height: 256, backgroundAlpha: 0 })

const fpsCounter = new FPSCounter(128)

document.body.appendChild(app.canvas)

// Load resources
const assets = {
  necromant: await PIXI.Assets.load('/assets/necromant.png'),
  background: await PIXI.Assets.load('/assets/test-background.png')
}

// Setup scene
const background = PIXI.Sprite.from(assets.background)
app.stage.addChild(background)

const avatarCount = parseInt(
  (new URLSearchParams(location.search)).get('count')
  ?? '128'
)

const avatars = range(avatarCount).map(() => {
  const sprite = PIXI.Sprite.from(assets.necromant)
  sprite.pivot.set(sprite.width / 2, sprite.height)

  const avatar = new DummyWalker(sprite)
  avatar.position.x = Math.random() * app.canvas.width
  avatar.position.y = Math.random() * app.canvas.height

  return avatar
})

avatars.forEach(avatar => avatar.sprite && app.stage.addChild(avatar.sprite))

// Animate
app.ticker.add(ticker => {
  // Run simulation
  const dt = ticker.deltaMS / 1000.
  avatars.forEach(avatar => {
    avatar.update(dt)

    avatar.sprite.position.x = avatar.position.x | 0
    avatar.sprite.position.y = avatar.position.y | 0

    avatar.sprite.zIndex = avatar.position.y
  })

  // Update FPS counter
  fpsCounter.pushMillis(ticker.deltaMS)

  const counterDiv = document.querySelector('#fps')
  if (counterDiv)
    counterDiv.innerHTML = 'FPS: ' + (fpsCounter.averageFps | 0)
})

app.start()
