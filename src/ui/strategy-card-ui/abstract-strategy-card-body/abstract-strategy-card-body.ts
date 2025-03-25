import { AbstractUI } from "../../abstract-ui/abtract-ui";
import {
  StrategyCardNumberAndState,
  StrategyCardsState,
} from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { PlayerSlot } from "ttpg-darrell";

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
      if (numberAndState.number === this._strategyCardNumber) {
        return numberAndState.state;
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

  abstract getStrategyCardName(): string;
  abstract getStrategyCardNumber(): number;
  abstract getBody(scale: number): AbstractUI | undefined;
  abstract getReport(): string | undefined;
}
