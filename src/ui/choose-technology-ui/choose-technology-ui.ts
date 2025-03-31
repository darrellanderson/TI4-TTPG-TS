import { PlayerSlot } from "ttpg-darrell";

import { RemoveByNsidOrSource } from "../../lib/remove-lib/remove-by-nsid-or-source/remove-by-nsid-or-source";
import { TechColorType } from "../../lib/tech-lib/schema/tech-schema";
import { Tech } from "../../lib/tech-lib/tech/tech";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { SingleTechUI } from "./single-tech-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";

export class ChooseTechnologyUI extends AbstractUI {
  private readonly _ui: AbstractUI;

  static _getBaseTechColumn(
    scale: number,
    techColor: TechColorType
  ): AbstractUI {
    // Apply remove rules (e.g. codex replacement).
    const removeByNsidOrSource: RemoveByNsidOrSource =
      TI4.removeRegistry.createRemoveFromRegistryAndConfig();

    // Get all techs.
    const techs: Array<Tech> = TI4.techRegistry
      .getAllTechs()
      .filter((tech: Tech): boolean => {
        return tech.getColor() === techColor && !tech.isFactionTech();
      })
      .filter((tech: Tech): boolean => {
        return !removeByNsidOrSource.shouldRemove(tech.getNsid());
      });
    Tech.sortByLevel(techs);

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
      ChooseTechnologyUI._getBaseTechColumn(scale, "blue"),
      ChooseTechnologyUI._getBaseTechColumn(scale, "green"),
      ChooseTechnologyUI._getBaseTechColumn(scale, "red"),
      ChooseTechnologyUI._getBaseTechColumn(scale, "yellow"),
      ChooseTechnologyUI._getBaseTechColumn(scale, "unit-upgrade"),
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
