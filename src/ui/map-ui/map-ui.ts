import {
  Canvas,
  ImageWidget,
  refPackageId,
  Vector,
  Widget,
} from "@tabletop-playground/api";
import { Hex, HEX_LAYOUT_POINTY, HexType } from "ttpg-darrell";

import {
  MapStringEntry,
  MapStringParser,
} from "../../lib/map-string-lib/map-string-parser";
import { MapStringHex } from "../../lib/map-string-lib/map-string-hex";

const HALF_HEX_W_PX: number = 50;
const packageId: string = refPackageId;

export class MapUI {
  private readonly _mapString: string;

  private readonly _halfScaledHexWidth: number; // int
  private readonly _halfScaledHexHeight: number; // int
  private readonly _scaledHex: Hex;

  private readonly _width: number; // int
  private readonly _height: number; // int

  private readonly _left: number;
  private readonly _top: number;

  constructor(scale: number, mapString: string) {
    this._mapString = mapString;

    this._halfScaledHexWidth = Math.ceil(HALF_HEX_W_PX * scale);
    this._halfScaledHexHeight = Math.ceil(this._halfScaledHexWidth * 0.866);
    this._scaledHex = new Hex(HEX_LAYOUT_POINTY, this._halfScaledHexWidth);

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
      if (entry.tile === -1) {
        return;
      }

      const img = new ImageWidget().setImageSize(
        this._halfScaledHexWidth * 2 + 2,
        this._halfScaledHexHeight * 2 + 2
      );

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

    return canvas;
  }
}
