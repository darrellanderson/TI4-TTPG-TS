import { GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";

export class Mutiny extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.action:base/mutiny";
    const customActionName: string = "*Score";
    const customActionHandler = (
      obj: GameObject,
      player: Player,
      actionName: string
    ) => {
      if (actionName === customActionName) {
        this.score(player.getSlot());
      }
    };
    super(cardNsidPrefix, customActionName, customActionHandler);
  }

  protected _onRightClick(): void {
    console.log("Mutiny right-clicked");
  }
}
