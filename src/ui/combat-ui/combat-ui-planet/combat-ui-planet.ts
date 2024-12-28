import { Button } from "@tabletop-playground/api";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { LabelUI } from "../../button-ui/label-ui";
import { Planet } from "../../../lib/system-lib/planet/planet";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

export class CombatUIPlanet extends AbstractUI {
  private readonly _planet: Planet;
  private readonly _bombardment: Button;
  private readonly _spaceCannonDefense: Button;
  private readonly _groundCombat: Button;

  constructor(planet: Planet, scale: number) {
    const planetNameUi: LabelUI = new LabelUI(scale);
    planetNameUi.getText().setText(planet.getName());

    const bombardmentUi: ButtonUI = new ButtonUI(scale);
    bombardmentUi.getButton().setText("Bombardment");

    const spaceCannonDefenseUi: ButtonUI = new ButtonUI(scale);
    spaceCannonDefenseUi.getButton().setText("Spc Cannon Defense");

    const groundCombatUi: ButtonUI = new ButtonUI(scale);
    groundCombatUi.getButton().setText("Ground Combat");

    const abstractUi: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING)
      .addUIs([
        planetNameUi,
        bombardmentUi,
        spaceCannonDefenseUi,
        groundCombatUi,
      ])
      .build();

    super(abstractUi.getWidget(), abstractUi.getSize());

    this._planet = planet;
    this._bombardment = bombardmentUi.getButton();
    this._spaceCannonDefense = spaceCannonDefenseUi.getButton();
    this._groundCombat = groundCombatUi.getButton();
  }

  getPlanet(): Planet {
    return this._planet;
  }

  getBombardment(): Button {
    return this._bombardment;
  }

  getSpaceCannonDefense(): Button {
    return this._spaceCannonDefense;
  }

  getGroundCombat(): Button {
    return this._groundCombat;
  }
}
