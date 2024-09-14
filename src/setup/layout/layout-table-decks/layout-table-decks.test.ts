import { Vector } from "@tabletop-playground/api";
import { LayoutTableDecks } from "./layout-table-decks";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutTableDecks().getLayout().doLayoutAtPoint(pos, yaw);
});
