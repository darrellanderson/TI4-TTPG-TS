import {
  Canvas,
  ImageWidget,
  LayoutBox,
  refPackageId,
  Vector,
  Widget,
} from "@tabletop-playground/api";
import { Hex, HEX_LAYOUT_POINTY, HexType } from "ttpg-darrell";

import { Faction } from "../../../lib/faction-lib/faction/faction";
import { MapHomeSystemLocations } from "../../../lib/map-string-lib/map-home-system-locations";
import { PlayerSeatType } from "../../../lib/player-lib/player-seats/player-seats";
import {
  SliceShape,
  SliceTiles,
} from "../../../lib/draft-lib/generate-slices/generate-slices";

const HALF_HEX_W_PX: number = 50;
const packageId: string = refPackageId;

export class MapUI {
  private readonly _defaultSliceShape: SliceShape;
  private readonly _seatIndexToSliceShape: Map<number, SliceShape> = new Map();

  private readonly _halfScaledHexWidth: number; // int
  private readonly _halfScaledHexHeight: number; // int
  private readonly _scaledHex: Hex;

  private readonly _hexPositions: Array<Vector> = []; // indexed like sliceShape
  private readonly _width: number; // int
  private readonly _height: number; // int

  constructor(scale: number, sliceShape: SliceShape) {
    this._defaultSliceShape = sliceShape;

    this._halfScaledHexWidth = Math.ceil(HALF_HEX_W_PX * scale);
    this._halfScaledHexHeight = Math.ceil(this._halfScaledHexWidth * 0.866);
    this._scaledHex = new Hex(HEX_LAYOUT_POINTY, this._halfScaledHexWidth); // x/y flipped thus pointy

    let left: number = 0;
    let top: number = 0;
    let right: number = 0;
    let bottom: number = 0;

    const homeSystemLocs = new MapHomeSystemLocations();
    const seats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    console.log("seats", seats.length);
    for (const seat of seats) {
      const playerSlot: number = seat.playerSlot;
      const homePosWorld: Vector | undefined = homeSystemLocs.get(playerSlot);
      if (homePosWorld) {
        const homePosHex: HexType = TI4.hex.fromPosition(homePosWorld);
        console.log("homePosHex", homePosHex);
        const pos: Vector = this._scaledHex.toPosition(homePosHex);

        // Convert to screen coordinates (swap x/y, and flip y).
        [pos.x, pos.y] = [pos.y, -pos.x];

        this._hexPositions.push(pos);

        // Update bounding box.
        left = Math.min(left, pos.x - this._halfScaledHexWidth);
        top = Math.min(top, pos.y - this._halfScaledHexHeight);
        right = Math.max(right, pos.x + this._halfScaledHexWidth);
        bottom = Math.max(bottom, pos.y + this._halfScaledHexHeight);
      }
    }

    // Adjust positions to be relative to bounding box top-left.
    for (const pos of this._hexPositions) {
      pos.x -= left;
      pos.y -= top;
    }

    // Adjust to int.
    for (const pos of this._hexPositions) {
      pos.x = Math.ceil(pos.x);
      pos.y = Math.ceil(pos.y);
    }

    this._width = Math.ceil(right - left);
    this._height = Math.ceil(bottom - top);
  }

  overrideSliceShape(seatIndex: number, sliceShape: SliceShape): this {
    this._seatIndexToSliceShape.set(seatIndex, sliceShape);
    return this;
  }

  getSize(): { w: number; h: number } {
    return { w: this._width, h: this._height };
  }

  getWidget(
    seatIndexToSliceTiles: Map<number, SliceTiles>,
    seatIndexToFaction: Map<number, Faction>,
    setIndexToPlayerName: Map<number, string>
  ): Widget {
    const canvas: Canvas = new Canvas();

    this._hexPositions.forEach((pos: Vector) => {
      const img = new ImageWidget()
        .setImageSize(
          this._halfScaledHexWidth * 2 + 2,
          this._halfScaledHexHeight * 2 + 2
        )
        .setImage("tile/system/tile-000.png", packageId);

      canvas.addChild(
        img,
        pos.x - this._halfScaledHexWidth - 1,
        pos.y - this._halfScaledHexWidth - 1,
        this._halfScaledHexWidth * 2 + 2,
        this._halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
      );
    });

    return new LayoutBox()
      .setOverrideWidth(this._width)
      .setOverrideHeight(this._height)
      .setChild(canvas);
  }
}
