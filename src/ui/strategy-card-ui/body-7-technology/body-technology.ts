import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { ThrottleClickHandler } from "ttpg-darrell";
import { Button, Player } from "@tabletop-playground/api";

export class BodyTechnology extends AbstractStrategyCardBody {
  private readonly _onChooseTechButtonClicked =
    new ThrottleClickHandler<Button>(
      (_button: Button, player: Player): void => {
        const playerSlot: number = player.getSlot();
        TI4.events.onTechChooserRequest.trigger(playerSlot);
      }
    ).get();

  constructor(strategyCardsState: StrategyCardsState, playerSlot: number) {
    super(strategyCardsState, 7, playerSlot);
  }

  getStrategyCardName(): string {
    return "Technology";
  }

  getBody(scale: number): AbstractUI | undefined {
    const chooseButton: ButtonUI = new ButtonUI(scale);
    chooseButton.getButton().setText("Choose technology...");
    chooseButton.getButton().onClicked.add(this._onChooseTechButtonClicked);
    return chooseButton;
  }

  getReport(): string | undefined {
    return undefined;
  }
}
