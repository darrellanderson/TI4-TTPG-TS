import { GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";

/**
 * Remove all command tokens owned by the player who owns this card
 * from the game board.
 */
export class HeroHelioCommandArray extends AbstractRightClickCard {
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
