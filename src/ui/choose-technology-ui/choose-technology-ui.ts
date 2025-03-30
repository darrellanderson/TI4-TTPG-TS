import { PlayerSlot } from "ttpg-darrell";

import { TechColorType } from "../../lib/tech-lib/schema/tech-schema";
import { Tech } from "../../lib/tech-lib/tech/tech";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { LabelUI } from "../button-ui/label-ui";
import { SingleTechUI } from "./single-tech-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";

export class ChooseTechnologyUI extends AbstractUI {
  private readonly _ui: AbstractUI;

  static _getBaseTechColumn(
    scale: number,
    techColor: TechColorType
  ): AbstractUI {
    const techs: Array<Tech> = TI4.techRegistry
      .getAllTechs()
      .filter((tech: Tech): boolean => {
        return tech.getColor() === techColor && !tech.isFactionTech();
      });
    const uis: Array<AbstractUI> = techs.map((tech: Tech): AbstractUI => {
      return new SingleTechUI(scale, tech);
    });

    return new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();
  }

  constructor(scale: number, _playerSlot: PlayerSlot) {
    const uis: Array<AbstractUI> = [
      new LabelUI(scale),
      ChooseTechnologyUI._getBaseTechColumn(scale, "blue"),
      ChooseTechnologyUI._getBaseTechColumn(scale, "green"),
      ChooseTechnologyUI._getBaseTechColumn(scale, "red"),
      ChooseTechnologyUI._getBaseTechColumn(scale, "yellow"),
    ];

    const ui: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();
    super(ui.getWidget(), ui.getSize());
    this._ui = ui;
  }

  destroy(): void {
    this._ui.destroy();
  }
}
