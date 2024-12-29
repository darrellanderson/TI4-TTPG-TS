import { Button, Player, Text } from "@tabletop-playground/api";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { LabelUI } from "../../button-ui/label-ui";
import { OnSystemActivated } from "../../../event/on-system-activated/on-system-activated";
import { Planet } from "../../../lib/system-lib/planet/planet";
import { System } from "../../../lib/system-lib/system/system";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";
import { ThrottleClickHandler } from "ttpg-darrell";

export class CombatUIPlanet extends AbstractUI {
  private readonly _planetIndex: number;
  private _planetNameValue: string = "-";

  private readonly _planetName: Text;
  private readonly _bombardment: Button;
  private readonly _spaceCannonDefense: Button;
  private readonly _groundCombat: Button;

  private readonly _onSystemActivatedHandler = () => {
    this.update();
  };

  constructor(scale: number, planetIndex: number) {
    const planetNameUi: LabelUI = new LabelUI(scale);

    const bombardmentUi: ButtonUI = new ButtonUI(scale);
    bombardmentUi.getButton().setText("Bombardment");
    bombardmentUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.onCombatClicked.trigger(
          "bombardment",
          this._planetNameValue,
          player
        );
      }).get()
    );

    const spaceCannonDefenseUi: ButtonUI = new ButtonUI(scale);
    spaceCannonDefenseUi.getButton().setText("Spc Cannon Defense");
    spaceCannonDefenseUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.onCombatClicked.trigger(
          "spaceCannonDefense",
          this._planetNameValue,
          player
        );
      }).get()
    );

    const groundCombatUi: ButtonUI = new ButtonUI(scale);
    groundCombatUi.getButton().setText("Ground Combat");
    groundCombatUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.onCombatClicked.trigger(
          "groundCombat",
          this._planetNameValue,
          player
        );
      }).get()
    );

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

    this._planetIndex = planetIndex;
    this._planetName = planetNameUi.getText();
    this._bombardment = bombardmentUi.getButton();
    this._spaceCannonDefense = spaceCannonDefenseUi.getButton();
    this._groundCombat = groundCombatUi.getButton();

    TI4.onSystemActivated.add(this._onSystemActivatedHandler);

    this.update();
  }

  destroy(): void {
    this._bombardment.onClicked.clear();
    this._spaceCannonDefense.onClicked.clear();
    this._groundCombat.onClicked.clear();

    TI4.onSystemActivated.remove(this._onSystemActivatedHandler);
  }

  update(): void {
    this._planetNameValue = "-";
    let enabled: boolean = false;

    const system: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    if (system) {
      const planet: Planet | undefined = system.getPlanets()[this._planetIndex];
      if (planet) {
        this._planetNameValue = planet.getName();
        enabled = true;
      }
    }

    this._planetName.setText(this._planetNameValue);
    this._bombardment.setEnabled(enabled);
    this._spaceCannonDefense.setEnabled(enabled);
    this._groundCombat.setEnabled(enabled);
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
