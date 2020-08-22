import utils from "../node_modules/decentraland-ecs-utils/index"
import { TriggerBoxShape } from "../node_modules/decentraland-ecs-utils/triggers/triggerSystem"

// Sound
const switchSound = new Entity()
switchSound.addComponent(new AudioSource(new AudioClip("sounds/switch.mp3")))
switchSound.addComponent(new Transform())
switchSound.getComponent(Transform).position = Camera.instance.position
engine.addEntity(switchSound)

export class Switchboard extends Entity {
  constructor(
    model: GLTFShape,
    startPos: Vector3,
    endPos: Vector3,
    public buttonA: Entity,
    public buttonB: Entity,
    public gears: Entity
  ) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(new Transform({ position: startPos }))

    // Parent button and gears to switchboard
    buttonA.setParent(this)
    buttonB.setParent(this)
    gears.setParent(this)

    // Trigger configurations
    const buttonTriggerA = new TriggerBoxShape(
      new Vector3(2.75, 2.75, 2.75),
      new Vector3(-1.5, 2, 0)
    )
    const buttonTriggerB = new TriggerBoxShape(
      new Vector3(2.75, 2.75, 2.75),
      new Vector3(1.5, 2, 0)
    )

    // Button triggers
    buttonA.addComponent(
      new utils.TriggerComponent(buttonTriggerA, null, null, null, null, () => {
        this.movePlatform(this.getComponent(Transform).position, startPos)
        switchSound.getComponent(AudioSource).playOnce()
        buttonA.getComponent(Transform).position.y = -0.125
        buttonB.getComponent(Transform).position.y = 0
        gears.addComponentOrReplace(
          new utils.KeepRotatingComponent(Quaternion.Euler(0, 0, 180))
        )
      })
    )

    buttonB.addComponent(
      new utils.TriggerComponent(buttonTriggerB, null, null, null, null, () => {
        this.movePlatform(this.getComponent(Transform).position, endPos)
        switchSound.getComponent(AudioSource).playOnce()
        buttonA.getComponent(Transform).position.y = 0
        buttonB.getComponent(Transform).position.y = -0.125
        gears.addComponentOrReplace(
          new utils.KeepRotatingComponent(Quaternion.Euler(0, 0, -180))
        )
      })
    )
  }

  private movePlatform(currentPosition: Vector3, targetPosition: Vector3): void {
    this.addComponentOrReplace(
      new utils.MoveTransformComponent(
        currentPosition,
        targetPosition,
        Math.abs(targetPosition.x - this.getComponent(Transform).position.x) * 0.33,
        () => {
          this.resetButtons()
        }
      )
    )
  }

  private resetButtons(): void {
    switchSound.getComponent(AudioSource).playOnce()
    this.buttonA.getComponent(Transform).position.y = 0
    this.buttonB.getComponent(Transform).position.y = 0
    this.gears.addComponentOrReplace(new utils.KeepRotatingComponent(Quaternion.Euler(0, 0, 0)))
  }
}
