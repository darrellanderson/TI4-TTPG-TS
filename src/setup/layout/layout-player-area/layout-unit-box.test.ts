import { Vector } from "@tabletop-playground/api";
import { LayoutUnitBox } from "./layout-unit-box";

it("constructor (infantry)", () => {
  new LayoutUnitBox("infantry", 1);
});

it("constructor (mech)", () => {
  new LayoutUnitBox("mech", 1);
});

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutUnitBox("infantry", 1).getLayout().doLayoutAtPoint(pos, yaw);
});
