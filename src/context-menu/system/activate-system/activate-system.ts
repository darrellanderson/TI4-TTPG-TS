import {
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Broadcast, IGlobal, NSID } from "ttpg-darrell";

import {
  CommandTokenCounter,
  CommandTokenCounts,
} from "../../../lib/command-token-lib/command-token-counter/command-token-counter";
import { System } from "../../../lib/system-lib/system/system";

export class ActivateSystem implements IGlobal {
  private readonly _actionName: string = "*Activate System";
  private readonly _customActionHandler = (
    systemTileObj: GameObject,
    player: Player,
    actionName: string
  ) => {
    if (actionName === this._actionName) {
      this.moveCommandTokenToSystem(systemTileObj, player);
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

  moveCommandTokenToSystem(systemTileObj: GameObject, player: Player): boolean {
    const id: string = systemTileObj.getId();
    const system: System | undefined =
      TI4.systemRegistry.getBySystemTileObjId(id);
    if (!system) {
      return false;
    }

    const counter: CommandTokenCounter = new CommandTokenCounter();
    const playerSlotToCommandTokenCounts: Map<number, CommandTokenCounts> =
      counter.getPlayerSlotToCommandTokenCounts();
    const commandTokenCounts: CommandTokenCounts | undefined =
      playerSlotToCommandTokenCounts.get(player.getSlot());
    const token: GameObject | undefined = commandTokenCounts?.tactic.pop();
    if (!token) {
      Broadcast.broadcastAll("No command tokens available", Broadcast.ERROR);
      return false;
    }

    const pos: Vector = systemTileObj.getPosition().add([0, 6, 10]);
    token.setPosition(pos, 1);
    token.snapToGround();
    TI4.events.onSystemActivated.trigger(system, player);
    return true;
  }
}
