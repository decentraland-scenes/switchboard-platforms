import utils from "../node_modules/decentraland-ecs-utils/index"
import { TriggerBoxShape } from "../node_modules/decentraland-ecs-utils/triggers/triggerSystem"

// Sound
const switchSound = new Entity()
switchSound.addComponent(new AudioSource(new AudioClip("sounds/switch.mp3")))
switchSound.addComponent(new Transform())
switchSound.getComponent(Transform).position = Camera.instance.position
engine.addEntity(switchSound)

export class Switchboard extends Entity {
  constructor(model: GLTFShape, startPos: Vector3, endPos: Vector3, public buttonA: Entity, public buttonB: Entity, public gears: Entity) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(new Transform({ position: startPos }))

    // Parent button and gears to switchboard
    buttonA.setParent(this)
    buttonB.setParent(this)
    gears.setParent(this)

    // Trigger configurations
    const buttonTriggerA = new TriggerBoxShape(new Vector3(2.75, 2.75, 2.75), new Vector3(1.5, 2, 0))
    const buttonTriggerB = new TriggerBoxShape(new Vector3(2.75, 2.75, 2.75), new Vector3(-1.5, 2, 0))

    // Button triggers
    buttonA.addComponent(
      new utils.TriggerComponent(buttonTriggerA, null, null, null, null, () => {
        this.movePlatform(-0.12, 0, -180, endPos)
      })
    )

    buttonB.addComponent(
      new utils.TriggerComponent(buttonTriggerB, null, null, null, null, () => {
        this.movePlatform(0, -0.12, 180, startPos)
      })
    )
  }

  private movePlatform(buttonAPos: number, buttonBPos: number, rotationSpeed: number, targetPos: Vector3) {
    switchSound.getComponent(AudioSource).playOnce()
    this.buttonA.getComponent(Transform).position.y = buttonAPos
    this.buttonB.getComponent(Transform).position.y = buttonBPos
    let currentPos = this.getComponent(Transform).position
    this.addComponentOrReplace(
      new utils.MoveTransformComponent(currentPos, targetPos, Math.abs(targetPos.x - currentPos.x) * 0.25, () => {
        this.resetButtons()
      })
    )
    this.gears.addComponentOrReplace(new utils.KeepRotatingComponent(Quaternion.Euler(0, 0, rotationSpeed)))
  }

  private resetButtons(): void {
    switchSound.getComponent(AudioSource).playOnce()
    this.buttonA.getComponent(Transform).position.y = 0
    this.buttonB.getComponent(Transform).position.y = 0
    this.gears.addComponentOrReplace(new utils.KeepRotatingComponent(Quaternion.Euler(0, 0, 0)))
  }
}
