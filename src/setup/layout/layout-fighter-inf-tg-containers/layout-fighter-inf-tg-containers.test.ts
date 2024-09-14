import { LayoutFighterInfTgContainers } from "./layout-fighter-inf-tg-contaienrs";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  new LayoutFighterInfTgContainers();
});
