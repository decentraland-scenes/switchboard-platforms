import utils from "../node_modules/decentraland-ecs-utils/index"
import { Coin } from "./coin"
import { Switchboard } from "./switchboard"

// Base
const base = new Entity()
base.addComponent(new GLTFShape("models/baseLight.glb"))
base.addComponent(new Transform({ scale: new Vector3(2, 1, 1) }))
engine.addEntity(base)

// Platform and rails
const platforms = new Entity()
platforms.addComponent(new GLTFShape("models/platforms.glb"))
engine.addEntity(platforms)

// Coins
const coinShape = new GLTFShape("models/starCoin.glb") // Includes the spinning animation
let triggerBoxShape = new utils.TriggerBoxShape(new Vector3(1.5, 2.5, 1.5), new Vector3(0, 1, 0)) // Trigger shape for coin
const coin = new Coin(coinShape, new Transform({ position: new Vector3(29, 6, 8) }), triggerBoxShape)

// Switchboard
const buttonAShape = new GLTFShape("models/buttonA.glb")
const buttonBShape = new GLTFShape("models/buttonB.glb")

const buttonA = new Entity()
buttonA.addComponent(buttonAShape)
buttonA.addComponent(new Transform())

const buttonB = new Entity()
buttonB.addComponent(buttonBShape)
buttonB.addComponent(new Transform())

const gears = new Entity()
gears.addComponent(new GLTFShape("models/gears.glb"))
gears.addComponent(new Transform())

const switchboard = new Switchboard(
  new GLTFShape("models/switchboard.glb"), 
  new Vector3(8, 3, 8),
  new Vector3(27, 3, 8),
  buttonA,
  buttonB,
  gears
)
