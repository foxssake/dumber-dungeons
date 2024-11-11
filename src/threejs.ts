import * as three from 'three'
import DummyWalker, { vec2 } from './dummy-walker'

const PI = 3.14159265
const PIx2 = PI * 2

function radians(degrees: number): number {
  return degrees / 180 * PI
}

function range(n: number): Array<number> {
  return [...new Array(n)].map((_, i) => i)
}

// Init three.js / Setup rendering
const renderer = new three.WebGLRenderer({
  alpha: true // Transparent background
})

renderer.setSize(512, 512, false)

document.body.appendChild(renderer.domElement)

// Load resources

const textureLoader = new three.TextureLoader()
const necromantTexture = await textureLoader.loadAsync('/assets/necromant.png')
necromantTexture.magFilter = three.NearestFilter

// Setup scene
const scene = new three.Scene()
const camera = new three.PerspectiveCamera()

const floorSize = 16
const floorMaterial = new three.MeshBasicMaterial({ color: 'white' })
const floorGeometry = new three.BoxGeometry(floorSize, 1, floorSize)
const floorObject = new three.Mesh(floorGeometry, floorMaterial)

floorObject.position.y = -1

scene.add(floorObject)

const spriteMaterial = new three.SpriteMaterial({
  map: necromantTexture
})

const avatarCount = 128
const avatars = range(avatarCount).map(() => {
  const sprite = new three.Sprite(spriteMaterial)
  sprite.center.y = 0

  const avatar = new DummyWalker(sprite)
  avatar.moveSpeed = 2
  avatar.accelSpeed = avatar.moveSpeed * 4
  avatar.target = new vec2(0, 0)
  avatar.targetRange = floorSize * .75
  avatar.position = new vec2(
    (1 - 2 * Math.random()) / 2 * floorSize,
    (1 - 2 * Math.random()) / 2 * floorSize
  )

  scene.add(sprite)

  return avatar
})

// Run scene
let lastUpdate = -1
renderer.setAnimationLoop(timeMs => {
  // Calculate frame delta
  if (lastUpdate < 0) {
    lastUpdate = timeMs
  }

  const dt = (timeMs - lastUpdate) / 1000
  lastUpdate = timeMs

  // Move camera
  const yaw = radians(45 + Math.sin(timeMs / 12000 * PIx2) * 15)
  const pitch = radians(30)
  const distance = floorSize * Math.SQRT2

  camera.position.set(
    Math.cos(yaw) * Math.cos(pitch) * distance,
    Math.sin(pitch) * distance,
    Math.sin(yaw) * Math.cos(pitch) * distance
  )

  camera.lookAt(0, 0, 0)

  // Update avatars
  avatars.forEach(avatar => {
    avatar.update(dt)

    avatar.sprite.position.x = avatar.position.x
    avatar.sprite.position.z = avatar.position.y
  })

  // Render
  renderer.render(scene, camera)
})

