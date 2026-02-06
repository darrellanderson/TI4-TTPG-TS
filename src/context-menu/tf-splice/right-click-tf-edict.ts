/**
 * Not a splice, option to draw 3 edict as public information (required?).
 * Place them face up on the table to the right of the "agenda" deck.
 */
import { Card, GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickDeck } from "ttpg-darrell";

const ACTION_NAME: string = "*Draw 3 to table";

export class RightClickTFEdict extends AbstractRightClickDeck {
  constructor() {
    const deckNsidPrefix: string = "card.tf-edict:";
    const customActionHandler = (
      object: GameObject,
      _player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_NAME && object instanceof Card) {
        this._draw3EdictsToTable(object);
      }
    };

    super(deckNsidPrefix, ACTION_NAME, customActionHandler);
  }

  _draw3EdictsToTable(deck: Card): void {
    // TODO XXX TODO XXX
  }
}
