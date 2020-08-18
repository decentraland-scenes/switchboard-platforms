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

// Switchboards
const buttonAShape = new GLTFShape("models/buttonA.glb")
const buttonBShape = new GLTFShape("models/buttonB.glb")

const buttonABlue = new Entity()
buttonABlue.addComponent(buttonAShape)
buttonABlue.addComponent(new Transform())

const buttonBBlue = new Entity()
buttonBBlue.addComponent(buttonBShape)
buttonBBlue.addComponent(new Transform())

const switchboardBlue = new Switchboard(
  new GLTFShape("models/switchboardBlue.glb"), 
  new Vector3(8, 3, 8),
  new Vector3(27, 3, 8),
  buttonABlue,
  buttonBBlue
)
