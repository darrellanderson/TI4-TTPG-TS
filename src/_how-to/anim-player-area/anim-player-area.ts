import { GameObject, Vector } from "@tabletop-playground/api";
import { AnimCamera } from "_how-to/anim-lib/anim-camera";
import { AnimDelay } from "_how-to/anim-lib/anim-delay";
import { Find, PlayerSlot } from "ttpg-darrell";

export class AnimPlayerArea {
  private readonly _find: Find = new Find();
  private readonly _playerSlot: PlayerSlot;
  private readonly _center: Vector;

  constructor(playerSlot: PlayerSlot) {
    this._playerSlot = playerSlot;

    const pos: Vector = TI4.playerSeats.getDealPosition(playerSlot);
    pos.x += pos.x < 0 ? -25 : 25;
    pos.z = AnimCamera.CAMERA_Z; // Set the camera height
    this._center = pos;
  }

  toCenter(): Promise<void> {
    return AnimCamera.simple(this._center);
  }

  toObj(nsid: string): Promise<void> {
    const skipContained: boolean = true;
    const obj: GameObject | undefined = this._find.findGameObject(
      nsid,
      this._playerSlot,
      skipContained
    );
    if (!obj) {
      throw new Error(
        `Object with NSID ${nsid} not found for player slot ${this._playerSlot}`
      );
    }
    const pos: Vector = obj.getPosition();
    pos.z = AnimCamera.CAMERA_Z;
    return AnimCamera.simple(pos);
  }

  async fullTour(): Promise<void> {
    await this.toObj("sheet.faction:base/generic");
    await AnimDelay.simple(1000);

    await this.toObj("mat:base/status-pad");
    await AnimDelay.simple(1000);

    await this.toObj("mat.player:base/build");
    await AnimDelay.simple(1000);
    await this.toObj("mat.player:base/planet");
    await AnimDelay.simple(1000);
    await this.toObj("mat.player:base/technology");
  }

  async miniTour(): Promise<void> {
    await this.toObj("sheet.faction:base/generic");
    await AnimDelay.simple(1000);
  }
}
