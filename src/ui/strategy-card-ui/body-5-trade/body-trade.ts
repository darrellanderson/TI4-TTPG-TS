import { CheckBox, Color, Player, world } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CheckBoxUI } from "../../button-ui/checkbox-ui";
import { CONFIG } from "../../config/config";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { PlayerSeatType } from "../../../lib/player-lib/player-seats/player-seats";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

export class BodyTrade extends AbstractStrategyCardBody {
  private readonly _checkedSlots: Set<PlayerSlot> = new Set();

  constructor(strategyCardsState: StrategyCardsState, playerSlot: number) {
    super(strategyCardsState, 5, playerSlot);

    const state: string | undefined = this.getState();
    if (state && state.length > 0) {
      const checkedSlotsArray: Array<PlayerSlot> = JSON.parse(state);
      for (const slot of checkedSlotsArray) {
        this._checkedSlots.add(slot);
      }
    }
  }

  getStrategyCardName(): string {
    return "Trade";
  }

  getBody(scale: number): AbstractUI | undefined {
    const enabled: boolean = this.isPlayingPlayer();
    if (!enabled) {
      return undefined;
    }

    const availableSlots: Array<PlayerSlot> = TI4.playerSeats
      .getAllSeats()
      .map((playerSeat: PlayerSeatType): PlayerSlot => playerSeat.playerSlot)
      .filter((slot: PlayerSlot): boolean => slot !== this.getPlayerSlot());

    const uis: Array<AbstractUI> = availableSlots.map(
      (slot: PlayerSlot): AbstractUI => {
        const colorName: string | undefined =
          TI4.playerColor.getSlotColorName(slot);
        const color: Color = world.getSlotColor(slot);

        const checkBoxUi: CheckBoxUI = new CheckBoxUI(scale);
        checkBoxUi.getCheckBox().setIsChecked(this._checkedSlots.has(slot));
        if (colorName) {
          checkBoxUi.getCheckBox().setText(colorName).setTextColor(color);
        }
        checkBoxUi
          .getCheckBox()
          .onCheckStateChanged.add(
            (
              _checkBox: CheckBox,
              _player: Player,
              isChecked: boolean
            ): void => {
              if (isChecked) {
                this._checkedSlots.add(slot);
              } else {
                this._checkedSlots.delete(slot);
              }
              const json: string = JSON.stringify(
                Array.from(this._checkedSlots)
              );
              this.setState(json);
            }
          );

        return checkBoxUi;
      }
    );

    return new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();
  }

  getReport(): string | undefined {
    return undefined;
  }
}
