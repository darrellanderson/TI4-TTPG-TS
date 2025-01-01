import { Button, Player } from "@tabletop-playground/api";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";
import { ThrottleClickHandler } from "ttpg-darrell";

export class CombatUISpace extends AbstractUI {
  private readonly _spaceCannonOffense: Button;
  private readonly _ambush: Button;
  private readonly _antifighterBarrage: Button;
  private readonly _spaceCombat: Button;

  constructor(scale: number) {
    const planetName: string | undefined = undefined; // space

    const spaceCannonOffenseUi: ButtonUI = new ButtonUI(scale);
    spaceCannonOffenseUi.getButton().setText("Spc Cannon Offense");
    spaceCannonOffenseUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.events.onCombatClicked.trigger(
          "spaceCannonOffense",
          planetName,
          player
        );
      }).get()
    );

    const ambushUi: ButtonUI = new ButtonUI(scale);
    ambushUi.getButton().setText("Ambush");
    ambushUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.events.onCombatClicked.trigger("ambush", planetName, player);
      }).get()
    );

    const antifighterBarrageUi: ButtonUI = new ButtonUI(scale);
    antifighterBarrageUi.getButton().setText("Anti-fighter Barrage");
    antifighterBarrageUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.events.onCombatClicked.trigger(
          "antiFighterBarrage",
          planetName,
          player
        );
      }).get()
    );

    const spaceCombatUi: ButtonUI = new ButtonUI(scale);
    spaceCombatUi.getButton().setText("Space Combat");
    spaceCombatUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.events.onCombatClicked.trigger("spaceCombat", planetName, player);
      }).get()
    );

    const abstractUi: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING)
      .addUIs([
        spaceCannonOffenseUi,
        ambushUi,
        antifighterBarrageUi,
        spaceCombatUi,
      ])
      .build();

    super(abstractUi.getWidget(), abstractUi.getSize());

    this._spaceCannonOffense = spaceCannonOffenseUi.getButton();
    this._ambush = ambushUi.getButton();
    this._antifighterBarrage = antifighterBarrageUi.getButton();
    this._spaceCombat = spaceCombatUi.getButton();
  }

  destroy(): void {
    this._spaceCannonOffense.onClicked.clear();
    this._ambush.onClicked.clear();
    this._antifighterBarrage.onClicked.clear();
    this._spaceCombat.onClicked.clear();
  }

  getSpaceCannonOffense(): Button {
    return this._spaceCannonOffense;
  }

  getAmbush(): Button {
    return this._ambush;
  }

  getAntifighterBarrage(): Button {
    return this._antifighterBarrage;
  }

  getSpaceCombat(): Button {
    return this._spaceCombat;
  }
}
