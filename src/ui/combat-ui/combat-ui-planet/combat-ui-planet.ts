import { Button, Text } from "@tabletop-playground/api";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { LabelUI } from "../../button-ui/label-ui";
import { Planet } from "../../../lib/system-lib/planet/planet";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

export class CombatUIPlanet extends AbstractUI {
  private _planet: Planet | undefined;
  private readonly _planetName: Text;
  private readonly _bombardment: Button;
  private readonly _spaceCannonDefense: Button;
  private readonly _groundCombat: Button;

  constructor(scale: number) {
    const planetNameUi: LabelUI = new LabelUI(scale);

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

    this._planetName = planetNameUi.getText();
    this._bombardment = bombardmentUi.getButton();
    this._spaceCannonDefense = spaceCannonDefenseUi.getButton();
    this._groundCombat = groundCombatUi.getButton();

    this.setPlanet(undefined);
  }

  destroy(): void {
    this._bombardment.onClicked.clear();
    this._spaceCannonDefense.onClicked.clear();
    this._groundCombat.onClicked.clear();
  }

  setPlanet(planet: Planet | undefined): this {
    const enabled: boolean = planet !== undefined;
    const planetName: string = planet ? planet.getName() : "-";

    this._planet = planet;
    this._planetName.setText(planetName);
    this._bombardment.setEnabled(enabled);
    this._spaceCannonDefense.setEnabled(enabled);
    this._groundCombat.setEnabled(enabled);
    return this;
  }

  getPlanet(): Planet | undefined {
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
