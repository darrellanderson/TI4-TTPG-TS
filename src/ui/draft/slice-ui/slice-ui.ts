import {
  Canvas,
  ImageWidget,
  LayoutBox,
  refPackageId,
  Text,
  TextJustification,
  Vector,
  VerticalAlignment,
  VerticalBox,
  Widget,
} from "@tabletop-playground/api";
import { Hex, HEX_LAYOUT_POINTY, HexType } from "ttpg-darrell";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { SliceTiles } from "../../../lib/draft-lib/generate-slices/generate-slices";
import { System } from "../../../lib/system-lib/system/system";
import { SystemSummary } from "../../../lib/system-lib/system/system-summary";

const HALF_HEX_W_PX: number = 100;
const packageId: string = refPackageId;

export class SliceUI extends AbstractUI {
  private readonly _labelText: Text;

  constructor(
    slice: SliceTiles,
    sliceShape: ReadonlyArray<HexType>,
    scale: number
  ) {
    const halfScaledHexWidth = Math.ceil(HALF_HEX_W_PX * scale);
    const halfScaledHexHeight = Math.ceil(halfScaledHexWidth * 0.866);
    const scaledHex = new Hex(HEX_LAYOUT_POINTY, halfScaledHexWidth); // x/y flipped thus pointy
    const hexPositions: Array<Vector> = [];

    let left: number = 0;
    let top: number = 0;
    let right: number = 0;
    let bottom: number = 0;
    for (const hex of sliceShape) {
      // Remember hex position.
      const pos: Vector = scaledHex.toPosition(hex);

      // Convert to screen coordinates (swap x/y, and flip y).
      [pos.x, pos.y] = [pos.y, -pos.x];

      hexPositions.push(pos);

      // Update bounding box.
      left = Math.min(left, pos.x - halfScaledHexWidth);
      top = Math.min(top, pos.y - halfScaledHexHeight);
      right = Math.max(right, pos.x + halfScaledHexWidth);
      bottom = Math.max(bottom, pos.y + halfScaledHexHeight);
    }

    // Adjust positions to be relative to bounding box top-left.
    for (const pos of hexPositions) {
      pos.x -= left;
      pos.y -= top;
    }

    // Adjust to int.
    for (const pos of hexPositions) {
      pos.x = Math.ceil(pos.x);
      pos.y = Math.ceil(pos.y);
    }

    const canvas: Canvas = new Canvas();

    // Add home system.
    const homePos: Vector | undefined = hexPositions[0];
    if (homePos) {
      const img = new ImageWidget()
        .setImageSize(halfScaledHexWidth * 2 + 2, halfScaledHexHeight * 2 + 2)
        .setImage("tile/system/tile-000.png", packageId);
      canvas.addChild(
        img,
        homePos.x - halfScaledHexWidth - 1,
        homePos.y - halfScaledHexWidth - 1,
        halfScaledHexWidth * 2 + 2,
        halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
      );
    }

    // Add slice systems.
    slice.forEach((tile: number, index: number) => {
      const system: System | undefined =
        TI4.systemRegistry.getBySystemTileNumber(tile);
      const pos: Vector | undefined = hexPositions[index + 1]; // 0 is home system
      if (system && pos) {
        const img: ImageWidget = new ImageWidget().setImageSize(
          halfScaledHexWidth * 2,
          halfScaledHexHeight * 2
        );
        if (system.isHyperlane()) {
          // Cannot rotate images, use a gray tile for hyperlanes.
          const c = 0.03;
          img
            .setImage("tile/system/tile-000.png", packageId)
            .setTintColor([c, c, c, 1]);
        } else {
          img.setImage(system.getImg(), system.getImgPackageId());
        }
        canvas.addChild(
          img,
          pos.x - halfScaledHexWidth - 1,
          pos.y - halfScaledHexWidth - 1,
          halfScaledHexWidth * 2 + 2,
          halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
        );
      }
    });

    // Add label (home system location).
    const summaryValue: string =
      SystemSummary.getFromSystemTileNumbers(slice).getSummary();

    const fontSize: number = halfScaledHexHeight * 0.25;
    const summaryText: Text = new Text()
      .setBold(true)
      .setFontSize(fontSize)
      .setJustification(TextJustification.Center)
      .setTextColor([0, 0, 0, 1])
      .setText(summaryValue);
    const labelText = new Text()
      .setAutoWrap(true)
      .setBold(true)
      .setFontSize(fontSize)
      .setJustification(TextJustification.Center)
      .setTextColor([0, 0, 0, 1])
      .setText("Slice");
    const panel: Widget = new VerticalBox()
      .addChild(summaryText)
      .addChild(labelText);
    const panelBox = new LayoutBox()
      .setOverrideWidth(Math.ceil(right - left))
      .setOverrideHeight(halfScaledHexHeight * 2 + 2)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(panel);
    if (homePos) {
      canvas.addChild(
        panelBox,
        0,
        homePos.y - halfScaledHexHeight - 1,
        Math.ceil(right - left),
        halfScaledHexHeight * 2 + 2
      );
    }

    const w: number = Math.ceil(right - left);
    const h: number = Math.ceil(bottom - top);
    const widget: Widget = new LayoutBox()
      .setOverrideWidth(w)
      .setOverrideHeight(h)
      .setChild(canvas);

    super(widget, { w, h });
    this._labelText = labelText;
  }

  public setLabel(label: string): void {
    this._labelText.setText(label);
  }
}
