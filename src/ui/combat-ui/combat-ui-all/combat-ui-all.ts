import {
  HorizontalAlignment,
  VerticalAlignment,
} from "@tabletop-playground/api";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CombatUISpace } from "../combat-ui-space/combat-ui-space";
import { CombatUIPlanet } from "../combat-ui-planet/combat-ui-planet";
import { CombatUIHex } from "../combat-ui-hex/combat-ui-hex";
import { CONFIG } from "../../config/config";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

/**
 * space | hex
 * planet| planet | planet
 */
export class CombatUIAll extends AbstractUI {
  private readonly _combatUiSpace: CombatUISpace;
  private readonly _combatUiPlanets: Array<CombatUIPlanet> = [];
  private readonly _combatUiHex: CombatUIHex;

  constructor(scale: number) {
    const combatUiSpace: CombatUISpace = new CombatUISpace(scale);
    const combatUiPlanets: Array<CombatUIPlanet> = [];
    for (let i = 0; i < 3; i++) {
      combatUiPlanets.push(new CombatUIPlanet(scale));
    }
    const combatUiHex: CombatUIHex = new CombatUIHex(scale);

    const topRow: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING)
      .setVerticalAlignment(VerticalAlignment.Bottom)
      .addUIs([combatUiSpace, combatUiHex])
      .build();

    const bottomRow: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING)
      .addUIs(combatUiPlanets)
      .build();

    const abstractUi: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING)
      .setHorizontalAlignment(HorizontalAlignment.Left)
      .addUIs([topRow, bottomRow])
      .build();

    super(abstractUi.getWidget(), abstractUi.getSize());

    this._combatUiSpace = combatUiSpace;
    this._combatUiPlanets = combatUiPlanets;
    this._combatUiHex = combatUiHex;
  }

  destroy(): void {
    this._combatUiSpace.destroy();
    this._combatUiPlanets.forEach((combatUiPlanet) => {
      combatUiPlanet.destroy();
    });
    this._combatUiHex.destroy();
  }
}
