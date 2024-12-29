import { Player } from "@tabletop-playground/api";
import { CombatUIPlanet } from "../../../ui/combat-ui/combat-ui-planet/combat-ui-planet";
import { CombatUISpace } from "../../../ui/combat-ui/combat-ui-space/combat-ui-space";
import { System } from "../../system-lib/system/system";

/**
 * Set up CombatUI buttons, reset on system activation.
 */
export class CombatUILink {
  private readonly _onSystemActivatedHandler = (
    system: System,
    _player: Player
  ): void => {};

  constructor(
    combatUiSpace: CombatUISpace,
    combatUiPlanets: Array<CombatUIPlanet>
  ) {
    TI4.onSystemActivated.add(this._onSystemActivatedHandler);
  }

  destroy(): void {
    TI4.onSystemActivated.remove(this._onSystemActivatedHandler);
  }
}
