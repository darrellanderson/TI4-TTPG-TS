import { GameObject, Player } from "@tabletop-playground/api";
import { _setTheCavalryUnitType } from "lib";
import { AbstractRightClickCard } from "ttpg-darrell";

/**
 * Right click menu to set the unit type for Gravleash Maneuvers.
 * Also supports choosing best or worst to prioritize single hit or more hits.
 */
export class RightClickGravleashManeuvers extends AbstractRightClickCard {
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
