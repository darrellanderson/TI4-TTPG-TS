// 9 (z+70)
import {
  CardHolder,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

export class NumpadKeyLookMySeat {
  private readonly _find: Find = new Find();
  private readonly _key: number;

  private readonly _onScriptButtonPressed = (
    player: Player,
    index: number,
    ctrl: boolean,
    alt: boolean
  ): void => {
    // Our key?
    if (index !== this._key || ctrl || alt) {
      return;
    }

    const skipContained: boolean = true;
    const cardHolder: CardHolder | undefined = this._find.findCardHolder(
      "card-holder:base/player-hand",
      player.getSlot(),
      skipContained
    );
    if (!cardHolder) {
      return;
    }

    const lookAt: Vector = cardHolder.getPosition();
    lookAt.x = lookAt.x * 0.7; // move towards center
    lookAt.z = world.getTableHeight();

    const lookFrom: Vector = lookAt.add([-10, 0, 70]);
    const rot = lookFrom.findLookAtRotation(lookAt);
    player.setPositionAndRotation(lookFrom, rot);
  };

  constructor(key: number) {
    this._key = key;
    globalEvents.onScriptButtonPressed.add(this._onScriptButtonPressed);
  }

  destroy(): void {
    globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
  }
}
