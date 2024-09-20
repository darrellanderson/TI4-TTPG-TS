import { Vector } from "@tabletop-playground/api";
import { LayoutPlayerArea } from "./layout-player-area";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
import { MockPlayer } from "ttpg-mock";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("layout", () => {
  new MockPlayer({ slot: 1 }); // assigns card holder

  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutPlayerArea(1).getLayout().doLayoutAtPoint(pos, yaw);
});
