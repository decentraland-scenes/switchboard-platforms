import utils from "../node_modules/decentraland-ecs-utils/index"
import { ToggleState } from "../node_modules/decentraland-ecs-utils/toggle/toggleComponent"
import { TriggerBoxShape } from "../node_modules/decentraland-ecs-utils/triggers/triggerSystem"

// Sound
const switchSound = new Entity()
switchSound.addComponent(new AudioSource(new AudioClip("sounds/switch.mp3")))
switchSound.addComponent(new Transform())
switchSound.getComponent(Transform).position = Camera.instance.position
engine.addEntity(switchSound)

// Trigger configurations
const buttonTriggerA = new TriggerBoxShape(new Vector3(2.75, 2.75, 2.75), new Vector3(-1.5, 2, 0))
const buttonTriggerB = new TriggerBoxShape(new Vector3(2.75, 2.75, 2.75), new Vector3(1.5, 2, 0))

export class Switchboard extends Entity {
  constructor(model: GLTFShape, startPos: Vector3, endPos: Vector3, public buttonA: Entity, public buttonB: Entity) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(new Transform({ position: startPos }))

    buttonA.setParent(this)
    buttonB.setParent(this)

    // Create trigger for entity
    buttonA.addComponent(
      new utils.TriggerComponent(buttonTriggerA, null, null, null, null, () => {
        switchSound.getComponent(AudioSource).playOnce()
        this.getComponent(utils.ToggleComponent).set(utils.ToggleState.Off)
        buttonA.getComponent(Transform).position.y = -0.125
        buttonB.getComponent(Transform).position.y = 0
      })
    )

    buttonB.addComponent(
      new utils.TriggerComponent(buttonTriggerB, null, null, null, null, () => {
        switchSound.getComponent(AudioSource).playOnce()
        this.getComponent(utils.ToggleComponent).set(utils.ToggleState.On)
        buttonA.getComponent(Transform).position.y = 0
        buttonB.getComponent(Transform).position.y = -0.125
      })
    )

    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (value: ToggleState) => {
        // Move the platform to the end position
        if (value == utils.ToggleState.On) {
          this.addComponentOrReplace(
            new utils.MoveTransformComponent(
              this.getComponent(Transform).position,
              endPos,
              (endPos.x - this.getComponent(Transform).position.x) * 0.1,
              () => {
                this.resetButtons(buttonA, buttonB)
              }
            )
          )
        } else {
          // Move the platform to the start position once the player
          this.addComponentOrReplace(
            new utils.MoveTransformComponent(
              this.getComponent(Transform).position,
              startPos,
              (this.getComponent(Transform).position.x - startPos.x) * 0.1,
              () => {
                this.resetButtons(buttonA, buttonB)
              }
            )
          )
        }
      })
    )
  }

  private resetButtons(buttonA: Entity, buttonB: Entity) {
    switchSound.getComponent(AudioSource).playOnce()
    buttonA.getComponent(Transform).position.y = 0
    buttonB.getComponent(Transform).position.y = 0
  }
}
