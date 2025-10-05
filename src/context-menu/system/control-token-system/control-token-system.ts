import {
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { SpawnControlToken } from "lib";
import { Find, IGlobal, NSID } from "ttpg-darrell";

export class ControlTokenSystem implements IGlobal {
  private readonly _find: Find = new Find();

  private readonly _actionName: string = "*Add Control Token";
  private readonly _customActionHandler = (
    obj: GameObject,
    player: Player,
    actionName: string
  ) => {
    if (actionName === this._actionName) {
      this.addControlToken(obj, player);
    }
  };

  init(): void {
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAddContextMenuItem(obj);
    }
    globalEvents.onObjectCreated.add((obj: GameObject) => {
      this._maybeAddContextMenuItem(obj);
    });
  }

  _maybeAddContextMenuItem(obj: GameObject) {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("tile.system:")) {
      obj.removeCustomAction(this._actionName);
      obj.addCustomAction(this._actionName);
      obj.onCustomAction.remove(this._customActionHandler);
      obj.onCustomAction.add(this._customActionHandler);
    }
  }

  addControlToken(systemTileObj: GameObject, player: Player): boolean {
    /*
    const container: Container | undefined = this._find.findContainer(
      "container.token.control:base/generic",
      player.getSlot()
    );
    if (!container) {
      return false;
    }
    const pos: Vector = systemTileObj.getPosition().add([0, 0, 10]);
    const showAnimation: boolean = true;
    const keep: boolean = true;
    const token: GameObject | undefined = container.takeAt(
      0,
      pos,
      showAnimation,
      keep
    );
    if (!token) {
      return false;
    }
    token.snapToGround();
    */

    // takeAt leaving a token on top of container?
    // instead spawn a new one.

    const playerSlot: number = player.getSlot();
    const pos: Vector = systemTileObj.getPosition().add([0, 0, 10]);

    const spawnControlToken = new SpawnControlToken();
    const token: GameObject =
      spawnControlToken.spawnControlTokenOrThrow(playerSlot);
    token.setPosition(pos);
    token.snapToGround();

    return true;
  }
}
