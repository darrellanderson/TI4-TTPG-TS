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

import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { Faction } from "../../lib/faction-lib/faction/faction";
import {
  MapStringEntry,
  MapStringParser,
} from "../../lib/map-string-lib/map-string-parser";
import { MapStringHex } from "../../lib/map-string-lib/map-string-hex";
import { System } from "../../lib/system-lib/system/system";

const HALF_HEX_W_PX: number = 20; // 50 will fill a small screen
const LABEL_RELATIVE_TO_HEX_SIZE: number = 0.2;

const packageId: string = refPackageId;

export class MapUI extends AbstractUI {
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

  constructor(
    scale: number,
    mapString: string,
    hexToLabel: Map<HexType, string>
  ) {
    const halfScaledHexWidth: number = Math.ceil(HALF_HEX_W_PX * scale);
    const halfScaledHexHeight: number = Math.ceil(halfScaledHexWidth * 0.866);
    const scaledHex: Hex = new Hex(HEX_LAYOUT_POINTY, halfScaledHexWidth);
    const labelFontSize: number =
      halfScaledHexWidth * LABEL_RELATIVE_TO_HEX_SIZE;

    let left: number = 0;
    let top: number = 0;
    let right: number = 0;
    let bottom: number = 0;

    const entries: Array<MapStringEntry> = new MapStringParser().parseOrThrow(
      mapString
    );
    const mapStringHex: MapStringHex = new MapStringHex();
    for (let i = 0; i < entries.length; i++) {
      const hex: HexType = mapStringHex.indexToHex(i);
      const pos: Vector = scaledHex.toPosition(hex);
      [pos.x, pos.y] = [pos.y, -pos.x];
      const x: number = pos.x;
      const y: number = pos.y;
      left = Math.min(left, x - halfScaledHexWidth);
      top = Math.min(top, y - halfScaledHexHeight);
      right = Math.max(right, x + halfScaledHexWidth);
      bottom = Math.max(bottom, y + halfScaledHexHeight);
    }

    const width: number = Math.ceil(right - left);
    const height: number = Math.ceil(bottom - top);
    const size: UI_SIZE = { w: width, h: height };

    const canvas: Canvas = new Canvas();
    entries.forEach((entry: MapStringEntry, index: number) => {
      // Always skip -1, allow other negative values for tint color.
      if (entry.tile === -1) {
        return;
      }

      const img = new ImageWidget().setImageSize(
        halfScaledHexWidth * 2 + 2,
        halfScaledHexHeight * 2 + 2
      );

      // Apply system image, or default to blank tile.
      const system: System | undefined =
        TI4.systemRegistry.getBySystemTileNumber(entry.tile);
      if (system && system.isHyperlane()) {
        // Cannot rotate images, use a gray tile for hyperlanes.
        const c = 0.03;
        img
          .setImage("tile/system/tile-000.png", packageId)
          .setTintColor([c, c, c, 1]);
      } else if (system) {
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
      const pos: Vector = scaledHex.toPosition(hex);

      [pos.x, pos.y] = [pos.y, -pos.x];
      pos.x -= left;
      pos.y -= top;

      canvas.addChild(
        img,
        pos.x - halfScaledHexWidth - 1,
        pos.y - halfScaledHexWidth - 1,
        halfScaledHexWidth * 2 + 2,
        halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
      );
    });

    // Add labels (do after tiles so labels lay on top).
    for (const [hex, label] of hexToLabel) {
      const pos: Vector = scaledHex.toPosition(hex);

      [pos.x, pos.y] = [pos.y, -pos.x];
      pos.x -= left;
      pos.y -= top;

      const labelText: Text = new Text()
        .setAutoWrap(true)
        .setBold(true)
        .setFontSize(labelFontSize)
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
        pos.x - halfScaledHexWidth - 1,
        pos.y - halfScaledHexWidth - 1,
        halfScaledHexWidth * 2 + 2,
        halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
      );
    }
    super(canvas, size);
  }
}
