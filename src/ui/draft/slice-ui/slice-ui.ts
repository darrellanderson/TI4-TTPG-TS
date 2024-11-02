import {
  Canvas,
  ImageWidget,
  LayoutBox,
  refPackageId,
  Vector,
  Widget,
} from "@tabletop-playground/api";
import { Hex, HEX_LAYOUT_POINTY, HexType } from "ttpg-darrell";
import { Slice } from "lib/draft-lib/generate-slices/generate-slices";
import { System } from "lib/system-lib/system/system";

const HALF_HEX_W_PX: number = 100;
const packageId: string = refPackageId;

export class SliceUI {
  private readonly _halfScaledHexWidth: number; // int
  private readonly _halfScaledHexHeight: number; // int
  private readonly _scaledHex: Hex;

  private readonly _hexPositions: Array<Vector> = []; // indexed like sliceShape
  private readonly _width: number; // int
  private readonly _height: number; // int

  constructor(scale: number, sliceShape: ReadonlyArray<HexType>) {
    this._halfScaledHexWidth = Math.ceil(HALF_HEX_W_PX * scale);
    this._halfScaledHexHeight = Math.ceil(this._halfScaledHexWidth * 0.866);
    this._scaledHex = new Hex(HEX_LAYOUT_POINTY, this._halfScaledHexWidth); // x/y flipped thus pointy

    let left: number = 0;
    let top: number = 0;
    let right: number = 0;
    let bottom: number = 0;
    for (const hex of sliceShape) {
      // Remember hex position.
      const pos: Vector = this._scaledHex.toPosition(hex);

      // Convert to screen coordinates (swap x/y, and flip y).
      [pos.x, pos.y] = [pos.y, -pos.x];

      this._hexPositions.push(pos);

      // Update bounding box.
      left = Math.min(left, pos.x - this._halfScaledHexWidth);
      top = Math.min(top, pos.y - this._halfScaledHexHeight);
      right = Math.max(right, pos.x + this._halfScaledHexWidth);
      bottom = Math.max(bottom, pos.y + this._halfScaledHexHeight);
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

  getSize(): { w: number; h: number } {
    return { w: this._width, h: this._height };
  }

  getWidget(slice: Slice): Widget {
    const canvas: Canvas = new Canvas();

    // Add home system.
    const pos: Vector | undefined = this._hexPositions[0];
    if (pos) {
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
    }

    slice.forEach((tile: number, index: number) => {
      const system: System | undefined =
        TI4.systemRegistry.getBySystemTileNumber(tile);
      const pos: Vector | undefined = this._hexPositions[index + 1]; // 0 is home system
      if (system && pos) {
        const img = new ImageWidget()
          .setImageSize(
            this._halfScaledHexWidth * 2,
            this._halfScaledHexHeight * 2
          )
          .setImage(system.getImg(), system.getImgPackageId());
        canvas.addChild(
          img,
          pos.x - this._halfScaledHexWidth - 1,
          pos.y - this._halfScaledHexWidth - 1,
          this._halfScaledHexWidth * 2 + 2,
          this._halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
        );
      }
    });

    return new LayoutBox()
      .setOverrideWidth(this._width)
      .setOverrideHeight(this._height)
      .setChild(canvas);
  }
}
