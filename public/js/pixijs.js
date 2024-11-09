// import * as PIXI from 'pixi.js'
import FPSCounter from "./fps-counter.js"

function range(n) {
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
  ?? 128
)

const avatarMoveSpeed = 32
const avatarAccelerationSpeed = avatarMoveSpeed / .25
const avatars = range(avatarCount).map(() => {
  const avatar = PIXI.Sprite.from(assets.necromant)
  avatar.velocity = new PIXI.Point()
  
  avatar.position.set(
    Math.random() * app.canvas.width,
    Math.random() * app.canvas.height
  )

  avatar.pivot.set(avatar.width / 2, avatar.height / 2)

  return avatar
})

avatars.forEach(avatar => app.stage.addChild(avatar))

// Animate
app.ticker.add(ticker => {
  // Run simulation
  avatars.forEach(avatar => {
    const dt = ticker.deltaMS / 1000.

    let cohesionW = avatar.position.subtract(new PIXI.Point(128, 128)).magnitude() / 96
    cohesionW = Math.min(1., Math.max(0., cohesionW))
    cohesionW = Math.pow(cohesionW, 4.)

    const brownainW = 1. - cohesionW

    const brownianDir = new PIXI.Point(
      2. * Math.random() - 1.,
      2. * Math.random() - 1.
    )
    .normalize()
    .multiplyScalar(brownainW)

    const cohesionDir = new PIXI.Point(
      128 - avatar.position.x,
      128 - avatar.position.y
    )
    .normalize()
    .multiplyScalar(cohesionW)

    const acceleration = new PIXI.Point()
      .add(brownianDir)
      .add(cohesionDir)
      .normalize()
      .multiplyScalar(avatarAccelerationSpeed * dt)

    avatar.velocity = avatar.velocity.add(acceleration)
    if (avatar.velocity.magnitude() > avatarMoveSpeed) {
      avatar.velocity = avatar.velocity
        .normalize()
        .multiplyScalar(avatarMoveSpeed)
    }

    avatar.position.x += avatar.velocity.x * dt
    avatar.position.y += avatar.velocity.y * dt
    avatar.zIndex = avatar.position.y
  })

  // Update FPS counter
  fpsCounter.pushMillis(ticker.deltaMS)
  document.querySelector('#fps').innerHTML = 'FPS: ' + (fpsCounter.averageFps | 0)
})

app.start()
