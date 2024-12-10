import {
  Border,
  Canvas,
  Color,
  ImageWidget,
  LayoutBox,
  refPackageId,
  Text,
  TextJustification,
  Vector,
  VerticalBox,
  Widget,
} from "@tabletop-playground/api";
import { Hex, HEX_LAYOUT_POINTY, HexType } from "ttpg-darrell";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { SliceTiles } from "../../../lib/draft-lib/generate-slices/generate-slices";
import { System } from "../../../lib/system-lib/system/system";
import { SystemSummary } from "../../../lib/system-lib/system/system-summary";

const HALF_HEX_W_PX: number = 25;
const packageId: string = refPackageId;

export class SliceUI extends AbstractUI {
  private readonly _labelText: Text;
  private readonly _defaultFontSize: number;

  constructor(
    slice: SliceTiles,
    sliceShape: ReadonlyArray<HexType>,
    sliceColor: Color,
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
        .setImage("tile/system/tile-000.png", packageId)
        .setTintColor(sliceColor);
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

    // Add label (below slice).
    const summaryValue: string =
      SystemSummary.getFromSystemTileNumbers(slice).getSummary();
    const fontSize: number = halfScaledHexHeight * 0.45;
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
    const panelBox: LayoutBox = new LayoutBox()
      .setPadding(0, 0, 0, -100)
      .setChild(panel);
    const panelBorder: Widget = new Border()
      .setColor(sliceColor)
      .setChild(panelBox);
    const labelWidth: number = Math.ceil(right - left);
    const labelHeight: number = Math.ceil(fontSize * 4);
    const labelY = Math.floor(bottom - top - labelHeight * 0.5);
    canvas.addChild(panelBorder, 0, labelY, labelWidth, labelHeight);
    bottom += labelHeight * 0.5;

    const w: number = Math.ceil(right - left);
    const h: number = Math.ceil(bottom - top);
    const widget: Widget = new LayoutBox()
      .setOverrideWidth(w)
      .setOverrideHeight(h)
      .setChild(canvas);

    super(widget, { w, h });
    this._labelText = labelText;
    this._defaultFontSize = fontSize;
  }

  public setLabel(label: string): void {
    this._labelText.setText(label);

    let fontSize = this._defaultFontSize;

    const maxLineLength: number = 18;
    const numLines: number = Math.ceil(label.length / maxLineLength);
    if (numLines === 2) {
      // More will fit in one line with smaller font size.
      const excess: number = label.length - maxLineLength;
      fontSize *= 1 - excess / maxLineLength / 2;
    } else if (numLines > 2) {
      fontSize *= 1.5 / numLines;
    }
    this._labelText.setFontSize(fontSize);
  }
}
