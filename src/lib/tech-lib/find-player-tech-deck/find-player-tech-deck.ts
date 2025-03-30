import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

export class FindPlayerTechDeck {
  private readonly _find: Find = new Find();

  _getTechDeck(playerSlot: number, errors: Array<string>): Card | undefined {
    const snapPoint: SnapPoint | undefined = this._find.findSnapPointByTag(
      "deck-technology",
      playerSlot
    );
    if (!snapPoint) {
      errors.push("Missing tech deck (no snap point)");
      return undefined;
    }
    const snapped: GameObject | undefined = snapPoint.getSnappedObject();
    if (!snapped) {
      errors.push("Missing tech deck (no snapped object)");
      return undefined;
    }
    if (!(snapped instanceof Card)) {
      errors.push("Missing tech deck (not a card)");
      return undefined;
    }
    return snapped;
  }

  getTechDeck(playerSlot: number): Card | undefined {
    const errors: Array<string> = [];
    return this._getTechDeck(playerSlot, errors);
  }

  getTechDeckOrThrow(playerSlot: number): Card {
    const errors: Array<string> = [];
    const techDeck: Card | undefined = this._getTechDeck(playerSlot, errors);
    if (!techDeck) {
      throw new Error(errors.join(", "));
    }
    return techDeck;
  }
}
