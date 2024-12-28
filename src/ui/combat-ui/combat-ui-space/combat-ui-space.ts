import { Button } from "@tabletop-playground/api";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

export class CombatUISpace extends AbstractUI {
  private readonly _spaceCannonOffense: Button;
  private readonly _ambush: Button;
  private readonly _antifighterBarrage: Button;
  private readonly _spaceCombat: Button;

  constructor(scale: number) {
    const spaceCannonOffenseUi: ButtonUI = new ButtonUI(scale);
    spaceCannonOffenseUi.getButton().setText("Spc Cannon Offense");

    const ambushUi: ButtonUI = new ButtonUI(scale);
    ambushUi.getButton().setText("Ambush");

    const antifighterBarrageUi: ButtonUI = new ButtonUI(scale);
    ambushUi.getButton().setText("Anti-fighter Barrage");

    const spaceCombatUi: ButtonUI = new ButtonUI(scale);
    spaceCombatUi.getButton().setText("Space Combat");

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
