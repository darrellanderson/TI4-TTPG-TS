import {
  Canvas,
  Color,
  ImageWidget,
  LayoutBox,
  refPackageId,
  Vector,
  Widget,
  world,
} from "@tabletop-playground/api";
import { Hex, HEX_LAYOUT_POINTY, HexType } from "ttpg-darrell";

import { Faction } from "../../../lib/faction-lib/faction/faction";
import { MapHomeSystemLocations } from "../../../lib/map-string-lib/map-home-system-locations";
import { PlayerSeatType } from "../../../lib/player-lib/player-seats/player-seats";
import {
  SliceShape,
  SliceTiles,
} from "../../../lib/draft-lib/generate-slices/generate-slices";
import { System } from "lib/system-lib/system/system";

const HALF_HEX_W_PX: number = 50;
const packageId: string = refPackageId;

export class MapUI {
  private readonly _defaultSliceShape: SliceShape;
  private readonly _seatIndexToSliceShape: Map<number, SliceShape> = new Map();

  private readonly _halfScaledHexWidth: number; // int
  private readonly _halfScaledHexHeight: number; // int
  private readonly _scaledHex: Hex;

  private readonly _playerSlotToAnchorHex: Map<number, HexType> = new Map();

  private readonly _width: number; // int
  private readonly _height: number; // int

  private readonly _left: number;
  private readonly _top: number;

  constructor(scale: number, sliceShape: SliceShape) {
    this._defaultSliceShape = sliceShape;

    this._halfScaledHexWidth = Math.ceil(HALF_HEX_W_PX * scale);
    this._halfScaledHexHeight = Math.ceil(this._halfScaledHexWidth * 0.866);
    this._scaledHex = new Hex(HEX_LAYOUT_POINTY, this._halfScaledHexWidth);

    let left: number = 0;
    let top: number = 0;
    let right: number = 0;
    let bottom: number = 0;

    const homeSystemLocs = new MapHomeSystemLocations();
    const seats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    for (const seat of seats) {
      const playerSlot: number = seat.playerSlot;
      const homePosWorld: Vector | undefined = homeSystemLocs.get(playerSlot);
      if (homePosWorld) {
        const homePosHex: HexType = TI4.hex.fromPosition(homePosWorld);
        this._playerSlotToAnchorHex.set(playerSlot, homePosHex);

        const pos: Vector = this._scaledHex.toPosition(homePosHex);
        [pos.x, pos.y] = [pos.y, -pos.x];

        // Update bounding box.
        left = Math.min(left, pos.x - this._halfScaledHexWidth);
        top = Math.min(top, pos.y - this._halfScaledHexHeight);
        right = Math.max(right, pos.x + this._halfScaledHexWidth);
        bottom = Math.max(bottom, pos.y + this._halfScaledHexHeight);
      }
    }

    this._width = Math.ceil(right - left);
    this._height = Math.ceil(bottom - top);

    this._left = left;
    this._top = top;
  }

  overrideSliceShape(seatIndex: number, sliceShape: SliceShape): this {
    this._seatIndexToSliceShape.set(seatIndex, sliceShape);
    return this;
  }

  _getSliceShape(seatIndex: number): SliceShape {
    const sliceShape: SliceShape | undefined =
      this._seatIndexToSliceShape.get(seatIndex);
    if (sliceShape) {
      return sliceShape;
    }
    return this._defaultSliceShape;
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

    [...this._playerSlotToAnchorHex.entries()].forEach(
      ([playerSlot, anchorHex], index) => {
        const sliceShape: SliceShape = this._getSliceShape(index);
        const sliceTiles: SliceTiles | undefined =
          seatIndexToSliceTiles.get(index);
        const faction: Faction | undefined = seatIndexToFaction.get(index);
        const color: Color = world.getSlotColor(playerSlot);

        const anchorPos: Vector = this._scaledHex.toPosition(anchorHex);
        const dirHex: HexType = "<0,0,0>";
        const dirPos: Vector = this._scaledHex.toPosition(dirHex);
        const dir = dirPos.subtract(anchorPos);

        const theta = Math.atan2(dir.y, dir.x);
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        // First entry in slice shape is the home system.
        sliceShape.forEach((shapeHex: HexType, index: number) => {
          const img = new ImageWidget().setImageSize(
            this._halfScaledHexWidth * 2 + 2,
            this._halfScaledHexHeight * 2 + 2
          );
          if (index === 0) {
            if (faction) {
              img.setImage(faction.getHomeImg(), faction.getHomeImgPackageId());
            } else {
              img.setImage("tile/system/tile-000.png", packageId);
            }
          } else if (sliceTiles) {
            const tile: number | undefined = sliceTiles[index - 1];
            if (tile) {
              const system: System | undefined =
                TI4.systemRegistry.getBySystemTileNumber(tile);
              if (system) {
                img.setImage(system.getImg(), system.getImgPackageId());
              }
            }
          } else if (color) {
            img
              .setImage("tile/system/tile-000.png", packageId)
              .setTintColor(color);
          }

          // Update position based on hex and direction to center.
          const shapeOffset = this._scaledHex.toPosition(shapeHex);

          // Rotate offset in direction.
          let dx = cos * shapeOffset.x - sin * shapeOffset.y;
          let dy = sin * shapeOffset.x + cos * shapeOffset.y;

          dx = Math.floor(dx * 1000) / 1000;
          dy = Math.floor(dy * 1000) / 1000;

          const pos = new Vector(
            anchorPos.x + dx,
            anchorPos.y + dy,
            anchorPos.z
          );
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
      }
    );

    return new LayoutBox()
      .setOverrideWidth(this._width)
      .setOverrideHeight(this._height)
      .setChild(canvas);
  }
}
