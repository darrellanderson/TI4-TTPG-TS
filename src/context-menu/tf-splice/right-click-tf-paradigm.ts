import { Card, GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickDeck } from "ttpg-darrell";
import { Splice } from "../../lib/twilights-fall-lib/splice/splice";

const ACTION_PREFIX: string = "*Splice Paradigm ";

export class RightClickTFParadigmSplice extends AbstractRightClickDeck {
  constructor() {
    const deckNsidPrefix: string = "card.tf-paradigm:";
    const customActionName: string = `${ACTION_PREFIX}2`;
    const customActionHandler = (
      object: GameObject,
      _player: Player,
      identifier: string
    ): void => {
      if (identifier.startsWith(ACTION_PREFIX)) {
        const countStr: string = identifier.substring(ACTION_PREFIX.length);
        const count: number = parseInt(countStr, 10);
        if (!isNaN(count) && count > 0 && object instanceof Card) {
          this._splice(object, count);
        }
      }
    };

    super(deckNsidPrefix, customActionName, customActionHandler);
    for (let i = 3; i <= 9; i++) {
      this.addCustomActionName(`${ACTION_PREFIX}${i}`);
    }
  }

  _splice(deck: Card, count: number): void {
    new Splice().splice(deck, count);
  }
}
