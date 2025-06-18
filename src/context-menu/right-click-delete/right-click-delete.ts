import {
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";

export const ACTION_DELETE: string = "Delete";

/**
 * Disable the default delete (delete key), replace with a context menu item.
 */
export class RightClickDelete implements IGlobal {
  private readonly _onCustomAction = (
    obj: GameObject,
    _player: Player,
    action: string
  ): void => {
    if (action === ACTION_DELETE && obj.isValid()) {
      obj.destroy();
    }
  };

  init(): void {
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._addRightClickDelete(obj);
    }
    globalEvents.onObjectCreated.add((obj: GameObject): void => {
      this._addRightClickDelete(obj);
    });
  }

  _addRightClickDelete(obj: GameObject): void {
    process.nextTick(() => {
      obj.removeCustomAction(ACTION_DELETE);
      obj.addCustomAction(ACTION_DELETE);
    });
    obj.onCustomAction.remove(this._onCustomAction);
    obj.onCustomAction.add(this._onCustomAction);
  }
}
