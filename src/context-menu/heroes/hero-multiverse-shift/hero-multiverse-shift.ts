import { GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";

export class HeroMultiverseShift extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "x";
    const customActionName: string = "*Dimensional Anchor";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {};
    super(cardNsidPrefix, customActionName, customActionHandler);
  }
}
