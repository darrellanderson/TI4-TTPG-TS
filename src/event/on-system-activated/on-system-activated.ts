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

export class OnSystemActivated implements IGlobal {
  private static _lastActivatedSystem: System | undefined;

  static getLastActivatedSystem(): System | undefined {
    return this._lastActivatedSystem;
  }

  private readonly _onReleasedHandler = (
    object: GameObject,
    player: Player,
    _thrown: boolean,
    _grabPosition: Vector | [x: number, y: number, z: number],
    _grabRotation: Rotator | [pitch: number, yaw: number, roll: number]
  ): void => {
    const pos: Vector = object.getPosition();
    const system: System | undefined = TI4.systemRegistry.getByPosition(pos);
    if (system) {
      OnSystemActivated._lastActivatedSystem = system;
      TI4.onSystemActivated.trigger(system, player);
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

    TI4.onSystemActivated.add((system: System, player: Player): void => {
      const name: string = player.getName();
      const systemSummary: string = system.getName();
      const message: string = `${name} activated ${systemSummary}`;
      Broadcast.broadcastAll(message);
    });
  }

  _maybeLinkCommandToken(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("token.command:")) {
      obj.onReleased.add(this._onReleasedHandler);
    }
  }
}
