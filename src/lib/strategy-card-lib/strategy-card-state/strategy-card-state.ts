import { GameObject, Player, world } from "@tabletop-playground/api";
import { NamespaceId, NSID, ParsedNSID, PlayerSlot } from "ttpg-darrell";

export type StrategyCardNumberAndState = {
  number: number;
  state: string;
};

/**
 * Per-player set of active strategy cards, in order of play.
 */
export class StrategyCardState {
  public onStrategyCardPlayedHandler = (
    strategyCard: GameObject,
    player: Player
  ): void => {
    const playerSlot: PlayerSlot = player.getSlot();
    const strategyCardNumber: number | undefined =
      StrategyCardState.strategyCardToNumber(strategyCard);
    if (strategyCardNumber !== undefined) {
      this.addOrUpdate(playerSlot, strategyCardNumber, "");
    }
  };

  private readonly _persistenceKey: NamespaceId;
  private readonly _playerSlotToActive: Map<
    PlayerSlot,
    Array<StrategyCardNumberAndState>
  > = new Map();

  static strategyCardToNumber(strategyCard: GameObject): number | undefined {
    const nsid: string = NSID.get(strategyCard);
    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    const firstNamePart: string | undefined = parsed?.nameParts[0];
    if (firstNamePart === "leadership") {
      return 1;
    } else if (firstNamePart === "diplomacy") {
      return 2;
    } else if (firstNamePart === "politics") {
      return 3;
    } else if (firstNamePart === "construction") {
      return 4;
    } else if (firstNamePart === "trade") {
      return 5;
    } else if (firstNamePart === "warfare") {
      return 6;
    } else if (firstNamePart === "technology") {
      return 7;
    } else if (firstNamePart === "imperial") {
      return 8;
    }
    return undefined;
  }

  constructor(persistenceKey: NamespaceId) {
    this._persistenceKey = persistenceKey;
    this._load();

    TI4.events.onStrategyCardPlayed.add(this.onStrategyCardPlayedHandler);
  }

  destroy(): void {
    TI4.events.onStrategyCardPlayed.remove(this.onStrategyCardPlayedHandler);
  }

  _save(): void {
    const packed = [];
    for (const [playerSlot, active] of this._playerSlotToActive.entries()) {
      const packedEntry = [];
      packedEntry.push(playerSlot);
      for (const activeEntry of active) {
        packedEntry.push(activeEntry.number, activeEntry.state);
      }
      packed.push(packedEntry);
    }
    const json: string = JSON.stringify(packed);
    world.setSavedData(json, this._persistenceKey);
  }

  _load(): void {
    this._playerSlotToActive.clear();
    const json: string | undefined = world.getSavedData(this._persistenceKey);
    if (json && json.length > 0) {
      const entries = JSON.parse(json);
      for (const entry of entries) {
        const playerSlot: number = entry.shift() as number;
        const active: Array<StrategyCardNumberAndState> =
          this._getMutableActive(playerSlot);
        while (entry.length > 0) {
          const number: number = entry.shift() as number;
          const state: string = entry.shift() as string;
          active.push({ number, state });
        }
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
