import {
  Border,
  Canvas,
  Color,
  HorizontalAlignment,
  ImageWidget,
  LayoutBox,
  refPackageId,
  Text,
  TextJustification,
  Vector,
  VerticalAlignment,
  Widget,
  world,
} from "@tabletop-playground/api";
import { Hex, HEX_LAYOUT_POINTY, HexType } from "ttpg-darrell";

import {
  MapStringEntry,
  MapStringParser,
} from "../../lib/map-string-lib/map-string-parser";
import { MapStringHex } from "../../lib/map-string-lib/map-string-hex";
import { System } from "../../lib/system-lib/system/system";
import { Faction } from "../../lib/faction-lib/faction/faction";

const HALF_HEX_W_PX: number = 50; // 50 for small screens
const LABEL_RELATIVE_TO_HEX_SIZE: number = 0.2;

const packageId: string = refPackageId;

export class MapUI {
  private readonly _mapString: string;

  private readonly _hexToLabel: Map<HexType, string> = new Map();
  private readonly _labelFontSize: number;

  private readonly _halfScaledHexWidth: number; // int
  private readonly _halfScaledHexHeight: number; // int
  private readonly _scaledHex: Hex;

  private readonly _width: number; // int
  private readonly _height: number; // int

  private readonly _left: number;
  private readonly _top: number;

  /**
   * Get a negative tile number that will render as this player slot's color.
   *
   * @param playerSlot
   * @returns
   */
  static playerSlotToColorTileNumber(playerSlot: number): number {
    return -100 - playerSlot;
  }

  /**
   * Translate a color tile number to the linked player slot color.
   *
   * @param tileNumber
   * @returns
   */
  static colorTileNumberToColor(tileNumber: number): Color | undefined {
    const playerSlot = -(tileNumber + 100);
    if (playerSlot >= 0 && playerSlot < 20) {
      const color: Color = world.getSlotColor(playerSlot);
      return color;
    }
    return undefined;
  }

  constructor(scale: number, mapString: string) {
    this._mapString = mapString;

    this._halfScaledHexWidth = Math.ceil(HALF_HEX_W_PX * scale);
    this._halfScaledHexHeight = Math.ceil(this._halfScaledHexWidth * 0.866);
    this._scaledHex = new Hex(HEX_LAYOUT_POINTY, this._halfScaledHexWidth);
    this._labelFontSize = this._halfScaledHexWidth * LABEL_RELATIVE_TO_HEX_SIZE;

    let left: number = 0;
    let top: number = 0;
    let right: number = 0;
    let bottom: number = 0;

    const entries: Array<MapStringEntry> = new MapStringParser().parseOrThrow(
      this._mapString
    );
    const mapStringHex: MapStringHex = new MapStringHex();
    for (let i = 0; i < entries.length; i++) {
      const hex: HexType = mapStringHex.indexToHex(i);
      const pos: Vector = this._scaledHex.toPosition(hex);
      [pos.x, pos.y] = [pos.y, -pos.x];
      const x: number = pos.x;
      const y: number = pos.y;
      left = Math.min(left, x - this._halfScaledHexWidth);
      top = Math.min(top, y - this._halfScaledHexHeight);
      right = Math.max(right, x + this._halfScaledHexWidth);
      bottom = Math.max(bottom, y + this._halfScaledHexHeight);
    }

    this._width = Math.ceil(right - left);
    this._height = Math.ceil(bottom - top);

    this._left = left;
    this._top = top;
  }

  setHexLabel(hex: HexType, label: string): this {
    this._hexToLabel.set(hex, label);
    return this;
  }

  getSize(): { w: number; h: number } {
    return { w: this._width, h: this._height };
  }

  getWidget(): Widget {
    const canvas: Canvas = new Canvas();

    const entries: Array<MapStringEntry> = new MapStringParser().parseOrThrow(
      this._mapString
    );
    const mapStringHex: MapStringHex = new MapStringHex();
    entries.forEach((entry: MapStringEntry, index: number) => {
      // Always skip -1, allow other negative values for tint color.
      if (entry.tile === -1) {
        return;
      }

      const img = new ImageWidget().setImageSize(
        this._halfScaledHexWidth * 2 + 2,
        this._halfScaledHexHeight * 2 + 2
      );

      // Apply system image, or default to blank tile.
      const system: System | undefined =
        TI4.systemRegistry.getBySystemTileNumber(entry.tile);
      if (system) {
        img.setImage(system.getImg(), system.getImgPackageId());
      } else {
        img.setImage("tile/system/tile-000.png", packageId);
      }

      // Faction home systems might not exist in the world (yet),
      // systemRegistry only knows existing systems.
      // Look up faction by home system.
      const faction: Faction | undefined =
        TI4.factionRegistry.getByHomeSystemTileNumber(entry.tile);
      if (faction) {
        img.setImage(faction.getHomeImg(), faction.getHomeImgPackageId());
      }

      // Apply tint color.
      const color: Color | undefined = MapUI.colorTileNumberToColor(entry.tile);
      if (color) {
        img.setTintColor(color);
      }

      const hex: HexType = mapStringHex.indexToHex(index);
      const pos: Vector = this._scaledHex.toPosition(hex);

      [pos.x, pos.y] = [pos.y, -pos.x];
      pos.x -= this._left;
      pos.y -= this._top;

      canvas.addChild(
        img,
        pos.x - this._halfScaledHexWidth - 1,
        pos.y - this._halfScaledHexWidth - 1,
        this._halfScaledHexWidth * 2 + 2,
        this._halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
      );
    });

    // Add labels (do after tiles so labels lay on top).
    for (const [hex, label] of this._hexToLabel) {
      const pos: Vector = this._scaledHex.toPosition(hex);

      [pos.x, pos.y] = [pos.y, -pos.x];
      pos.x -= this._left;
      pos.y -= this._top;

      const labelText: Text = new Text()
        .setAutoWrap(true)
        .setBold(true)
        .setFontSize(this._labelFontSize)
        .setJustification(TextJustification.Center)
        .setText(` ${label.trim()} `);

      const c: number = 0;
      const border: Widget = new Border()
        .setColor([c, c, c, 0.5])
        .setChild(labelText);

      const box: LayoutBox = new LayoutBox()
        .setHorizontalAlignment(HorizontalAlignment.Center)
        .setVerticalAlignment(VerticalAlignment.Center)
        .setChild(border);

      canvas.addChild(
        box,
        pos.x - this._halfScaledHexWidth - 1,
        pos.y - this._halfScaledHexWidth - 1,
        this._halfScaledHexWidth * 2 + 2,
        this._halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
      );
    }

    return canvas;
  }
}
