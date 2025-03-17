import { Border, LayoutBox } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

export class DivUI extends AbstractUI {
  constructor(
    scale: number,
    scaledLength: number,
    orientation: "horizontal" | "vertical"
  ) {
    const thickness = 2 * scale;
    const w: number = orientation === "horizontal" ? scaledLength : thickness;
    const h: number = orientation === "horizontal" ? thickness : scaledLength;
    const size: UI_SIZE = {
      w,
      h,
    };
    const border: Border = new Border().setColor([0, 0, 0, 1]);
    const borderBox: LayoutBox = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(border);
    super(borderBox, size);
  }
}
