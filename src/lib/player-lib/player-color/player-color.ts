import { Color, world } from "@tabletop-playground/api";
import { ColorLib, ColorsType } from "ttpg-darrell";

export class PlayerColor {
  private static readonly KEY: string = "player-colors";

  setSlotColor(slot: number, colorName: string, colorHex?: string): void {
    const colorLib: ColorLib = new ColorLib();
    let colorsType: ColorsType = colorLib.getColorsByNameOrThrow(colorName, 0);
    if (colorHex) {
      colorsType = colorLib.getColorsByTargetOrThrow(colorHex);
    }
    const slotColor: Color = colorLib.parseColorOrThrow(colorsType.slot);
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
    if (!json || json.length === 0) {
      return undefined;
    }
    const parsed = JSON.parse(json);
    const colorName: string | undefined = parsed[slot]?.name;
    return colorName;
  }
}
