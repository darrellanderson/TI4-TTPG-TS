import { Player } from "@tabletop-playground/api";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CombatUISpace } from "../combat-ui-space/combat-ui-space";
import { CombatUIPlanet } from "../combat-ui-planet/combat-ui-planet";
import { CONFIG } from "../../config/config";
import { System } from "../../../lib/system-lib/system/system";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

/**
 * Clean combat UI, minimal.
 */
export class CombatUIAllSimple extends AbstractUI {
  private readonly _combatUiSpace: CombatUISpace;
  private readonly _combatUiPlanets: Array<CombatUIPlanet> = [];

  private readonly _onSystemActivatedHandler = (
    system: System,
    _player: Player
  ): void => {
    this.update(system);
  };

  constructor(scale: number) {
    const combatUiSpace: CombatUISpace = new CombatUISpace(scale);
    const combatUiPlanets: Array<CombatUIPlanet> = [];
    for (let i = 0; i < 3; i++) {
      combatUiPlanets.push(new CombatUIPlanet(scale));
    }

    const abstractUi: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING)
      .addUIs([combatUiSpace, ...combatUiPlanets])
      .build();

    super(abstractUi.getWidget(), abstractUi.getSize());

    this._combatUiSpace = combatUiSpace;
    this._combatUiPlanets = combatUiPlanets;
  }

  update(system: System | undefined): void {
    this._combatUiPlanets.forEach((planet) => planet.setPlanet(undefined));
    if (system) {
      system.getPlanets().forEach((planet, index) => {
        const combatUiPlanet: CombatUIPlanet | undefined =
          this._combatUiPlanets[index];
        if (combatUiPlanet) {
          combatUiPlanet.setPlanet(planet);
        }
      });
    }
  }
}
