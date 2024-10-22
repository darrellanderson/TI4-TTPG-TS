import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";

export class UnpackStartingTech extends AbstractUnpack {
  _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    throw new Error("Method not implemented.");
  }

  remove(): void {
    throw new Error("Method not implemented.");
  }

  _getTechDeckOrThrow(): Card {
    const snapPoint: SnapPoint | undefined = this._find.findSnapPointByTag(
      "deck-technology",
      this.getPlayerSlot()
    );
    if (!snapPoint) {
      throw new Error("Missing tech deck (no snap point)");
    }
    const snapped: GameObject | undefined = snapPoint.getSnappedObject();
    if (!snapped) {
      throw new Error("Missing tech deck (no snapped object)");
    }
    if (!(snapped instanceof Card)) {
      throw new Error("Missing tech deck (not a card)");
    }
    return snapped;
  }
}
