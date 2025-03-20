import { world } from "@tabletop-playground/api";
import { NamespaceId, PlayerSlot } from "ttpg-darrell";

export type StrategyCardNumberAndState = {
  number: number;
  state: string;
};

/**
 * Per-player set of active strategy cards, in order of play.
 */
export class StrategyCardState {
  private readonly _persistenceKey: NamespaceId;
  private readonly _playerSlotToActive: Map<
    PlayerSlot,
    Array<StrategyCardNumberAndState>
  > = new Map();

  constructor(persistenceKey: NamespaceId) {
    this._persistenceKey = persistenceKey;
    this._load();
  }

  _save(): void {
    const json: string = JSON.stringify(
      Array.from(this._playerSlotToActive.entries())
    );
    world.setSavedData(json, this._persistenceKey);
  }

  _load(): void {
    const json: string | undefined = world.getSavedData(this._persistenceKey);
    if (json && json.length > 0) {
      const entries: Array<[PlayerSlot, Array<StrategyCardNumberAndState>]> =
        JSON.parse(json);
      this._playerSlotToActive.clear();
      for (const entry of entries) {
        this._playerSlotToActive.set(entry[0], entry[1]);
      }
    }
  }

  _getMutableActive(playerSlot: PlayerSlot): Array<StrategyCardNumberAndState> {
    let active: Array<StrategyCardNumberAndState> | undefined =
      this._playerSlotToActive.get(playerSlot);
    if (!active) {
      active = [];
      this._playerSlotToActive.set(playerSlot, active);
    }
    return active;
  }

  active(playerSlot: PlayerSlot): Array<StrategyCardNumberAndState> {
    const active: Array<StrategyCardNumberAndState> =
      this._getMutableActive(playerSlot);
    return active.map((entry) => {
      // clone
      return {
        number: entry.number,
        state: entry.state,
      };
    });
  }

  addOrUpdate(playerSlot: number, strategyCardNumber: number, state: string) {
    const active: Array<StrategyCardNumberAndState> =
      this._getMutableActive(playerSlot);
    let strategyCardNumberAndState: StrategyCardNumberAndState | undefined =
      active.find(
        (entry: StrategyCardNumberAndState): boolean =>
          entry.number === strategyCardNumber
      );
    if (!strategyCardNumberAndState) {
      strategyCardNumberAndState = { number: strategyCardNumber, state };
      active.push(strategyCardNumberAndState);
    } else {
      strategyCardNumberAndState.state = state;
    }
    this._save();
  }

  remove(playerSlot: number, strategyCardNumber: number) {
    const active: Array<StrategyCardNumberAndState> =
      this._getMutableActive(playerSlot);
    const index: number = active.findIndex(
      (entry: StrategyCardNumberAndState): boolean =>
        entry.number === strategyCardNumber
    );
    if (index > -1) {
      active.splice(index, 1);
    }
    this._save();
  }
}
