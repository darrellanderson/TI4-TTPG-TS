import { Border, LayoutBox } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

export class DivUI extends AbstractUI {
  constructor(
    scale: number,
    scaledLength: number,
    orientation: "horizontal" | "vertical"
  ) {
    const thickness = 2 * scale;
    const size: UI_SIZE = {
      w: orientation === "horizontal" ? scaledLength : thickness,
      h: orientation === "horizontal" ? thickness : scaledLength,
    };
    const border: Border = new Border().setColor([0, 0, 0, 1]);
    const borderBox: LayoutBox = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(border);
    super(borderBox, size);
  }
}
