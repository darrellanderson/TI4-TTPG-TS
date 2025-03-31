import { PlayerSlot } from "ttpg-darrell";

import { Faction } from "../../lib/faction-lib/faction/faction";
import { PlayerTechSummary } from "../../lib/tech-lib/player-tech-summary/player-tech-summary";
import { PlayerWithFactionTechs } from "../../lib/tech-lib/player-with-faction-techs/player-with-faction-techs";
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
    faction: Faction | undefined,
    playerTechSummary: PlayerTechSummary
  ): AbstractUI {
    const techs: Array<Tech> = new PlayerWithFactionTechs(faction)
      .get()
      .filter((tech: Tech): boolean => {
        return tech.getColor() === techColor;
      });
    Tech.sortByLevel(techs);

    if (faction) {
      const nsids: Array<string> = techs
        .filter((tech: Tech): boolean => {
          return tech.getColor() === "unit-upgrade";
        })
        .map((tech: Tech): string => {
          return tech.getNsid();
        });
      nsids.sort();
    }

    const uis: Array<AbstractUI> = techs.map((tech: Tech): AbstractUI => {
      return new SingleTechUI(scale, tech, faction, playerTechSummary);
    });

    return new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();
  }

  constructor(scale: number, playerSlot: PlayerSlot) {
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    const playerTechSummary: PlayerTechSummary = new PlayerTechSummary(
      playerSlot
    );

    const uis: Array<AbstractUI> = [
      ChooseTechnologyUI._getTechColumn(
        scale,
        "blue",
        faction,
        playerTechSummary
      ),
      ChooseTechnologyUI._getTechColumn(
        scale,
        "green",
        faction,
        playerTechSummary
      ),
      ChooseTechnologyUI._getTechColumn(
        scale,
        "red",
        faction,
        playerTechSummary
      ),
      ChooseTechnologyUI._getTechColumn(
        scale,
        "yellow",
        faction,
        playerTechSummary
      ),
      ChooseTechnologyUI._getTechColumn(
        scale,
        "unit-upgrade",
        faction,
        playerTechSummary
      ),
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
