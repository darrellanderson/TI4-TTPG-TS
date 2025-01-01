import {
  GameObject,
  globalEvents,
  Player,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Broadcast, IGlobal, NSID } from "ttpg-darrell";

import { System } from "lib/system-lib/system/system";

// Persist the last activated system and the player slot that activated it.
const KEY: string = "@TI4/last-activated";
type LastActivatedType = {
  tile: number;
  slot: number;
};

export class OnSystemActivated implements IGlobal {
  private static __lastActivatedSystem: System | undefined;
  private static __lastActivatingPlayerSlot: number | undefined;

  static getLastActivatedSystem(): System | undefined {
    return this.__lastActivatedSystem;
  }

  static getLastActivatingPlayerSlot(): number | undefined {
    return this.__lastActivatingPlayerSlot;
  }

  private readonly _onReleasedHandler = (
    object: GameObject,
    player: Player,
    _thrown: boolean,
    _grabPosition: Vector | [x: number, y: number, z: number],
    _grabRotation: Rotator | [pitch: number, yaw: number, roll: number]
  ): void => {
    const playerSlot: number = TI4.turnOrder.getCurrentTurn();
    const isActivePlayer: boolean = playerSlot === player.getSlot();
    if (isActivePlayer) {
      const pos: Vector = object.getPosition();
      const system: System | undefined = TI4.systemRegistry.getByPosition(pos);
      if (system) {
        const state: LastActivatedType = {
          tile: system.getSystemTileNumber(),
          slot: player.getSlot(),
        };
        const json: string = JSON.stringify(state);
        world.setSavedData(json, KEY);

        TI4.events.onSystemActivated.trigger(system, player);
      }
    }
  };

  init(): void {
    globalEvents.onObjectCreated.add((obj: GameObject): void => {
      this._maybeLinkCommandToken(obj);
    });
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeLinkCommandToken(obj);
    }

    TI4.events.onSystemActivated.add((system: System, player: Player): void => {
      OnSystemActivated.__lastActivatedSystem = system;
      OnSystemActivated.__lastActivatingPlayerSlot = player.getSlot();
      const name: string = player.getName();
      const systemSummary: string = system.getName();
      const message: string = `${name} activated ${systemSummary}`;
      Broadcast.broadcastAll(message);
    });

    // Restore last activated system.
    const json: string = world.getSavedData(KEY);
    if (json && json.length > 0) {
      const parsed = JSON.parse(json);
      const tile: number = parsed.tile;
      const slot: number = parsed.slot;
      OnSystemActivated.__lastActivatedSystem =
        TI4.systemRegistry.getBySystemTileNumber(tile);
      OnSystemActivated.__lastActivatingPlayerSlot = slot;
    }
  }

  _maybeLinkCommandToken(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("token.command:")) {
      obj.onReleased.remove(this._onReleasedHandler);
      obj.onReleased.add(this._onReleasedHandler);
    }
  }
}
