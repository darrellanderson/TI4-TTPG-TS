import { PlayerSlot } from "ttpg-darrell";

/**
 * Per-player set of active strategy cards, in order of play.
 */
export class StrategyCardState {
  private readonly _playerSlotToActiveStrategyCardNsids: Map<
    PlayerSlot,
    Array<string>
  > = new Map();

  // Persist?

  _getMutableActiveNsids(playerSlot: PlayerSlot): Array<string> {
    let activeStrategyCards: Array<string> | undefined =
      this._playerSlotToActiveStrategyCardNsids.get(playerSlot);
    if (!activeStrategyCards) {
      activeStrategyCards = [];
      this._playerSlotToActiveStrategyCardNsids.set(
        playerSlot,
        activeStrategyCards
      );
    }
    return activeStrategyCards;
  }

  activeNsids(playerSlot: PlayerSlot): Array<string> {
    const activeStrategyCardNsids: Array<string> =
      this._getMutableActiveNsids(playerSlot);
    return [...activeStrategyCardNsids]; // return a copy
  }

  addNsid(playerSlot: number, strategyCardNsid: string) {
    const activeStrategyCardNsids: Array<string> =
      this._getMutableActiveNsids(playerSlot);
    if (!activeStrategyCardNsids.includes(strategyCardNsid)) {
      activeStrategyCardNsids.push(strategyCardNsid);
    }
  }

  removeNsid(playerSlot: number, strategyCardNsid: string) {
    const activeStrategyCardNsids: Array<string> =
      this._getMutableActiveNsids(playerSlot);
    const index: number = activeStrategyCardNsids.indexOf(strategyCardNsid);
    if (index > -1) {
      activeStrategyCardNsids.splice(index, 1);
    }
  }
}
