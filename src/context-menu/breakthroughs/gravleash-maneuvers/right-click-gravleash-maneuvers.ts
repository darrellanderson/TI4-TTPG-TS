import { GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
import {
  _setGravleashUnitType,
  GRAVLEASH_CHOOSE_BEST,
  GRAVLEASH_CHOOSE_WORST,
} from "../../../lib/unit-lib/data/unit-modifiers/thunders-edge/gravleash-maneuvers";

const ACTION_CHOOSE_BEST: string = "*Choose lowest hit";
const ACTION_CHOOSE_WORST: string = "*Choose highest hit";

/**
 * Right click menu to set the unit type for Gravleash Maneuvers.
 * Also supports choosing best or worst to prioritize single hit or more hits.
 */
export class RightClickGravleashManeuvers extends AbstractRightClickCard {
  constructor() {
    const nsid: string = "card.breakthrough:thunders-edge/gravleash-maneuvers";
    const customActionHandler = (
      object: GameObject,
      _player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_CHOOSE_BEST) {
        _setGravleashUnitType(GRAVLEASH_CHOOSE_BEST);
        object.setDescription(identifier);
      } else if (identifier === ACTION_CHOOSE_WORST) {
        _setGravleashUnitType(GRAVLEASH_CHOOSE_WORST);
        object.setDescription(identifier);
      } else if (identifier.startsWith("*Choose ")) {
        const unitType: string = identifier.substring("*Choose ".length);
        _setGravleashUnitType(unitType);
        object.setDescription(identifier);
      }
    };
    super(nsid, ACTION_CHOOSE_BEST, customActionHandler);
    this.addCustomActionName(ACTION_CHOOSE_WORST);

    this.setTooltip(
      ACTION_CHOOSE_BEST,
      "Always choose unit with the lowest hit value, more likely to get at least one hit."
    );
    this.setTooltip(
      ACTION_CHOOSE_WORST,
      "Always choose unit with the highest hit value, more likely to get multiple hits."
    );

    this.addCustomActionName("*Choose carrier");
    this.addCustomActionName("*Choose cruiser");
    this.addCustomActionName("*Choose destroyer");
    this.addCustomActionName("*Choose dreadnought");
    this.addCustomActionName("*Choose fighter");
    this.addCustomActionName("*Choose flagship");
    this.addCustomActionName("*Choose war-sun");
  }
}
