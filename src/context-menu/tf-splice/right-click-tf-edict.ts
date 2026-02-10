/**
 * Not a splice, option to draw 3 edict as public information (required?).
 * Place them face up on the table to the right of the "agenda" deck.
 */
import {
  Card,
  GameObject,
  Player,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { AbstractRightClickDeck } from "ttpg-darrell";

const ACTION_NAME: string = "*Draw 3 to table";

export class RightClickTFEdict extends AbstractRightClickDeck {
  constructor() {
    const deckNsidPrefix: string = "card.tf-edict:";
    const customActionHandler = (
      object: GameObject,
      _player: Player,
      identifier: string,
    ): void => {
      if (identifier === ACTION_NAME && object instanceof Card) {
        this._draw3EdictsToTable(object);
      }
    };

    super(deckNsidPrefix, ACTION_NAME, customActionHandler);
  }

  _draw3EdictsToTable(deck: Card): void {
    const z: number = world.getTableHeight() + 3;
    const p0: Vector = new Vector(0, 0, z); // TODO XXX
    const d: Vector = new Vector(0, 1, 0.1); // TODO XXX

    const rot: Rotator = new Rotator(0, 0, 180);
    for (let i = 0; i < 3; i++) {
      const pos: Vector = p0.add(d.multiply(i));
      const card: Card | undefined = deck.takeCards(1);
      if (card) {
        card.setPosition(pos);
        card.setRotation(rot);
        card.snapToGround();
      }
    }
  }
}
