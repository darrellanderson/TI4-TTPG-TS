import {
  GameObject,
  Player,
  refObject,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Atop, DeletedItemsContainer, NSID, PlayerSlot } from "ttpg-darrell";
import { __atopCacheGet } from "../lib/combat-lib/combat-roll/combat-roll";
import { SpawnControlToken } from "../lib/control-token-lib/spawn-control-token";
import { PlayerSeatType } from "../lib/player-lib/player-seats/player-seats";

const ACTION_MAT_TF_SPLICE_INTENT_RESET: string = "*Reset Control Tokens";

class MatTfSpliceIntent {
  private readonly _obj: GameObject;

  private readonly _onFactionChanged = (_playerSlot: number): void => {
    this._reset();
  };

  private readonly _onStrategyCardPlayed = (
    _strategyCard: GameObject,
    _player: Player,
  ): void => {
    if (TI4.config.sources.includes("twilights-fall")) {
      this._reset();
    }
  };

  private readonly _onCustomAction = (
    _object: GameObject,
    _player: Player,
    identifier: string,
  ): void => {
    if (identifier === ACTION_MAT_TF_SPLICE_INTENT_RESET) {
      this._reset();
    }
  };

  constructor(obj: GameObject) {
    this._obj = obj;

    TI4.events.onFactionChanged.remove(this._onFactionChanged);
    TI4.events.onFactionChanged.add(this._onFactionChanged);
    //TI4.events.onStrategyCardPlayed.remove(this._onStrategyCardPlayed);
    //TI4.events.onStrategyCardPlayed.add(this._onStrategyCardPlayed);

    obj.removeCustomAction(ACTION_MAT_TF_SPLICE_INTENT_RESET);
    obj.addCustomAction(ACTION_MAT_TF_SPLICE_INTENT_RESET);
    obj.onCustomAction.remove(this._onCustomAction);
    obj.onCustomAction.add(this._onCustomAction);

    this._reset();
  }

  _reset(): void {
    this._removeControlTokens();
    this._spawnControlTokens();
  }

  _removeControlTokens(): void {
    const atop: Atop = __atopCacheGet(this._obj);

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const pos: Vector = obj.getPosition();
      if (nsid.startsWith("token.control:") && atop.isAtop(pos)) {
        DeletedItemsContainer.destroyWithoutCopying(obj);
      }
    }
  }

  _spawnControlTokens(): void {
    const spawnControlToken: SpawnControlToken = new SpawnControlToken();

    const playerSlots: Array<PlayerSlot> = TI4.playerSeats
      .getAllSeats()
      .map((seat: PlayerSeatType): PlayerSlot => seat.playerSlot);

    playerSlots.forEach((playerSlot: PlayerSlot, index: number): void => {
      const pos: Vector | undefined = this._getTokenPos(index);
      pos.z = world.getTableHeight() + 10;
      const token: GameObject | undefined =
        spawnControlToken.spawnControlToken(playerSlot);
      if (token) {
        token.setPosition(pos);
        token.snapToGround();
      }
    });
  }

  _getTokenPos(index: number): Vector {
    const playerCount: number = TI4.config.playerCount;
    const numCols = Math.ceil(playerCount / 2);
    let col: number = index % numCols;
    let row: number = Math.floor(index / numCols);

    if (index >= numCols) {
      col = numCols - col - 1;
    }

    // Make relative to center.
    col -= (numCols - 1) / 2;
    row -= 0.5;

    // Left to right.
    col = -col;

    const y: number = col * 1.5;
    const x: number = row * 2.3;
    const localPos: Vector = new Vector(x, y, 0);

    // Move up slightly to match mat slot.
    localPos.x += 0.5;

    return this._obj.localPositionToWorld(localPos);
  }
}

new MatTfSpliceIntent(refObject);
