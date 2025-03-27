import {
  CheckBox,
  Color,
  Player,
  TextJustification,
  world,
} from "@tabletop-playground/api";
import { Broadcast, PlayerSlot } from "ttpg-darrell";
import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CheckBoxUI } from "../../button-ui/checkbox-ui";
import { CONFIG } from "../../config/config";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { LongLabelUI } from "../../button-ui/long-label-ui";
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

    const playingPlayerSlot: PlayerSlot = this.getPlayerSlot();
    const playingPlayerName: string =
      TI4.playerName.getBySlot(playingPlayerSlot);
    const playingPlayerColor: Color = world.getSlotColor(playingPlayerSlot);

    const availableSlots: Array<PlayerSlot> = TI4.playerSeats
      .getAllSeats()
      .map((playerSeat: PlayerSeatType): PlayerSlot => playerSeat.playerSlot)
      .filter((slot: PlayerSlot): boolean => slot !== this.getPlayerSlot());

    const uis: Array<AbstractUI> = availableSlots.map(
      (slot: PlayerSlot): AbstractUI => {
        const targetPlayerName: string = TI4.playerName.getBySlot(slot);
        const targetColor: Color = world.getSlotColor(slot);

        const checkBoxUi: CheckBoxUI = new CheckBoxUI(scale);
        checkBoxUi.getCheckBox().setIsChecked(this._checkedSlots.has(slot));
        checkBoxUi
          .getCheckBox()
          .setText(targetPlayerName)
          .setTextColor(targetColor);
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
                const msg: string = `${playingPlayerName} refreshes ${targetPlayerName}.`;
                Broadcast.chatAll(msg, playingPlayerColor);
              } else {
                this._checkedSlots.delete(slot);
                const msg: string = `${playingPlayerName} un-refreshes ${targetPlayerName}.`;
                Broadcast.chatAll(msg, playingPlayerColor);
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

    const half: number = Math.ceil(uis.length / 2);
    const uis1: Array<AbstractUI> = uis.slice(0, half);
    const uis2: Array<AbstractUI> = uis.slice(half);

    const left: AbstractUI = new VerticalUIBuilder()
      .setSpacing(-CONFIG.SPACING * scale)
      .addUIs(uis1)
      .build();
    const right: AbstractUI = new VerticalUIBuilder()
      .setSpacing(-CONFIG.SPACING * scale)
      .addUIs(uis2)
      .build();
    const bottom: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([left, right])
      .build();

    const width2x: number = (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING) * scale;
    const label: LongLabelUI = new LongLabelUI(width2x, scale);
    label
      .getText()
      .setJustification(TextJustification.Left)
      .setText("Refresh players:");
    return new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([label, bottom])
      .build();
  }

  getReport(): string | undefined {
    return undefined;
  }
}
