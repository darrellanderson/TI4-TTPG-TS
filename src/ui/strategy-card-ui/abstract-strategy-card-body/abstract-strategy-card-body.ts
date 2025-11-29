import { PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import {
  StrategyCardNumberAndState,
  StrategyCardsState,
} from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

/**
 * Manage the contents of a strategy card UI (betweent the title and the
 * play/pass buttons).
 *
 * Body can be empty.  Also provides optional additional report text.
 *
 * Use getState/setState to preserve any data needed to regenerate the body.
 */
export abstract class AbstractStrategyCardBody {
  private readonly _strategyCardsState: StrategyCardsState;
  private readonly _strategyCardNumber: number;
  private readonly _playerSlot: PlayerSlot;

  constructor(
    strategyCardsState: StrategyCardsState,
    strategyCardNumber: number,
    playerSlot: PlayerSlot
  ) {
    this._strategyCardsState = strategyCardsState;
    this._strategyCardNumber = strategyCardNumber;
    this._playerSlot = playerSlot;
  }

  getState(): string | undefined {
    const numbersAndStates: Array<StrategyCardNumberAndState> =
      this._strategyCardsState.active(this._playerSlot);
    for (const numberAndState of numbersAndStates) {
      if (numberAndState.n === this._strategyCardNumber) {
        return numberAndState.s;
      }
    }
    return undefined;
  }

  setState(state: string): void {
    this._strategyCardsState.addOrUpdate(
      this._playerSlot,
      this._strategyCardNumber,
      state
    );
  }

  isPlayingPlayer(): boolean {
    const lastPlayerSlotPlayed: PlayerSlot | undefined =
      this._strategyCardsState.getLastPlayerSlotPlayed(
        this._strategyCardNumber
      );
    return lastPlayerSlotPlayed === this._playerSlot;
  }

  getPlayerSlot(): PlayerSlot {
    return this._playerSlot;
  }

  getStrategyCardNumber(): number {
    return this._strategyCardNumber;
  }

  abstract getStrategyCardName(): string;
  abstract getBody(scale: number): AbstractUI | undefined;
  abstract getReport(): string | undefined;
}
