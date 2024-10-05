import { Color, world } from "@tabletop-playground/api";
import { ColorLib, ColorsType } from "ttpg-darrell";

export class PlayerColor {
  private static readonly KEY: string = "player-colors";
  private readonly _colorLib: ColorLib = new ColorLib();

  setSlotColor(slot: number, colorName: string, colorHex?: string): void {
    let colorsType: ColorsType = this._colorLib.getColorsByNameOrThrow(
      colorName,
      0
    );
    if (colorHex) {
      colorsType = this._colorLib.getColorsByTargetOrThrow(colorHex);
    }
    const slotColor: Color = this._colorLib.parseColorOrThrow(colorsType.slot);
    world.setSlotColor(slot, slotColor);

    let json: string = world.getSavedData(PlayerColor.KEY);
    if (!json || json.length === 0) {
      json = "{}";
    }
    const parsed = JSON.parse(json);
    parsed[slot] = {
      name: colorName,
      target: colorsType.target,
      widget: colorsType.widget,
      plastic: colorsType.plastic,
    };
    json = JSON.stringify(parsed);
    world.setSavedData(json, PlayerColor.KEY);
  }

  getSlotColorName(slot: number): string | undefined {
    const json: string = world.getSavedData(PlayerColor.KEY);
    if (json && json.length > 0) {
      const parsed = JSON.parse(json);
      if (parsed) {
        const colorName: string | undefined = parsed[slot].name;
        if (colorName) {
          return colorName;
        }
      }
    }
    return undefined;
  }

  getSlotWidgetColor(slot: number): Color {
    const json: string = world.getSavedData(PlayerColor.KEY);
    if (json && json.length > 0) {
      const parsed = JSON.parse(json);
      if (parsed) {
        const colorHex: string | undefined = parsed[slot].widget;
        if (colorHex) {
          return this._colorLib.parseColorOrThrow(colorHex);
        }
      }
    }
    return new Color(1, 1, 1, 1);
  }

  getSlotPlasticColor(slot: number): Color {
    const json: string = world.getSavedData(PlayerColor.KEY);
    if (json && json.length > 0) {
      const parsed = JSON.parse(json);
      if (parsed) {
        const colorHex: string | undefined = parsed[slot].plastic;
        if (colorHex) {
          return this._colorLib.parseColorOrThrow(colorHex);
        }
      }
    }
    return new Color(1, 1, 1, 1);
  }
}
