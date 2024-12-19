import { Vector } from "@tabletop-playground/api";
import { MockPlayer } from "ttpg-mock";
import { LayoutTroveMat } from "./layout-trove-mat";

it("layout", () => {
  new MockPlayer({ slot: 10 }); // assigns card holder

  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutTroveMat(10).getLayout().doLayoutAtPoint(pos, yaw);
});

it("bad player slot", () => {
  expect(() => new LayoutTroveMat(-1)).toThrow();
});
