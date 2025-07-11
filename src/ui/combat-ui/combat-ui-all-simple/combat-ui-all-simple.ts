import { PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CombatUISpace } from "../combat-ui-space/combat-ui-space";
import { CombatUIPlanet } from "../combat-ui-planet/combat-ui-planet";
import { CONFIG } from "../../config/config";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

/**
 * Clean combat UI, minimal.
 */
export class CombatUIAllSimple extends AbstractUI {
  private readonly _combatUiSpace: CombatUISpace;
  private readonly _combatUiPlanets: Array<CombatUIPlanet> = [];

  constructor(scale: number, playerSlot: PlayerSlot) {
    const combatUiSpace: CombatUISpace = new CombatUISpace(scale, playerSlot);
    const combatUiPlanets: Array<CombatUIPlanet> = [];
    for (let i = 0; i < 3; i++) {
      combatUiPlanets.push(new CombatUIPlanet(scale, i));
    }

    const abstractUi: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING)
      .addUIs([combatUiSpace, ...combatUiPlanets])
      .build();

    super(abstractUi.getWidget(), abstractUi.getSize());

    this._combatUiSpace = combatUiSpace;
    this._combatUiPlanets = combatUiPlanets;
  }

  destroy(): void {
    this._combatUiSpace.destroy();
    this._combatUiPlanets.forEach((combatUiPlanet) => {
      combatUiPlanet.destroy();
    });
  }
}
