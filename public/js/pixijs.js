// import * as PIXI from 'pixi.js'

function range(n) {
  return [...new Array(n)].map((_, i) => i)
}

// Init
const app = new PIXI.Application()
await app.init({ width: 256, height: 256, backgroundAlpha: 0 })

document.body.appendChild(app.canvas)

// Load resources
const assets = {
  necromant: await PIXI.Assets.load('/assets/necromant.png'),
  background: await PIXI.Assets.load('/assets/test-background.png')
}

// Setup scene
const background = PIXI.Sprite.from(assets.background)
app.stage.addChild(background)

const avatarCount = 16
const avatarMoveSpeed = 1
const avatars = range(avatarCount).map(() => {
  const avatar = PIXI.Sprite.from(assets.necromant)
  
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
  avatars.forEach(avatar => {
    const brownian = new PIXI.Point(
      2. * Math.random() - 1.,
      2. * Math.random() - 1.
    )
    .normalize()

    const velocity = brownian.multiplyScalar(ticker.deltaTime * avatarMoveSpeed)

    avatar.position.x += velocity.x
    avatar.position.y += velocity.y
  })
})

app.start()
