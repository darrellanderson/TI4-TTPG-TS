import { Vector } from "@tabletop-playground/api";
import { MockPlayer } from "ttpg-mock";
import { LayoutRowTrovesAndStatusPad } from "./layout-row-troves-and-status-pad";

it("layout", () => {
  new MockPlayer({ slot: 10 }); // assigns card holder

  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutRowTrovesAndStatusPad(10).getLayout().doLayoutAtPoint(pos, yaw);
});

it("bad player slot", () => {
  expect(() => new LayoutRowTrovesAndStatusPad(-1)).toThrow();
});
