import { GameObject, Player, Vector, world } from "@tabletop-playground/api";
import { PlayerSlot, TurnOrder } from "ttpg-darrell";

import { Scoreboard } from "../../score-lib/scoreboard/scoreboard";
import { System } from "../../system-lib/system/system";

/**
 * Move the player's camera:
 *
 * - To system on system activation.
 * - To full map on turn change.
 * - To scoring area on all passed.
 *
 * No camera movement necessary for agenda, agenda UI is on screen.
 */
export class AutoStreamerCamera {
  private static __instance: AutoStreamerCamera | null = null;

  private readonly _streamerPlayerSlots: Set<PlayerSlot> = new Set();
  private readonly _scoreboard: Scoreboard = new Scoreboard();

  private readonly _onAllPlayersPassed = (): void => {
    this._lookAtScoring();
  };

  private readonly _onSystemActivated = (
    system: System,
    _player: Player
  ): void => {
    this._lookAtSystem(system);
  };

  private readonly _onTurnStateChanged = (_turnOrder: TurnOrder): void => {
    this._lookAtFullMap();
  };

  static getInstance(): AutoStreamerCamera {
    if (this.__instance === null) {
      this.__instance = new AutoStreamerCamera();
    }
    return this.__instance;
  }

  // Private: must use getInstance
  private constructor() {
    TI4.events.onAllPlayersPassed.add(this._onAllPlayersPassed);
    TI4.events.onSystemActivated.add(this._onSystemActivated);
    TurnOrder.onTurnStateChanged.add(this._onTurnStateChanged);
  }

  destroy(): void {
    TI4.events.onAllPlayersPassed.remove(this._onAllPlayersPassed);
    TI4.events.onSystemActivated.remove(this._onSystemActivated);
    TurnOrder.onTurnStateChanged.remove(this._onTurnStateChanged);
    AutoStreamerCamera.__instance = null;
  }

  addStreamerPlayerSlot(playerSlot: PlayerSlot): void {
    this._streamerPlayerSlots.add(playerSlot);
  }

  hasStreamerPlayerSlot(playerSlot: PlayerSlot): boolean {
    return this._streamerPlayerSlots.has(playerSlot);
  }

  removeStreamerPlayerSlot(playerSlot: PlayerSlot): void {
    this._streamerPlayerSlots.delete(playerSlot);
  }

  _lookAtSystem(system: System): void {
    const lookAtPos: Vector = system.getObj().getPosition();
    this._lookAt(lookAtPos, 20);
  }

  _lookAtScoring(): void {
    const scoreboardObj: GameObject | undefined =
      this._scoreboard.getScoreboard();
    if (scoreboardObj) {
      const lookAtPos: Vector = scoreboardObj.getPosition().add([-13, 0, 0]);
      this._lookAt(lookAtPos, 60);
    }
  }

  _lookAtFullMap(): void {
    const lookAtPos: Vector = new Vector(0, 0, world.getTableHeight());
    this._lookAt(lookAtPos, 110);
  }

  _lookAt(pos: Vector, height: number): void {
    pos.z = world.getTableHeight();
    const lookFrom: Vector = pos.add([-10, 0, height]);
    const rot = lookFrom.findLookAtRotation(pos);
    for (const playerSlot of this._streamerPlayerSlots) {
      const player: Player | undefined = world.getPlayerBySlot(playerSlot);
      if (player) {
        player.setPositionAndRotation(lookFrom, rot);
      }
    }
  }
}
