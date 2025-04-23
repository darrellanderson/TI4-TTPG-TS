import { Border, Color, LayoutBox, Widget } from "@tabletop-playground/api";
import { ColorLib } from "ttpg-darrell";
import {
  GameData,
  PerPlayerGameData,
} from "../../lib/game-data-lib/game-data/game-data";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { LabelUI } from "../button-ui/label-ui";
import { CONFIG } from "../config/config";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";
import { TechColorType } from "../../lib/tech-lib/schema/tech-schema";
import { Tech } from "../../lib/tech-lib/tech/tech";

export class AllPlayersTechsUI extends AbstractUI {
  static getTechNameToColor(): Map<string, Color> {
    const colorLib: ColorLib = new ColorLib();

    const techColorToColor: Map<TechColorType, Color> = new Map();
    techColorToColor.set("blue", colorLib.parseColorOrThrow("#00D0FE"));
    techColorToColor.set("green", colorLib.parseColorOrThrow("#008000"));
    techColorToColor.set("red", colorLib.parseColorOrThrow("#FE0101"));
    techColorToColor.set("yellow", colorLib.parseColorOrThrow("#e5e500"));
    techColorToColor.set("unit-upgrade", colorLib.parseColorOrThrow("#ffffff"));
    techColorToColor.set("none", colorLib.parseColorOrThrow("#ffffff"));

    const techNameToColor: Map<string, Color> = new Map();
    TI4.techRegistry.getAllTechs().map((tech: Tech): void => {
      const techColor: TechColorType = tech.getColor();
      const color: Color | undefined = techColorToColor.get(techColor);
      if (color !== undefined) {
        techNameToColor.set(tech.getName(), color);
      }
    });

    return techNameToColor;
  }

  constructor(scale: number, gameData: GameData) {
    const techColorToColor: Map<string, Color> =
      AllPlayersTechsUI.getTechNameToColor();

    const cols: Array<AbstractUI> = gameData.players.map(
      (player: PerPlayerGameData): AbstractUI => {
        const techNames: Array<string> = player.technologies ?? [];
        const rows: Array<AbstractUI> = techNames.map(
          (techName: string): AbstractUI => {
            const techUi: LabelUI = new LabelUI(scale);
            techUi.getText().setText(techName);
            const color: Color | undefined = techColorToColor.get(techName);
            if (color) {
              techUi.getText().setTextColor(color);
            }
            return techUi;
          }
        );

        // Add header with player name.
        const playerName: string = player.name ?? "";
        const playerNameUi: LabelUI = new LabelUI(scale);
        playerNameUi.getText().setText(playerName);
        rows.unshift(playerNameUi);

        return new VerticalUIBuilder()
          .setSpacing(-8 * scale)
          .addUIs(rows)
          .build();
      }
    );

    const abstractUi: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(cols)
      .build();

    const border: Widget = new Border()
      .setColor(CONFIG.DARKER)
      .setChild(abstractUi.getWidget());
    const box: Widget = new LayoutBox()
      .setOverrideWidth(abstractUi.getSize().w)
      .setOverrideHeight(abstractUi.getSize().h)
      .setChild(border);

    super(box, abstractUi.getSize());
  }
}
