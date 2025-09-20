import { GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
import { _setTheCavalryUnitType } from "../../../lib/unit-lib/data/unit-modifiers/pok/the-cavalry";

/**
 * Right click menu to set the unit type for The Cavalry.
 */
export class RightClickTheCavalry extends AbstractRightClickCard {
  constructor() {
    const nsid: string = "card.promissory:pok/the-cavalry";
    const customActionHandler = (
      object: GameObject,
      _player: Player,
      identifier: string
    ): void => {
      if (identifier.startsWith("*Replace ")) {
        const unitType: string = identifier.substring("*Replace ".length);
        _setTheCavalryUnitType(unitType);
        object.setDescription(identifier);
      }
    };
    super(nsid, "*Replace carrier", customActionHandler);

    // Other non-fighter ships.
    this.addCustomActionName("*Replace cruiser");
    this.addCustomActionName("*Replace destroyer");
    this.addCustomActionName("*Replace dreadnought");
    this.addCustomActionName("*Replace flagship");
    this.addCustomActionName("*Replace war-sun");
  }
}
