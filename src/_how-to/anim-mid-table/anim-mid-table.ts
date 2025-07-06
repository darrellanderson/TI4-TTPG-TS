import { AnimCamera } from "_how-to/anim-lib/anim-camera";
import { AnimDelay } from "_how-to/anim-lib/anim-delay";

export class AnimMidTable {
  async tour(): Promise<void> {
    const z: number = AnimCamera.CAMERA_Z;

    await AnimCamera.simpleObj("tile.system:base/18", z);
    await AnimDelay.simple(1000);
    await AnimCamera.simpleObj("mat:base/strategy-card", z);
    await AnimDelay.simple(1000);
    await AnimCamera.simpleObj("mat:base/combat-arena", z);
    await AnimDelay.simple(1000);
    await AnimCamera.simpleObj("mat.deck:base/base", z);
    await AnimDelay.simple(1000);
    await AnimCamera.simpleObj("mat:base/objective-2", z);
    await AnimDelay.simple(1000);
  }
}
