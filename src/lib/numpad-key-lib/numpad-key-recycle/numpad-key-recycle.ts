import { GameObject, globalEvents, Player } from "@tabletop-playground/api";
import { Broadcast, GarbageContainer, locale } from "ttpg-darrell";

const CONTROL_KEY_NEEDED = 3;

locale.inject({
  "ui.error.numpad0_control":
    "Numpad-0 restricted, press control + numpad-0 {remaining} {#remaining|time|times} to access numpad-0 to trash objects",
  "ui.error.numpad0_progress":
    "Press control + numpad-0 {remaining} more {#remaining|time|times} to access",
  "ui.error.numpad0_granted": "Numpad-0 access granted",
});

export class NumpadKeyRecycle {
  private readonly _playerNameToCtrlKeyCount: Map<string, number> = new Map();
  private readonly _key: number;

  private readonly _onScriptButtonPressed = (
    player: Player,
    index: number,
    ctrl: boolean,
    alt: boolean
  ): void => {
    // Our key?
    if (index !== this._key || alt) {
      return;
    }

    // Require control+key several times to enable normal key based recycle.
    const name: string = player.getName(); // key off player name
    let count: number = this._playerNameToCtrlKeyCount.get(name) || 0;
    if (ctrl) {
      count += 1;
      this._playerNameToCtrlKeyCount.set(player.getName(), count);
      if (count < CONTROL_KEY_NEEDED) {
        // Report progress.
        Broadcast.chatOne(
          player,
          locale("ui.error.numpad0_progress", {
            remaining: CONTROL_KEY_NEEDED - count,
          }),
          Broadcast.ERROR
        );
      } else if (count === CONTROL_KEY_NEEDED) {
        // Report access granted.
        Broadcast.chatOne(
          player,
          locale("ui.error.numpad0_granted"),
          Broadcast.ERROR
        );
      }
    } else {
      if (count < CONTROL_KEY_NEEDED) {
        // Report progress needed.
        Broadcast.chatOne(
          player,
          locale("ui.error.numpad0_control", {
            remaining: CONTROL_KEY_NEEDED - count,
          }),
          Broadcast.ERROR
        );
      } else {
        // Do recycle.
        const objs: Array<GameObject> = player.getHeldObjects();
        for (const obj of objs) {
          GarbageContainer.tryRecycle(obj, player);
        }
      }
    }
  };

  constructor(key: number) {
    this._key = key;
    globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
    globalEvents.onScriptButtonPressed.add(this._onScriptButtonPressed);
  }

  destroy() {
    globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
  }

  // expose for testing.
  _getCtrlKeyCount(player: Player): number {
    return this._playerNameToCtrlKeyCount.get(player.getName()) || 0;
  }
}
