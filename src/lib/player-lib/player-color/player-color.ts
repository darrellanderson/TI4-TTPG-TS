import { Color, world } from "@tabletop-playground/api";
import { ColorLib, ColorsType, NamespaceId } from "ttpg-darrell";

type PlayerColorEntry = {
  colorName: string; // "red"
  target: string; // hex colors
  plastic: string;
  widget: string;
};

export class PlayerColor {
  private readonly _namespaceId: NamespaceId;
  private readonly _colorLib: ColorLib = new ColorLib();

  constructor(namespaceId: NamespaceId) {
    this._namespaceId = namespaceId;
  }

  getAnonymousChatColor(): Color {
    return this._colorLib.parseColorOrThrow("#C0C0C0"); // #5D1602
  }

  getAnonymousPlasticColor(): Color {
    return this._colorLib.parseColorOrThrow("#808080"); // #5D1602
  }

  _getPlayerColorEntry(slot: number): PlayerColorEntry | undefined {
    const json: string = world.getSavedData(this._namespaceId);
    if (json && json.length > 0) {
      const parsed = JSON.parse(json);
      if (parsed) {
        const entry: PlayerColorEntry | undefined = parsed[slot];
        if (entry) {
          return entry;
        }
      }
    }
    return undefined;
  }

  _setPlayerColorEntry(slot: number, entry: PlayerColorEntry): void {
    let json: string = world.getSavedData(this._namespaceId);
    if (!json || json.length === 0) {
      json = "{}";
    }
    const parsed = JSON.parse(json);
    parsed[slot] = entry;
    json = JSON.stringify(parsed);
    world.setSavedData(json, this._namespaceId);
  }

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

    const entry: PlayerColorEntry = {
      colorName: colorName,
      target: colorsType.target,
      plastic: colorsType.plastic,
      widget: colorsType.widget,
    };
    this._setPlayerColorEntry(slot, entry);
  }

  getSlotColorName(slot: number): string | undefined {
    const entry: PlayerColorEntry | undefined = this._getPlayerColorEntry(slot);
    if (entry) {
      return entry.colorName;
    }
    return undefined;
  }

  getSlotColorNameOrThrow(slot: number): string {
    const colorName: string | undefined = this.getSlotColorName(slot);
    if (!colorName) {
      throw new Error(`No color name for slot ${slot}`);
    }
    return colorName;
  }

  getSlotPlasticColor(slot: number): Color | undefined {
    const entry: PlayerColorEntry | undefined = this._getPlayerColorEntry(slot);
    if (entry) {
      const hexColor: string = entry.plastic;
      return this._colorLib.parseColor(hexColor);
    }
    return undefined;
  }

  getSlotPlasticColorOrThrow(slot: number): Color {
    const color: Color | undefined = this.getSlotPlasticColor(slot);
    if (!color) {
      throw new Error(`No plastic color for slot ${slot}`);
    }
    return color;
  }

  getSlotWidgetColor(slot: number): Color | undefined {
    const entry: PlayerColorEntry | undefined = this._getPlayerColorEntry(slot);
    if (entry) {
      const hexColor: string = entry.widget;
      return this._colorLib.parseColor(hexColor);
    }
    return undefined;
  }

  getSlotWidgetColorOrThrow(slot: number): Color {
    const color: Color | undefined = this.getSlotWidgetColor(slot);
    if (!color) {
      throw new Error(`No widget color for slot ${slot}`);
    }
    return color;
  }
}
