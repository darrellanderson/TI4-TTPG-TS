import {
  Container,
  GameObject,
  GameWorld,
  Player,
  refObject,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";
import { AdvanceScore } from "../lib/score-lib/advance-score/advance-score";

export class CustodiansToken {
  private readonly _obj: GameObject;
  private readonly _find: Find = new Find();

  private readonly _actionName: string = "*Score";
  private readonly _customActionHandler = (
    _obj: GameObject,
    player: Player,
    actionName: string
  ) => {
    if (actionName === this._actionName) {
      this.score(player.getSlot());
    }
  };

  constructor(obj: GameObject) {
    this._obj = obj;

    obj.addCustomAction(this._actionName);
    obj.onCustomAction.add(this._customActionHandler);
  }

  score(playerSlot: number): void {
    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      "container.token.control:base/generic",
      playerSlot,
      skipContained
    );
    if (container) {
      const pos: Vector = container.getPosition().add([0, 0, 10]);
      const controlToken: GameObject | undefined = container.takeAt(0, pos);
      if (controlToken) {
        const controlTokenExtent: Vector = controlToken.getExtent(false, false);
        const custodiansTokenExtent: Vector = this._obj.getExtent(false, false);
        const controlD: number = Math.max(
          controlTokenExtent.x,
          controlTokenExtent.y
        );
        const custodiansD: number = Math.max(
          custodiansTokenExtent.x,
          custodiansTokenExtent.y
        );
        const d: number = custodiansD - controlD;
        const dst: Vector = this._obj
          .getPosition()
          .add([
            Math.random() * d,
            Math.random() * d,
            world.getTableHeight() + 10,
          ]);
        controlToken.setPosition(dst);
        controlToken.snapToGround();
      }
    }
    new AdvanceScore().addToScore(playerSlot, 1);
  }
}

export function createFromObject(
  obj: GameObject,
  executionReason: string
): void {
  if (executionReason !== "unittest") {
    new CustodiansToken(obj);
  }
}
createFromObject(refObject, GameWorld.getExecutionReason());
