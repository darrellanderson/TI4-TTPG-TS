/**
 * Not a splice, option to draw 3 edict as public information (required?).
 * Place them face up on the table to the right of the "agenda" deck.
 */
import {
  Card,
  Color,
  GameObject,
  Player,
  world,
} from "@tabletop-playground/api";
import { AbstractRightClickDeck, Broadcast } from "ttpg-darrell";
import { Splice } from "../../lib/twilights-fall-lib/splice/splice";

const ACTION_NAME: string = "*Draw 3 to table";

export class RightClickTFEdict extends AbstractRightClickDeck {
  constructor() {
    const deckNsidPrefix: string = "card.tf-edict:";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_NAME && object instanceof Card) {
        this._draw3EdictsToTable(object, player);
      }
    };

    super(deckNsidPrefix, ACTION_NAME, customActionHandler);
  }

  _draw3EdictsToTable(deck: Card, player: Player): void {
    new Splice().splice(deck, 3);

    const playerSlot: number = player.getSlot();
    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    const color: Color = world.getSlotColor(playerSlot);
    const msg: string = `${playerName} drew 3 edicts to splice location`;
    Broadcast.chatAll(msg, color);
  }
}
