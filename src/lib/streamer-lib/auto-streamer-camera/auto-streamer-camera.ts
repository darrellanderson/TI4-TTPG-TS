import { GameObject, Player, Vector, world } from "@tabletop-playground/api";
import { IGlobal, NamespaceId, PlayerSlot, TurnOrder } from "ttpg-darrell";

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
export class AutoStreamerCamera implements IGlobal {
  private readonly _streamerPlayerSlots: Set<PlayerSlot> = new Set();
  private readonly _scoreboard: Scoreboard = new Scoreboard();
  private readonly _namespaceId: NamespaceId;

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

  constructor(namespaceId: NamespaceId) {
    this._namespaceId = namespaceId;
    this._load();
  }

  init(): void {
    TI4.events.onAllPlayersPassed.add(this._onAllPlayersPassed);
    TI4.events.onSystemActivated.add(this._onSystemActivated);
    TurnOrder.onTurnStateChanged.add(this._onTurnStateChanged);
  }

  destroy(): void {
    TI4.events.onAllPlayersPassed.remove(this._onAllPlayersPassed);
    TI4.events.onSystemActivated.remove(this._onSystemActivated);
    TurnOrder.onTurnStateChanged.remove(this._onTurnStateChanged);

    world.setSavedData("", this._namespaceId);
  }

  addStreamerPlayerSlot(playerSlot: PlayerSlot): void {
    this._streamerPlayerSlots.add(playerSlot);
    this._save();
  }

  hasStreamerPlayerSlot(playerSlot: PlayerSlot): boolean {
    return this._streamerPlayerSlots.has(playerSlot);
  }

  removeStreamerPlayerSlot(playerSlot: PlayerSlot): void {
    this._streamerPlayerSlots.delete(playerSlot);
    this._save();
  }

  _load(): void {
    this._streamerPlayerSlots.clear();
    const json: string | undefined = world.getSavedData(this._namespaceId);
    if (json && json.length > 0) {
      const playerSlots: PlayerSlot[] = JSON.parse(json);
      for (const playerSlot of playerSlots) {
        this._streamerPlayerSlots.add(playerSlot);
      }
    }
  }

  _save(): void {
    const json: string = JSON.stringify(Array.from(this._streamerPlayerSlots));
    world.setSavedData(json, this._namespaceId);
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
    const lookAtPos: Vector = new Vector(6, 0, world.getTableHeight());
    this._lookAt(lookAtPos, 135);
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
