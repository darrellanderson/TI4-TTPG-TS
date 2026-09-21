import { GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
import {
  _setSuperchargeUnitType,
  SUPERCHARGE_CHOOSE_BEST,
  SUPERCHARGE_CHOOSE_WORST,
} from "../../../lib/unit-lib/data/unit-modifiers/twilights-fall/supercharge-tf";

const ACTION_CHOOSE_BEST: string = "*Choose lowest hit";
const ACTION_CHOOSE_WORST: string = "*Choose highest hit";

/**
 * Right click menu to set the unit type for tf supercharge.
 * Also supports choosing best or worst to prioritize single hit or more hits.
 */
export class RightClickTFSupercharge extends AbstractRightClickCard {
  constructor() {
    const nsid: string = "card.tf-ability:twilights-fall/supercharge";
    const customActionHandler = (
      object: GameObject,
      _player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_CHOOSE_BEST) {
        _setSuperchargeUnitType(SUPERCHARGE_CHOOSE_BEST);
        object.setDescription(identifier);
      } else if (identifier === ACTION_CHOOSE_WORST) {
        _setSuperchargeUnitType(SUPERCHARGE_CHOOSE_WORST);
        object.setDescription(identifier);
      } else if (identifier.startsWith("*Choose ")) {
        const unitType: string = identifier.substring("*Choose ".length);
        _setSuperchargeUnitType(unitType);
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
    this.addCustomActionName("*Choose infantry");
    this.addCustomActionName("*Choose mech");
  }
}
