import { LayoutFighterInfTgContainers } from "./layout-fighter-inf-tg-containers";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
import { Spawn } from "ttpg-darrell";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("garbage nsid", () => {
  expect(Spawn.has("container:base/garbage")).toBe(true);
});

it("constructor", () => {
  new LayoutFighterInfTgContainers();
});
