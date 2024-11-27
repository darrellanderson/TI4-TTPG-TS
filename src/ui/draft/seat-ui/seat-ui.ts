import {
  Color,
  HorizontalAlignment,
  LayoutBox,
  Text,
  VerticalAlignment,
  Widget,
  world,
} from "@tabletop-playground/api";
import { BOX_H, BOX_W, FONT_SIZE } from "../faction-ui/faction-ui";
import { PlayerSeatType } from "lib/player-lib/player-seats/player-seats";
import { AbstractUI } from "../../abstract-ui/abtract-ui";

export class SeatUI extends AbstractUI {
  private readonly _speakerSeatIndex: number;
  private readonly _seatIndex: number;
  private readonly _fontSize: number;

  constructor(seatIndex: number, speakerSeatIndex: number, scale: number) {
    super({ w: BOX_W * scale, h: BOX_H * scale });
    this._speakerSeatIndex = speakerSeatIndex;
    this._seatIndex = seatIndex;
    this._fontSize = FONT_SIZE * scale;
  }

  _getPlayerSlotOrThrow(seatIndex: number): number {
    const playerSeatType: PlayerSeatType | undefined =
      TI4.playerSeats.getAllSeats()[seatIndex];
    if (!playerSeatType) {
      throw new Error(`Unexpected seat index: ${seatIndex}`);
    }
    return playerSeatType.playerSlot;
  }

  _getLabelOrThrow(seatIndex: number): string {
    const playerCount: number = TI4.config.playerCount;
    let pickCount: number = seatIndex - this._speakerSeatIndex;
    if (pickCount < 0) {
      pickCount += playerCount;
    }
    const result: string | undefined = [
      "Speaker",
      "2nd Pick",
      "3rd Pick",
      "4th Pick",
      "5th Pick",
      "6th Pick",
      "7th Pick",
      "8th Pick",
    ][pickCount];
    if (result === undefined) {
      throw new Error(`Unexpected pick count: ${pickCount}`);
    }
    return result.toUpperCase();
  }

  getWidget(): Widget {
    const label: string = this._getLabelOrThrow(this._seatIndex);
    const playerSlot: number = this._getPlayerSlotOrThrow(this._seatIndex);

    const color: Color = world.getSlotColor(playerSlot);
    const text: Widget = new Text()
      .setBold(true)
      .setFontSize(this._fontSize)
      .setTextColor(color)
      .setText(label);

    return new LayoutBox()
      .setOverrideWidth(this._width)
      .setOverrideHeight(this._height)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(text);
  }
}
