import {
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Spawn } from "ttpg-darrell";

export class NumpadKeySpawn {
  private readonly _key: number;
  private readonly _nsid: string;

  private readonly _onScriptButtonPressed = (
    player: Player,
    index: number,
    ctrl: boolean,
    alt: boolean
  ): void => {
    if (index === this._key && !ctrl && !alt) {
      const pos: Vector = player.getCursorPosition();
      pos.z = world.getTableHeight() + 10;
      const obj: GameObject | undefined = Spawn.spawn(this._nsid, pos);
      if (obj) {
        obj.snapToGround();
      }
    }
  };

  constructor(key: number, nsid: string) {
    if (!Spawn.has(nsid)) {
      throw new Error(`NumpadKeySpawn: Unknown NSID: "${nsid}"`);
    }

    this._key = key;
    this._nsid = nsid;
    globalEvents.onScriptButtonPressed.add(this._onScriptButtonPressed);
  }

  destroy() {
    globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
  }
}
