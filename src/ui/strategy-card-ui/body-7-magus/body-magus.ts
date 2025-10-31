import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { ThrottleClickHandler } from "ttpg-darrell";
import { Button, Player } from "@tabletop-playground/api";

export class BodyMagus extends AbstractStrategyCardBody {
  private readonly _onChooseTechButtonClicked =
    new ThrottleClickHandler<Button>(
      (_button: Button, player: Player): void => {
        const playerSlot: number = player.getSlot();
        TI4.events.onTechChooserRequest.trigger(playerSlot);
      }
    ).get();

  constructor(strategyCardsState: StrategyCardsState, playerSlot: number) {
    super(strategyCardsState, -7, playerSlot);
  }

  getStrategyCardName(): string {
    return "Magus";
  }

  getBody(_scale: number): AbstractUI | undefined {
    return undefined;
  }

  getReport(): string | undefined {
    return undefined;
  }
}
