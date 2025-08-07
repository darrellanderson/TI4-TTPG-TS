import {
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import { IGlobal, NSID } from "ttpg-darrell";

export const NSID_BOOM_TOKEN: string = "token:homebrew.test/boom";
export const ACTION_BOOM: string = "*Boom";
export const TOOLTIP_BOOM: string = "Destroy units on some die roll";

/**
 * Testing for homebrew.  Right click a token to roll a die for every unit
 * in the system, destroy on some value.
 */
export class RightClickTokenBoom implements IGlobal {
  private readonly _onObjectCreated = (obj: GameObject): void => {
    this._maybeAddContextMenu(obj);
  };

  private readonly _onCustomAction = (
    object: GameObject,
    player: Player,
    identifier: string
  ): void => {
    if (identifier === ACTION_BOOM) {
      this._boom(object, player);
    }
  };

  init(): void {
    globalEvents.onObjectCreated.add(this._onObjectCreated);
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAddContextMenu(obj);
    }
  }

  _maybeAddContextMenu(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (nsid === NSID_BOOM_TOKEN) {
      obj.removeCustomAction(ACTION_BOOM);
      obj.addCustomAction(ACTION_BOOM, TOOLTIP_BOOM);
      obj.onCustomAction.remove(this._onCustomAction);
      obj.onCustomAction.add(this._onCustomAction);
    }
  }

  _boom(_obj: GameObject, _player: Player): void {
    // TODO
  }
}
