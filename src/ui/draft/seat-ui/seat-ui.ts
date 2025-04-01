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
import { PlayerSeatType } from "../../../lib/player-lib/player-seats/player-seats";
import { AbstractUI } from "../../abstract-ui/abtract-ui";

export class SeatUI extends AbstractUI {
  static _getPlayerSlotOrThrow(seatIndex: number): number {
    const playerSeatType: PlayerSeatType | undefined =
      TI4.playerSeats.getAllSeats()[seatIndex];
    if (!playerSeatType) {
      throw new Error(`Unexpected seat index: ${seatIndex}`);
    }
    return playerSeatType.playerSlot;
  }

  static _getLabelOrThrow(seatIndex: number, speakerSeatIndex: number): string {
    const playerCount: number = TI4.config.playerCount;
    let pickCount: number = seatIndex - speakerSeatIndex;
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

  constructor(seatIndex: number, speakerSeatIndex: number, scale: number) {
    const w: number = BOX_W * scale;
    const h: number = BOX_H * scale;

    const fontSize = FONT_SIZE * scale;

    const label: string = SeatUI._getLabelOrThrow(seatIndex, speakerSeatIndex);
    const playerSlot: number = SeatUI._getPlayerSlotOrThrow(seatIndex);

    const color: Color = world.getSlotColor(playerSlot);
    const text: Widget = new Text()
      .setBold(true)
      .setFontSize(fontSize)
      .setTextColor(color)
      .setText(label);

    const widget: Widget = new LayoutBox()
      .setOverrideWidth(w)
      .setOverrideHeight(h)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(text);

    super(widget, { w: BOX_W * scale, h: BOX_H * scale });
  }
}
