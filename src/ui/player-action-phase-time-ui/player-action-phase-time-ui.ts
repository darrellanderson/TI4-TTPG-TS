import {
  Border,
  Color,
  HorizontalBox,
  LayoutBox,
  Text,
  TextJustification,
  VerticalBox,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";
import { PlayerSeatType } from "../../lib/player-lib/player-seats/player-seats";

export class PlayerActionPhaseTimeUI extends AbstractUI {
  private readonly _roundToSeatIndexToTimeText: Array<Array<Text>> = [];
  private intervalHandle: NodeJS.Timeout | undefined = undefined;

  readonly _onInterval = (): void => {
    this.update();
  };

  constructor(scale: number) {
    const numStandardWidths: number = 3;
    const numPlayers: number = TI4.config.playerCount;
    const scaledWidth: number =
      (CONFIG.BUTTON_WIDTH * numStandardWidths +
        CONFIG.SPACING * (numStandardWidths - 1)) *
      scale;
    const scaledHeight: number =
      (CONFIG.BUTTON_HEIGHT * (numPlayers + 1) + CONFIG.SPACING * numPlayers) *
      scale *
      0.65; // +1 for header, extra scale b/c tighter than usual ui

    const box: LayoutBox = new LayoutBox()
      .setOverrideWidth(scaledWidth)
      .setOverrideHeight(scaledHeight);
    super(box, { w: scaledWidth, h: scaledHeight });
    box.setChild(this._createInnerWidget(scale));
    this.update();

    this.intervalHandle = setInterval(this._onInterval, 1000);
  }

  destroy(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = undefined;
    }
    super.destroy();
  }

  _createInnerWidget(scale: number): Widget {
    const playerNames: Array<string> = TI4.playerSeats
      .getAllSeats()
      .map((playerSeat: PlayerSeatType): string => {
        const playerSlot: number = playerSeat.playerSlot;
        return TI4.playerName.getBySlot(playerSlot);
      });

    const labelWeight: number = 1;
    const timeWeight: number = 0.4;
    const horizontalBox: HorizontalBox = new HorizontalBox().setChildDistance(
      CONFIG.SPACING * scale
    );

    // Round "zero" doesn't exist, use it for player names.
    // Use seat-index -1 for player names.
    for (let round: number = 0; round <= 6; round++) {
      const verticalBox: VerticalBox = new VerticalBox().setChildDistance(
        CONFIG.SPACING * scale
      );
      const weight: number = round === 0 ? labelWeight : timeWeight;

      // Use a dark background on alternating columns.
      let widget: Widget = verticalBox;
      if (round % 2 === 1) {
        const border: Border = new Border()
          .setColor(CONFIG.DARKER)
          .setChild(verticalBox);
        widget = border;
      }
      horizontalBox.addChild(widget, weight);

      const seatIndexToTimeText: Array<Text> = [];
      this._roundToSeatIndexToTimeText[round] = seatIndexToTimeText;
      for (
        let seatIndex: number = -1;
        seatIndex < playerNames.length;
        seatIndex++
      ) {
        const playerSlot: number =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const text: Text = new Text()
          .setBold(true)
          .setFontSize(CONFIG.FONT_SIZE * scale)
          .setText(`${round}/${seatIndex}`);
        if (playerSlot >= 0) {
          const color: Color = world.getSlotColor(playerSlot);
          text.setTextColor(color);
        }
        if (round > 0) {
          text.setJustification(TextJustification.Center);
        }
        seatIndexToTimeText[seatIndex] = text;
        verticalBox.addChild(text, 1);
      }
    }
    return horizontalBox;
  }

  update() {
    for (let round: number = 0; round <= 6; round++) {
      for (
        let seatIndex: number = -1;
        seatIndex < TI4.config.playerCount;
        seatIndex++
      ) {
        this._updateRoundAndSeatIndex(round, seatIndex);
      }
    }
  }

  _formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const secondsRemainder: number = seconds % 60;
    const secondsString: string =
      secondsRemainder < 10 ? `0${secondsRemainder}` : `${secondsRemainder}`;
    return `${minutes}:${secondsString}`;
  }

  _updateRoundAndSeatIndex(round: number, seatIndex: number) {
    const seatIndexToTimeText: Array<Text> | undefined =
      this._roundToSeatIndexToTimeText[round];
    if (!seatIndexToTimeText) {
      return;
    }
    const text: Text | undefined = seatIndexToTimeText[seatIndex];
    if (!text) {
      return;
    }
    if (round === 0) {
      // First column, header and player names.
      if (seatIndex === -1) {
        text.setText("Action phase time".toUpperCase());
      } else {
        const playerSlot: number =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        text.setText(TI4.playerName.getBySlot(playerSlot));
      }
    } else {
      if (seatIndex === -1) {
        // First row, header.
        text.setText(`${round}`);
      } else {
        // Player action phase time.
        const totalSeconds: number = TI4.playerActionPhaseTime.getSeconds(
          round,
          seatIndex
        );
        const textString: string = this._formatTime(totalSeconds);
        text.setText(textString);
      }
    }
  }
}
