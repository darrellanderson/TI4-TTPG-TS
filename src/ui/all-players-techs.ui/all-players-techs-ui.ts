import {
  Border,
  Color,
  LayoutBox,
  Widget,
  world,
} from "@tabletop-playground/api";
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

const MAX_NAME_LENGTH: number = 20;

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

    const cols: Array<AbstractUI> = [];
    for (
      let seatIndex: number = 0;
      seatIndex < TI4.config.playerCount;
      seatIndex++
    ) {
      const player: PerPlayerGameData | undefined = gameData.players[seatIndex];

      const rows: Array<AbstractUI> = [];

      // Add header with player name.
      const playerName: string = player?.steamName ?? "";
      const playerNameUi: LabelUI = new LabelUI(scale);
      playerNameUi.getText().setText(playerName);

      const playerSlot: number =
        TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
      const color: Color = world.getSlotColor(playerSlot);
      playerNameUi.getText().setTextColor(color);

      rows.push(playerNameUi);

      // Add techs.
      const techNames: Array<string> = player?.technologies ?? [];
      techNames.forEach((techName: string): void => {
        const techUi: LabelUI = new LabelUI(scale);

        // Apply color before potentially truncating the name.
        const playerColor: Color | undefined = techColorToColor.get(techName);
        if (playerColor) {
          techUi.getText().setTextColor(playerColor);
        }

        // Truncate the name if it is too long.
        if (techName.length > MAX_NAME_LENGTH) {
          techName = techName.substring(0, MAX_NAME_LENGTH - 3) + "...";
        }
        techUi.getText().setText(techName);

        rows.push(techUi);
      });

      const col: AbstractUI = new VerticalUIBuilder()
        .setSpacing(0 * scale)
        .addUIs(rows)
        .build();

      cols.push(col);
    }

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
