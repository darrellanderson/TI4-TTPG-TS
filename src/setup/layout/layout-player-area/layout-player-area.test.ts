import { Vector } from "@tabletop-playground/api";
import { MockPlayer } from "ttpg-mock";

import { LayoutPlayerArea } from "./layout-player-area";

it("layout", () => {
  new MockPlayer({ slot: 1 }); // assigns card holder

  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutPlayerArea(1).getLayout().doLayoutAtPoint(pos, yaw);
});
