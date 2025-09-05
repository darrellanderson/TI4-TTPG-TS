import {
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";

export class NumpadKeySpawn {
  private readonly _keyToNsid: Record<number, string>;

  private readonly _onScriptButtonPressed = (
    player: Player,
    index: number,
    ctrl: boolean,
    alt: boolean
  ): void => {
    const nsid: string | undefined = this._keyToNsid[index];
    if (nsid && !ctrl && !alt) {
      const pos: Vector = player.getCursorPosition();
      pos.z = world.getTableHeight() + 10;
      const obj: GameObject | undefined = TI4.spawn.spawn(nsid, pos);
      if (obj) {
        obj.snapToGround();
      }
    }
  };

  constructor(keyToNsid: Record<number, string>) {
    // Validate NSIDs.
    for (const key in keyToNsid) {
      const nsid: string | undefined = keyToNsid[key];
      if (!nsid || !TI4.spawn.has(nsid)) {
        throw new Error(`NumpadKeySpawn: Unknown NSID: "${keyToNsid[key]}"`);
      }
    }

    this._keyToNsid = keyToNsid;
    globalEvents.onScriptButtonPressed.add(this._onScriptButtonPressed);
  }

  destroy() {
    globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
  }
}
