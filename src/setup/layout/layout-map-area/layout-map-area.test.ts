import { Vector } from "@tabletop-playground/api";
import { LayoutMapArea } from "./layout-map-area";

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutMapArea(3).getLayout().doLayoutAtPoint(pos, yaw);
});

it("_addMapRingLines", () => {
  const layoutMapArea = new LayoutMapArea(3);
  layoutMapArea._addMapRingLines(3);
  layoutMapArea._addMapRingLines(3); // repeat, erase old lines
});
