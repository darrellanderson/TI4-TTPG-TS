import { Vector } from "@tabletop-playground/api";
import { MockPlayer } from "ttpg-mock";

import { LayoutPlayerArea } from "./layout-player-area";

it("layout", () => {
  new MockPlayer({ slot: 10 }); // assigns card holder

  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutPlayerArea(10).getLayout().doLayoutAtPoint(pos, yaw);
});
