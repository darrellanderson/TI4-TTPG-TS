import { AnimCamera } from "_how-to/anim-lib/anim-camera";
import { AnimDelay } from "_how-to/anim-lib/anim-delay";
import { PlayerSlot } from "ttpg-darrell";

export class AnimPlayerArea {
  private readonly _playerSlot: PlayerSlot;

  constructor(playerSlot: PlayerSlot) {
    this._playerSlot = playerSlot;
  }

  async fullTour(): Promise<void> {
    const z: number = AnimCamera.CAMERA_Z;

    await AnimCamera.simpleObj("sheet.faction:base/generic", z);
    await AnimDelay.simple(1000);

    await AnimDelay.simple(1000);

    await AnimCamera.simpleObj("mat.player:base/build", z);
    await AnimDelay.simple(1000);
    await AnimCamera.simpleObj("mat.player:base/planet", z);
    await AnimDelay.simple(1000);
    await AnimCamera.simpleObj("mat.player:base/technology", z);
  }

  async miniTour(): Promise<void> {
    const z: number = AnimCamera.CAMERA_Z;

    await AnimCamera.simpleObj("sheet.faction:base/generic", z);
    await AnimDelay.simple(1000);
  }
}
