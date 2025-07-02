import { Vector } from "@tabletop-playground/api";
import { AnimCamera } from "_how-to/anim-lib/anim-camera";
import { PlayerSlot } from "ttpg-darrell";

export class AnimPlayerArea {
  private readonly _playerSlot: PlayerSlot;
  private readonly _area: Vector;

  constructor(playerSlot: PlayerSlot) {
    this._playerSlot = playerSlot;

    const pos: Vector = TI4.playerSeats.getDealPosition(playerSlot);
    pos.x += pos.x < 0 ? -25 : 25;
    this._area = pos;
  }

  toCenter(): Promise<void> {
    return AnimCamera.simple(this._area);
  }

  tour(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.toCenter().then(() => {
        resolve();
      });
    });
  }
}
