import { PlayerSlot } from "ttpg-darrell";

import { Faction } from "../../lib/faction-lib/faction/faction";
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

  static _getTechColumn(
    scale: number,
    techColor: TechColorType,
    faction: Faction | undefined
  ): AbstractUI {
    // Apply remove rules (e.g. codex replacement).
    const removeByNsidOrSource: RemoveByNsidOrSource =
      TI4.removeRegistry.createRemoveFromRegistryAndConfig();
    const factionTechNsids: Set<string> = new Set<string>();
    if (faction) {
      for (const nsid of faction.getFactionTechNsids()) {
        factionTechNsids.add(nsid);
      }
    }

    // Get all techs.
    let techs: Array<Tech> = TI4.techRegistry
      .getAllTechs()
      .filter((tech: Tech): boolean => {
        if (tech.getColor() !== techColor) {
          return false;
        }
        if (tech.isFactionTech() && !factionTechNsids.has(tech.getNsid())) {
          return false;
        }
        if (removeByNsidOrSource.shouldRemove(tech.getNsid())) {
          return false;
        }
        return true;
      });
    Tech.sortByLevel(techs);

    // Remove base unit upgrades when faction tech is present.
    const removeNsidNames: Set<string> = new Set<string>();
    for (const tech of techs) {
      if (tech.replacesNsidName()) {
        removeNsidNames.add(tech.getNsid());
      }
    }
    techs = techs.filter((tech: Tech): boolean => {
      return !removeNsidNames.has(tech.getNsidName());
    });

    const uis: Array<AbstractUI> = techs.map((tech: Tech): AbstractUI => {
      return new SingleTechUI(scale, tech);
    });

    return new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();
  }

  constructor(scale: number, playerSlot: PlayerSlot) {
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);

    const uis: Array<AbstractUI> = [
      ChooseTechnologyUI._getTechColumn(scale, "blue", faction),
      ChooseTechnologyUI._getTechColumn(scale, "green", faction),
      ChooseTechnologyUI._getTechColumn(scale, "red", faction),
      ChooseTechnologyUI._getTechColumn(scale, "yellow", faction),
      ChooseTechnologyUI._getTechColumn(scale, "unit-upgrade", faction),
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
